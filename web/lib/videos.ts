import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Types
interface Thumbnail {
  storage_path: string;
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
  thumbnails: string[];//
  videoUrl?: string;
  thumbnailsUrls?: string[];
}

// Helper to fetch signed URL from your API route
async function fetchSignedUrl(bucket: string, path: string): Promise<string | undefined> {
  if (!path) return undefined;

  try {
    const res = await fetch(`/api/signed-url?bucket=${bucket}&path=${encodeURIComponent(path)}`);
    const data = await res.json();
    return data.url as string | undefined;
  } catch (err) {
    console.error("Error fetching signed URL:", err);
    return undefined;
  }
}

// Fetch all videos for a user with signed URLs
export async function getUserVideos(userId: string): Promise<Video[]> {
  const { data: videos, error } = await supabase
    .from("videos")
    .select(`
      *,
      thumbnails(storage_path)
    `)
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching videos:", error);
    return [];
  }

  if (!videos) return [];
  console.log('videos',videos)
  // Map each video to include signed URLs
  const videosWithUrls: Video[] = await Promise.all(
  videos.map(async (video) => {
    const videoUrl = await fetchSignedUrl("videos", video.storage_path);

    const thumbnailsUrls = await Promise.all(
      (video.thumbnails || []).map((t: Thumbnail) => fetchSignedUrl("thumbnails", t.storage_path))
    );

    return {
      ...video,
      videoUrl,
      thumbnailsUrls,
    };
  })
);


  return videosWithUrls;
}


export async function getVideoById(videoId: string) {
  const { data: video, error } = await supabase
    .from("videos")
    .select(`*, thumbnails(storage_path)`)
    .eq("id", videoId)
    .single();

  if (error || !video) return null;

  const videoUrl = await fetchSignedUrl("videos", video.storage_path);

  const thumbnails = await Promise.all(
    (video.thumbnails || []).map((t: any) => fetchSignedUrl("thumbnails", t.storage_path))
  );

  // Example: fetch share links if you have a table
  const { data: links } = await supabase
    .from("video_links")
    .select("*")
    .eq("video_id", videoId);
  return { ...video, videoUrl, thumbnails, links: links || [] };
}