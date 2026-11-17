import type { Metadata } from "next";
import { CalendarDays, Info, Link2, Mail, ShieldCheck, Users } from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { Badge } from "@/components/ui/badge";
import { CopyButton } from "@/components/ui/copy-button";
import { ButtonLink } from "@/components/ui/button-link";
import { StatCard } from "@/components/analytics/stat-card";
import { dashboardCopy } from "@/content/product";
import { requireUser } from "@/lib/auth/guard";
import { getReferralSummary } from "@/lib/dashboard";
import { env } from "@/lib/env";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Invite a friend",
};

export default async function InvitePage() {
  const user = await requireUser("/dashboard/invite");
  const summary = await getReferralSummary(user.id);
  const inviteUrl = `${env.appUrl}/signup?ref=${encodeURIComponent(summary.code)}`;
  const mailto = `mailto:?subject=${encodeURIComponent(dashboardCopy.invite.emailSubject)}&body=${encodeURIComponent(
    `${dashboardCopy.invite.emailBody}\n\n${inviteUrl}`,
  )}`;

  return (
    <>
      <DashboardHeader
        eyebrow={dashboardCopy.invite.eyebrow}
        title={dashboardCopy.invite.title}
        copy={dashboardCopy.invite.copy}
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
        <StatCard label="People joined" value={summary.count} icon={<Users className="h-4 w-4" />} tone="brand" />
        <StatCard
          label="Reward tier"
          value="None"
          icon={<ShieldCheck className="h-4 w-4" />}
          tone="default"
        />
        <StatCard
          label="Cost to join"
          value="Free"
          icon={<Link2 className="h-4 w-4" />}
          tone="gold"
        />
      </div>

      <div className="mt-6 grid gap-5 xl:grid-cols-[1.3fr_0.7fr] xl:items-start">
        <section aria-labelledby="invite-link-heading" className="card-vv p-5 sm:p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="eyebrow text-muted">{dashboardCopy.invite.linkLabel}</p>
              <h2 id="invite-link-heading" className="mt-1.5 font-display text-[20px] font-bold tracking-tight text-ink">
                One link, no strings.
              </h2>
            </div>
            <Badge tone="lime">no rewards</Badge>
          </div>

          <p className="mt-2 text-[12.5px] leading-relaxed text-muted">
            Anyone who opens this link gets the ordinary free signup form with your code already
            filled in. No deposit, purchase, or commission is involved at any point.
          </p>

          <div className="mt-5 space-y-3">
            <div>
              <label
                htmlFor="invite-link"
                className="mb-1.5 block text-[11.5px] font-semibold text-ink"
              >
                Invite link
              </label>
              <div className="flex flex-col gap-2 sm:flex-row">
                <input
                  id="invite-link"
                  readOnly
                  value={inviteUrl}
                  className="mono w-full rounded-xl border border-line-strong bg-paper-2/60 px-3.5 py-2.5 text-[12px] text-ink focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
                />
                <CopyButton value={inviteUrl} label="Copy link" className="shrink-0 justify-center py-2.5" />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11.5px] text-muted">{dashboardCopy.invite.codeLabel}:</span>
              <code className="mono rounded-lg border border-line bg-card px-2 py-1 text-[12px] font-semibold tracking-[0.12em] text-ink">
                {summary.code || "—"}
              </code>
              {summary.code ? (
                <CopyButton value={summary.code} label="Copy code" copiedLabel="Copied" />
              ) : null}
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-2 border-t border-line pt-4">
            <ButtonLink href={mailto} size="sm" variant="outline">
              <Mail className="h-4 w-4" aria-hidden="true" />
              Share by email
            </ButtonLink>
            <ButtonLink href="/methodology" size="sm" variant="ghost">
              How the free model works
            </ButtonLink>
          </div>
        </section>

        <section aria-labelledby="joined-heading" className="card-vv p-5 sm:p-6">
          <p className="eyebrow text-muted">{dashboardCopy.invite.recentTitle}</p>
          <h2 id="joined-heading" className="mt-1.5 font-display text-[18px] font-bold tracking-tight text-ink">
            {summary.count > 0 ? `${summary.count} joined` : "No joins yet"}
          </h2>

          {summary.recent.length > 0 ? (
            <ul className="mt-4 divide-y divide-line">
              {summary.recent.map((referral, index) => (
                <li key={`${referral.firstName}-${index}`} className="flex items-center justify-between gap-3 py-2.5">
                  <span className="text-[12.5px] font-semibold text-ink">{referral.firstName}</span>
                  <span className="inline-flex items-center gap-1.5 text-[10.5px] text-muted">
                    <CalendarDays className="h-3 w-3" aria-hidden="true" />
                    {formatDate(referral.joinedAt)}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-[12.5px] leading-relaxed text-muted">
              {dashboardCopy.invite.recentEmpty}
            </p>
          )}

          <div className="mt-5 flex items-start gap-2.5 rounded-xl border border-line bg-paper-2/45 p-3">
            <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold" aria-hidden="true" />
            <p className="text-[11px] leading-relaxed text-muted">
              This is a plain invitation, not an affiliate programme. There are no cash rewards,
              commissions, recruitment tiers, or payments of any kind.
            </p>
          </div>
        </section>
      </div>
    </>
  );
}
