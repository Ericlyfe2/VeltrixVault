import { Compass } from "lucide-react";
import { StatusScreen } from "@/components/layout/status-screen";
import { ButtonLink } from "@/components/ui/button-link";
import { notFoundCopy } from "@/content/product";

export default function MarketingNotFound() {
  return (
    <StatusScreen
      eyebrow={notFoundCopy.eyebrow}
      title={notFoundCopy.title}
      copy={notFoundCopy.copy}
      icon={<Compass className="h-7 w-7" aria-hidden="true" />}
    >
      <ButtonLink href="/" size="sm">
        {notFoundCopy.home}
      </ButtonLink>
      <ButtonLink href="/analytics" variant="outline" size="sm">
        {notFoundCopy.analytics}
      </ButtonLink>
    </StatusScreen>
  );
}
