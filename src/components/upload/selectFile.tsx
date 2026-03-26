"use client";

import { useState } from "react";

interface selectFileProps {
  onFileSelect: (file: File) => void;
  fileType?: "image" | "pdf";
}

const SelectFile = ({ onFileSelect, fileType }: selectFileProps) => {
  const [error, setError] = useState<string | null>(null);

  const validateFile = (file: File) => {
    if (fileType === "pdf" && file.type !== "application/pdf") {
      setError("Please upload a valid PDF");
      return false;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("File must be under 10MB");
      return false;
    }

    return true;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!validateFile(file)) return;

    setError(null);
    onFileSelect(file);
  };

  return (
    <>
      <input
        type="file"
        accept={fileType === "pdf" ? "application/pdf" : "image/*"}
        onChange={handleFileChange}
        required className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 "
        placeholder="e.g., Next.js Interview Prep" 
       
      />

      {error && <p className="text-red-500">{error}</p>}
    </>
  );
};

export default SelectFile;
