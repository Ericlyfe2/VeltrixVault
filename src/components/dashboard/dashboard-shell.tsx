"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Bookmark,
  FlaskConical,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  ShieldAlert,
  Users,
  X,
} from "lucide-react";
import { Logo } from "@/components/layout/logo";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { dashboardCopy } from "@/content/product";
import { site } from "@/content/site";
import { cn, initials } from "@/lib/utils";
import type { SessionSummary } from "@/types";

const NAV = [
  { href: "/dashboard", label: dashboardCopy.nav.overview, icon: LayoutDashboard, exact: true },
  { href: "/dashboard/analyses", label: dashboardCopy.nav.analyses, icon: Bookmark, exact: false },
  { href: "/dashboard/watchlist", label: dashboardCopy.nav.watchlist, icon: ShieldAlert, exact: false },
  { href: "/dashboard/invite", label: dashboardCopy.nav.invite, icon: Users, exact: false },
  { href: "/dashboard/account", label: dashboardCopy.nav.account, icon: Settings, exact: false },
] as const;

export function DashboardShell({
  user,
  children,
}: {
  user: SessionSummary;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!mobileOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setMobileOpen(false);
    }
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [mobileOpen]);

  async function signOut() {
    await fetch("/api/auth/logout", { method: "POST" });
    setMobileOpen(false);
    router.push("/");
    router.refresh();
  }

  function isActive(href: string, exact: boolean) {
    return exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
  }

  const nav = (
    <>
      <div className="px-5 pt-6">
        <Logo variant="onDark" />
      </div>

      <div className="mt-8 flex items-center gap-2 px-5">
        <span className="mono text-[10px] uppercase tracking-[0.2em] text-header-ink/35">Workspace</span>
        <span className="h-px flex-1 bg-white/10" />
      </div>

      <nav aria-label="Dashboard" className="mt-3 flex flex-1 flex-col gap-0.5 px-3">
        {NAV.map((item) => {
          const active = isActive(item.href, item.exact);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              aria-current={active ? "page" : undefined}
              className={cn(
                "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13.5px] font-medium transition-colors",
                active
                  ? "bg-white/10 text-header-ink"
                  : "text-header-ink/60 hover:bg-white/5 hover:text-header-ink",
              )}
            >
              <Icon
                className={cn("h-4 w-4 shrink-0", active ? "text-lime" : "text-header-ink/40 group-hover:text-header-ink/70")}
                aria-hidden="true"
              />
              <span className="flex-1">{item.label}</span>
              {item.href === "/dashboard/account" && !user.emailVerified ? (
                <span className="h-1.5 w-1.5 rounded-full bg-gold" aria-label="Action needed" />
              ) : null}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto space-y-3 px-3 pb-5">
        <Link
          href="/match-lab"
          onClick={() => setMobileOpen(false)}
          className="flex items-center gap-3 rounded-xl border border-lime/25 bg-lime/10 px-3 py-3 text-[13px] font-semibold text-lime hover:bg-lime/15"
        >
          <FlaskConical className="h-4 w-4" aria-hidden="true" />
          Run a fixture
        </Link>

        <div className="rounded-2xl border border-white/10 bg-white/[0.045] p-3">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-lime text-[10px] font-bold text-[#0b1f18]">
              {initials(user.name)}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[12.5px] font-semibold text-header-ink">{user.name}</p>
              <p className="truncate text-[10.5px] text-header-ink/45">{user.email}</p>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1.5">
            <Link
              href="/"
              className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-white/15 py-1.5 text-[10.5px] font-semibold text-header-ink/70 hover:bg-white/5 hover:text-header-ink"
            >
              <ArrowLeft className="h-3 w-3" aria-hidden="true" />
              Site
            </Link>
            <ThemeToggle className="h-8 w-8" />
            <button
              type="button"
              onClick={signOut}
              className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-white/15 py-1.5 text-[10.5px] font-semibold text-coral hover:bg-coral/10"
            >
              <LogOut className="h-3 w-3" aria-hidden="true" />
              Sign out
            </button>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-paper">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[272px] flex-col bg-header text-header-ink lg:flex">
        {nav}
      </aside>

      <header className="sticky top-0 z-40 flex h-16 items-center justify-between gap-3 border-b border-white/10 bg-header px-5 text-header-ink lg:hidden">
        <Logo variant="onDark" />
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          aria-expanded={mobileOpen}
          aria-controls="dashboard-drawer"
          aria-label="Open dashboard menu"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/5"
        >
          <Menu className="h-5 w-5" aria-hidden="true" />
        </button>
      </header>

      {mobileOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close dashboard menu"
            onClick={() => setMobileOpen(false)}
            className="absolute inset-0 bg-black/55 backdrop-blur-sm"
          />
          <div
            id="dashboard-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Dashboard navigation"
            className="relative flex h-full w-[288px] max-w-[86vw] flex-col bg-header text-header-ink shadow-2xl"
          >
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
              className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/5"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
            {nav}
          </div>
        </div>
      ) : null}

      <div className="lg:pl-[272px]">
        <main id="main" className="mx-auto w-full max-w-[1180px] px-5 py-8 sm:px-8 sm:py-10 lg:px-10">
          {children}
        </main>
        <footer className="mx-auto w-full max-w-[1180px] px-5 pb-8 sm:px-8 lg:px-10">
          <div className="border-t border-line pt-5 text-[10.5px] leading-relaxed text-muted">
            {site.disclaimer}
          </div>
        </footer>
      </div>
    </div>
  );
}
