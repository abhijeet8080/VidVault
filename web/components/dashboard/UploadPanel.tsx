// components/UploadPanel.tsx
"use client";

import { FileVideo, AlertCircle, X } from "lucide-react";
import UploadDropzone from "./UploadDropzone";
import { useUpload } from "@/hooks/useUpload";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";

interface UploadPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadComplete?: () => void; 
}

export default function UploadPanel({
  isOpen,
  onClose,
  onUploadComplete,
}: UploadPanelProps) {
  const {
    files,
    error,
    progress,
    uploading,
    onDrop,
    handleUpload,
    removeFile,
  } = useUpload(onClose, onUploadComplete); // ✅ pass down

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-full max-w-lg rounded-3xl p-6">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center">
            Upload Video
          </DialogTitle>
        </DialogHeader>

        {/* Close Button */}
        <DialogClose className="absolute top-3 right-3 text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200">
          ✕
        </DialogClose>

        {/* Dropzone */}
        <div className="mt-4">
          <UploadDropzone onDrop={onDrop} />
        </div>

        {/* Error */}
        {error && (
          <Alert variant="destructive" className="mt-4">
            <AlertCircle className="mr-2 h-5 w-5" />
            {error}
          </Alert>
        )}

        {/* Files Preview */}
        {files.length > 0 && !error && (
          <div className="mt-6 space-y-3">
            {files.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between gap-3 p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#111]"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <FileVideo className="h-7 w-7 text-indigo-600 dark:text-indigo-400" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {(file.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => removeFile(index)}
                  className="rounded-full p-1 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                >
                  <X className="h-4 w-4 text-gray-500 hover:text-red-500" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Progress */}
        {uploading && (
          <Progress value={progress} className="mt-4 h-2 rounded-full" />
        )}

        {/* Actions */}
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleUpload}
            disabled={files.length === 0 || !!error || uploading}
          >
            {uploading ? `Uploading ${progress}%` : "Upload"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
