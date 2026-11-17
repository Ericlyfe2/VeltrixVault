import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Database, FlaskConical, ShieldCheck, Sigma } from "lucide-react";
import { PageHero } from "@/components/marketing/page-hero";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button-link";
import { Reveal } from "@/components/ui/reveal";
import { methodology } from "@/content/marketing";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Methodology",
  description:
    "The full independent-Poisson model: data, league averages, shrinkage, expected goals, the scoreline matrix, and honest limitations.",
};

export default function MethodologyPage() {
  return (
    <>
      <PageHero
        breadcrumb={[{ href: "/", label: "Home" }, { label: "Methodology" }]}
        eyebrow={methodology.eyebrow}
        title={
          <>
            The whole model,{" "}
            <span className="font-serif font-normal italic tracking-[-0.02em] text-brand dark:text-lime">
              on one page.
            </span>
          </>
        }
        copy={methodology.copy}
        aside={
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            <div className="card-vv p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="eyebrow text-muted">Model</p>
                <Badge tone="lime">v1.0</Badge>
              </div>
              <p className="mt-2 flex items-center gap-2 font-display text-[16px] font-bold text-ink">
                <Sigma className="h-4 w-4 text-brand dark:text-lime" aria-hidden="true" />
                Independent Poisson
              </p>
              <p className="mt-1 text-[11.5px] leading-relaxed text-muted">
                Two goal distributions, one scoreline matrix, no proprietary ratings.
              </p>
            </div>
            <div className="card-vv p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="eyebrow text-muted">Source</p>
                <Badge tone="outline">{site.dataSource.license}</Badge>
              </div>
              <a
                href={site.dataSource.url}
                target="_blank"
                rel="noreferrer noopener"
                className="mt-2 flex items-center gap-2 font-display text-[16px] font-bold text-ink underline decoration-line underline-offset-4 hover:decoration-brand"
              >
                <Database className="h-4 w-4 text-brand dark:text-lime" aria-hidden="true" />
                {site.dataSource.name}
              </a>
              <p className="mt-1 text-[11.5px] leading-relaxed text-muted">
                Public-domain match archives, normalised into one local snapshot.
              </p>
            </div>
          </div>
        }
      />

      <section className="container-vv py-14 md:py-20">
        <div className="grid gap-10 lg:grid-cols-[240px_1fr] lg:gap-14">
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <p className="eyebrow text-muted">On this page</p>
            <nav aria-label="Methodology sections" className="mt-4">
              <ol className="space-y-1">
                {methodology.sections.map((section) => (
                  <li key={section.id}>
                    <Link
                      href={`#${section.id}`}
                      className="block rounded-lg px-2 py-1.5 text-[12.5px] text-muted transition-colors hover:bg-paper-2 hover:text-ink"
                    >
                      {section.title}
                    </Link>
                  </li>
                ))}
              </ol>
            </nav>

            <div className="mt-6 rounded-2xl border border-gold/30 bg-gold/10 p-4">
              <ShieldCheck className="h-4 w-4 text-gold" aria-hidden="true" />
              <p className="mt-2 text-[11.5px] leading-relaxed text-muted">
                Estimates are for analysis and education. Nothing here is betting advice or a
                guarantee.
              </p>
            </div>
          </aside>

          <div className="min-w-0">
            <div className="space-y-12">
              {methodology.sections.map((section, index) => (
                <Reveal key={section.id} delay={index === 0 ? 0 : 0.02}>
                  <section id={section.id} className="scroll-mt-28">
                    <div className="flex items-center gap-3">
                      <span className="mono flex h-7 w-7 items-center justify-center rounded-full border border-line bg-card text-[11px] font-semibold text-muted">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <h2 className="font-display text-[clamp(21px,2.4vw,27px)] font-bold tracking-tight text-ink">
                        {section.title.replace(/^\d+\.\s*/, "")}
                      </h2>
                    </div>

                    <div className="mt-4 space-y-3">
                      {section.paragraphs.map((paragraph) => (
                        <p key={paragraph} className="text-[14px] leading-[1.8] text-muted">
                          {paragraph}
                        </p>
                      ))}
                    </div>

                    {"formula" in section && section.formula ? (
                      <pre className="mono mt-5 overflow-x-auto rounded-2xl border border-white/10 bg-header p-4 text-[11.5px] leading-relaxed text-header-ink/80 sm:p-5">
                        <code>{section.formula}</code>
                      </pre>
                    ) : null}

                    {"note" in section && section.note ? (
                      <p className="mt-4 flex items-start gap-2 rounded-2xl border border-line bg-paper-2/55 px-4 py-3 text-[12px] leading-relaxed text-muted">
                        <Database className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand dark:text-lime" aria-hidden="true" />
                        {section.note}
                      </p>
                    ) : null}
                  </section>
                </Reveal>
              ))}
            </div>

            <Reveal>
              <section className="mt-14 rounded-3xl border border-line bg-card p-6 sm:p-8">
                <p className="eyebrow text-muted">Glossary</p>
                <h2 className="mt-1.5 font-display text-[22px] font-bold tracking-tight text-ink">
                  A few terms, plainly.
                </h2>
                <dl className="mt-6 grid gap-x-8 gap-y-5 sm:grid-cols-2">
                  {methodology.glossary.map((entry) => (
                    <div key={entry.term} className="border-t border-line pt-3">
                      <dt className="text-[12.5px] font-semibold text-ink">{entry.term}</dt>
                      <dd className="mt-1 text-[12px] leading-relaxed text-muted">{entry.definition}</dd>
                    </div>
                  ))}
                </dl>
              </section>
            </Reveal>

            <Reveal>
              <div className="mt-8 flex flex-col gap-5 rounded-3xl border border-line bg-paper-2/45 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
                <div>
                  <p className="eyebrow text-muted">See it run</p>
                  <h2 className="mt-2 font-display text-[22px] font-bold tracking-tight text-ink">
                    Put the formula on a fixture.
                  </h2>
                  <p className="mt-2 max-w-lg text-[13px] leading-relaxed text-muted">
                    Pick any two teams from the same competition and compare the output with the
                    method above.
                  </p>
                </div>
                <ButtonLink href="/match-lab" className="shrink-0">
                  <FlaskConical className="h-4 w-4" aria-hidden="true" />
                  Open the Match Lab
                </ButtonLink>
              </div>
            </Reveal>

            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-[11.5px] text-muted">
              <Link href="/analytics" className="inline-flex items-center gap-1 font-semibold text-brand hover:underline dark:text-lime">
                Browse the leagues
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
              <Link href="/about" className="hover:text-ink">
                Why VeltrixVault exists
              </Link>
              <Link href="/terms" className="hover:text-ink">
                Terms
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
