import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/DB";
import { getServerSession } from "next-auth";
import { AuthOptions } from "@/lib/auth";
import Document from "@/models/Document";

export async function GET() {
  try {
    // 1️⃣ Ensure DB connection
    await connectToDatabase();

    // 2️⃣ Check authentication
    const session = await getServerSession(AuthOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized access",
        },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // 3️⃣ Fetch documents belonging to this user
    const documents = await Document.find({ userId })
      .sort({ createdAt: -1 }) // newest first
      .lean();

    // 4️⃣ Handle case: user has no documents
    if (!documents || documents.length === 0) {
      return NextResponse.json(
        {
          success: true,
          documents: [],
          message: "No documents found",
        },
        { status: 200 }
      );
    }

    // 5️⃣ Success response
    return NextResponse.json(
      {
        success: true,
        count: documents.length,
        documents,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Fetch Documents API Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong while fetching documents",
      },
      { status: 500 }
    );
  }
}