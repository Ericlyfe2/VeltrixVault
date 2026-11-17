"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Bookmark, BookmarkCheck, Loader2 } from "lucide-react";
import { teamPage } from "@/content/product";
import { requestJson } from "@/lib/client-api";
import { cn } from "@/lib/utils";

export function WatchlistButton({
  teamId,
  initialFollowing,
  signedIn,
  loginHref,
  className,
}: {
  teamId: string;
  initialFollowing: boolean;
  signedIn: boolean;
  loginHref: string;
  className?: string;
}) {
  const router = useRouter();
  const [following, setFollowing] = useState(initialFollowing);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function toggle() {
    if (!signedIn) {
      router.push(loginHref);
      return;
    }

    setLoading(true);
    setError(null);

    const result = following
      ? await requestJson<{ ok: true; following: boolean }>(
          `/api/watchlist?teamId=${encodeURIComponent(teamId)}`,
          { method: "DELETE" },
        )
      : await requestJson<{ ok: true; following: boolean }>("/api/watchlist", {
          method: "POST",
          body: { teamId },
        });

    setLoading(false);

    if (!result.ok) {
      if (result.status === 401) {
        router.push(loginHref);
        return;
      }
      setError(result.message);
      return;
    }

    setFollowing(result.data.following);
    router.refresh();
  }

  return (
    <div className={cn("inline-flex flex-col items-start gap-1", className)}>
      <button
        type="button"
        onClick={toggle}
        disabled={loading}
        aria-pressed={following}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 text-[12.5px] font-semibold transition-colors disabled:opacity-65",
          following
            ? "border border-brand/25 bg-brand-soft/70 text-brand hover:bg-brand-soft dark:border-lime/30 dark:bg-lime/10 dark:text-lime"
            : "border border-line-strong bg-card text-ink hover:border-brand hover:bg-paper-2",
        )}
      >
        {loading ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
        ) : following ? (
          <BookmarkCheck className="h-3.5 w-3.5" aria-hidden="true" />
        ) : (
          <Bookmark className="h-3.5 w-3.5" aria-hidden="true" />
        )}
        {signedIn
          ? following
            ? teamPage.watchlist.following
            : teamPage.watchlist.follow
          : teamPage.watchlist.signIn}
      </button>
      <span className="text-[10.5px] text-muted" aria-live="polite">
        {error ?? teamPage.watchlist.note}
      </span>
    </div>
  );
}
