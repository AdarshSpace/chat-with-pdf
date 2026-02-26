import { NextResponse } from "next/server";
import { pineconeIndex } from "@/lib/pinecone";

async function getEmbedding(query: string): Promise<number[]> {
  return new Array(1536).fill(0);
}

export async function POST(req: Request) {
  const { query } = await req.json();

  const embedding = await getEmbedding(query);

  const results = await pineconeIndex.query({
    vector: embedding,
    topK: 5,
    includeMetadata: true,
  });

  return NextResponse.json({
    matches: results.matches,
  });
}