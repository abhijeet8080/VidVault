"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud, X, FileVideo, AlertCircle } from "lucide-react";
import axios from "axios";
import { useUser } from "@clerk/nextjs";

export default function UploadPanel({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [uploading, setUploading] = useState(false);
  const { user } = useUser();

  const MAX_SIZE = 500 * 1024 * 1024; // 500MB

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      const selectedFile = acceptedFiles[0];
      if (selectedFile.size > MAX_SIZE) {
        setError("File size cannot exceed 500 MB");
        setFile(null);
      } else {
        setFile(selectedFile);
        setError(null);
      }
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "video/*": [] },
    multiple: false,
  });

  const handleUpload = async () => {
    if (!file || !user) return;
    setUploading(true);
    setProgress(0);

    try {
      // 1. Request signed upload URL
      const res = await fetch("/api/upload-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName: file.name,
          fileType: file.type,
          userId: user.id,
        }),
      });

      const { uploadUrl, storagePath, error } = await res.json();
      if (error || !uploadUrl)
        throw new Error(error || "Failed to get upload URL");

      // 2. Upload file directly to Supabase
      await axios.put(uploadUrl, file, {
        headers: { "Content-Type": file.type },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percent = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setProgress(percent);
          }
        },
      });

      // 3. Save metadata to DB
      await axios.post("/api/videos", {
        userId: user?.id,
        fileName: file.name,
        storagePath: storagePath,
        fileSize: file.size,
      });

      // Reset + close modal
      setFile(null);
      setProgress(0);
      onClose();
    } catch (err: any) {
      console.error("Upload failed:", err);
      setError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="w-full max-w-lg bg-white dark:bg-[#0D0D0D] rounded-3xl shadow-2xl p-6 relative animate-fadeIn">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition"
        >
          <X className="h-6 w-6" />
        </button>

        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 text-center">
          Upload Video
        </h2>

        {/* Dropzone */}
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

        {/* Error */}
        {error && (
          <div className="mt-4 flex items-center gap-2 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 p-3 rounded-lg">
            <AlertCircle className="h-5 w-5" />
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}

        {/* File Preview */}
        {file && !error && (
          <div className="mt-6 flex items-center gap-3 p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#111]">
            <FileVideo className="h-7 w-7 text-indigo-600 dark:text-indigo-400" />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                {file.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {(file.size / (1024 * 1024)).toFixed(2)} MB
              </p>
            </div>
          </div>
        )}

        {/* Progress Bar */}
        {uploading && (
          <div className="w-full mt-4 bg-gray-200 dark:bg-gray-800 h-2 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-600 dark:bg-indigo-400 transition-all"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        )}

        {/* Actions */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            disabled={!file || !!error || uploading}
            className={`px-4 py-2 rounded-lg font-medium text-white transition ${
              file && !error && !uploading
                ? "bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
                : "bg-gray-400 dark:bg-gray-600 cursor-not-allowed"
            }`}
          >
            {uploading ? `Uploading ${progress}%` : "Upload"}
          </button>
        </div>
      </div>
    </div>
  );
}
