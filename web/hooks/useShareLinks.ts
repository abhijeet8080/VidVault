import { useEffect, useState } from "react";
import { getUserShareLinks, ShareLink } from "@/lib/link"; // adjust import path

interface UseShareLinksResult {
  shareLinks: ShareLink[];
  loading: boolean;
  error: string | null;
}

export function useShareLinks(userId: string | null): UseShareLinksResult {
  const [shareLinks, setShareLinks] = useState<ShareLink[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setShareLinks([]);
      setLoading(false);
      return;
    }

    let isMounted = true;

    const fetchLinks = async () => {
      setLoading(true);
      setError(null);

      try {
        const links = await getUserShareLinks(userId);
        if (isMounted) {
          setShareLinks(links);
        }
      } catch (err) {
        if (isMounted) {
          console.error("Failed to fetch share links:", err);
          setError(err instanceof Error ? err.message : "Unknown error");
          setShareLinks([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchLinks();

    return () => {
      isMounted = false;
    };
  }, [userId]);

  return { shareLinks, loading, error };
}
