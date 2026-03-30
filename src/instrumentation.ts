// src/instrumentation.ts
export async function register() {
    // Only run on the server (not edge)
    if (process.env.NEXT_RUNTIME === "edge") return;
  
    // Prevent multiple workers in dev hot-reload
    const g = globalThis as any;
    if (g.__pdfWorkerStarted) return;
    g.__pdfWorkerStarted = true;
  
    // Importing the module should create the Worker instance
    await import("./worker/pdf.worker");
  }