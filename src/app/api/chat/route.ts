// src/app/api/chat/route.ts

import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/DB";
import { getServerSession } from "next-auth";
import { AuthOptions } from "@/lib/auth";
import ChatHistory from "@/models/ChatHistory";
import Document from "@/models/Document";

// ⬇️ Your retrieval + LLM utility
import { retrieveAnswer }  from "@/services/retriever";

// This function should handle embedding + similarity + LLM

interface ChatRequest {
  message: string;
}

export async function POST(req: Request) {
  try {
    await connectToDatabase();

    // 1️⃣ Authenticate user
    const session = await getServerSession(AuthOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // 2️⃣ Get documentId from query
    const { searchParams } = new URL(req.url);
    const documentId = searchParams.get("documentId");

    if (!documentId) {
      return NextResponse.json(
        { error: "Missing documentId" },
        { status: 400 }
      );
    }

    console.log("documentId :", documentId, "userId :", userId);

    // 3️⃣ Validate document ownership (VERY IMPORTANT 🔐)
    const document = await Document.findOne({ _id: documentId, userId });
    if (!document) {
      return NextResponse.json(
        { error: "Document not found or unauthorized" },
        { status: 404 }
      );
    }

    const body: ChatRequest = await req.json();
    const { message } = body;

    console.log("message :", message);

    if (!message) {
      return NextResponse.json(
        { error: "Missing message" },
        { status: 400 }
      );
    }

    // 4️⃣ Get or create chat history
    let chat = await ChatHistory.findOne({ userId, documentId });

    if (!chat) {
      chat = await ChatHistory.create({
        userId,
        documentId,
        messages: [],
      });
    }

    // 5️⃣ Save user message first
    chat.messages.push({
      role: "user",
      content: message,
      timestamp: new Date(),
    });

    await chat.save(); // save immediately (important for reliability)

    // 6️⃣ Run RAG retrieval + LLM generation
    const { AiResponse, sources } = await retrieveAnswer({ userId, documentId, question: message });

    // 7️⃣ Save assistant message
    chat.messages.push({
      role: "assistant",
      content: AiResponse,
      timestamp: new Date(),
      relevantChunks: sources?.map((source) => source.chunkIndex) || [],
    });

    await chat.save();

    // 8️⃣ Return only necessary data
    return NextResponse.json({
      success: true,
      AiResponse
    });

  } catch (err: any) {
    console.error("Chat API Error:", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}