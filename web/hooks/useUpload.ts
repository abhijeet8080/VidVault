import { useCallback, useState } from "react";
import axios from "axios";
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

export function useUpload(onClose: () => void) {
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

        const { data: uploadData } = await axios.post<UploadUrlResponse>("/api/upload-url", {
          fileName: file.name,
          fileType: file.type,
          userId: user.id,
        });

        if (uploadData.error || !uploadData.uploadUrl) {
          throw new Error(uploadData.error || "Failed to get upload URL");
        }

        await axios.put(uploadData.uploadUrl, file, {
          headers: { "Content-Type": file.type },
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const currentFileProgress = (progressEvent.loaded / progressEvent.total) * 100;
              const overallProgress = Math.round(((i + currentFileProgress / 100) / files.length) * 100);
              setProgress(overallProgress);
            }
          },
        });

        const videoMetadata: VideoMetadata = {
          userId: user.id,
          fileName: file.name,
          storagePath: uploadData.storagePath,
          fileSize: file.size,
        };

        await axios.post("/api/videos", videoMetadata);
      }

      setFiles([]);
      setProgress(0);
      onClose();
    } catch (err) {
      console.error("Upload failed:", err);
      setError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  }, [files, user, onClose]);

  return { files, error, progress, uploading, onDrop, handleUpload, removeFile };
}
