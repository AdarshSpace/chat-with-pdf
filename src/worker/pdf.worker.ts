import { Worker } from "bullmq";
import { redis } from "@/lib/redis";


export const worker = new Worker("pdf-processing", async (job) => {
    try{





        console.log("✅ Job completed : ", job.id);

    }catch(error){
        console.error("Error processing job:", error);
        throw error;
    }   
    },{
        connection: redis,
    })
