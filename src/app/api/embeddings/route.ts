import { NextResponse } from "next/server";
import { pineconeIndex } from "@/lib/pinecone";

// example embedding function
async function getEmbedding(text: string): Promise<number[]> {
  // replace with OpenAI / Gemini / local model
  return new Array(1536).fill(0); // dummy
}

export async function POST(req: Request) {
  const { id, text, metadata } = await req.json();

  const embedding = await getEmbedding(text);

  await pineconeIndex.upsert([
    {
      id,
      values: embedding,
      metadata, // { documentId, page, userId }
    },
  ]);

  return NextResponse.json({ success: true });
}