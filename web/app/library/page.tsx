"use client";

import { useEffect, useState } from "react";
import { getUserVideos, Video } from "@/lib/videos";
import { Skeleton } from "@/components/ui/skeleton";
import { Play, Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";

export default function LibraryPage() {
  const { user, isLoaded } = useUser();
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoaded || !user?.id) return;

    const fetchVideos = async () => {
      setLoading(true);
      const vids = await getUserVideos(user.id);
      setVideos(vids);
      setLoading(false);
    };

    fetchVideos();
  }, [isLoaded, user?.id]);

  if (!isLoaded) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Skeleton className="h-6 w-40 mb-6" />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, idx) => (
            <div key={idx} className="space-y-2">
              <Skeleton className="w-full aspect-video rounded-xl" />
              <Skeleton className="h-4 w-3/4 rounded" />
              <Skeleton className="h-3 w-1/2 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <h1 className="text-2xl font-bold tracking-tight">Your Library</h1>

      {/* Video Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, idx) => (
            <div key={idx} className="space-y-2">
              <Skeleton className="w-full aspect-video rounded-xl" />
              <Skeleton className="h-4 w-3/4 rounded" />
              <Skeleton className="h-3 w-1/2 rounded" />
            </div>
          ))}
        </div>
      ) : videos.length === 0 ? (
        <p className="text-muted-foreground">No videos found in your library.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {videos.map((video) => (
            <Link
              key={video.id}
              href={`/videos/${video.id}`}
              className="group space-y-2"
            >
              {/* Thumbnail */}
              <div className="relative aspect-video rounded-xl overflow-hidden shadow-md bg-black">
                {video.thumbnailsUrls?.[0] ? (
                  <Image
                    src={video.thumbnailsUrls[0]}
                    alt={video.file_name}
                    fill
                    unoptimized
                    className="object-cover group-hover:scale-105 transition-transform"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full bg-gray-900 text-gray-400">
                    <Play className="w-10 h-10" />
                  </div>
                )}

                {/* Overlay Play Icon */}
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                  <Play className="w-12 h-12 text-white" />
                </div>
              </div>

              {/* Video Info */}
              <div>
                <h2 className="text-sm font-semibold truncate">{video.file_name}</h2>
                <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                  <Clock className="w-3 h-3" />
                  {new Date(video.created_at).toLocaleDateString()}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
