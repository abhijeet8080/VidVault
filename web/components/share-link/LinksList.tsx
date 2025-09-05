"use client";

import { useState } from "react";
import { Copy, Check, Globe, Lock, Mail, Clock, Eye, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

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
    return `Expires in ${expiry}`; // fallback for presets like "1h"
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

      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse rounded-lg overflow-hidden">
          <thead className="bg-muted/50 text-left text-xs uppercase">
            <tr>
              <th className="px-4 py-2">Visibility</th>
              <th className="px-4 py-2">Share URL</th>
              <th className="px-4 py-2">Expiry</th>
              <th className="px-4 py-2">Last Viewed</th>
              <th className="px-4 py-2">Emails</th>
              <th className="px-4 py-2 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {links.map((link) => {
              const url = `${process.env.NEXT_PUBLIC_APP_URL}/share/${link.token}`;
              return (
                <tr
                  key={link.id}
                  className="border-t hover:bg-muted/30 transition-colors"
                >
                  {/* Visibility */}
                  <td className="px-4 py-3">
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
                  </td>

                  {/* URL */}
                  <td className="px-4 py-3 max-w-[200px] truncate">
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-400 hover:underline truncate block"
                    >
                      {url}
                    </a>
                  </td>

                  {/* Expiry */}
                  <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {getExpiryLabel(link.expiry)}
                    </div>
                  </td>

                  {/* Last Viewed */}
                  <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      {formatDate(link.last_viewed_at)}
                    </div>
                  </td>

                  {/* Emails */}
                  <td className="px-4 py-3">
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
                  </td>

                  {/* Copy Button */}
                  <td className="px-4 py-3 text-right">
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
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
