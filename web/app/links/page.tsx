"use client";

import { useShareLinks } from "@/hooks/useShareLinks";
import { useUser } from "@clerk/nextjs";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function ShareLinksPage() {
  const { user } = useUser();
  const userId = user?.id ?? null;

  const { shareLinks, loading, error } = useShareLinks(userId);

  if (loading) {
    return (
      <div className="p-6 space-y-4">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-12 w-full rounded-md" />
        ))}
      </div>
    );
  }

  if (error) {
    return <p className="text-red-500 p-6">Error: {error}</p>;
  }

  return (
    <div className="p-6 overflow-x-auto min-h-screen">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Links</TableHead>
            <TableHead>Thumbnail</TableHead>
            <TableHead>File Name</TableHead>
            <TableHead>Size</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Visibility</TableHead>
            <TableHead>Emails</TableHead>
            <TableHead>Expiry</TableHead>
            <TableHead>Created At</TableHead>
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
              <TableRow key={link.id}>
                {/* Links URL */}
                <TableCell className="max-w-xs truncate">
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate">{linkUrl}</span>
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
                <TableCell>{(link.videos.file_size / (1024 * 1024)).toFixed(2)} MB</TableCell>

                {/* Status */}
                <TableCell>{link.videos.status}</TableCell>

                {/* Visibility */}
                <TableCell>
                  <Badge variant={link.visibility === "public" ? "default" : "secondary"}>
                    {link.visibility}
                  </Badge>
                </TableCell>

                {/* Emails */}
                <TableCell>
                  {link.visibility === "PRIVATE" && link.emails && link.emails.length > 0
                    ? link.emails.join(", ")
                    : "-"}
                </TableCell>

                {/* Expiry */}
                <TableCell>{link.expiry ? new Date(link.expiry).toLocaleDateString() : "-"}</TableCell>

                {/* Created At */}
                <TableCell>{new Date(link.videos.created_at).toLocaleDateString()}</TableCell>

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
  );
}
