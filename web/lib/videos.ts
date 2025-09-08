import { createClient } from "@supabase/supabase-js";
import axios from "axios";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Types
interface Thumbnail {
  storage_path: string;
}
interface ShareLink {
  id: string;
  video_id: string;
  visibility: string;
  emails: string[]; 
  token: string;
  expiry: string;
  last_viewed_at: string | null;
  storage_path: string | null;
}
export interface Video {
  id: string;//
  user_id: string;//
  file_name: string;//
  file_size: number;//
  storage_path: string;//
  status: "UPLOADING" | "PROCESSING" | "READY";//
  created_at: string;//
  updated_at: string;//
  share_links: ShareLink[];
  thumbnails: string[];//
  videoUrl?: string;
  thumbnailsUrls?: string[];
}

// Helper to fetch signed URL from your API route
export async function fetchSignedUrl(bucket: string, path: string): Promise<string | undefined> {
  if (!path) return undefined;

  try {
    // const res = await axios.get<{ url?: string }>(`${process.env.NEXT_PUBLIC_APP_URL}/api/signed-url`, {
    const res = await axios.get<{ url?: string }>(`/api/signed-url`, {
      params: {
        bucket,
        path,
      },
    });

    return res.data.url;
  } catch (err) {
    console.error("Error fetching signed URL:", err);
    return undefined;
  }
}



export async function getVideoById(videoId: string) {
  const { data: video, error } = await supabase
    .from("videos")
    .select(`
      *,
      thumbnails (storage_path),
      share_links (*)
    `)
    .eq("id", videoId)
    .single();

  if (error || !video) return null;
  // Signed URL for video
  const videoUrl = await fetchSignedUrl("videos", video.storage_path);
    
  // Signed URLs for thumbnails
  const thumbnailsUrls = await Promise.all(
    (video.thumbnails || []).map((t: Thumbnail) => fetchSignedUrl("thumbnails", t.storage_path))
  );

  return { ...video, videoUrl, thumbnailsUrls };
}


