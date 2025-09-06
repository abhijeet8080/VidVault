"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import { Film } from "lucide-react";
import VideoPlayer from "@/components/videos/VideoPlayer";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Video {
  url: string;
  file_name: string;
  file_size: number;
  created_at: string;
  visibility: string;
}

interface VideoResponse {
  video?: Video;
  error?: string;
}

export default function PrivateShareLinkPage() {
  const params = useParams();
  const { user, isLoaded } = useUser(); // Clerk user info
  const [video, setVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVideo = async () => {
      if (!params.token || !isLoaded) return;

      if (!user?.primaryEmailAddress?.emailAddress) {
        setError("You must be signed in with an allowed email to view this private video.");
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get<VideoResponse>(
          // `${process.env.NEXT_PUBLIC_APP_URL}/api/share-link/${params.token}`,
          `/api/share-link/${params.token}`,
          {
            headers: {
              Authorization: user.primaryEmailAddress.emailAddress, // ✅ backend expects email
            },
          }
        );

        if (res.data.video) {
          setVideo(res.data.video);
        } else {
          setError(res.data.error || "Cannot load private video");
        }
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.error || err.message);
        } else if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchVideo();
  }, [params.token, user, isLoaded]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-10 space-y-12">
        {/* Header Skeleton */}
        <div className="flex items-center gap-3 mb-6">
          <Skeleton className="w-7 h-7 rounded-full" />
          <Skeleton className="h-6 w-40" />
        </div>

        {/* Video + Metadata Skeleton */}
        <div className="flex flex-col lg:flex-row gap-10">
          <Skeleton className="w-full lg:w-2/3 h-72 rounded-lg" />
          <Skeleton className="w-full lg:w-96 h-60 rounded-lg" />
        </div>
      </div>
    );
  }

  if (error) {
  return (
    <div className="max-w-7xl mx-auto px-4 py-20 flex flex-col items-center justify-center min-h-[60vh]">
      <Film className="w-12 h-12 text-red-500 mb-4" />
      <h1 className="text-xl font-semibold text-red-600 mb-2">Error Loading Video</h1>
      <p className="text-muted-foreground text-center max-w-md">
        {error}
      </p>
    </div>
  );
}

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 space-y-12">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <Film className="w-7 h-7 text-primary" />
        <h1 className="text-2xl font-bold tracking-tight">Private Video</h1>
      </div>

      {/* Video + Metadata */}
      <div className="flex flex-col lg:flex-row gap-10">
        {/* Video Player */}
        <div className="flex-1">
          <VideoPlayer videoUrl={video?.url} loading={loading} />
        </div>

        {/* Metadata */}
        <div className="w-full lg:w-96 lg:sticky lg:top-10 h-fit">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Video Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">File Name</p>
                <p className="font-medium">{video?.file_name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">File Size</p>
                <p className="font-medium">
                  {video?.file_size
                    ? `${(video.file_size / (1024 * 1024)).toFixed(2)} MB`
                    : "-"}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Created At</p>
                <p className="font-medium">
                  {video?.created_at
                    ? new Date(video.created_at).toLocaleString()
                    : "-"}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Visibility</p>
                <Badge variant="destructive">Private</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Separator className="my-6" />
    </div>
  );
}
