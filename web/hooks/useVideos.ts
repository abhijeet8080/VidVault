import { useEffect, useState } from "react";

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

  useEffect(() => {
    if (!userId) return;

    const fetchVideos = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/user-videos?userId=${userId}`);
        const data = await res.json();
        console.log('dataf form',data)
        setVideos(data || []);
      } catch (err) {
        console.error(err);
        setVideos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [userId]);

  return { videos, loading };
}
