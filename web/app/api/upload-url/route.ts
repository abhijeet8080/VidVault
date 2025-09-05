import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

// Create Supabase client (Server-side, using service role)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! 
)

export async function POST(req: Request) {
  try {
    const { fileName, fileType, userId } = await req.json()

    if (!fileName || !fileType || !userId) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 })
    }

    // Storage path (folder by user + random file name to avoid collisions)
    const storagePath = `${userId}/${Date.now()}-${fileName}`

    // Create a signed URL for upload
    const { data, error } = await supabase.storage
      .from("videos")
      .createSignedUploadUrl(storagePath)

    if (error) throw error
    return NextResponse.json({
      uploadUrl: data.signedUrl,
      storagePath,
    })
  } catch (err: unknown) {
    console.error("Signed URL error:", err)

    // Safely check if err is an Error object
    const message = err instanceof Error ? err.message : "Unknown error"

    return NextResponse.json({ error: message }, { status: 500 })
  }
}
