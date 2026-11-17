import { FileQuestion } from "lucide-react";
import { StatusScreen } from "@/components/layout/status-screen";
import { ButtonLink } from "@/components/ui/button-link";
import { notFoundCopy } from "@/content/product";

export default function DashboardNotFound() {
  return (
    <StatusScreen
      eyebrow={notFoundCopy.eyebrow}
      title="That analysis is not in your Vault."
      copy="The saved analysis may have been deleted, or the link may belong to another account. Your own saved work is always listed under Saved analyses."
      icon={<FileQuestion className="h-7 w-7" aria-hidden="true" />}
    >
      <ButtonLink href="/dashboard/analyses" size="sm">
        Saved analyses
      </ButtonLink>
      <ButtonLink href="/dashboard" variant="outline" size="sm">
        Back to the dashboard
      </ButtonLink>
    </StatusScreen>
  );
}
