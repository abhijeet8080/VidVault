"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";

export default function ShareLinkPage() {
  const params = useParams();
  const { user } = useUser(); // Clerk user info
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVideo = async () => {
      if (!params.token || !user?.primaryEmailAddress?.emailAddress) return;

      try {
        const res = await fetch(`/api/share-link/${params.token}`, {
          headers: {
            Authorization: user.primaryEmailAddress.emailAddress, // 👈 send email
          },
        });

        const data = await res.json();

        if (res.ok && data.video?.url) {
          setVideoUrl(data.video.url);
        } else {
          setError(data.error || "Cannot load video");
        }
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchVideo();
  }, [params.token, user]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <video controls width="600">
      <source src={videoUrl!} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  );
}
