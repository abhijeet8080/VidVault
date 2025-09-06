// src/index.ts
import 'dotenv/config'  // load env variables first
import express from 'express'

// --- Start worker logic ---
import './videoProcessor'  // your worker logic runs here

console.log('Worker is running…')

// --- Start Express server for Render health checks ---
const app = express()
const PORT = process.env.PORT || 10000

app.get('/', (_, res) => res.send('Worker alive!'))

app.listen(PORT, () => console.log(`Listening on port ${PORT}`))
