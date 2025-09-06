"use client";

import { useState } from "react";
import {
  Copy,
  Check,
  Globe,
  Lock,
  Mail,
  Clock,
  Eye,
  Link2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export interface ShareLink {
  id: string;
  video_id: string;
  visibility: string;
  emails: string[];
  token: string;
  expiry: string;
  last_viewed_at: string | null;
  storage_path: string | null;
}

interface ShareLinksListProps {
  links: ShareLink[];
}

export default function ShareLinksList({ links }: ShareLinksListProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!links?.length) {
    return (
      <div>
        <h2 className="text-lg font-semibold flex items-center gap-2 mb-3">
          <Link2 className="w-5 h-5 text-primary" />
          Shared Links
        </h2>
        <p className="text-sm text-muted-foreground">
          No share links available for this video.
        </p>
      </div>
    );
  }

  const handleCopy = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    toast("📋 Copied to clipboard");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatDate = (date: string | null) => {
    if (!date) return "Never viewed";
    return new Date(date).toLocaleString();
  };

  const getExpiryLabel = (expiry: string) => {
    if (expiry === "forever") return "Never expires";

    const expiryDate = new Date(expiry);
    if (isNaN(expiryDate.getTime())) {
      return `Expires in ${expiry}`;
    }

    return `Expires on ${expiryDate.toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    })}`;
  };

  return (
    <div className="space-y-4">
      {/* Heading */}
      <h2 className="text-lg font-semibold flex items-center gap-2">
        <Link2 className="w-5 h-5 text-primary" />
        Shared Links
      </h2>

      <div className="overflow-x-auto rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Visibility</TableHead>
              <TableHead>Share URL</TableHead>
              <TableHead>Expiry</TableHead>
              <TableHead>Last Viewed</TableHead>
              <TableHead>Emails</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {links.map((link) => {
              let url = "";
              if (link.visibility === "PRIVATE") {
                url = `/shared-link/p/${link.token}`;
                // url = `${process.env.NEXT_PUBLIC_APP_URL}/shared-link/p/${link.token}`;
              } else {
                // url = `${process.env.NEXT_PUBLIC_APP_URL}/shared-link/s/${link.token}`;
                url = `/shared-link/s/${link.token}`;
              }
              return (
                <TableRow key={link.id}>
                  {/* Visibility */}
                  <TableCell>
                    {link.visibility === "PUBLIC" ? (
                      <Badge
                        variant="outline"
                        className="flex items-center gap-1 w-fit"
                      >
                        <Globe className="w-3 h-3" /> Public
                      </Badge>
                    ) : (
                      <Badge
                        variant="secondary"
                        className="flex items-center gap-1 w-fit"
                      >
                        <Lock className="w-3 h-3" /> Private
                      </Badge>
                    )}
                  </TableCell>

                  {/* URL */}
                  <TableCell className="max-w-[200px] truncate">
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-400 hover:underline truncate block"
                    >
                      {url}
                    </a>
                  </TableCell>

                  {/* Expiry */}
                  <TableCell className="text-muted-foreground whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {getExpiryLabel(link.expiry)}
                    </div>
                  </TableCell>

                  {/* Last Viewed */}
                  <TableCell className="text-muted-foreground whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      {formatDate(link.last_viewed_at)}
                    </div>
                  </TableCell>

                  {/* Emails */}
                  <TableCell>
                    {link.visibility === "PRIVATE" && link.emails.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {link.emails.map((email) => (
                          <Badge
                            key={email}
                            variant="outline"
                            className="px-2 py-0.5 text-xs"
                          >
                            <Mail className="w-3 h-3 mr-1" />
                            {email}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>

                  {/* Copy Button */}
                  <TableCell className="text-right">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleCopy(url, link.id)}
                    >
                      {copiedId === link.id ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
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
