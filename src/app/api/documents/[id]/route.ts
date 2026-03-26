import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/DB";
import { getServerSession } from "next-auth";
import { AuthOptions } from "@/lib/auth";
import Document from "@/models/Document";
import mongoose from "mongoose";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 1️⃣ Ensure database connection
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
    const { id: documentId } = await params;

    // 3️⃣ Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(documentId)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid document ID",
        },
        { status: 400 }
      );
    }

    // 4️⃣ Find document belonging to this user
    const document = await Document.findOne({
      _id: documentId,
      userId,
    }).lean();

   

    // 5️⃣ Handle document not found
    if (!document) {
      return NextResponse.json(
        {
          success: false,
          message: "Document not found",
        },
        { status: 404 }
      );
    }

    // 6️⃣ Success response
    return NextResponse.json(
      {
        success: true,
        document,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Fetch Document API Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong while fetching document",
      },
      { status: 500 }
    );
  }
}

