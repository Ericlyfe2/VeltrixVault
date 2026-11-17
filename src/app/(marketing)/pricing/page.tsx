import type { Metadata } from "next";
import { ArrowRight, Check, CircleSlash, Sparkles } from "lucide-react";
import { PageHero } from "@/components/marketing/page-hero";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button-link";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { pricing } from "@/content/marketing";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "VeltrixVault is free in the current release. No card, no deposit, no paid picks, and no affiliate commissions.",
};

export default function PricingPage() {
  return (
    <>
      <PageHero
        breadcrumb={[{ href: "/", label: "Home" }, { label: "Pricing" }]}
        eyebrow={pricing.eyebrow}
        title={
          <>
            Free while the Vault{" "}
            <span className="font-serif font-normal italic tracking-[-0.02em] text-brand dark:text-lime">
              is open.
            </span>
          </>
        }
        copy={pricing.copy}
        aside={
          <div className="card-vv overflow-hidden">
            <div className="flex items-center justify-between gap-3 border-b border-line bg-brand px-5 py-4 text-on-brand">
              <p className="font-display text-[18px] font-bold">{pricing.plan.name}</p>
              <Badge tone="lime">Current release</Badge>
            </div>
            <div className="p-5">
              <p className="mono text-[42px] font-semibold leading-none tracking-tight text-ink">
                {pricing.plan.price}
                <span className="ml-2 text-[12px] font-normal text-muted">{pricing.plan.cadence}</span>
              </p>
              <p className="mt-2 text-[12px] leading-relaxed text-muted">{pricing.plan.description}</p>
              <ButtonLink href="/signup" className="mt-4 w-full" size="sm">
                <Sparkles className="h-4 w-4" aria-hidden="true" />
                Create a free account
              </ButtonLink>
              <p className="mt-2 text-center text-[10.5px] text-muted">{pricing.plan.note}</p>
            </div>
          </div>
        }
      />

      <section className="container-vv py-14 md:py-20">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <Reveal>
            <div className="card-vv p-6 sm:p-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="eyebrow text-muted">What is included</p>
                  <h2 className="mt-1.5 font-display text-[clamp(24px,3vw,32px)] font-bold tracking-tight text-ink">
                    Everything shipped today.
                  </h2>
                </div>
                <span className="mono rounded-full border border-line bg-paper-2 px-3 py-1 text-[10.5px] font-semibold text-muted">
                  £0
                </span>
              </div>

              <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                {pricing.plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5 text-[13px] leading-relaxed text-muted">
                    <span className="mt-0.5 flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full bg-brand-soft text-brand dark:bg-lime/10 dark:text-lime">
                      <Check className="h-2.5 w-2.5" aria-hidden="true" />
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>

              <div className="mt-7 rounded-2xl border border-line bg-paper-2/50 p-4">
                <p className="text-[11.5px] leading-relaxed text-muted">
                  No card is requested, no deposit flow exists, and no feature is gated behind a
                  betting account. If a supporter tier is ever added, it will be optional and clearly
                  separate from the core data and model.
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.06}>
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-header p-6 text-header-ink sm:p-8">
              <div className="stripe-brand pointer-events-none absolute inset-0 opacity-25" aria-hidden="true" />
              <div
                className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-coral/15 blur-3xl"
                aria-hidden="true"
              />
              <div className="relative">
                <div className="flex items-center gap-2">
                  <CircleSlash className="h-4 w-4 text-coral" aria-hidden="true" />
                  <p className="eyebrow text-coral">Hard boundaries</p>
                </div>
                <h2 className="mt-3 font-display text-[clamp(24px,3vw,32px)] font-bold tracking-tight">
                  {pricing.commitments.title}
                </h2>
                <p className="mt-3 text-[13px] leading-relaxed text-header-ink/60">
                  {pricing.commitments.copy}
                </p>
                <ul className="mt-6 space-y-3">
                  {pricing.commitments.items.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-[12.5px] leading-relaxed text-header-ink/75">
                      <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-coral/35 bg-coral/10 text-coral">
                        <span className="text-[10px] leading-none">×</span>
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="border-y border-line bg-paper-2/35">
        <div className="container-vv py-14 md:py-20">
          <Reveal>
            <SectionHeading
              eyebrow="Straight answers"
              title="Questions about the price."
              copy="No fine print, no countdown, and no surprise charge at the end of the page."
              align="center"
            />
          </Reveal>
          <div className="mx-auto mt-9 max-w-3xl divide-y divide-line overflow-hidden rounded-3xl border border-line bg-card">
            {pricing.questions.map((item) => (
              <details key={item.question} className="group px-5 py-5 sm:px-6">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left [&::-webkit-details-marker]:hidden">
                  <span className="text-[14.5px] font-semibold text-ink">{item.question}</span>
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-line text-muted transition-transform group-open:rotate-45">
                    <span className="text-[16px] leading-none">+</span>
                  </span>
                </summary>
                <p className="mt-3 max-w-2xl text-[13.5px] leading-relaxed text-muted">{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="container-vv py-14 md:py-20">
        <Reveal>
          <div className="flex flex-col gap-5 rounded-3xl border border-line bg-card p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
            <div>
              <p className="eyebrow text-muted">Start free</p>
              <h2 className="mt-2 font-display text-[24px] font-bold tracking-tight text-ink">
                No card. No deposit. Just the workspace.
              </h2>
              <p className="mt-2 max-w-xl text-[13px] leading-relaxed text-muted">
                Browse without an account, or create one to save analyses and follow teams.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <ButtonLink href="/signup" className="shrink-0">
                Create an account
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </ButtonLink>
              <ButtonLink href="/match-lab" variant="outline" className="shrink-0">
                Try the Match Lab
              </ButtonLink>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
