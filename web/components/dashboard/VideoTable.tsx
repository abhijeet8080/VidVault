"use client"

import { PlayCircle, Download } from "lucide-react"
import Image from "next/image"

interface VideoItem {
  id: string
  title: string
  progress: number // 0 - 100
  thumbnail: string
  url?: string
}

export default function VideoTable({ videos }: { videos: VideoItem[] }) {
  const getProgressColor = (progress: number) => {
    if (progress < 40) return "bg-red-500"
    if (progress < 80) return "bg-yellow-500"
    return "bg-green-500"
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800 shadow-lg">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
        {/* Table Header */}
        <thead className="bg-gray-50 dark:bg-[#111]">
          <tr>
            <th className="px-4 md:px-6 py-3 text-left text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300">
              Thumbnail
            </th>
            <th className="px-4 md:px-6 py-3 text-left text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300">
              Title
            </th>
            <th className="px-4 md:px-6 py-3 text-left text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300">
              Status
            </th>
            <th className="px-4 md:px-6 py-3 text-left text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300">
              Action
            </th>
          </tr>
        </thead>

        {/* Table Body */}
        <tbody className="divide-y divide-gray-200 dark:divide-gray-800 bg-white dark:bg-[#0D0D0D]">
          {videos.map((video) => (
            <tr
              key={video.id}
              className="relative group hover:bg-gray-50 dark:hover:bg-[#111] transition-colors"
            >
              {/* Thumbnail */}
              <td className="px-4 md:px-6 py-4">
                <img width={200} height={120}
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-20 h-12 md:w-28 md:h-16 object-cover rounded-lg shadow-sm group-hover:shadow-md transition-all"
                />
              </td>

              {/* Title */}
              <td className="px-4 md:px-6 py-4 text-gray-900 dark:text-gray-100 font-medium text-sm md:text-base truncate max-w-[120px] md:max-w-xs">
                {video.title}
              </td>

              {/* Status */}
              <td className="px-4 md:px-6 py-4">
                {video.progress === 100 ? (
                  <span className="inline-block px-2 py-1 text-xs font-semibold rounded-lg bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300">
                    Ready
                  </span>
                ) : video.progress > 0 ? (
                  <span className="inline-block px-2 py-1 text-xs font-medium rounded-lg bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300">
                    Processing {video.progress}%
                  </span>
                ) : (
                  <span className="inline-block px-2 py-1 text-xs font-medium rounded-lg bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                    Queued
                  </span>
                )}
              </td>

              {/* Action */}
              <td className="px-4 md:px-6 py-4">
                {video.progress === 100 ? (
                  <a
                    href={video.url}
                    download
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs md:text-sm font-medium hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 transition-colors"
                  >
                    <PlayCircle className="h-4 w-4" /> 
                    <span className="hidden sm:inline">Play</span>
                  </a>
                ) : (
                  <button
                    disabled
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-200 text-gray-500 text-xs md:text-sm font-medium dark:bg-gray-800 dark:text-gray-400 cursor-not-allowed"
                  >
                    <Download className="h-4 w-4" />
                    <span className="hidden sm:inline">Pending</span>
                  </button>
                )}
              </td>

              {/* Full-Row Progress Bar */}
              <td colSpan={4} className="absolute bottom-0 left-0 right-0">
                <div className="h-1 w-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                  <div
                    className={`h-full ${video.progress === 100 ? "bg-green-500" : getProgressColor(video.progress)} transition-all duration-500`}
                    style={{ width: `${video.progress}%` }}
                  ></div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
