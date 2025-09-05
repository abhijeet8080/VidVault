"use client";

import { useEffect, useState } from "react";
import { getUserVideos, Video as VideoFromLib } from "@/lib/videos";

// Extend the Video type to include URLs
export interface Video extends VideoFromLib {
  videoUrl?: string;
  thumbnailsUrls?: string[];
}

export function useVideos(userId?: string) {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    const fetchVideos = async () => {
      try {
        setLoading(true);
        const vids: Video[] = await getUserVideos(userId);
        setVideos(vids);
      } catch (err) {
        console.error("Error fetching videos:", err);
        setVideos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [userId]);

  return { videos, loading };
}
