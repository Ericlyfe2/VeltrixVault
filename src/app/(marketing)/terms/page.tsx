import type { Metadata } from "next";
import Link from "next/link";
import { Mail, Scale } from "lucide-react";
import { LegalSections } from "@/components/marketing/legal-sections";
import { PageHero } from "@/components/marketing/page-hero";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/ui/reveal";
import { legalUpdated, terms } from "@/content/legal";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Terms",
  description:
    "The terms covering use of VeltrixVault: accounts, acceptable use, no betting advice, data ownership, availability, and termination.",
};

export default function TermsPage() {
  return (
    <>
      <PageHero
        breadcrumb={[{ href: "/", label: "Home" }, { label: "Terms" }]}
        eyebrow={terms.eyebrow}
        title={
          <>
            The rules of{" "}
            <span className="font-serif font-normal italic tracking-[-0.02em] text-brand dark:text-lime">
              the Vault.
            </span>
          </>
        }
        copy={terms.intro}
        aside={
          <div className="space-y-3">
            <div className="card-vv p-5">
              <div className="flex items-center justify-between gap-3">
                <p className="eyebrow text-muted">Effective date</p>
                <Badge tone="outline">{legalUpdated}</Badge>
              </div>
              <p className="mt-3 flex items-center gap-2 text-[12.5px] font-semibold text-ink">
                <Scale className="h-4 w-4 text-brand dark:text-lime" aria-hidden="true" />
                Analysis, not advice
              </p>
              <p className="mt-1.5 text-[11.5px] leading-relaxed text-muted">
                No deposits, no paid predictions, and no commission from any wager.
              </p>
            </div>
            <div className="rounded-2xl border border-gold/30 bg-gold/10 p-4">
              <p className="text-[11.5px] leading-relaxed text-muted">
                If you do not agree with these terms, please do not create an account or use the
                service.
              </p>
            </div>
          </div>
        }
      />

      <section className="container-vv py-14 md:py-20">
        <div className="grid gap-10 lg:grid-cols-[220px_1fr] lg:gap-14">
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <p className="eyebrow text-muted">On this page</p>
            <nav aria-label="Terms sections" className="mt-4">
              <ol className="space-y-1">
                {terms.sections.map((section) => (
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
                Read the{" "}
                <Link href="/privacy" className="font-semibold text-brand underline underline-offset-2 dark:text-lime">
                  privacy notice
                </Link>{" "}
                for how account data is handled.
              </p>
            </div>
          </aside>

          <div className="min-w-0">
            <LegalSections sections={terms.sections} />

            <Reveal>
              <div className="mt-10 rounded-3xl border border-line bg-card p-6">
                <p className="eyebrow text-muted">Contact</p>
                <h2 className="mt-1.5 font-display text-[20px] font-bold tracking-tight text-ink">
                  Questions about the terms?
                </h2>
                <p className="mt-2 text-[13px] leading-relaxed text-muted">
                  Send a message with the email address on your account so we can find the right
                  context.
                </p>
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
    .replace(/^[0-9]+\.\s*/, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
