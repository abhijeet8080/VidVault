import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId");
  if (!userId) return NextResponse.json({ error: "Missing userId" }, { status: 400 });

  const { data: videos, error } = await supabase
    .from("videos")
    .select("*, thumbnails(storage_path)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Generate signed URLs server-side
  const videosWithUrls = await Promise.all(
    videos.map(async (v) => {
      const videoUrlData = await supabase.storage
        .from("videos")
        .createSignedUrl(v.storage_path, 60 * 60); // 1 hour validity

      // ✅ Only generate signed URL for the first thumbnail
      let firstThumbnailUrl: string | null = null;
      if (v.thumbnails && v.thumbnails.length > 0) {
        const urlData = await supabase.storage
          .from("thumbnails")
          .createSignedUrl(v.thumbnails[0].storage_path, 60 * 60);
        firstThumbnailUrl = urlData.data?.signedUrl || null;
      }

      return {
        ...v,
        videoUrl: videoUrlData.data?.signedUrl,
        thumbnailUrl: firstThumbnailUrl, // single URL
      };
    })
  );

  return NextResponse.json(videosWithUrls);
}
