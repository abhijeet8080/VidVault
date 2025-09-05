import { Worker } from 'bullmq'
import { connection } from './queue'
import { supabase } from './supabase'
import ffmpeg from 'fluent-ffmpeg'
import ffmpegPath from 'ffmpeg-static'
import ffprobePath from 'ffprobe-static'
import fs from 'fs'
import path from 'path'
import os from 'os'

// Set paths for fluent-ffmpeg
ffmpeg.setFfmpegPath(ffmpegPath)
ffmpeg.setFfprobePath(ffprobePath.path)

const worker = new Worker(
  'video-processing',
  async (job) => {
    const { videoId, storagePath } = job.data
    console.log(`Processing video ${videoId}`)

    // Temporary directories
    const tempDir = path.join(os.tmpdir(), 'video-processing')
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true })

    const tempFile = path.join(tempDir, `${videoId}.mp4`)
    const thumbnailsDir = path.join(tempDir, 'thumbnails')
    if (!fs.existsSync(thumbnailsDir)) fs.mkdirSync(thumbnailsDir, { recursive: true })

    // Download video from Supabase
    const { data, error } = await supabase.storage.from('videos').download(storagePath)
    if (error || !data) throw error || new Error('Failed to download video')

    const buffer = Buffer.from(await data.arrayBuffer())
    fs.writeFileSync(tempFile, buffer)

    // Generate thumbnails
    await new Promise<void>((resolve, reject) => {
      ffmpeg(tempFile)
        .on('end', () => resolve())
        .on('error', (err) => reject(err))
        .screenshots({
          count: 3,
          folder: thumbnailsDir,
          filename: `${videoId}-%i.png`,
        })
    })

    // Upload thumbnails and insert DB records
    for (let i = 1; i <= 3; i++) {
      const thumbPath = path.join(thumbnailsDir, `${videoId}-${i}.png`)
      const thumbBuffer = fs.readFileSync(thumbPath)

      // Upload to thumbnails bucket
      const { error: uploadErr } = await supabase.storage
        .from('thumbnails')
        .upload(`${videoId}/${i}.png`, thumbBuffer, { contentType: 'image/png', upsert: true })
      if (uploadErr) throw uploadErr

      // Insert row in thumbnails table
      const { error: dbErr } = await supabase
        .from('thumbnails')
        .insert({
          video_id: videoId,
          storage_path: `${videoId}/${i}.png`,
        })
      if (dbErr) throw dbErr
    }

    // Update video status
    const { error: updateErr } = await supabase
      .from('videos')
      .update({ status: 'READY' })
      .eq('id', videoId)
    if (updateErr) throw updateErr

    console.log(`✅ Video ${videoId} processed.`)

    // Cleanup temporary files
    try {
      fs.unlinkSync(tempFile)
      for (let i = 1; i <= 3; i++) {
        fs.unlinkSync(path.join(thumbnailsDir, `${videoId}-${i}.png`))
      }
    } catch (cleanupErr) {
      console.warn('Cleanup error:', cleanupErr)
    }
  },
  { connection }
)

worker.on('failed', (job, err) => console.error(`Job ${job?.id} failed:`, err))
