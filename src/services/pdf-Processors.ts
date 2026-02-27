export interface processPdfInput{
    documentId: string,
    fileUrl: string,
    fileName: string
}

export async function processPdf(input: processPdfInput){
    try{
        const { documentId, fileUrl, fileName } = input;

        const response = await fetch(fileUrl);

        const arrayBuffer = await response.arrayBuffer();
        console.log('array Buffer : ', arrayBuffer);

        const buffer = Buffer.from(arrayBuffer);
        console.log('buffer : ', buffer);

        const loader = new PDFLoader(   // parses structure + extracts text,  This is a class that loads a PDF file and returns an array of documents.
            new Blob([buffer], { type: "application/pdf" })   // Blob declares format, This binary data should be treated as if it were a PDF file.
        ); 
        const docs = await loader.load();  // This will load the PDF file and return an array of documents.
        console.log('docs : ', docs);
        

    }catch(error){
        console.error("Error processing PDF : ", error);
        throw error;
    }
}