"use client";

import { useState } from "react";
import UploadPanel from "@/components/dashboard/UploadPanel";
import VideoTable from "@/components/dashboard/VideoTable";
import { useUser } from "@clerk/nextjs";
import { useVideos, Video } from "@/hooks/useVideos";

export default function DashboardPage() {
  const { user } = useUser();
  const { videos, loading } = useVideos(user?.id);
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  // Map videos to the format expected by VideoTable
  const mappedVideos = videos.map((v: Video) => ({
    id: v.id,
    title: v.file_name,
    progress:
      v.status === "READY"
        ? 100
        : v.status === "PROCESSING"
        ? 50
        : 0,
    thumbnail: v.thumbnailUrl, // <-- use single URL from backend
    url: v.videoUrl, // signed URL for video
  }));

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 space-y-10">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          My Dashboard
        </h1>
        <button
          onClick={() => setIsUploadOpen(true)}
          className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 transition"
        >
          Upload Video
        </button>
      </div>

      {loading ? (
        <div className="space-y-2">
          {[...Array(5)].map((_, idx) => (
            <div
              key={idx}
              className="h-16 md:h-20 rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse"
            />
          ))}
        </div>
      ) : mappedVideos.length > 0 ? (
        <VideoTable videos={mappedVideos} />
      ) : (
        <p className="text-gray-500">No videos found.</p>
      )}

      <UploadPanel
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
      />
    </div>
  );
}
