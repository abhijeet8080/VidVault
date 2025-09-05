"use client";

import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import {  PlayCircle } from "lucide-react";
import Image from "next/image";

interface VideoPlayerProps {
  videoUrl?: string;
  thumbnail?: string;
  loading?: boolean;
}

export default function VideoPlayer({ videoUrl, thumbnail, loading: initialLoading }: VideoPlayerProps) {
  const [loading, setLoading] = useState(initialLoading ?? true);

  return (
    <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-xl bg-black dark:bg-gray-800">
      {videoUrl && (
        <video
          src={videoUrl}
          className={`w-full h-full object-cover transition-opacity duration-500 ${loading ? "opacity-0" : "opacity-100"}`}
          controls
          autoPlay={false}
          onLoadedData={() => setLoading(false)}
        />
      )}

      {loading && thumbnail && (
        <div className="absolute inset-0 flex items-center justify-center bg-black dark:bg-gray-900">
          <Image src={thumbnail} alt="Video thumbnail" fill className="object-cover blur-sm" />
          <PlayCircle className="absolute w-16 h-16 text-white animate-pulse" />
        </div>
      )}

      {!thumbnail && loading && <Skeleton className="absolute inset-0 w-full h-full rounded-xl" />}
    </div>
  );
}
