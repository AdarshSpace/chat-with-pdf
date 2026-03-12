"use client"
import FileUpload from "@/components/upload/fileUpload";
import { DocumentCard } from "@/components/documentCards/docCard"
import { Plus, Upload, Trash2, FileText, X} from "lucide-react"
import toast from "react-hot-toast"
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Span } from "next/dist/trace";

 const Document = () => {

  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  // state for upload modal
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploading, setUploading] = useState(false);

  // state for delete conformation modal
  const [isDeleteModalOpen, setIsDeleteModalOpen ]  = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);

  const fetchDocuments = async () => {
    try{
      const res = await fetch(`/api/documents/fetchDocList`);
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


  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if(file){
      setUploadFile(file);
      setUploadTitle(file.name.replace(/\.[^/.]+$/, ""))
    }
  }


  const handleUpload = async (e) => {
    e.preventDefault();
    if(!uploadFile || !uploadTitle){
      toast.error('please provide a title and select a file');
      return
    }
    setUploading(true);

    const formData = new FormData();
    formData.append("file", uploadFile)
    formData.append("title", uploadTitle)

    try{
      await FileUpload
    }
    catch(error){

    }

   
  }


  const renderContent = () => {

    if(documents.length === 0){
      return(
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center max-w-md">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 shadow-lg shadow-slate-200/50 mb-6 ">
              <FileText className="w-10 h-10 text-slate-400" strokeWidth={1.5} />
            </div>
            <h3 className="text-xl font-medium text-slate-900 tracking-tight mb-2"> No Documents Yet </h3>
            <p className="text-sm text-slate-500 mb-6"> Get started by uploading your first PDF document to begin learning. </p>
            <Button variant={"gradient"} className=" inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white text-sm font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30 active:scale-[0.98] " > 
              <Plus strokeWidth={2.5} className="w-4 h-4"/> 
              Upload Document 
            </Button>
          </div>
          
        </div>
      )
    }
    return(
      <div className="">
        {documents?.map((doc) => (
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
          <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px, transparent_1px)] bg-size-[16px_16px] opacity-30 pointer-events-none"/>

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

          <div className="">
            <div className="">
              <button onClick={} className="">
                <X strokeWidth={2} className="" />
              </button>

              {/* Modal Header */}
              <div className="">
                <h2 className=""> Upload New Document </h2>
                <p className=""> Add a PDF document to your library </p>
              </div>

               {/* Form */}
               <form onSubmit={handleUpload} className="">
                 {/* Title Input */}
                 <div className="">
                    <label className=""> Document Title </label>
                    <input type="text" value={uploadFile} onChange={(e) => setUploadTitle(e.target.value)}
                    required className=""
                    placeholder="e.g., Next.js Interview Prep" 
                    />
                 </div>

                 {/* File Upload */}
                 <div className="">
                  <label className=""> PDF File </label>
                  <div className="">
                    <input type="file" id="file-upload" className="" onChange={handleFileChange} accept=".pdf" />
                    <div className="">
                      <div className="">
                        <Upload strokeWidth={2} className="" />
                      </div>
                      <p className=""> {uploadFile ? ( <span className=""> {uploadFile.name} </span>) : (<> <span className=""> Click to upload </span> {" "} or drag and drop </>)} </p>
                      <p className="">PDF upto 10MB</p>
                    </div>
                  </div>
                 </div>

                 {/* Action Button */}
                 <div className="">
                  <button type="button" onClick={setIsUploadModalOpen(false)} disabled={uploading} className="" > Cancle </button>
                  <button type="submit" disabled={uploading} className="" >{uploading ? ( <span className=""> <div className=""> Uploading...</div></span> ) : ("Upload")}</button>
                 </div>
               </form>
            </div>
          </div>

              <div className="">
                <FileUpload fileType="pdf" onsuccess={(res) => {console.log("PDF uploaded:", res.url)}}
                  onProgress={(progress) => {  console.log(`Uploading: ${progress}%`) }}
                  />


             </div>
        </div>
    )
}

 export default Document