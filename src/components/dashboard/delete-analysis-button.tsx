"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function DeleteAnalysisButton({
  id,
  redirectTo,
  className,
}: {
  id: string;
  redirectTo?: string;
  className?: string;
}) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function remove() {
    const confirmed = window.confirm(
      "Delete this saved analysis? The model output and your notes will be removed permanently.",
    );
    if (!confirmed) return;

    setDeleting(true);
    setError(null);

    const response = await fetch(`/api/analyses/${id}`, { method: "DELETE" });
    if (!response.ok) {
      const body = (await response.json().catch(() => null)) as { message?: string } | null;
      setDeleting(false);
      setError(body?.message ?? "The analysis could not be deleted. Please try again.");
      return;
    }

    if (redirectTo) {
      router.push(redirectTo);
    }
    router.refresh();
  }

  return (
    <div className={cn("inline-flex flex-col items-start gap-1", className)}>
      <button
        type="button"
        onClick={remove}
        disabled={deleting}
        className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[11.5px] font-semibold text-coral transition-colors hover:bg-coral/10 disabled:opacity-60"
      >
        <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
        {deleting ? "Deleting…" : "Delete"}
      </button>
      {error ? (
        <span role="alert" className="text-[10.5px] text-coral">
          {error}
        </span>
      ) : null}
    </div>
  );
}
