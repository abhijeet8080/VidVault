"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { PlayCircle, Upload } from "lucide-react"
import Link from "next/link"

export default function Hero() {
  return (
    <section className="relative w-full min-h-[85vh] flex items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-700/20 via-background to-cyan-700/20 pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-5xl font-extrabold tracking-tight sm:text-6xl bg-gradient-to-r from-purple-500 to-cyan-500 bg-clip-text text-transparent"
        >
          Secure & Elegant Video Storage
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7 }}
          className="mt-6 text-lg text-muted-foreground sm:text-xl"
        >
          VidVault helps you store, manage, and share your videos with ease.
          Fast, reliable, and beautifully simple.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.7 }}
          className="mt-8 flex flex-wrap justify-center gap-4"
        >
          <Link href="/dashboard">
            <Button size="lg" className="gap-2">
              <Upload className="h-5 w-5" />
              Upload Video
            </Button>
          </Link>
          <Link href="/library">
            <Button variant="outline" size="lg" className="gap-2">
              <PlayCircle className="h-5 w-5" />
              View Library
            </Button>
          </Link>
        </motion.div>
      </div>

      {/* Decorative Blur Circle */}
      <div className="absolute -top-20 -left-20 w-72 h-72 bg-purple-500/30 rounded-full blur-3xl" />
      <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-cyan-500/30 rounded-full blur-3xl" />
    </section>
  )
}
