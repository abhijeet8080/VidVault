import { fetchSignedUrl } from "./videos";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Final clean types
export interface Video {
  id: string;
  file_name: string;
  file_size: number;
  storage_path: string;
  status: string;
  created_at: string;
  thumbnailUrl: string | null;
}

export interface ShareLink {
  id: string;
  token: string;
  visibility: string;
  emails: string[] | null;
  expiry: string | null;
  last_viewed_at: string | null;
  storage_path: string;
  videos: Video;
}

// Raw Supabase response types
interface RawThumbnail {
  storage_path: string;
}

interface RawVideo {
  id: string;
  file_name: string;
  file_size: number;
  storage_path: string;
  status: string;
  created_at: string;
  thumbnails: RawThumbnail[]; // comes from join
}

interface RawShareLink {
  id: string;
  token: string;
  visibility: string;
  emails: string[]; // jsonb in Supabase, coerce later
  expiry: string | null;
  last_viewed_at: string | null;
  storage_path: string;
  videos: RawVideo; // ✅ ensure this is a single object, not an array
}

export async function getUserShareLinks(userId: string): Promise<ShareLink[]> {
  const { data, error } = await supabase
    .from("share_links")
    .select(`
      id,
      token,
      visibility,
      emails,
      expiry,
      last_viewed_at,
      storage_path,
      videos!inner (
        id,
        file_name,
        file_size,
        storage_path,
        status,
        created_at,
        thumbnails (storage_path)
      )
    `)
    .eq("videos.user_id", userId);

  if (error) {
    console.error("Error fetching share links:", error);
    return [];
  }

  if (!data) return [];

  const linksWithThumbs: ShareLink[] = await Promise.all(
    (data as unknown as RawShareLink[]).map(async (link) => {
      const video = link.videos;

      let firstThumbnailUrl: string | null = null;
      if (video?.thumbnails?.length > 0) {
        const firstThumb = video.thumbnails[0];
        const url = await fetchSignedUrl("thumbnails", firstThumb.storage_path);
        firstThumbnailUrl = url ?? null;
      }

      return {
        id: link.id,
        token: link.token,
        visibility: link.visibility,
        emails: (link.emails as string[] | null) ?? null,
        expiry: link.expiry,
        last_viewed_at: link.last_viewed_at,
        storage_path: link.storage_path,
        videos: {
          id: video.id,
          file_name: video.file_name,
          file_size: video.file_size,
          storage_path: video.storage_path,
          status: video.status,
          created_at: video.created_at,
          thumbnailUrl: firstThumbnailUrl,
        },
      };
    })
  );

  // ✅ Sort by video.created_at manually
  return linksWithThumbs.sort(
    (a, b) =>
      new Date(b.videos.created_at).getTime() -
      new Date(a.videos.created_at).getTime()
  );
}
