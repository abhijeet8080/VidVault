import { Queue } from "bullmq"
import { connection } from "./queue"
import { randomUUID } from 'crypto'
async function addTestJob() {
  const videoQueue = new Queue("video-processing", { connection })
const videoId = randomUUID()
  const job = await videoQueue.add("process-video", {
    videoId: 'd03ce92f-c850-417f-8802-479e5b9ecc0a',
    storagePath: "user_32FLcGV4RZvsTCG9gq2Mxk4qGny/1757017097936-1106780741-preview.mp4", // <- this is your storage path
  })

  console.log("Job added:", job.id)
}

addTestJob()
