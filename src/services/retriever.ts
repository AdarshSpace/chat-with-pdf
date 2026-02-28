import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { Pinecone } from "@pinecone-database/pinecone";
import { PineconeStore } from "@langchain/pinecone";

interface RetrieveInput {
  userId: string;
  question: string;
  documentId?: string; // optional → single-doc or multi-doc
}

export async function retrieveAnswer(input: RetrieveInput) {
  try{
    const { userId, question, documentId } = input;

  if (!process.env.GOOGLE_API_KEY) {
    throw new Error("Missing GOOGLE_API_KEY");
  }

  if (!process.env.PINECONE_API_KEY || !process.env.PINECONE_INDEX_NAME) {
    throw new Error("Missing Pinecone configuration");
  }

  // 1️⃣ Embeddings (same model used during ingestion)
  const embeddings = new GoogleGenerativeAIEmbeddings({
    model: "gemini-embedding-001",
    apiKey: process.env.GOOGLE_API_KEY,
  });

  // 2️⃣ Pinecone
  const pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY,
  });

  const pineconeIndex = pinecone.index(
    process.env.PINECONE_INDEX_NAME
  );

  // 3️⃣ Vector Store (existing index)
  const vectorStore = await PineconeStore.fromExistingIndex(
    embeddings,
    {
      pineconeIndex,
      namespace: userId, // 🔐 user isolation
    }
  );

  // 4️⃣ Similarity search
  const results = await vectorStore.similaritySearch(
    question,
    5,
    documentId
      ? { filter: { documentId } } // 🎯 single document
      : undefined                 // 📚 all user documents
  );

  console.log("PineCone DB results : ", results);

  if (results.length === 0) {
    return {
      answer: "I don’t know based on the uploaded document(s).",
      sources: [],
    };
  }

  const context = results
    .map((doc) => doc.pageContent)
    .join("\n\n");

  // 5️⃣ LLM
  const llm = new ChatGoogleGenerativeAI({
    model: "gemini-1.5-flash",
    apiKey: process.env.GOOGLE_API_KEY,
  });

  const prompt = `
You are an assistant answering questions strictly from the given context.

Context:
${context}

Question:
${question}

Rules:
- If the answer is not present in the context, say:
  "I don’t know based on the document."
- Be precise and factual.
`;

  const response = await llm.invoke(prompt);

  return {
    answer: response.content,
    sources: results.map((doc) => ({
      documentId: doc.metadata.documentId,
      fileName: doc.metadata.fileName,
      chunkIndex: doc.metadata.chunkIndex,
    })),
  };
  }
  catch(error){
     console.log('Retriever show Error : ', error);
     throw error
  }
}