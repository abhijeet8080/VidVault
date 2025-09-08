
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { ImageIcon } from "lucide-react";

interface ThumbnailCarouselProps {
  thumbnails?: string[];
  loading?: boolean;
}

export default function ThumbnailCarousel({
  thumbnails = [],
  loading = false,
}: ThumbnailCarouselProps) {
  if (loading) {
    return (
      <div className="flex space-x-4 overflow-x-auto py-2">
        {[...Array(4)].map((_, idx) => (
          <Skeleton
            key={idx}
            className="w-44 h-28 rounded-xl flex-shrink-0 animate-pulse"
          />
        ))}
      </div>
    );
  }

  const validThumbnails = thumbnails.filter(Boolean);

  if (!validThumbnails.length)
    return (
      <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
        <ImageIcon className="w-5 h-5" /> No thumbnails available
      </div>
    );

  return (
    <div className="w-full">
      <h2 className="text-lg font-semibold tracking-tight mb-3 flex items-center gap-2">
        <ImageIcon className="w-5 h-5 text-muted-foreground" /> Thumbnails
      </h2>

      <div className="flex space-x-4 overflow-x-auto pb-2">
        {validThumbnails.map((thumb, idx) => (
          <div
            key={idx}
            className="w-44 h-28 relative rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all transform hover:scale-105 flex-shrink-0"
            style={{ minWidth: "11rem", minHeight: "7rem" }}
          >
            <Image
              src={thumb}
              alt={`Thumbnail ${idx + 1}`}
              fill
              sizes="(max-width: 768px) 100vw, 25vw"
              className="object-cover transition-transform duration-500 hover:scale-110"
              unoptimized
            />
          </div>
        ))}
      </div>
    </div>
  );
}
