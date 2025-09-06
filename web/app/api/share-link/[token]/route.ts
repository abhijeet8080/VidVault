import { NextResponse } from "next/server"; 
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(
  req: Request,
  context: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await context.params;
    if (!token) {
      return NextResponse.json({ error: "Missing token" }, { status: 400 });
    }
    console.log("Token", token);

    // 🎯 Fetch share link
    const { data: shareLink, error: linkError } = await supabase
      .from("share_links")
      .select("*")
      .eq("token", token)
      .single();
    console.log("shareLink", shareLink);

    if (linkError || !shareLink) {
      return NextResponse.json({ error: "Link not found" }, { status: 404 });
    }

    // ⏳ Check expiry
    if (shareLink.expiry && new Date(shareLink.expiry) < new Date()) {
      return NextResponse.json({ error: "Link expired" }, { status: 403 });
    }

    // 🔐 Check visibility
    if (shareLink.visibility === "PRIVATE") {
      const authHeader = req.headers.get("authorization");
      console.log("authorization", authHeader);

      if (!authHeader) {
        return NextResponse.json(
          { error: "You are not allowed to access the video" },
          { status: 401 }
        );
      }

      const userEmail = authHeader.trim().toLowerCase();
      // ✅ Use correct property `emails` instead of `allowed_emails`
      if (!shareLink.emails?.map((e: string) => e.toLowerCase()).includes(userEmail)) {
        return NextResponse.json(
          { error: "You do not have permission to view this video" },
          { status: 403 }
        );
      }
    }

    // 📝 Update last_viewed_at
    await supabase
      .from("share_links")
      .update({ last_viewed_at: new Date() })
      .eq("token", token);

    // 📂 Fetch video details
    const { data: video, error: videoError } = await supabase
      .from("videos")
      .select("id, file_name, file_size, created_at, storage_path")
      .eq("id", shareLink.video_id)
      .single();

    if (videoError || !video) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }

    // 🎥 Generate signed URL
    const { data: signedData, error: signedError } = await supabase.storage
      .from("videos")
      .createSignedUrl(video.storage_path, 600);

    if (signedError) {
      return NextResponse.json({ error: signedError.message }, { status: 500 });
    }

    return NextResponse.json({
      video: {
        url: signedData.signedUrl,
        file_name: video.file_name,
        file_size: video.file_size,
        created_at: video.created_at,
        visibility: shareLink.visibility,
      },
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
