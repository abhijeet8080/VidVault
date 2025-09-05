"use client";

import { useState } from "react";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Share2, Copy, Check } from "lucide-react";
import { toast } from "sonner";
interface ShareLinkFormModalProps {
  videoId: string;
}

export default function ShareLinkFormModal({ videoId }: ShareLinkFormModalProps) {
  const [visibility, setVisibility] = useState<"PUBLIC" | "PRIVATE">("PUBLIC");
  const [expiry, setExpiry] = useState<"1h" | "12h" | "1d" | "30d" | "forever">("1d");
  const [emails, setEmails] = useState("");
  const [loading, setLoading] = useState(false);
  const [generatedLink, setGeneratedLink] = useState("");
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const emailList = emails
      .split(",")
      .map((e) => e.trim())
      .filter((e) => e.length > 0);

    try {
      const { data } = await axios.post("/api/share-link", {
        videoId,
        visibility,
        emails: visibility === "PRIVATE" ? emailList : [],
        expiryPreset: expiry,
      });
      if (data.error) throw new Error(data.error);
      setGeneratedLink(data.link);
      toast.success('✅ Share link created successfully!');
    } catch (err: unknown) {
      
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!generatedLink) return;
    navigator.clipboard.writeText(generatedLink);
    setCopied(true);
    toast(
       "📋 Copied"
    );
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog>
      {/* Trigger Button */}
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2 shadow-md rounded-full px-5 py-2">
          <Share2 className="w-4 h-4" />
          Share
        </Button>
      </DialogTrigger>

      {/* Modal Content */}
      <DialogContent className="sm:min-w-max rounded-2xl shadow-xl border dark:bg-white bg-neutral-900 p-6">
        <DialogHeader className="space-y-1">
          <DialogTitle className="text-lg font-semibold">
            Create Share Link
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Configure who can access this video and how long the link lasts.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Visibility */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Visibility</Label>
            <Select
              value={visibility}
              onValueChange={(val: "PUBLIC" | "PRIVATE") => setVisibility(val)}
            >
              <SelectTrigger className="rounded-lg">
                <SelectValue placeholder="Select visibility" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PUBLIC">🌍 Public</SelectItem>
                <SelectItem value="PRIVATE">🔒 Private</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Expiry */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Expiry</Label>
            <Select
              value={expiry}
              onValueChange={(val: typeof expiry) => setExpiry(val)}
            >
              <SelectTrigger className="rounded-lg">
                <SelectValue placeholder="Select expiry" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1h">⏰ 1 Hour</SelectItem>
                <SelectItem value="12h">🕐 12 Hours</SelectItem>
                <SelectItem value="1d">📅 1 Day</SelectItem>
                <SelectItem value="30d">🗓️ 30 Days</SelectItem>
                <SelectItem value="forever">♾️ Forever</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Emails (private only) */}
          {visibility === "PRIVATE" && (
            <div className="space-y-2">
              <Label className="text-sm font-medium">Emails</Label>
              <Input
                type="text"
                value={emails}
                onChange={(e) => setEmails(e.target.value)}
                placeholder="user1@example.com, user2@example.com"
                className="rounded-lg"
              />
              <p className="text-xs text-muted-foreground">
                Separate multiple emails with commas
              </p>
            </div>
          )}

          {/* Submit */}
          <DialogFooter className="flex flex-col gap-4">
            <Button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg shadow-md"
            >
              {loading ? "Creating..." : "Create Link"}
            </Button>

            {/* Generated Link */}
            {generatedLink && (
              <div className="flex items-center gap-2 w-full rounded-xl border px-3 py-2 bg-neutral-100 dark:bg-neutral-800">
                <a
                  href={generatedLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 truncate text-sm hover:underline"
                >
                  {generatedLink}
                </a>
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  onClick={handleCopy}
                  className="hover:bg-accent rounded-full"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
