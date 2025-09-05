"use client"

import { useState } from "react"
import UploadPanel from "@/components/dashboard/UploadPanel"
import VideoTable from "@/components/dashboard/VideoTable"
import { useUser } from "@clerk/nextjs"
import { useVideos, Video } from "@/hooks/useVideos"

export default function DashboardPage() {
  const { user } = useUser()
  const { videos, loading } = useVideos(user?.id)
  const [isUploadOpen, setIsUploadOpen] = useState(false)

  if (loading) {
    return <p className="text-gray-500">Loading videos...</p>
  }

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

      {/* Video List */}
      <VideoTable
        videos={videos.map((v: Video) => ({
          id: v.id,
          title: v.file_name, // using file_name since title doesn’t exist
          progress:
            v.status === "READY"
              ? 100
              : v.status === "PROCESSING"
              ? 50
              : v.status === "UPLOADING"
              ? 0
              : 0,
          thumbnail: "/placeholder-thumbnail.png", // until you add thumbnail URLs
          url:
            v.status === "READY"
              ? `/storage/${v.storage_path}` // adjust based on how you serve public URLs
              : undefined,
        }))}
      />

      {/* Upload Modal */}
      <UploadPanel
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
      />
    </div>
  )
}
