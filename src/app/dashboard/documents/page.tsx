"use client"
import SelectFile from "@/components/upload/selectFile";
import { upload } from "@imagekit/next";
import { DocumentCard } from "@/components/documents/docCard"
import { Plus, Upload, Trash2, FileText, X} from "lucide-react"
import toast from "react-hot-toast"
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  fileType?: "image" | "pdf";
}

type DocItem = {
  _id: string; // or `any` if you don't want to type conversion yet
  title: string;
  fileSize?: number;
  createdAt?: string | Date;
};


  const Document = () => {

    const router = useRouter();

  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0)

  

  // state for upload modal
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploading, setUploading] = useState(false);

  // state for delete conformation modal
  const [isDeleteModalOpen, setIsDeleteModalOpen ]  = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<DocItem | null >(null);

  const fetchDocuments = async () => {
    try{
      const res = await fetch(`/api/documents/fetchDocList`);
      if(res.status === 401) router.replace("/login")
      const data = await res.json();
      if(data.success){
        setDocuments(data.documents)
      }
     

    }
    catch(error){
      toast.error('Failed to fetch documents');
      console.log('Error : ', error)
    }
    finally{
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchDocuments();
  }, []);


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if(file){
      setUploadFile(file);

      setUploadTitle((prev) => {
        if (prev.trim() !== "") return prev;
        return file.name.replace(/\.[^/.]+$/, "")})
    
    }
  }

  const cleanedTitle = uploadTitle.trim() || uploadFile?.name.replace(/\.[^/.]+$/, "");

  const startUpload = async () => {
    if (!uploadFile) {
      toast.error("Please select a PDF");
      return;
    }

  setUploading(true);

  try {

    const authRes = await fetch("/api/auth/imagekit-auth");
    const data = await authRes.json();

    const res = await upload({
      file: uploadFile,
      fileName: uploadFile.name,
      publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY!,
      token: data.token,
      signature: data.signature,
      expire: data.expire,

      onProgress: (event: ProgressEvent) => {
        if (event.lengthComputable) {
          const percent = Math.round(
            (event.loaded / event.total) * 100
          );

          setProgress(percent);
          console.log(`Uploading: ${percent}%`);
        }
      }
    });

    await fetch("/api/documents/save", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: cleanedTitle,
        fileId: res.fileId,
        fileName: res.name,
        fileUrl: res.url,
        fileSize: res.size,
        thumbnailUrl: res.thumbnailUrl
      }),
    });

    console.log("Upload Success:", res.url);

    // SUCCESS CALLBACK
    toast.success("Document uploaded successfully");

       // ✅ REFRESH DOCUMENT LIST
       await fetchDocuments();

      setIsUploadModalOpen(false);

             // ✅ reset form
         setUploadFile(null);
         setUploadTitle("");
         setProgress(0);

  } catch (err) {
    console.log("Upload failed:", err);
  } finally {
    setUploading(false);
    setProgress(0);
  }
};

  // Handle delete request
  const handleDeleteRequest = (doc: DocItem ) => {
      setSelectedDoc(doc)
      setIsDeleteModalOpen(true)
  }

  const renderContent = () => {

      // 1️⃣ Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-3 text-slate-500">
          <div className="w-5 h-5 border-2 border-slate-300 border-t-emerald-500 rounded-full animate-spin"></div>
          <span className="text-sm font-medium">Loading documents...</span>
        </div>
      </div>
    );
  }

    if(documents.length === 0){
      return(
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center max-w-md">
            
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 shadow-lg shadow-slate-200/50 mb-6 ">
              <FileText className="w-10 h-10 text-slate-400" strokeWidth={1.5} />
            </div>
            <h3 className="text-xl font-medium text-slate-900 tracking-tight mb-2"> No Documents Yet </h3>
            <p className="text-sm text-slate-500 mb-6"> Get started by uploading your first PDF document to begin learning. </p>
            <Button variant={"gradient"} onClick={() => setIsUploadModalOpen(true)} className=" inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white text-sm font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30 active:scale-[0.98] " > 
              <Plus strokeWidth={2.5} className="w-4 h-4"/> 
              Upload Document 
            </Button>
          </div>
          
        </div>
      )
    }
    return(
      <div className="grid grid-cols-1  sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4  gap-6">
        {documents?.map((doc: DocItem) => (
          <DocumentCard key={doc._id}
          
          document={doc}
          onDelete={handleDeleteRequest}
          />
        )         
        )}
      </div>
    )

  }
    
    return(
        <div className="min-h-screen">
          {/* subtitle background patterns */}
          <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px, transparent_1px)] bg-[size:16px_16px] opacity-30 pointer-events-none"/>

          <div className="relative max-w-7xl mx-auto">
             {/* Headers */}
             <div className="flex items-center justify-between mb-10">
               <div>
                  <h1 className="text-2xl font-medium text-slate-900 tracking-tight mb-2"> My Documents </h1>
                  <p className="text-slate-500 text-sm"> Manage and organise your learing materials </p>
               </div>
               {documents.length > 0 && (
                
                <Button onClick={() => setIsUploadModalOpen(true)} variant={"gradient"} >
                  <Plus strokeWidth={2.5} className="w-4 h-4" /> 
                   Upload Document
                </Button>
               )}
             </div>
             {renderContent()}
          </div>

          {isUploadModalOpen && (
            <div className="fixed inset-0 z-0 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <div className="relative w-full max-w-lg bg-white/95 backdrop-blur-xl border border-slate-200/60 rounded-2xl shadow-2xl shadow-slate-900/20 p-8">
              <button onClick={() => setIsUploadModalOpen(false)} className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all duration-200">
                <X strokeWidth={2} className="w-5 h-5" />
              </button>

              {/* Modal Header */}
              <div className="mb-6">
                <h2 className="text-xl font-medium text-slate-900 tracking-tight"> Upload New Document </h2>
                <p className="text-sm text-slate-500 mt-1"> Add a PDF document to your library </p>
              </div>

               {/* Form */}
               <form onSubmit={(e) => { e.preventDefault(); startUpload();}} className="space-y-5">
                 {/* Title Input */}
                 <div className="space-y-2">
                    <label className="block text-xs font-semibold"> Document Title </label>
                    <input type="text" placeholder="Title" value={uploadTitle} onChange={(e) => setUploadTitle(e.target.value)}
                    className="w-full h-12 px-4 border-2 border-slate-200 rounded-xl bg-slate-50/50 text-slate-900 placeholder-slate-400 text-sm font-medium tansition-all duration-200 focus:outline-null focus:border-emerald-500 focus:bg-white focus:shadow-lg focus:shadow-emerald-500/10" />
                 </div>

                 {/* File Upload */}
                 <div className="space-y-2">
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide"> PDF File </label>
                  <div className="relative border-2 border-dashed border-slate-300 rounded-xl bg-slate-50/50 hover:border-emerald-400 hover:bg-emerald-50/30 transition-all duration-200 ">

                    <SelectFile fileType="pdf"
                     onFileSelect={(file) => {setUploadFile(file); 
                     setUploadTitle((prev) => { 
                      if(prev.trim() !== "") return prev; 
                      return file.name.replace(/\.[^/.]+$/, "")})}}  />

                    <div className="flex flex-col items-center justify-center py-10 px-6 ">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-r from-emerald-100 to-teal-100 flex items-center justify-center mb-4 ">
                        <Upload strokeWidth={2} className="w-7 h-7 text-emerald-600" />
                      </div>
                      <p className="text-sm font-medium text-slate-700 mb-1"> {uploadFile ? ( <span className="text-emerald-600"> {uploadFile.name} </span>) : (<> <span className="text-emerald-600"> Click to upload </span> {" "} or drag and drop </>)} </p>
                      <p className="text-xs text-slate-500">PDF upto 10MB</p>
                    </div>
                  </div>
                 </div>

                 {/* Action Button */}
                 <div className="flex gap-3 pt-2 ">
                  <button type="button" onClick={() => { setUploadFile(null); setUploadTitle(""); setIsUploadModalOpen(false)}}
                   disabled={uploading} className="flex-1 h-11 px-4 border-2 bloder-slate-200 rounded-xl bg-white text-slate-700 text-sm font-semibold hover:bg-slate-50 hover-border-slate-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed " > Cancle </button>

                  <button type="submit" disabled={uploading} className="flex-1 h-11 px-4 bg-linear-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white text-sm font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-emerald-500/25 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]" >
                  {uploading ? ( <span className="flex items-center gap-2"> <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"> </div> <span>{ `Uploading... ${progress}%`}</span> </span> ) : "Upload"}
                  </button>
                 </div>
               </form>
            </div>
          </div>
          )}

             
        </div>
    )
}

 export default Document