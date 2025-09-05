import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // service role needed for insert
)

export async function POST(req: Request) {
  try {
    const { userId, fileName, storagePath, fileSize } = await req.json()

    if (!userId || !storagePath || !fileName || !fileSize) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Insert new video record
    const { data, error } = await supabase
      .from("videos")
      .insert([
        {
          user_id: userId,
          file_name: fileName,
          file_size: fileSize,
          storage_path: storagePath,
          status: "PROCESSING", 
        },
      ])
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ video: data })
  }catch (err: unknown) {
    console.error("Insert video error:", err)

    const message = err instanceof Error ? err.message : "Unknown error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
