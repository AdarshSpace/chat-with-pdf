import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { Pinecone } from "@pinecone-database/pinecone";
import { PineconeStore } from "@langchain/pinecone";



export interface processPdfInput{
    userId: string,
    documentId: string,
    fileUrl: string,
    fileName: string
}

export async function processPdf(input: processPdfInput){
    try{
        const { userId, documentId, fileUrl, fileName } = input;

        // 1st Step : Fetch the PDF file
        const response = await fetch(fileUrl);
        if (!response.ok) {
            throw new Error(`Failed to fetch PDF: ${response.statusText}`);
          }

        // Step-2: convert stream to buffer
        const arrayBuffer = await response.arrayBuffer();

        // make node friendly buffer from array buffer
        const buffer = Buffer.from(arrayBuffer);

        // Load the buffer as a PDF file
        const loader = new PDFLoader(   // parses structure + extracts text,  This is a class that loads a PDF file and returns an array of documents.
            new Blob([buffer], { type: "application/pdf" })   // Blob declares format, This binary data should be treated as if it were a PDF file.
        ); 
        const docs = await loader.load();  // This will load the PDF file and return an array of documents.

        // Step-3: Text Splitter 
        const splitter = new RecursiveCharacterTextSplitter({    // This splitter only defines the rule, how to split the text into chunks.
            chunkSize: 1000, 
            chunkOverlap: 200 
        });

        const chunks = await splitter.splitDocuments(docs);      // splitDocuments applies those rules to Documents, This will split the text into chunks. 


        const docsWithMetadata = chunks.map((chunk, index) => ({
            ...chunk,
            metadata: {
              ...chunk.metadata,
              userId,
              documentId,
              fileName,
              chunkIndex: index,
            },
          }));


           // Step-4: Initialize Google Gemini Embeddings
        const embeddings = new GoogleGenerativeAIEmbeddings({
            model: "gemini-embedding-001",
            apiKey: process.env.GOOGLE_API_KEY
        });
        if (!process.env.GOOGLE_API_KEY) {
            throw new Error("Missing GOOGLE_API_KEY");
          }

             // Step-4: Vector Store
       const pinecone = new Pinecone({
        apiKey: process.env.PINECONE_API_KEY!,
     });

     const pineconeIndex = pinecone.index(process.env.PINECONE_INDEX_NAME!);

         // save in pinecone DB
    await PineconeStore.fromDocuments(docsWithMetadata, embeddings, {
        pineconeIndex,
        namespace: userId,
        maxConcurrency: 5,
    });

        console.log("PDF processed and stored in Pinecone");

    }catch(error){
        console.error("Error processing PDF : ", error);
        throw error;
    }
}