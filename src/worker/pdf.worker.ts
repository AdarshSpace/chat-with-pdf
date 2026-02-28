import { Worker } from "bullmq";
import { redis } from "@/lib/redis";
import { processPdf } from "@/services/pdf-Processors";


export const worker = new Worker("pdf-processing", async (job) => {
    try{
        const { userId, documentId, fileUrl, fileName } = job.data;

         // Call your processing function
         await processPdf({ userId, documentId, fileUrl, fileName });


        console.log("✅ Job completed : ", job.id);

    }catch(error){
        console.error("Error processing job:", error);
        throw error;
    }   
    },{
        connection: redis,
    })
