"use client";

import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

export function ThemeToggle({
  className = "",
  variant = "dark",
}: {
  className?: string;
  variant?: "dark" | "light";
}) {
  function toggle() {
    const root = document.documentElement;
    const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    root.style.colorScheme = next;
    try {
      localStorage.setItem("vv-theme", next);
    } catch {
      /* storage can be unavailable in private mode */
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle colour theme"
      title="Toggle colour theme"
      className={cn(
        "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition-colors",
        variant === "dark"
          ? "border-white/20 bg-white/5 text-header-ink hover:border-lime hover:bg-white/10"
          : "border-line bg-card text-ink hover:border-brand hover:bg-paper-2",
        className,
      )}
    >
      <Sun className="hidden h-[18px] w-[18px] dark:block" aria-hidden="true" />
      <Moon className="h-[18px] w-[18px] dark:hidden" aria-hidden="true" />
    </button>
  );
}
