import { PageHeader } from "@/new-ui/organisms/PageHeader/PageHeader";
import { cn } from "@/new-ui/utils/cn";
import * as React from "react";

export interface CardGridLayoutProps {
  title: string;
  description?: string;
  breadcrumbs?: Array<{ label: string; href?: string }>;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  gridCols?: 1 | 2 | 3 | 4 | 5 | 6;
}

export function CardGridLayout({
  title,
  description,
  breadcrumbs,
  actions,
  children,
  className,
  gridCols = 3,
}: CardGridLayoutProps): React.ReactElement {
  const gridClass = {
    1: "tw-grid-cols-1",
    2: "tw-grid-cols-1 md:tw-grid-cols-2",
    3: "tw-grid-cols-1 md:tw-grid-cols-2 lg:tw-grid-cols-3",
    4: "tw-grid-cols-1 md:tw-grid-cols-2 lg:tw-grid-cols-3 xl:tw-grid-cols-4",
    5: "tw-grid-cols-1 md:tw-grid-cols-2 lg:tw-grid-cols-3 xl:tw-grid-cols-4 2xl:tw-grid-cols-5",
    6: "tw-grid-cols-1 md:tw-grid-cols-2 lg:tw-grid-cols-3 xl:tw-grid-cols-4 2xl:tw-grid-cols-5 3xl:tw-grid-cols-6",
  }[gridCols];

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

      <div className={cn("tw-grid tw-gap-6", gridClass)}>{children}</div>
    </div>
  );
}
