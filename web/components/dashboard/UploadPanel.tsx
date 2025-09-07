"use client";

import { FileVideo, AlertCircle, X, Upload } from "lucide-react";
import UploadDropzone from "./UploadDropzone";
import { useUpload } from "@/hooks/useUpload";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
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
  } = useUpload(onClose, onUploadComplete);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-full max-w-2xl max-h-[90vh] overflow-hidden p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload Video
          </DialogTitle>
          {/* <DialogClose className="absolute top-4 right-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
            <X className="h-4 w-4" />
          </DialogClose> */}
        </DialogHeader>

        <div className="space-y-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Dropzone */}
          <UploadDropzone onDrop={onDrop} />

          {/* Error */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Files Preview */}
          {files.length > 0 && !error && (
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Selected Files ({files.length})
              </h3>
              
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 border rounded-lg bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <FileVideo className="h-5 w-5 text-blue-500 flex-shrink-0" />
                    
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate" title={file.name}>
                        {file.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {(file.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(index)}
                      className="h-8 w-8 p-0 hover:bg-red-100 dark:hover:bg-red-900/20"
                    >
                      <X className="h-4 w-4 text-gray-400 hover:text-red-500" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Progress */}
          {uploading && (
            <div className="space-y-3 p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg">
              <div className="flex items-center justify-between text-sm">
                <span className="text-blue-700 dark:text-blue-300">
                  Uploading...
                </span>
                <span className="text-blue-600 dark:text-blue-400 font-medium">
                  {progress}%
                </span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={uploading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpload}
            disabled={files.length === 0 || !!error || uploading}
          >
            {uploading ? `Uploading ${progress}%` : 'Upload'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}