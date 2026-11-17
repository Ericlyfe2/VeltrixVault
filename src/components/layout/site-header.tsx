"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";
import { Logo } from "@/components/layout/logo";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { ButtonLink } from "@/components/ui/button-link";
import { marketingNav as NAV } from "@/content/site";
import { cn, initials } from "@/lib/utils";
import type { SessionSummary } from "@/types";

export function SiteHeader({
  initialSession,
}: {
  initialSession?: SessionSummary | null;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [session, setSession] = useState<SessionSummary | null | undefined>(initialSession);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialSession !== undefined) return;
    const controller = new AbortController();

    fetch("/api/auth/session", { cache: "no-store", signal: controller.signal })
      .then((response) => (response.ok ? response.json() : { user: null }))
      .then((data) => setSession((data.user as SessionSummary | null) ?? null))
      .catch(() => setSession(null));

    return () => controller.abort();
  }, [initialSession]);

  useEffect(() => {
    function onPointerDown(event: PointerEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setUserOpen(false);
      }
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [mobileOpen]);

  async function signOut() {
    await fetch("/api/auth/logout", { method: "POST" });
    setSession(null);
    setUserOpen(false);
    setMobileOpen(false);
    router.push("/");
    router.refresh();
  }

  function isActive(href: string) {
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  function closeMenus() {
    setMobileOpen(false);
    setUserOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 glass-header">
      <div className="container-vv flex h-[72px] items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-9">
          <Logo variant="onDark" />
          <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMenus}
                className={cn(
                  "relative rounded-full px-3.5 py-2 text-[13.5px] font-medium text-header-ink/75 transition-colors hover:text-header-ink",
                  isActive(item.href) && "text-header-ink",
                )}
              >
                {item.label}
                {isActive(item.href) ? (
                  <span className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-lime" />
                ) : null}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle className="hidden sm:inline-flex" />

          {session === undefined ? (
            <span
              className="hidden h-10 w-28 animate-pulse rounded-full bg-white/10 sm:block"
              aria-hidden="true"
            />
          ) : session ? (
            <div className="relative hidden sm:block" ref={menuRef}>
              <button
                type="button"
                onClick={() => setUserOpen((open) => !open)}
                aria-expanded={userOpen}
                aria-haspopup="menu"
                className="inline-flex h-10 items-center gap-2 rounded-full border border-white/20 bg-white/5 pl-1.5 pr-3 text-[13px] font-semibold text-header-ink transition-colors hover:bg-white/10"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-lime text-[10px] font-bold text-[#0b1f18]">
                  {initials(session.name)}
                </span>
                <span className="max-w-[110px] truncate">{session.name.split(" ")[0]}</span>
                <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", userOpen && "rotate-180")} aria-hidden="true" />
              </button>

              {userOpen ? (
                <div
                  role="menu"
                  className="absolute right-0 top-[calc(100%+10px)] w-60 overflow-hidden rounded-2xl border border-line bg-card p-1.5 text-ink shadow-[0_24px_60px_-20px_rgba(0,0,0,0.5)]"
                >
                  <div className="border-b border-line px-3 py-2.5">
                    <p className="truncate text-[13px] font-semibold">{session.name}</p>
                    <p className="truncate text-[11px] text-muted">{session.email}</p>
                  </div>
                  <Link href="/dashboard" onClick={closeMenus} role="menuitem" className="mt-1 flex items-center gap-2.5 rounded-xl px-3 py-2 text-[13px] font-medium hover:bg-paper-2">
                    <LayoutDashboard className="h-4 w-4 text-muted" aria-hidden="true" /> Dashboard
                  </Link>
                  <Link href="/dashboard/account" onClick={closeMenus} role="menuitem" className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-[13px] font-medium hover:bg-paper-2">
                    <Settings className="h-4 w-4 text-muted" aria-hidden="true" /> Account
                  </Link>
                  {!session.emailVerified ? (
                    <Link href="/dashboard/account" onClick={closeMenus} role="menuitem" className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-[13px] font-medium text-gold hover:bg-paper-2">
                      <ShieldCheck className="h-4 w-4" aria-hidden="true" /> Verify email
                    </Link>
                  ) : null}
                  <button
                    type="button"
                    role="menuitem"
                    onClick={signOut}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-[13px] font-medium text-coral hover:bg-paper-2"
                  >
                    <LogOut className="h-4 w-4" aria-hidden="true" /> Sign out
                  </button>
                </div>
              ) : null}
            </div>
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <ButtonLink href="/login" variant="headerGhost" size="sm">
                Sign in
              </ButtonLink>
              <ButtonLink href="/signup" variant="header" size="sm">
                <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                Start free
              </ButtonLink>
            </div>
          )}

          <button
            type="button"
            onClick={() => setMobileOpen((open) => !open)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/5 text-header-ink lg:hidden"
          >
            {mobileOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
          </button>
        </div>
      </div>

      {mobileOpen ? (
        <div id="mobile-menu" className="border-t border-white/10 bg-header lg:hidden">
          <nav aria-label="Mobile" className="container-vv flex flex-col gap-1 py-5">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMenus}
                className={cn(
                  "rounded-xl px-3 py-3 text-[15px] font-medium text-header-ink/80 hover:bg-white/5 hover:text-header-ink",
                  isActive(item.href) && "bg-white/8 text-header-ink",
                )}
              >
                {item.label}
              </Link>
            ))}
            <Link href="/about" onClick={closeMenus} className="rounded-xl px-3 py-3 text-[15px] font-medium text-header-ink/80 hover:bg-white/5 hover:text-header-ink">
              About
            </Link>

            <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-4">
              <span className="text-[12px] text-header-ink/60">Theme</span>
              <ThemeToggle />
            </div>

            {session ? (
              <div className="mt-3 grid grid-cols-2 gap-2">
                <ButtonLink href="/dashboard" variant="header" size="md" className="w-full">
                  Dashboard
                </ButtonLink>
                <button
                  type="button"
                  onClick={signOut}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-white/25 text-[13px] font-semibold text-header-ink hover:bg-white/10"
                >
                  <LogOut className="h-4 w-4" aria-hidden="true" /> Sign out
                </button>
              </div>
            ) : (
              <div className="mt-3 grid grid-cols-2 gap-2">
                <ButtonLink href="/login" variant="headerGhost" size="md" className="w-full">
                  Sign in
                </ButtonLink>
                <ButtonLink href="/signup" variant="header" size="md" className="w-full">
                  Start free
                </ButtonLink>
              </div>
            )}
          </nav>
        </div>
      ) : null}
    </header>
  );
}
