import { useCallback, useState } from "react";
import { useUser } from "@clerk/nextjs";

const MAX_SIZE = 500 * 1024 * 1024; // 500MB

interface UploadUrlResponse {
  uploadUrl: string;
  storagePath: string;
  error?: string;
}

interface VideoMetadata {
  userId: string;
  fileName: string;
  storagePath: string;
  fileSize: number;
}

export function useUpload(onClose: () => void, onUploadComplete?: () => void) {
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [uploading, setUploading] = useState(false);
  const { user } = useUser();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (!acceptedFiles.length) return;

    const validFiles = acceptedFiles.filter((f) => f.size <= MAX_SIZE);
    const oversized = acceptedFiles.find((f) => f.size > MAX_SIZE);

    if (oversized) {
      setError("File size cannot exceed 500 MB");
    } else {
      setError(null);
    }

    setFiles((prev) => [...prev, ...validFiles]);
  }, []);

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpload = useCallback(async () => {
    if (files.length === 0 || !user) return;
    setUploading(true);
    setProgress(0);

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        // 🔹 Step 1: Get upload URL
        const uploadRes = await fetch(`/api/upload-url`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fileName: file.name,
            fileType: file.type,
            userId: user.id,
          }),
        });

        const uploadData: UploadUrlResponse = await uploadRes.json();

        if (uploadData.error || !uploadData.uploadUrl) {
          throw new Error(uploadData.error || "Failed to get upload URL");
        }

        // 🔹 Step 2: Upload file to storage (progress tracking with XMLHttpRequest since fetch doesn't support it)
        await new Promise<void>((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.open("PUT", uploadData.uploadUrl);

          xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) {
              const currentFileProgress = (event.loaded / event.total) * 100;
              const overallProgress = Math.round(
                ((i + currentFileProgress / 100) / files.length) * 100
              );
              setProgress(overallProgress);
            }
          };

          xhr.onload = () => (xhr.status >= 200 && xhr.status < 300 ? resolve() : reject());
          xhr.onerror = reject;
          xhr.send(file);
        });

        // 🔹 Step 3: Save metadata
        const videoMetadata: VideoMetadata = {
          userId: user.id,
          fileName: file.name,
          storagePath: uploadData.storagePath,
          fileSize: file.size,
        };

        await fetch(`/api/videos`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(videoMetadata),
        });
      }

      setFiles([]);
      setProgress(0);
      onClose();
      if (onUploadComplete) onUploadComplete();
    } catch (err) {
      console.error("Upload failed:", err);
      setError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  }, [files, user, onClose, onUploadComplete]);

  return { files, error, progress, uploading, onDrop, handleUpload, removeFile };
}
