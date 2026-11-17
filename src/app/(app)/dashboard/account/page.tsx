import type { Metadata } from "next";
import Link from "next/link";
import { CalendarDays, CheckCircle2, KeyRound, Mail, ShieldAlert, ShieldCheck, Trash2, UserRound } from "lucide-react";
import { ChangePasswordForm } from "@/components/dashboard/change-password-form";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DeleteAccountForm } from "@/components/dashboard/delete-account-form";
import { ResendVerificationButton } from "@/components/dashboard/resend-verification-button";
import { Badge } from "@/components/ui/badge";
import { dashboardCopy } from "@/content/product";
import { requireUser } from "@/lib/auth/guard";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Account",
  robots: { index: false, follow: false },
};

export default async function AccountPage() {
  const user = await requireUser("/dashboard/account");
  const [analysisCount, watchlistCount] = await Promise.all([
    db.analysis.count({ where: { userId: user.id } }),
    db.watchlistItem.count({ where: { userId: user.id } }),
  ]);

  return (
    <>
      <DashboardHeader
        eyebrow={dashboardCopy.account.eyebrow}
        title={dashboardCopy.account.title}
        copy={dashboardCopy.account.copy}
      />

      <div className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr] xl:items-start">
        <div className="space-y-5">
          <section aria-labelledby="profile-heading" className="card-vv p-5 sm:p-6">
            <div className="flex items-center gap-2">
              <UserRound className="h-4 w-4 text-brand dark:text-lime" aria-hidden="true" />
              <h2 id="profile-heading" className="font-display text-[17px] font-bold text-ink">
                {dashboardCopy.account.profileTitle}
              </h2>
            </div>

            <dl className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-line bg-paper-2/45 p-3.5">
                <dt className="text-[10.5px] font-medium uppercase tracking-[0.12em] text-muted">Name</dt>
                <dd className="mt-1 text-[13.5px] font-semibold text-ink">{user.name}</dd>
              </div>
              <div className="min-w-0 rounded-xl border border-line bg-paper-2/45 p-3.5">
                <dt className="text-[10.5px] font-medium uppercase tracking-[0.12em] text-muted">Email</dt>
                <dd className="mt-1 truncate text-[13.5px] font-semibold text-ink">{user.email}</dd>
              </div>
              <div className="rounded-xl border border-line bg-paper-2/45 p-3.5">
                <dt className="text-[10.5px] font-medium uppercase tracking-[0.12em] text-muted">Member since</dt>
                <dd className="mt-1 inline-flex items-center gap-1.5 text-[13.5px] font-semibold text-ink">
                  <CalendarDays className="h-3.5 w-3.5 text-muted" aria-hidden="true" />
                  {formatDate(user.createdAt)}
                </dd>
              </div>
              <div className="rounded-xl border border-line bg-paper-2/45 p-3.5">
                <dt className="text-[10.5px] font-medium uppercase tracking-[0.12em] text-muted">Your data</dt>
                <dd className="mono mt-1 text-[13px] font-semibold text-ink">
                  {analysisCount} analyses · {watchlistCount} teams
                </dd>
              </div>
            </dl>
          </section>

          <section aria-labelledby="email-heading" className="card-vv p-5 sm:p-6">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-brand dark:text-lime" aria-hidden="true" />
                <h2 id="email-heading" className="font-display text-[17px] font-bold text-ink">
                  {dashboardCopy.account.emailTitle}
                </h2>
              </div>
              {user.emailVerifiedAt ? (
                <Badge tone="lime">
                  <ShieldCheck className="h-3 w-3" aria-hidden="true" />
                  Verified
                </Badge>
              ) : (
                <Badge tone="gold">
                  <ShieldAlert className="h-3 w-3" aria-hidden="true" />
                  Unverified
                </Badge>
              )}
            </div>

            <p className="mt-2 text-[12.5px] leading-relaxed text-muted">
              {user.emailVerifiedAt ? dashboardCopy.account.verified : dashboardCopy.account.unverified}
            </p>

            {!user.emailVerifiedAt ? (
              <div className="mt-4">
                <ResendVerificationButton email={user.email} />
              </div>
            ) : (
              <p className="mt-3 inline-flex items-center gap-1.5 text-[11.5px] text-muted">
                <CheckCircle2 className="h-3.5 w-3.5 text-brand dark:text-lime" aria-hidden="true" />
                Confirmed {user.emailVerifiedAt ? formatDate(user.emailVerifiedAt) : ""}
              </p>
            )}
          </section>

          <section aria-labelledby="password-heading" className="card-vv p-5 sm:p-6">
            <div className="flex items-center gap-2">
              <KeyRound className="h-4 w-4 text-brand dark:text-lime" aria-hidden="true" />
              <h2 id="password-heading" className="font-display text-[17px] font-bold text-ink">
                {dashboardCopy.account.passwordTitle}
              </h2>
            </div>
            <p className="mt-2 text-[12.5px] leading-relaxed text-muted">
              {dashboardCopy.account.passwordCopy}
            </p>
            <div className="mt-4">
              <ChangePasswordForm />
            </div>
          </section>
        </div>

        <aside className="space-y-5">
          <section className="card-vv p-5">
            <p className="eyebrow text-muted">Privacy</p>
            <h2 className="mt-1 font-display text-[17px] font-bold text-ink">What we store.</h2>
            <ul className="mt-3 space-y-2.5 text-[12px] leading-relaxed text-muted">
              <li className="flex gap-2">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-brand dark:bg-lime" />
                Your name, email, and a scrypt password hash.
              </li>
              <li className="flex gap-2">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-brand dark:bg-lime" />
                Saved analyses, watchlist bookmarks, and invite joins.
              </li>
              <li className="flex gap-2">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-brand dark:bg-lime" />
                Session records with a hashed IP address and browser string.
              </li>
            </ul>
            <p className="mt-3 text-[11px] leading-relaxed text-muted">
              Read the full{" "}
              <Link href="/privacy" className="font-semibold text-brand underline underline-offset-2 dark:text-lime">
                privacy policy
              </Link>
              .
            </p>
          </section>

          <section
            aria-labelledby="danger-heading"
            className="rounded-2xl border border-coral/30 bg-coral/[0.04] p-5"
          >
            <div className="flex items-center gap-2">
              <Trash2 className="h-4 w-4 text-coral" aria-hidden="true" />
              <h2 id="danger-heading" className="font-display text-[17px] font-bold text-ink">
                {dashboardCopy.account.dangerTitle}
              </h2>
            </div>
            <p className="mt-2 text-[12px] leading-relaxed text-muted">
              {dashboardCopy.account.dangerCopy}
            </p>
            <div className="mt-4">
              <DeleteAccountForm />
            </div>
          </section>
        </aside>
      </div>
    </>
  );
}
