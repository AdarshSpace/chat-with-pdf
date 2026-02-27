import { Queue } from "bullmq";
import { redis } from "@/lib/redis";

export const pdfQueue = new Queue("pdf-processing",  {
    connection: {
      url: process.env.REDIS_URL!,
      maxRetriesPerRequest: null,
    },
  });


