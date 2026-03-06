// src/app/documents/[id]/page.tsx

import DocumentChat from "@/components/chat/DocumentChat";

export default async function DocumentPage({ params }: {params: Promise<{ id: string }> }) {
  const {id} = await params 
  const documentId = id;

  return (
    <div className="h-screen flex flex-col p-8">
      <h1 className="text-2xl font-bold mb-4">Document Chat</h1>
      <div className="flex-1">
        <DocumentChat documentId={documentId} />
      </div>
    </div>
  );
}