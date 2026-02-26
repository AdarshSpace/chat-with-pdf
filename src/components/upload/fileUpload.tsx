"use client";

import { upload } from "@imagekit/next";
import { useState } from "react";

interface FileUploadProps {
  onsuccess: (res: any) => void;
  onProgress: (progress: number) => void;
  fileType?: "image" | "pdf";
}

const FileUpload = ({ onsuccess, onProgress, fileType }: FileUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateFile = (file: File): boolean => {
    if (fileType === "pdf" && file.type !== "application/pdf") {
      setError("Please upload a valid PDF file");
      return false;
    }

    if (fileType === "image" && !file.type.startsWith("image/")) {
      setError("Please upload a valid image file");
      return false;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("File size must be less than 5 MB");
      return false;
    } 

    return true;
  };

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);

    if (!validateFile(file)) return;

    setUploading(true);

    try {
        
      // Ask backend for ImageKit auth
      const authRes = await fetch("/api/auth/imagekit-auth");
      const data = await authRes.json();


    console.log('authentication  : ', data, authRes);
    console.log('Public Key : ', process.env.NEXT_PUBLIC_PUBLIC_KEY);

      const res = await upload({
        file,
        fileName: file.name,
        publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY!,
        expire: data.expire,
        token: data.token,
        signature: data.signature,
        onProgress: (event: ProgressEvent) => {
          if (event.lengthComputable) {
            const percent = Math.round(
              (event.loaded / event.total) * 100
            );
            onProgress(percent);
          }
        },
      });

      await fetch("/api/documents", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: "My PDF",
          fileId: res.fileId,
          fileName: res.name,
          fileUrl: res.url,
          fileSize: res.size,
          thumbnailUrl: res.thumbnailUrl
        }),
      });

      onsuccess(res);
    } catch (err) {
      console.log("Upload failed:", err);
      setError("Upload failed. Please try again.",);
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <input
        type="file"
        accept={
          fileType === "pdf" ? "application/pdf" : "image/*"
        }
        onChange={handleFileChange}
      />

      {uploading && <span>Uploading...</span>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </>
  );
};

export default FileUpload;
