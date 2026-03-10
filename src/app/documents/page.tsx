"use client"
import FileUpload from "@/components/upload/fileUpload";
import { Plus, Upload, Trash2, FileText, X} from "lucide-react"
import toast from "react-hot-toast"
import { useState } from "react";

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

    }
    catch(error){
      console.log('Error : ', error)
    }
  }

    
    return(
        <div>
              <div>
                <FileUpload fileType="pdf" onsuccess={(res) => {console.log("PDF uploaded:", res.url)}}
                  onProgress={(progress) => {  console.log(`Uploading: ${progress}%`) }}
                  />


             </div>
        </div>
    )
}

 export default Document