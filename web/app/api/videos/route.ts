import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { Queue } from "bullmq"
import IORedis from "ioredis"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Setup Redis connection for BullMQ
if (!process.env.REDIS_URL) throw new Error("REDIS_URL not defined in .env")
const connection = new IORedis(process.env.REDIS_URL, { maxRetriesPerRequest: null })

// Video processing queue
const videoQueue = new Queue("video-processing", { connection })

export async function POST(req: Request) {
  try {
    const { userId, fileName, storagePath, fileSize } = await req.json()

    if (!userId || !storagePath || !fileName || !fileSize) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // 1️⃣ Insert new video record
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

    // 2️⃣ Enqueue job for background processing
    await videoQueue.add("process-video", {
      videoId: data.id,           // UUID from videos table
      storagePath: data.storage_path
    })

    // 3️⃣ Return inserted video metadata
    return NextResponse.json({ video: data })
  } catch (err: unknown) {
    console.error("Insert video error:", err)
    const message = err instanceof Error ? err.message : "Unknown error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
