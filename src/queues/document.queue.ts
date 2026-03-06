import { Queue } from "bullmq";

export const pdfQueue = new Queue("pdf-processing",  {
    connection: {
      url: process.env.REDIS_URL!,
      maxRetriesPerRequest: null,
    },
  });


