import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/DB";
import {getServerSession} from "next-auth"
import { AuthOptions } from "@/lib/auth";
import Document from "@/models/Document";
import { documentQueue } from "@/queues/document.queue";

 // Post/Api/documents

 export async function POST(req: Request){
    try{
        await connectToDatabase();

        const session = await getServerSession(AuthOptions);
        if(!session || !session.user?.id){
            return NextResponse.json(
                {  message: 'Unauthorized' },
                { status: 401 }
            )
        }

        const userId = session.user.id;     // from session 

        const body = await req.json();

        const { title, fileId, fileName, fileUrl, fileSize, thumbnailUrl } = body;


        if(!fileId || !fileUrl){
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            )
        }

        const document = await Document.create({ userId, title, fileId, fileName, fileUrl, fileSize, thumbnailUrl, status: 'processing' });

        
        await documentQueue.add("process-document", {
            documentId: document._id.toString(),
            fileUrl: document.fileUrl,
          });

        return NextResponse.json(
            {success: true, document},
            {status: 201}
        )
      

    }catch(err: any){
        console.log("Documents Api Error : ", err);

         // Duplicate ImageKit file
    if (err.code === 11000) {
        return NextResponse.json(
          { error: "Document already exists" },
          { status: 409 }
        );
      }
  
      return NextResponse.json(
        { error: "Failed to save document" },
        { status: 500 }
      )
 }
}