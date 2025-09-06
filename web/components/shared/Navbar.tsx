"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu, X, Video, Compass, Upload, Library } from "lucide-react"
import { ModeToggle } from "./ThemeToggleButton"
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="w-full sticky top-0 z-50 bg-white/60 dark:bg-[#0D0D0D]/60 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-800/50 shadow-sm">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between h-16 items-center">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <Video className="h-7 w-7 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform" />
            <span className="text-2xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent tracking-tight">
              VidVault
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/dashboard" className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors group">
              <Compass className="h-5 w-5 group-hover:rotate-12 transition-transform" />
              <span className="relative after:block after:h-[2px] after:w-0 after:bg-indigo-600 dark:after:bg-indigo-400 after:transition-all group-hover:after:w-full">
                Dashboard
              </span>
            </Link>

            

            <Link href="/library" className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors group">
              <Library className="h-5 w-5 group-hover:scale-110 transition-transform" />
              <span className="relative after:block after:h-[2px] after:w-0 after:bg-indigo-600 dark:after:bg-indigo-400 after:transition-all group-hover:after:w-full">
                Library
              </span>
            </Link>
          </div>

          {/* Auth + Theme */}
          <div className="hidden md:flex items-center gap-5">
            <ModeToggle />

            <SignedOut>
              <SignInButton mode="modal">
                <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md hover:shadow-lg hover:scale-105 transition-all">
                  Sign In
                </button>
              </SignInButton>
            </SignedOut>

            <SignedIn>
              <UserButton
                appearance={{
                  elements: {
                    avatarBox:
                      "w-9 h-9 rounded-full ring-2 ring-indigo-500 dark:ring-indigo-400 transition-all hover:scale-105",
                  },
                }}
              />
            </SignedIn>
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden px-6 pb-4 space-y-4 bg-white/95 dark:bg-[#0D0D0D]/95 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800 shadow-lg rounded-b-2xl">
          <Link href="/dahsboard" className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400">
            <Compass className="h-5 w-5" /> Explore
          </Link>
          
          <Link href="/library" className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400">
            <Library className="h-5 w-5" /> Library
          </Link>

          {/* Theme toggle */}
          <div className="pt-2 border-t border-gray-200 dark:border-gray-800">
            <ModeToggle />
          </div>

          {/* Clerk auth */}
          <SignedOut>
            <SignInButton mode="modal">
              <button className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md hover:shadow-lg hover:scale-105 transition-all">
                Sign In
              </button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <div className="flex justify-start">
              <UserButton
                appearance={{
                  elements: {
                    avatarBox:
                      "w-10 h-10 rounded-full ring-2 ring-indigo-500 dark:ring-indigo-400 transition-all hover:scale-110",
                  },
                }}
              />
            </div>
          </SignedIn>
        </div>
      )}
    </nav>
  )
}
