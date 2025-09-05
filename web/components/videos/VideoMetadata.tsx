"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, FileText, ImageIcon, Link2, CheckCircle, Loader } from "lucide-react";

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

export default function VideoMetadata({ video, loading = false }: VideoMetadataProps) {
  if (loading) {
    return (
      <div className="space-y-4 w-full">
        {[...Array(6)].map((_, idx) => <Skeleton key={idx} className="h-6 w-full rounded-md" />)}
      </div>
    );
  }
  console.log('meta',video)
  if (!video) return null;

  const formattedSize = `${(video.file_size / 1024 / 1024).toFixed(2)} MB`;
  const createdAt = new Date(video.created_at).toLocaleString();
  const updatedAt = new Date(video.updated_at).toLocaleString();

  return (
    <div className="space-y-4 w-full bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg transition-colors">
      <div className="flex justify-between items-center">
        <span className="flex items-center gap-2 font-semibold"><FileText /> File Name:</span>
        <span>{video.file_name}</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="flex items-center gap-2 font-semibold"><ImageIcon /> File Size:</span>
        <span>{formattedSize}</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="flex items-center gap-2 font-semibold"><Calendar /> Upload Date:</span>
        <span>{createdAt}</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="flex items-center gap-2 font-semibold"><Clock /> Last Updated:</span>
        <span>{updatedAt}</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="flex items-center gap-2 font-semibold">Status:</span>
        <Badge variant={video.status === "READY" ? "default" : "secondary"} className="flex items-center gap-1">
          {video.status === "READY" ? <CheckCircle className="w-4 h-4" /> : <Loader className="w-4 h-4 animate-spin" />}
          {video.status}
        </Badge>
      </div>
      <div className="flex justify-between items-center">
        <span className="flex items-center gap-2 font-semibold"><ImageIcon /> Thumbnails:</span>
        <span>{video.thumbnails.length}</span>
      </div>
      <div className="flex flex-col gap-2">
        <span className="flex items-center gap-2 font-semibold"><Link2 /> Share Links:</span>
        {video.links?.length ? (
          video.links.map((link) => (
            <a key={link.id} href={link.url} target="_blank" className="text-blue-500 hover:underline truncate">
              {link.url}
            </a>
          ))
        ) : (
          <span>No links</span>
        )}
      </div>
    </div>
  );
}
