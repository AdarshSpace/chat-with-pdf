"use client";

import { ArrowLeft, ExternalLink } from "lucide-react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import DocumentChat from "../chat/DocumentChat";

import PageHeader from "./PageHeader";
import Tabs from "./Tabs";

interface DocumentType { 
    title: string;
    fileUrl: string;
}

interface DocPageType {
    documentId: string
}

const DocumentPage = ({documentId}: DocPageType) => {
  const id = documentId


  const [document, setDocument] = useState<DocumentType | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Content");

  useEffect(() => {
    const fetchDocumentDetails = async () => {
      try {
        const res = await fetch(`/api/documents/${id}`);

        if (!res.ok) throw new Error("Failed to fetch");

        const data = await res.json();
        console.log('data : ', data)

        setDocument(data.document);
      } catch (error) {
        toast.error("Failed to fetch document details");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchDocumentDetails();
  }, [id]);

  const getPdfURL = () => {
    return document?.fileUrl ?? "";
  };

  const renderContent = () => {
    if (loading) return <p>Loading...</p>;

    if (!document?.fileUrl) {
      return <div className="text-center p-8">PDF not available</div>;
    }

    const pdfURL = getPdfURL();

    return (
      <div className="bg-white border border-gray-300 rounded-lg overflow-hidden shadow-sm">
        <div className="flex items-center justify-between p-4 bg-gray-50 border-b border-gray-300">
          <span className="text-sm font-medium text-gray-700">
            Document Viewer
          </span>

          <Link
            href={pdfURL}
            target="_blank"
            className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            <ExternalLink size={16} />
            Open in new tab
          </Link>
        </div>

        <div className="bg-gray-100 p-1">
          <iframe
            src={pdfURL}
            title="Pdf Viewer"
            className="w-full h-[70vh] bg-white rounded border border-gray-300"
          />
        </div>
      </div>
    );
  };

  const renderChat = () => <div className="flex-1">
  <DocumentChat documentId={documentId} />
</div>;
  const renderAIActions = () => <div>AI Actions</div>;
  const renderFlashcardsTab = () => <div>Flashcards</div>;
  const renderQuizzesTab = () => <div>Quizzes</div>;

  const tabs = [
    { name: "Content", label: "Content", content: renderContent() },
    { name: "Chat", label: "Chat", content: renderChat() },
    { name: "AI Actions", label: "AI Actions", content: renderAIActions() },
    { name: "Flashcards", label: "Flashcards", content: renderFlashcardsTab() },
    { name: "Quizzes", label: "Quizzes", content: renderQuizzesTab() },
  ];

  if (loading) return <p>Loading...</p>;

  if (!document)
    return <div className="text-center p-8">Document not found</div>;

  return (
    <div>
      <div className="mb-4">
        <Link
          href="/dashboard/documents"
          className="inline-flex items-center gap-2 text-sm text-neutral-600 hover:text-neutral-900"
        >
          <ArrowLeft size={16} />
          Back to Documents
        </Link>
      </div>

      <PageHeader title={document?.title} />

      <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
};

export default DocumentPage;
