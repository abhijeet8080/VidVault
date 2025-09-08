// src/index.ts
import 'dotenv/config'  
import express from 'express'

import './videoProcessor' 

console.log('Worker is running…')

const app = express()
const PORT = process.env.PORT || 10000

app.get("/wake", async (_, res) => {
  console.log("⏰ Wake request received – worker is alive");
  res.send("Worker awake!");
});
app.listen(PORT, () => console.log(`Listening on port ${PORT}`))
