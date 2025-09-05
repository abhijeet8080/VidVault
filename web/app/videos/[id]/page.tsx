"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getVideoById, Video } from "@/lib/videos";
import VideoPlayer from "@/components/videos/VideoPlayer";
import VideoMetadata from "@/components/videos/VideoMetadata";
import ThumbnailCarousel from "@/components/videos/ThumbnailsCarousel";
import { Separator } from "@/components/ui/separator";

export default function VideoPage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const [video, setVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!id) return;

    const fetchVideo = async () => {
      setLoading(true);
      const vid = await getVideoById(id);
      setVideo(vid);
      setLoading(false);
    };

    fetchVideo();
  }, [id]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 space-y-10">
      {/* Video + Metadata */}
      <div className="flex flex-col lg:flex-row gap-10">
        <div className="flex-1">
          <VideoPlayer
            videoUrl={video?.videoUrl}
            thumbnail={video?.thumbnailsUrls?.[0]}
            loading={loading}
          />
        </div>
        <div className="w-full lg:w-96">
          <VideoMetadata
            video={ 
              video
                ? {
                    ...video,
                    thumbnails: video.thumbnails || [], // use actual thumbnails array
                  }
                : undefined
            }
            loading={loading}
          />
        </div>
      </div>

      <Separator />

      {/* Thumbnails Carousel */}
      <div>
        <ThumbnailCarousel thumbnails={video?.thumbnails} loading={loading} />
      </div>
    </div>
  );
}
