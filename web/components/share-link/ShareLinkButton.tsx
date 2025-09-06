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
      const { data } = await axios.post(`/api/share-link`, {
      // const { data } = await axios.post(`${process.env.NEXT_PUBLIC_APP_URL}/api/share-link`, {
        videoId,
        visibility,
        emails: visibility === "PRIVATE" ? emailList : [],
        expiryPreset: expiry,
      });
      if (data.error) throw new Error(data.error);
      setGeneratedLink(data.link);
      toast.success('✅ Share link created successfully!');
    } catch (err: unknown) {
      console.error(err);
      toast.error("❌ Failed to create share link. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!generatedLink) return;
    navigator.clipboard.writeText(generatedLink);
    setCopied(true);
    toast("📋 Copied");
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
      <DialogContent className="sm:min-w-[400px] sm:max-w-[500px] rounded-2xl shadow-xl border bg-white dark:bg-neutral-900 p-6 max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-1">
          <DialogTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Create Share Link
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-600 dark:text-gray-400">
            Configure who can access this video and how long the link lasts.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 flex flex-col">
          <div className="space-y-5">
            {/* Visibility */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Visibility
              </Label>
              <Select
                value={visibility}
                onValueChange={(val: "PUBLIC" | "PRIVATE") => setVisibility(val)}
              >
                <SelectTrigger className="rounded-lg bg-white dark:bg-neutral-800 border-gray-300 dark:border-neutral-700">
                  <SelectValue placeholder="Select visibility" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-neutral-900">
                  <SelectItem value="PUBLIC">🌍 Public</SelectItem>
                  <SelectItem value="PRIVATE">🔒 Private</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Expiry */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Expiry
              </Label>
              <Select
                value={expiry}
                onValueChange={(val: typeof expiry) => setExpiry(val)}
              >
                <SelectTrigger className="rounded-lg bg-white dark:bg-neutral-800 border-gray-300 dark:border-neutral-700">
                  <SelectValue placeholder="Select expiry" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-neutral-900">
                  <SelectItem value="1h">⏰ 1 Hour</SelectItem>
                  <SelectItem value="12h">🕐 12 Hours</SelectItem>
                  <SelectItem value="1d">📅 1 Day</SelectItem>
                  <SelectItem value="30d">🗓️ 30 Days</SelectItem>
                  <SelectItem value="forever">♾️ Forever</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Emails */}
            {visibility === "PRIVATE" && (
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Emails
                </Label>
                <Input
                  type="text"
                  value={emails}
                  onChange={(e) => setEmails(e.target.value)}
                  placeholder="user1@example.com, user2@example.com"
                  className="rounded-lg bg-white dark:bg-neutral-800 border-gray-300 dark:border-neutral-700"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Separate multiple emails with commas
                </p>
              </div>
            )}
          </div>

          {/* Submit + Generated Link */}
          <div className="space-y-3 pt-2">
            {/* Create Link Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg shadow-md"
            >
              {loading ? "Creating..." : "Create Link"}
            </Button>

            {/* Generated Link */}
            {generatedLink && (
              <div className="flex items-center gap-2 w-full rounded-lg border px-3 py-2 bg-neutral-100 dark:bg-neutral-800 border-gray-300 dark:border-neutral-700">
                <a
                  href={generatedLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 truncate text-sm hover:underline text-blue-600 dark:text-blue-400"
                >
                  {generatedLink}
                </a>
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  onClick={handleCopy}
                  className="hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-full"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}