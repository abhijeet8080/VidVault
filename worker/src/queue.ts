import dotenv from "dotenv"
dotenv.config()

import IORedis from "ioredis"

if (!process.env.REDIS_URL) {
  throw new Error("REDIS_URL not defined in .env")
}

// BullMQ requires maxRetriesPerRequest = null
export const connection = new IORedis(process.env.REDIS_URL!, {
  maxRetriesPerRequest: null,
})
