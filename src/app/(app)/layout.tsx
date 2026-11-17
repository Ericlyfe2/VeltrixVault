import type { Metadata } from "next";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { requireUser } from "@/lib/auth/guard";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: {
    default: "Dashboard",
    template: "%s · VeltrixVault",
  },
  robots: { index: false, follow: false },
};

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();

  return (
    <DashboardShell
      user={{
        id: user.id,
        name: user.name,
        email: user.email,
        referralCode: user.referralCode,
        emailVerified: Boolean(user.emailVerifiedAt),
      }}
    >
      {children}
    </DashboardShell>
  );
}
