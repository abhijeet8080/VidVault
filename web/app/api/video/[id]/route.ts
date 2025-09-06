import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }  // params is now a Promise
) {
  const { id } = await context.params;   // <-- await it

  // Fetch the video from DB
  const { data: video } = await supabase
    .from("videos")
    .select("storage_path")
    .eq("id", id)
    .single();

  if (!video) return NextResponse.json({ error: "Video not found" }, { status: 404 });

  // Create signed URL (1 hour)
  const { data, error } = await supabase.storage
    .from("videos")
    .createSignedUrl(video.storage_path, 60 * 60);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Redirect to signed URL
  return NextResponse.redirect(data.signedUrl);
}
