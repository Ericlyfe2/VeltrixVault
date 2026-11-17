import type { Metadata } from "next";
import Link from "next/link";
import { Mail, ShieldCheck } from "lucide-react";
import { LegalSections } from "@/components/marketing/legal-sections";
import { PageHero } from "@/components/marketing/page-hero";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/ui/reveal";
import { legalUpdated, privacy } from "@/content/legal";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Privacy",
  description:
    "How VeltrixVault collects, uses, and protects account data, session records, saved analyses, and referral information.",
};

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        breadcrumb={[{ href: "/", label: "Home" }, { label: "Privacy" }]}
        eyebrow={privacy.eyebrow}
        title={
          <>
            What we keep,{" "}
            <span className="font-serif font-normal italic tracking-[-0.02em] text-brand dark:text-lime">
              and why.
            </span>
          </>
        }
        copy={privacy.intro}
        aside={
          <div className="space-y-3">
            <div className="card-vv p-5">
              <div className="flex items-center justify-between gap-3">
                <p className="eyebrow text-muted">Effective date</p>
                <Badge tone="outline">{legalUpdated}</Badge>
              </div>
              <p className="mt-3 flex items-center gap-2 text-[12.5px] font-semibold text-ink">
                <ShieldCheck className="h-4 w-4 text-brand dark:text-lime" aria-hidden="true" />
                Plain-language notice
              </p>
              <p className="mt-1.5 text-[11.5px] leading-relaxed text-muted">
                No advertising cookies, no cross-site trackers, and no sale of personal data.
              </p>
            </div>
            <div className="card-vv p-5">
              <p className="eyebrow text-muted">{privacy.contact.title}</p>
              <p className="mt-2 text-[12px] leading-relaxed text-muted">{privacy.contact.copy}</p>
              <a
                href={`mailto:${site.email}`}
                className="mt-3 inline-flex items-center gap-2 text-[12px] font-semibold text-brand underline underline-offset-4 dark:text-lime"
              >
                <Mail className="h-3.5 w-3.5" aria-hidden="true" />
                {site.email}
              </a>
            </div>
          </div>
        }
      />

      <section className="container-vv py-14 md:py-20">
        <div className="grid gap-10 lg:grid-cols-[220px_1fr] lg:gap-14">
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <p className="eyebrow text-muted">On this page</p>
            <nav aria-label="Privacy sections" className="mt-4">
              <ol className="space-y-1">
                {privacy.sections.map((section) => (
                  <li key={section.title}>
                    <Link
                      href={`#${slug(section.title)}`}
                      className="block rounded-lg px-2 py-1.5 text-[12.5px] text-muted transition-colors hover:bg-paper-2 hover:text-ink"
                    >
                      {section.title}
                    </Link>
                  </li>
                ))}
              </ol>
            </nav>
            <div className="mt-6 rounded-2xl border border-line bg-paper-2/50 p-4">
              <p className="text-[11.5px] leading-relaxed text-muted">
                You can delete your account from the{" "}
                <Link href="/dashboard/account" className="font-semibold text-brand underline underline-offset-2 dark:text-lime">
                  account page
                </Link>
                . The deletion removes your workspace data.
              </p>
            </div>
          </aside>

          <div className="min-w-0">
            <LegalSections sections={privacy.sections} />

            <Reveal>
              <div className="mt-10 rounded-3xl border border-line bg-card p-6">
                <p className="eyebrow text-muted">{privacy.contact.title}</p>
                <h2 className="mt-1.5 font-display text-[20px] font-bold tracking-tight text-ink">
                  Questions about your data?
                </h2>
                <p className="mt-2 text-[13px] leading-relaxed text-muted">{privacy.contact.copy}</p>
                <a
                  href={`mailto:${site.email}`}
                  className="mt-4 inline-flex items-center gap-2 text-[12.5px] font-semibold text-brand underline underline-offset-4 dark:text-lime"
                >
                  <Mail className="h-3.5 w-3.5" aria-hidden="true" />
                  {site.email}
                </a>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}

function slug(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
