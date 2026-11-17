import type { Metadata } from "next";
import { ArrowRight, Database, ExternalLink, FlaskConical, ShieldCheck, X } from "lucide-react";
import { PageHero } from "@/components/marketing/page-hero";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button-link";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { about } from "@/content/marketing";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "Why VeltrixVault exists: public-data football analytics, an inspectable model, and a product that does not monetise the outcome.",
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        breadcrumb={[{ href: "/", label: "Home" }, { label: "About" }]}
        eyebrow={about.eyebrow}
        title={
          <>
            A quieter way to look at{" "}
            <span className="font-serif font-normal italic tracking-[-0.02em] text-brand dark:text-lime">
              football.
            </span>
          </>
        }
        copy={about.copy}
        aside={
          <div className="rounded-3xl border border-white/10 bg-header p-6 text-header-ink">
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4 text-lime" aria-hidden="true" />
              <p className="eyebrow text-lime">Data credit</p>
            </div>
            <h2 className="mt-3 font-display text-[20px] font-bold">{about.data.title}</h2>
            <p className="mt-2 text-[12.5px] leading-relaxed text-header-ink/65">{about.data.copy}</p>
            <a
              href={site.dataSource.url}
              target="_blank"
              rel="noreferrer noopener"
              className="mt-4 inline-flex items-center gap-1.5 text-[12px] font-semibold text-lime underline decoration-lime/30 underline-offset-4 hover:decoration-lime"
            >
              OpenFootball archive
              <ExternalLink className="h-3 w-3" aria-hidden="true" />
            </a>
          </div>
        }
      />

      <section className="container-vv py-14 md:py-20">
        <Reveal>
          <SectionHeading
            eyebrow="Principles"
            title="Three rules the product follows."
            copy="These are constraints on the product, not aspirations. They shape what gets built and what never ships."
          />
        </Reveal>

        <div className="mt-9 grid gap-4 md:grid-cols-3">
          {about.principles.map((principle, index) => (
            <Reveal key={principle.title} delay={index * 0.05}>
              <article className="card-vv h-full p-5 sm:p-6">
                <span className="mono flex h-9 w-9 items-center justify-center rounded-full border border-line bg-paper-2 text-[11px] font-semibold text-muted">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h2 className="mt-4 font-display text-[18px] font-bold tracking-tight text-ink">
                  {principle.title}
                </h2>
                <p className="mt-2 text-[13px] leading-relaxed text-muted">{principle.copy}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="border-y border-line bg-paper-2/35">
        <div className="container-vv py-14 md:py-20">
          <div className="grid gap-6 lg:grid-cols-2">
            <Reveal>
              <div className="card-vv h-full p-6 sm:p-8">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-brand dark:text-lime" aria-hidden="true" />
                  <p className="eyebrow text-muted">Scope</p>
                </div>
                <h2 className="mt-3 font-display text-[clamp(23px,2.8vw,30px)] font-bold tracking-tight text-ink">
                  {about.story.title}
                </h2>
                <p className="mt-3 text-[14px] leading-[1.8] text-muted">{about.story.copy}</p>
                <div className="mt-6 flex flex-wrap gap-2">
                  <Badge tone="brand">League tables</Badge>
                  <Badge tone="muted">Team profiles</Badge>
                  <Badge tone="muted">Poisson model</Badge>
                  <Badge tone="muted">Saved analyses</Badge>
                  <Badge tone="muted">Watchlist</Badge>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.06}>
              <div className="card-vv h-full p-6 sm:p-8">
                <div className="flex items-center gap-2">
                  <X className="h-4 w-4 text-coral" aria-hidden="true" />
                  <p className="eyebrow text-muted">Boundaries</p>
                </div>
                <h2 className="mt-3 font-display text-[clamp(23px,2.8vw,30px)] font-bold tracking-tight text-ink">
                  {about.not.title}
                </h2>
                <ul className="mt-4 space-y-3">
                  {about.not.items.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-[13px] leading-relaxed text-muted">
                      <span className="mt-0.5 flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full bg-coral/10 text-coral">
                        <X className="h-2.5 w-2.5" aria-hidden="true" />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="container-vv py-14 md:py-20">
        <Reveal>
          <div className="relative overflow-hidden rounded-[32px] bg-brand px-6 py-10 text-on-brand md:px-10 md:py-12">
            <div className="stripe-brand pointer-events-none absolute inset-0 opacity-35" aria-hidden="true" />
            <div className="relative grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
              <div>
                <p className="eyebrow text-lime">The work</p>
                <h2 className="mt-3 display max-w-xl text-[clamp(28px,3.6vw,42px)] text-on-brand balance">
                  Read a fixture with the working shown.
                </h2>
                <p className="mt-3 max-w-lg text-[13.5px] leading-relaxed text-on-brand/75">
                  The Match Lab is free, the methodology is public, and the account exists to keep
                  your own analysis — not to unlock a tip.
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <ButtonLink href="/match-lab" variant="lime" className="w-full md:w-auto">
                  <FlaskConical className="h-4 w-4" aria-hidden="true" />
                  Open the Match Lab
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </ButtonLink>
                <ButtonLink href="/signup" variant="headerGhost" className="w-full md:w-auto">
                  Create a free account
                </ButtonLink>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
