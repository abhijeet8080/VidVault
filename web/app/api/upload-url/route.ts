import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

// Create Supabase client (Server-side, using service role)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! 
)

function sanitizeFileName(name: string): string {
  return name
    .normalize("NFKD")                // remove accents
    .replace(/[^\w.-]/g, "_")         // replace unsafe chars
    .replace(/_+/g, "_")              // collapse multiple _
    .replace(/^_+|_+$/g, "");         // trim leading/trailing _
}

export async function POST(req: Request) {
  try {
    const { fileName, fileType, userId } = await req.json()

    if (!fileName || !fileType || !userId) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 })
    }

    // Sanitize before using in storage path
    const safeName = sanitizeFileName(fileName)
    const storagePath = `${userId}/${Date.now()}-${safeName}`

    // Create a signed URL for upload
    const { data, error } = await supabase.storage
      .from("videos")
      .createSignedUploadUrl(storagePath)

    if (error) throw error

    return NextResponse.json({
      uploadUrl: data.signedUrl,
      storagePath,        // safe path stored in DB
      originalFileName: fileName  // keep original for UI
    })
  } catch (err: unknown) {
    console.error("Signed URL error:", err)
    const message = err instanceof Error ? err.message : "Unknown error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
