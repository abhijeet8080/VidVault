import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: Request, context: { params: { token: string } }) {
  try {
    const { token } = context.params;
    if (!token) {
      return NextResponse.json({ error: "Missing token" }, { status: 400 });
    }

    // 🎯 Fetch share link from DB
    const { data: shareLink, error: linkError } = await supabase
      .from("share_links")
      .select("*")
      .eq("token", token)
      .single();

    if (linkError || !shareLink) {
      return NextResponse.json({ error: "Link not found" }, { status: 404 });
    }

    // ⏳ Check expiry
    if (shareLink.expiry && new Date(shareLink.expiry) < new Date()) {
      return NextResponse.json({ error: "Link expired" }, { status: 403 });
    }
    console.log('sharelink',shareLink)
    // 🔐 Check visibility
    if (shareLink.visibility === "private") {
      const authHeader = req.headers.get("authorization");
      if (!authHeader) {
        return NextResponse.json({ error: "Email required in Authorization header" }, { status: 401 });
      }

      const userEmail = authHeader.trim().toLowerCase();

      if (!shareLink.allowed_emails?.map((e: string) => e.toLowerCase()).includes(userEmail)) {
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

    // 🎥 Generate signed URL
    const { data: signedData, error: signedError } = await supabase.storage
      .from("videos")
      .createSignedUrl(shareLink.storage_path, 600);

    if (signedError) {
      return NextResponse.json({ error: signedError.message }, { status: 500 });
    }

    return NextResponse.json({
      video: {
        url: signedData.signedUrl,
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
