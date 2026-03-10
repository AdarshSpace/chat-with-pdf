import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/DB";
import { getServerSession } from "next-auth";
import { AuthOptions } from "@/lib/auth";
import Document from "@/models/Document";

export async function GET() {
  try {
    await connectToDatabase();

    const session = await getServerSession(AuthOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    const totalDocuments = await Document.countDocuments({ userId });

    return NextResponse.json({
      success: true,
      totalDocuments,
    });

  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch document count" },
      { status: 500 }
    );
  }
}