import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-5 py-20">
      <div className="flex flex-col items-center gap-3 text-center" aria-live="polite" aria-busy="true">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-line bg-card">
          <Loader2 className="h-5 w-5 animate-spin text-brand dark:text-lime" aria-hidden="true" />
        </span>
        <p className="eyebrow text-muted">Loading the Vault</p>
        <span className="sr-only">Loading content</span>
      </div>
    </div>
  );
}
