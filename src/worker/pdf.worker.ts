import { Worker } from "bullmq";
import { redis } from "@/lib/redis";
import { processPdf } from "@/services/pdf-Processors";
import Document from "@/models/Document";

// 1️⃣ Worker logic as a reusable function
export async function handlePdfJob(jobData: {
  userId: string;
  documentId: string;
  fileUrl: string;
  fileName: string;
}) {
  const { userId, documentId, fileUrl, fileName } = jobData;

  try {
    await processPdf({ userId, documentId, fileUrl, fileName });
    console.log("✅ PDF processed successfully for document:", documentId);

    await Document.findByIdAndUpdate(documentId, {
        status: "ready",
      });
    console.log('Status update : ready');


  } catch (error) {
    await Document.findByIdAndUpdate(documentId, {
      status: "failed",
    });
    console.error("Error processing PDF:", error);
    throw error;
  }
}

// 2️⃣ BullMQ worker
export const worker = new Worker(
  "pdf-processing",
  async (job) => {
    await handlePdfJob(job.data);
    console.log("✅ Job completed:", job.id);
  },
  {
    connection: redis,
    autorun: true, 
  }
);