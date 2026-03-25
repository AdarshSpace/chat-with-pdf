

// src/app/documents/[id]/page.tsx

import DocumentChat from "@/components/chat/DocumentChat";
import Document from "@/models/Document";
import DocumentPage from '@/components/documents/docpage'





export default async function DocumentDetailPage({ params }: {params: Promise<{ id: string }> }) {
  const {id} = await params 
  const documentId = id;




  return (
    <div className="h-screen flex flex-col px-8">
      <div className="mb-4">
        <DocumentPage documentId={documentId} />
      </div>
      
    </div>
  );
}