import { useEffect, useState, useCallback } from "react";
import axios from "axios";

export interface Video {
  id: string;
  file_name: string;
  file_size: number;
  status: "UPLOADING" | "PROCESSING" | "READY";
  videoUrl?: string;
  thumbnailUrl?: string;
  created_at?:string
}

export function useVideos(userId?: string) {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchVideos = useCallback(async () => {
    if (!userId) return;
    try {
      setLoading(true);

      // const res = await axios.get<Video[]>(`${process.env.NEXT_PUBLIC_APP_URL}/api/user-videos`, {
      const res = await axios.get<Video[]>(`/api/user-videos`, {
        params: { userId },
      });
      console.log(res.data)
      setVideos(res.data || []);
    } catch (err) {
      console.error("Error fetching videos:", err);
      setVideos([]);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  return { videos, loading, refresh: fetchVideos };
}
