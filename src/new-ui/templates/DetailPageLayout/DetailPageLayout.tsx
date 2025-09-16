import { PageHeader } from "@/new-ui/organisms/PageHeader/PageHeader";
import { cn } from "@/new-ui/utils/cn";
import * as React from "react";

export interface DetailPageLayoutProps {
  title: string;
  description?: string;
  breadcrumbs?: Array<{ label: string; href?: string }>;
  actions?: React.ReactNode;
  children: React.ReactNode;
  sidebar?: React.ReactNode;
  className?: string;
}

export function DetailPageLayout({
  title,
  description,
  breadcrumbs,
  actions,
  children,
  sidebar,
  className,
}: DetailPageLayoutProps): React.ReactElement {
  return (
    <div
      className={cn("tw-container tw-mx-auto tw-p-6 tw-space-y-6", className)}
    >
      <PageHeader
        title={title}
        description={description}
        breadcrumbs={breadcrumbs}
        actions={actions}
      />

      <div className="tw-grid tw-grid-cols-1 lg:tw-grid-cols-3 tw-gap-6">
        <div className="lg:tw-col-span-2 tw-space-y-6">{children}</div>

        {sidebar && <div className="tw-space-y-6">{sidebar}</div>}
      </div>
    </div>
  );
}
