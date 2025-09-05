"use client"

import { useEffect, useState } from "react"
import { getUserVideos } from "@/lib/videos"

// Define the type of a Video object
export interface Video {
  id: string
  user_id: string
  file_name: string
  file_size: number
  storage_path: string
  status: "UPLOADING" | "PROCESSING" | "READY"  
  created_at: string
  updated_at: string
}

export function useVideos(userId?: string) {
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) return

    const fetchVideos = async () => {
      try {
        setLoading(true)
        const vids: Video[] = await getUserVideos(userId)
        setVideos(vids)
      } catch (err) {
        console.error("Error fetching videos:", err)
        setVideos([])
      } finally {
        setLoading(false)
      }
    }

    fetchVideos()
  }, [userId])

  return { videos, loading }
}
