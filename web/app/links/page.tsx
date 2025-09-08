"use client";

import { useShareLinks } from "@/hooks/useShareLinks";
import { useUser } from "@clerk/nextjs";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Copy, Link2, VideoIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function ShareLinksPage() {
  const { user } = useUser();
  const userId = user?.id ?? null;

  const { shareLinks, loading, error } = useShareLinks(userId);

  const formatDate = (date: string | null) => {
    if (!date) return "Never viewed";
    return new Date(date).toLocaleString();
  };

  if (loading) {
    return (
      <div className="p-6 space-y-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="grid grid-cols-6 gap-4 items-center border rounded-lg p-3"
          >
            <Skeleton className="h-4 w-32 col-span-2" />
            <Skeleton className="h-16 w-24 rounded-md" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-8 w-16 rounded-md" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return <p className="text-red-500 p-6">Error: {error}</p>;
  }

  if (!shareLinks || shareLinks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center p-10 min-h-[50vh]">
        <VideoIcon className="h-12 w-12 text-muted-foreground mb-4" />
        <h2 className="text-lg font-semibold mb-2">No links available</h2>
        <p className="text-muted-foreground max-w-md">
          You haven’t shared any videos yet. Once you create a share link, it
          will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 overflow-x-auto min-h-screen">
      <div className="rounded-xl border shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[200px]">Links</TableHead>
              <TableHead className="min-w-[120px]">Thumbnail</TableHead>
              <TableHead>File Name</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Visibility</TableHead>
              <TableHead>Emails</TableHead>
              <TableHead>Expiry</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Last Viewed</TableHead>
              <TableHead>View</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {shareLinks.map((link) => {
              const linkUrl =
                link.visibility === "PRIVATE"
                  ? `${process.env.NEXT_PUBLIC_APP_URL}/shared-link/p/${link.token}`
                  : `${process.env.NEXT_PUBLIC_APP_URL}/shared-link/s/${link.token}`;
              const videoPage = `/videos/${link.videos.id}`;

              return (
                <TableRow key={link.id} className="hover:bg-muted/50">
                  {/* Links URL */}
                  <TableCell className="max-w-xs truncate">
                    <div className="flex items-center justify-between gap-2">
                      <a
                        href={linkUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="truncate text-blue-600 hover:underline flex items-center gap-1"
                      >
                        <Link2 className="h-4 w-4" />
                        {linkUrl}
                      </a>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigator.clipboard.writeText(linkUrl)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>

                  {/* Thumbnail */}
                  <TableCell className="w-24 h-20 p-1">
                    {link.videos.thumbnailUrl ? (
                      <div className="relative w-full h-20 rounded-md overflow-hidden">
                        <Image
                          unoptimized
                          src={link.videos.thumbnailUrl}
                          alt={link.videos.file_name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-full h-20 bg-muted flex items-center justify-center rounded-md text-xs text-muted-foreground">
                        No Thumbnail
                      </div>
                    )}
                  </TableCell>

                  {/* File Name */}
                  <TableCell>{link.videos.file_name}</TableCell>

                  {/* Size */}
                  <TableCell>
                    {(link.videos.file_size / (1024 * 1024)).toFixed(2)} MB
                  </TableCell>

                  {/* Status */}
                  <TableCell>
                    <Badge variant="outline">{link.videos.status}</Badge>
                  </TableCell>

                  {/* Visibility */}
                  <TableCell>
                    <Badge
                      variant={
                        link.visibility === "public" ? "default" : "secondary"
                      }
                    >
                      {link.visibility}
                    </Badge>
                  </TableCell>

                  {/* Emails */}
                  <TableCell>
                    {link.visibility === "PRIVATE" &&
                    link.emails &&
                    link.emails.length > 0
                      ? link.emails.join(", ")
                      : "-"}
                  </TableCell>

                  {/* Expiry */}
                  <TableCell>
                    {link.expiry
                      ? new Date(link.expiry).toLocaleDateString()
                      : "-"}
                  </TableCell>

                  {/* Created At */}
                  <TableCell>
                    {new Date(link.videos.created_at).toLocaleDateString()}
                  </TableCell>

                  {/* Last viewed At */}
                  <TableCell>{formatDate(link.last_viewed_at)}</TableCell>

                  {/* View Button */}
                  <TableCell>
                    <Link href={videoPage}>
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
