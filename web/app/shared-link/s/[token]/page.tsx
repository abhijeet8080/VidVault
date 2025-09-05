"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function ShareLinkPage() {
  const params = useParams();
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!params.token) return;

    fetch(`/api/share-link/${params.token}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.video?.url) {
          setVideoUrl(data.video.url);
        } else {
          setError(data.error || "Cannot load video");
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [params.token]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <video controls width="600">
      <source src={videoUrl!} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  );
}
