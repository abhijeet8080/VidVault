"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getVideoById, Video } from "@/lib/videos";
import VideoPlayer from "@/components/videos/VideoPlayer";
import VideoMetadata from "@/components/videos/VideoMetadata";
import ThumbnailCarousel from "@/components/videos/ThumbnailsCarousel";
import { Separator } from "@/components/ui/separator";
import { Film } from "lucide-react";
import ShareLinkFormModal from "@/components/share-link/ShareLinkButton";
import ShareLinksList from "@/components/share-link/LinksList";

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
    <div className="max-w-7xl mx-auto px-4 py-10 space-y-12">
      {/* Header with Share button */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Film className="w-7 h-7 text-primary" />
          <h1 className="text-2xl font-bold tracking-tight">Video Details</h1>
        </div>

        {id && <ShareLinkFormModal videoId={id} />}
      </div>

      {/* Video + Metadata */}
      <div className="flex flex-col lg:flex-row gap-10">
        <div className="flex-1">
          <VideoPlayer
            videoUrl={video?.videoUrl}
            thumbnail={video?.thumbnailsUrls?.[0]}
            loading={loading}
          />
        </div>
        <div className="w-full lg:w-96 lg:sticky lg:top-10 h-fit">
          <VideoMetadata
            video={
              video
                ? {
                    ...video,
                    thumbnails: video.thumbnails || [],
                  }
                : undefined
            }
            loading={loading}
          />
        </div>
      </div>

      <Separator className="my-6" />

      {/* Thumbnails Carousel */}
      <div>
        <ThumbnailCarousel thumbnails={video?.thumbnailsUrls} loading={loading} />
      </div>
      <div>
        <ShareLinksList links={video?.share_links || []} />
      </div>
    </div>
  );
}
