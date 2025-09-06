import { useEffect, useState, useCallback } from "react";

export interface Video {
  id: string;
  file_name: string;
  file_size: number;
  status: "UPLOADING" | "PROCESSING" | "READY";
  videoUrl?: string;
  thumbnailUrl?: string;
}

export function useVideos(userId?: string) {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchVideos = useCallback(async () => {
    if (!userId) return;
    try {
      setLoading(true);
      const res = await fetch(`/api/user-videos?userId=${userId}`);
      const data = await res.json();
      console.log("fetched videos:", data);
      setVideos(data || []);
    } catch (err) {
      console.error(err);
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
