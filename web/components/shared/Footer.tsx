"use client"

import { Github, Twitter, Youtube } from "lucide-react"
import Link from "next/link"

export default function Footer() {
  return (
    <footer className="border-t bg-background/80 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Left: Brand */}
        <div className="text-center md:text-left">
          <h2 className="text-lg font-bold">VidVault</h2>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} VidVault. All rights reserved.
          </p>
        </div>

        {/* Center: Links */}
        <div className="flex flex-wrap justify-center gap-6 text-sm">
          <Link href="/about" className="hover:underline">
            About
          </Link>
          <Link href="/pricing" className="hover:underline">
            Pricing
          </Link>
          <Link href="/docs" className="hover:underline">
            Docs
          </Link>
          <Link href="/contact" className="hover:underline">
            Contact
          </Link>
        </div>

        {/* Right: Socials */}
        <div className="flex gap-4">
          <Link href="https://github.com" target="_blank">
            <Github className="h-5 w-5 hover:text-purple-500 transition-colors" />
          </Link>
          <Link href="https://twitter.com" target="_blank">
            <Twitter className="h-5 w-5 hover:text-cyan-500 transition-colors" />
          </Link>
          <Link href="https://youtube.com" target="_blank">
            <Youtube className="h-5 w-5 hover:text-red-500 transition-colors" />
          </Link>
        </div>
      </div>
    </footer>
  )
}
