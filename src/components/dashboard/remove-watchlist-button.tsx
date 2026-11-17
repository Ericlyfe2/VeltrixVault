"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, X } from "lucide-react";
import { requestJson } from "@/lib/client-api";

export function RemoveWatchlistButton({ teamId }: { teamId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function remove() {
    setLoading(true);
    setError(null);

    const result = await requestJson<{ ok: true; following: boolean }>(
      `/api/watchlist?teamId=${encodeURIComponent(teamId)}`,
      { method: "DELETE" },
    );

    setLoading(false);

    if (!result.ok) {
      setError(result.message);
      return;
    }

    router.refresh();
  }

  return (
    <div className="inline-flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={remove}
        disabled={loading}
        className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-[11.5px] font-semibold text-muted transition-colors hover:border-coral/40 hover:bg-coral/8 hover:text-coral disabled:opacity-60"
      >
        {loading ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
        ) : (
          <X className="h-3.5 w-3.5" aria-hidden="true" />
        )}
        {loading ? "Removing" : "Remove"}
      </button>
      {error ? (
        <span role="alert" className="max-w-[180px] text-right text-[10.5px] text-coral">
          {error}
        </span>
      ) : null}
    </div>
  );
}
