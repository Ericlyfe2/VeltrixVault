import Link from "next/link";
import { ArrowRight, Compass } from "lucide-react";
import { Logo } from "@/components/layout/logo";
import { StatusScreen } from "@/components/layout/status-screen";
import { ButtonLink } from "@/components/ui/button-link";
import { notFoundCopy } from "@/content/product";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-paper">
      <header className="border-b border-white/10 bg-header">
        <div className="container-vv flex h-[72px] items-center justify-between">
          <Logo variant="onDark" />
          <Link href="/" className="text-[12.5px] font-semibold text-header-ink/70 hover:text-header-ink">
            Back to the site
          </Link>
        </div>
      </header>

      <main id="main" className="flex-1">
        <StatusScreen
          eyebrow={notFoundCopy.eyebrow}
          title={notFoundCopy.title}
          copy={notFoundCopy.copy}
          icon={<Compass className="h-7 w-7" aria-hidden="true" />}
        >
          <ButtonLink href="/" size="sm">
            {notFoundCopy.home}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </ButtonLink>
          <ButtonLink href="/analytics" variant="outline" size="sm">
            {notFoundCopy.analytics}
          </ButtonLink>
        </StatusScreen>
      </main>
    </div>
  );
}
