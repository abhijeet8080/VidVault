"use client";

import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";

interface ThumbnailCarouselProps {
  thumbnails?: string[];
  loading?: boolean;
}

export default function ThumbnailCarousel({ thumbnails = [], loading = false }: ThumbnailCarouselProps) {
  console.log('thumbs',thumbnails)
  if (loading) {
    return (
      <div className="flex space-x-4 overflow-x-auto py-2">
        {[...Array(4)].map((_, idx) => (
          <Skeleton key={idx} className="w-44 h-28 rounded-xl flex-shrink-0" />
        ))}
      </div>
    );
  }

  const validThumbnails = thumbnails.filter(Boolean); // removes undefined, null, ""

  if (!validThumbnails.length)
    return <p className="text-gray-500 dark:text-gray-400">No thumbnails available</p>;

  return (<>
  <h2>Thumbnails</h2>
    <div className="flex space-x-4 overflow-x-auto py-2">
     
  {validThumbnails.map((thumb, idx) => (
    <div
      key={idx}
      className="w-44 h-28 relative rounded-xl overflow-hidden shadow hover:shadow-lg transition-transform transform hover:scale-105 flex-shrink-0"
      style={{ minWidth: '11rem', minHeight: '7rem' }} 
    >
      <Image
        src={thumb}
        alt={`Thumbnail ${idx + 1}`}
        fill
        sizes="(max-width: 768px) 100vw, 25vw"
        style={{ objectFit: 'cover' }} 
      />
    </div>
  ))}
</div>
</>
  );
}
