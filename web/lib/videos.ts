import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Fetch all videos for a user
export async function getUserVideos(userId: string) {
  const { data, error } = await supabase
    .from("videos")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    console.log('data',data)
  if (error) {
    console.error("Error fetching videos:", error)
    return []
  }

  return data || []
}
