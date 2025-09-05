import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { nanoid } from "nanoid";
import { sendPrivateLinkEmail } from "@/lib/email";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { videoId, visibility, emails, expiryPreset } = await req.json();

    if (!videoId || !visibility) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Fetch video storage path
    const { data: video, error: videoError } = await supabase
      .from("videos")
      .select("id, storage_path")
      .eq("id", videoId)
      .single();

    if (videoError || !video) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }

    // Determine expiry
    const now = new Date();
    let expiry: Date | null = null;
    switch (expiryPreset) {
      case "1h": expiry = new Date(now.getTime() + 1 * 60 * 60 * 1000); break;
      case "12h": expiry = new Date(now.getTime() + 12 * 60 * 60 * 1000); break;
      case "1d": expiry = new Date(now.getTime() + 24 * 60 * 60 * 1000); break;
      case "30d": expiry = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); break;
      case "forever": expiry = null; break;
      default: expiry = null;
    }

    const token = nanoid(12);

    // Insert share link
    const { data, error } = await supabase
      .from("share_links")
      .insert({
        video_id: videoId,
        storage_path: video.storage_path,
        visibility,
        emails: emails || [],
        token,
        expiry,
      })
      .select()
      .single();

    if (error) throw error;

    // Send email notifications if PRIVATE
    if (visibility === "PRIVATE" && emails?.length) {
      await sendPrivateLinkEmail(emails, token, expiry);
    }
    let link ='';
    if(visibility === "PRIVATE" ){
      link = `${process.env.NEXT_PUBLIC_APP_URL}/shared-link/p/${token}`;
    } else{
      link = `${process.env.NEXT_PUBLIC_APP_URL}/shared-link/s/${token}`;

    }
    return NextResponse.json({
      message: "Share link created",
      token,
      link:link,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Share link creation error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
