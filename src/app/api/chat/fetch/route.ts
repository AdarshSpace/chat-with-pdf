// src/app/api/chat/fetch/route.ts
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/DB";
import { getServerSession } from "next-auth";
import { AuthOptions } from "@/lib/auth";
import ChatHistory from "@/models/ChatHistory";
import {useChatStore} from "@/store/chatStore"; 


export async function GET(req: Request) {
  try {
    await connectToDatabase();

    // 1️⃣ Get logged-in user
    const session = await getServerSession(AuthOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = session.user.id;

    const { searchParams } = new URL(req.url);
    const documentId = searchParams.get("documentId");


    if (!documentId) {
      return NextResponse.json(
        { error: "Missing documentId" },
        { status: 400 }
      );
    }

    // 3️⃣ Fetch chat
    const chat = await ChatHistory.findOne({ userId, documentId });

    return NextResponse.json({
      success: true,
      chat: chat ? chat.messages : [], // return empty array if no chat yet
    });
  } catch (err: any) {
    console.error("Fetch Chat API Error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
