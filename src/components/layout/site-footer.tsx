import Link from "next/link";
import { Database, ExternalLink } from "lucide-react";
import { Logo } from "@/components/layout/logo";
import { footerNav, site } from "@/content/site";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-white/10 bg-header text-header-ink">
      <div className="container-vv py-14 md:py-16">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_2fr]">
          <div className="max-w-sm">
            <Logo variant="onDark" />
            <p className="mt-5 text-[14px] leading-relaxed text-header-ink/65">
              A public-data football analytics workspace. League tables, an inspectable
              goals model, saved reports, and no betting funnel.
            </p>
            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/5 px-3 py-2 text-[11px] text-header-ink/70">
              <Database className="h-3.5 w-3.5 text-lime" aria-hidden="true" />
              Data from{" "}
              <a
                href={site.dataSource.url}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-1 font-semibold text-header-ink underline decoration-white/25 underline-offset-4 hover:decoration-lime"
              >
                OpenFootball
                <ExternalLink className="h-3 w-3" aria-hidden="true" />
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {footerNav.map((column) => (
              <nav key={column.title} aria-label={column.title}>
                <p className="eyebrow mb-4 text-lime">{column.title}</p>
                <ul className="space-y-2.5">
                  {column.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-[13.5px] text-header-ink/70 transition-colors hover:text-header-ink"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        <div className="mt-12 rounded-2xl border border-white/10 bg-white/[0.035] px-4 py-3 text-[11.5px] leading-relaxed text-header-ink/55">
          {site.disclaimer}
        </div>

        <div className="mt-7 flex flex-col gap-3 border-t border-white/10 pt-6 text-[11.5px] text-header-ink/45 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {site.name}. Built independently, with public data.
          </p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <Link href="/privacy" className="hover:text-header-ink">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-header-ink">
              Terms
            </Link>
            <a href={`mailto:${site.email}`} className="hover:text-header-ink">
              {site.email}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
