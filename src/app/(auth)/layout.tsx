import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";
import { Logo } from "@/components/layout/logo";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { authCopy } from "@/content/product";
import { site } from "@/content/site";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[0.92fr_1.08fr]">
      <aside className="relative hidden overflow-hidden bg-header text-header-ink lg:flex lg:flex-col lg:justify-between">
        <div className="stripe-brand pointer-events-none absolute inset-0 opacity-35" aria-hidden="true" />
        <div
          className="pointer-events-none absolute -right-32 top-1/4 h-[420px] w-[420px] rounded-full bg-lime/10 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -left-24 bottom-0 h-[320px] w-[320px] rounded-full bg-gold/10 blur-3xl"
          aria-hidden="true"
        />

        <div className="relative p-10 xl:p-14">
          <Logo variant="onDark" />
          <p className="mt-14 max-w-md eyebrow text-lime">{authCopy.panel.eyebrow}</p>
          <h2 className="display mt-4 max-w-lg text-[clamp(38px,4.2vw,56px)] text-header-ink balance">
            {authCopy.panel.title}
          </h2>
          <p className="mt-5 max-w-md text-[14.5px] leading-relaxed text-header-ink/65">
            {authCopy.panel.copy}
          </p>
        </div>

        <div className="relative px-10 pb-10 xl:px-14 xl:pb-14">
          <ul className="space-y-3">
            {authCopy.panel.points.map((point) => (
              <li key={point} className="flex items-start gap-3 text-[13.5px] leading-relaxed text-header-ink/75">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-lime/30 bg-lime/10 text-lime">
                  <Check className="h-3 w-3" aria-hidden="true" />
                </span>
                {point}
              </li>
            ))}
          </ul>

          <div className="mt-8 flex items-center justify-between gap-4 border-t border-white/10 pt-5">
            <p className="text-[11px] text-header-ink/45">{authCopy.panel.note}</p>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-[11.5px] font-semibold text-header-ink/65 hover:text-header-ink"
            >
              Back to the site
              <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </aside>

      <div className="flex min-h-screen flex-col">
        <header className="flex items-center justify-between gap-4 px-5 py-5 sm:px-8 lg:justify-end">
          <div className="lg:hidden">
            <Logo />
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="hidden rounded-full px-3 py-2 text-[12.5px] font-semibold text-muted hover:text-ink sm:inline-flex"
            >
              Back to the site
            </Link>
            <ThemeToggle variant="light" />
          </div>
        </header>

        <main id="main" className="flex flex-1 items-center justify-center px-5 py-8 sm:px-8 lg:py-12">
          <div className="w-full max-w-[440px]">{children}</div>
        </main>

        <footer className="px-5 py-6 text-center text-[11px] leading-relaxed text-muted sm:px-8">
          <div className="mx-auto flex max-w-md flex-wrap items-center justify-center gap-x-4 gap-y-2">
            <Link href="/terms" className="hover:text-ink">
              Terms
            </Link>
            <Link href="/privacy" className="hover:text-ink">
              Privacy
            </Link>
            <a href={`mailto:${site.email}`} className="hover:text-ink">
              {site.email}
            </a>
          </div>
          <p className="mx-auto mt-2 max-w-md">{site.disclaimer}</p>
        </footer>
      </div>
    </div>
  );
}
