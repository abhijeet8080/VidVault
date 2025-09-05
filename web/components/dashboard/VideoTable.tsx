"use client";

import { FileVideo, Download } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface VideoItem {
  id: string;
  title: string;
  progress: number; // 0 - 100
  thumbnail?: string;
  url?: string;
}

interface VideoTableProps {
  videos: VideoItem[];
}

export default function VideoTable({ videos }: VideoTableProps) {
  const router = useRouter();

  const getProgressColor = (progress: number) => {
    if (progress < 40) return "bg-red-500 dark:bg-red-600";
    if (progress < 80) return "bg-yellow-500 dark:bg-yellow-500/80";
    return "bg-green-500 dark:bg-green-600";
  };

  return (
    <div className="overflow-x-auto w-full">
      <Table className="min-w-full overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800 shadow-lg">
        <TableHeader>
          <TableRow>
            <TableHead>Thumbnail</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Download</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {videos.map((video) => (
            <TableRow
              key={video.id}
              className="group hover:bg-gray-50 dark:hover:bg-[#111] transition-colors relative cursor-pointer"
              onClick={() => router.push(`/videos/${video.id}`)}
            >
              {/* Thumbnail */}
              <TableCell className="w-28">
                {video.thumbnail ? (
                  <Image
                    src={video.thumbnail}
                    alt={video.title}
                    width={112}
                    height={64}
                    className="rounded-lg shadow-sm object-cover group-hover:shadow-md"
                  />
                ) : (
                  <div className="w-28 h-16 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg">
                    <FileVideo className="h-8 w-8 text-gray-400" />
                  </div>
                )}
              </TableCell>

              {/* Title */}
              <TableCell className="truncate max-w-xs">{video.title}</TableCell>

              {/* Status */}
              <TableCell>
                {video.progress === 100 ? (
                  <Badge className="bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300">
                    Ready
                  </Badge>
                ) : video.progress > 0 ? (
                  <Badge variant="secondary">
                    Processing {video.progress}%
                  </Badge>
                ) : (
                  <Badge variant="outline">Queued</Badge>
                )}
              </TableCell>

              {/* Download Button */}
              <TableCell
                onClick={(e) => e.stopPropagation()} // prevent row navigation when clicking download
              >
                {video.progress === 100 && video.url ? (
                  <Button
                    size="sm"
                    className="w-28 justify-center"
                    
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                ) : (
                  <Button size="sm" disabled className="w-28 justify-center">
                    <Download className="mr-2 h-4 w-4" />
                    Pending
                  </Button>
                )}
              </TableCell>

              {/* Full-row progress bar */}
              <TableCell
                colSpan={4}
                className="absolute bottom-0 left-0 right-0"
              >
                <div className="h-1 w-full bg-gray-200 dark:bg-gray-700 overflow-hidden rounded-b-lg">
                  <div
                    className={`h-full ${
                      video.progress === 100
                        ? "bg-green-500 dark:bg-green-600"
                        : getProgressColor(video.progress)
                    } transition-all duration-500`}
                    style={{ width: `${video.progress}%` }}
                  ></div>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
