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

        // 1️⃣ Get signed upload URL
        const res = await fetch(`/api/upload-url`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fileName: file.name,
            fileType: file.type,
            userId: user.id,
          }),
        });

        const uploadData: UploadUrlResponse = await res.json();
        if (!res.ok || uploadData.error || !uploadData.uploadUrl) {
          throw new Error(uploadData.error || `Failed to get upload URL (${res.status})`);
        }

        // 2️⃣ Upload file with XMLHttpRequest (progress support + Safari fix)
        await new Promise<void>((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.open("PUT", uploadData.uploadUrl);

          // 🚨 DO NOT set Content-Type (Supabase already handles it via signed URL)
          // xhr.setRequestHeader("Content-Type", file.type || "application/octet-stream");

          xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) {
              const currentFileProgress = (event.loaded / event.total) * 100;
              const overallProgress = Math.round(
                ((i + currentFileProgress / 100) / files.length) * 100
              );
              setProgress(overallProgress);
            }
          };

          xhr.onloadend = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
              resolve();
            } else {
              reject(new Error(`Upload failed with status ${xhr.status}: ${xhr.responseText}`));
            }
          };

          xhr.onerror = () => reject(new Error("Network error during upload"));
          xhr.send(file);
        });

        // 3️⃣ Save video metadata
        const videoMetadata: VideoMetadata = {
          userId: user.id,
          fileName: file.name,
          storagePath: uploadData.storagePath,
          fileSize: file.size,
        };

        const saveRes = await fetch(`/api/videos`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(videoMetadata),
        });

        if (!saveRes.ok) {
          throw new Error(`Metadata save failed: ${saveRes.status} ${await saveRes.text()}`);
        }
      }

      // ✅ Done
      setFiles([]);
      setProgress(0);
      onClose();
      if (onUploadComplete) onUploadComplete();
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error("Upload failed:", err.message);
        setError(err.message);
      } else {
        console.error("Upload failed:", err);
        setError("Upload failed. Please try again.");
      }
    } finally {
      setUploading(false);
    }
  }, [files, user, onClose, onUploadComplete]);

  return {
    files,
    error,
    progress,
    uploading,
    onDrop,
    handleUpload,
    removeFile,
  };
}
