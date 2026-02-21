"use client"
import FileUpload from "@/components/upload/fileUpload";

 const Document = () => {
    
    return(
        <div>
              <div>
              <FileUpload
  fileType="pdf"
  onsuccess={(res) => {
    console.log("PDF uploaded:", res.url);
  }}
  onProgress={(progress) => {
    console.log(`Uploading: ${progress}%`);
  }}
/>


             </div>
        </div>
    )
}

 export default Document