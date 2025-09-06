"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Clock,
  FileText,
  ImageIcon,
  CheckCircle,
  Loader,
  HardDrive,
} from "lucide-react";

interface VideoMetadataProps {
  video?: {
    file_name: string;
    file_size: number;
    created_at: string;
    updated_at: string;
    status: "UPLOADING" | "PROCESSING" | "READY";
    thumbnails: string[];
    links?: { id: string; url: string }[];
  };
  loading?: boolean;
}

export default function VideoMetadata({
  video,
  loading = false,
}: VideoMetadataProps) {
  if (loading) {
    return (
      <div className="space-y-4 w-full">
        {[...Array(6)].map((_, idx) => (
          <Skeleton key={idx} className="h-6 w-full rounded-md" />
        ))}
      </div>
    );
  }

  if (!video) return null;

  const formattedSize = `${(video.file_size / 1024 / 1024).toFixed(2)} MB`;
  const createdAt = new Date(video.created_at).toLocaleString();
  const updatedAt = new Date(video.updated_at).toLocaleString();

  const rows = [
    { label: "File Name", value: video.file_name, icon: FileText },
    { label: "File Size", value: formattedSize, icon: HardDrive },
    { label: "Upload Date", value: createdAt, icon: Calendar },
    { label: "Last Updated", value: updatedAt, icon: Clock },
    {
      label: "Status",
      value: (
        <Badge
          variant={video.status === "READY" ? "default" : "secondary"}
          className="flex items-center gap-1"
        >
          {video.status === "READY" ? (
            <CheckCircle className="w-4 h-4" />
          ) : (
            <Loader className="w-4 h-4 animate-spin" />
          )}
          {video.status}
        </Badge>
      ),
    },
    {
  label: "Thumbnails",
  value: `${video.thumbnails?.length ?? 0}`, 
  icon: ImageIcon,
},
  ];

  return (
    <div className="w-full bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-xl space-y-6">
      <h2 className="text-lg font-semibold tracking-tight mb-2 flex items-center gap-2">
        <FileText className="w-5 h-5 text-muted-foreground" />
        Video Metadata
      </h2>

      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {rows.map((row, idx) => (
          <div
            key={idx}
            className="flex justify-between items-center py-3 text-sm"
          >
            <span className="flex items-center gap-2 font-medium text-gray-700 dark:text-gray-300">
              {row.icon && <row.icon className="w-4 h-4 text-muted-foreground" />}
              {row.label}
            </span>
            <span className="text-gray-900 dark:text-gray-100 text-right">
              {row.value}
            </span>
          </div>
        ))}
      </div>

      
    </div>
  );
}
