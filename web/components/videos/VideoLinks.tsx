"use client";

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface VideoLinksProps {
  videoUrl?: string;
  shareLinks?: string[];
}

export default function VideoLinks({ videoUrl, shareLinks }: VideoLinksProps) {
  return (
    <div className="mt-6 flex flex-col md:flex-row items-start md:items-center gap-4">
      {videoUrl && (
        <a href={videoUrl} download>
          <Button>
            <Download className="mr-2 h-4 w-4" />
            Download Video
          </Button>
        </a>
      )}

      {shareLinks?.length ? (
        <div className="flex gap-2 flex-wrap">
          {shareLinks.map((link, idx) => (
            <a
              key={idx}
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-sm hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 transition"
            >
              Share {idx + 1}
            </a>
          ))}
        </div>
      ) : null}
    </div>
  );
}
