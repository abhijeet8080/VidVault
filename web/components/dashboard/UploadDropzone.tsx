// components/UploadDropzone.tsx
"use client";

import { useDropzone } from "react-dropzone";
import { UploadCloud } from "lucide-react";

interface UploadDropzoneProps {
  onDrop: (files: File[]) => void;
}

export default function UploadDropzone({ onDrop }: UploadDropzoneProps) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "video/*": [] },
    multiple: false,
  });

  return (
    <div
      {...getRootProps()}
      className={`flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-2xl transition-all cursor-pointer w-full ${
        isDragActive
          ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30"
          : "border-gray-300 dark:border-gray-700 bg-gray-50/70 dark:bg-[#111]/70"
      }`}
    >
      <input {...getInputProps()} />
      <UploadCloud className="h-12 w-12 text-indigo-600 dark:text-indigo-400 mb-3" />
      {isDragActive ? (
        <p className="text-indigo-600 dark:text-indigo-400 font-medium">
          Drop your video here...
        </p>
      ) : (
        <>
          <p className="text-gray-700 dark:text-gray-300 font-medium">
            Drag & Drop your video
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            or click to select a file (max 500 MB)
          </p>
        </>
      )}
    </div>
  );
}
