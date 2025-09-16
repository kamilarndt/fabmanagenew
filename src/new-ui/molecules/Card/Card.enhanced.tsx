import { Icon } from "@/new-ui/atoms/Icon/Icon";
import { cn } from "@/new-ui/utils/cn";
import { cva, type VariantProps } from "@/new-ui/utils/variants";
import * as React from "react";

const cardVariants = cva(
  "tw-rounded-lg tw-border tw-bg-card tw-text-card-foreground tw-shadow-sm tw-transition-all tw-duration-200",
  {
    variants: {
      variant: {
        default: "tw-border-border hover:tw-shadow-md",
        elevated: "tw-shadow-lg hover:tw-shadow-xl tw-border-0",
        outlined: "tw-border-2 tw-border-border hover:tw-border-primary/50",
        ghost: "tw-border-0 tw-shadow-none hover:tw-bg-muted/50",
        interactive:
          "tw-cursor-pointer hover:tw-shadow-lg hover:tw-scale-[1.02] tw-transform",
      },
      size: {
        sm: "tw-p-4",
        default: "tw-p-6",
        lg: "tw-p-8",
      },
      loading: {
        true: "tw-relative tw-overflow-hidden",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      loading: false,
    },
  }
);

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  loading?: boolean;
  loadingText?: string;
}

export function Card({
  className,
  variant,
  size,
  loading,
  loadingText = "Loading...",
  children,
  ...props
}: CardProps): React.ReactElement {
  return (
    <div
      className={cn(cardVariants({ variant, size, loading }), className)}
      {...props}
    >
      {loading && (
        <div className="tw-absolute tw-inset-0 tw-flex tw-items-center tw-justify-center tw-bg-background/80 tw-backdrop-blur-sm">
          <div className="tw-flex tw-items-center tw-gap-2 tw-text-muted-foreground">
            <Icon name="loader-2" className="tw-h-4 tw-w-4 tw-animate-spin" />
            <span className="tw-text-sm">{loadingText}</span>
          </div>
        </div>
      )}
      {children}
    </div>
  );
}

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  actions?: React.ReactNode;
}

export function CardHeader({
  className,
  actions,
  children,
  ...props
}: CardHeaderProps): React.ReactElement {
  return (
    <div
      className={cn(
        "tw-flex tw-flex-col tw-space-y-1.5 tw-p-6",
        actions &&
          "tw-flex-row tw-items-center tw-justify-between tw-space-y-0",
        className
      )}
      {...props}
    >
      <div className="tw-flex-1">{children}</div>
      {actions && (
        <div className="tw-flex tw-items-center tw-gap-2">{actions}</div>
      )}
    </div>
  );
}

export interface CardTitleProps
  extends React.HTMLAttributes<HTMLHeadingElement> {
  icon?: string;
  badge?: React.ReactNode;
}

export function CardTitle({
  className,
  icon,
  badge,
  children,
  ...props
}: CardTitleProps): React.ReactElement {
  return (
    <div className="tw-flex tw-items-center tw-gap-2">
      {icon && <Icon name={icon} className="tw-h-5 tw-w-5" />}
      <h3
        className={cn(
          "tw-text-2xl tw-font-semibold tw-leading-none tw-tracking-tight",
          className
        )}
        {...props}
      >
        {children}
      </h3>
      {badge && <div className="tw-shrink-0">{badge}</div>}
    </div>
  );
}

export interface CardDescriptionProps
  extends React.HTMLAttributes<HTMLParagraphElement> {}

export function CardDescription({
  className,
  ...props
}: CardDescriptionProps): React.ReactElement {
  return (
    <p
      className={cn("tw-text-sm tw-text-muted-foreground", className)}
      {...props}
    />
  );
}

export interface CardContentProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export function CardContent({
  className,
  ...props
}: CardContentProps): React.ReactElement {
  return <div className={cn("tw-p-6 tw-pt-0", className)} {...props} />;
}

export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  justify?: "start" | "center" | "end" | "between";
}

export function CardFooter({
  className,
  justify = "end",
  ...props
}: CardFooterProps): React.ReactElement {
  const justifyClass = {
    start: "tw-justify-start",
    center: "tw-justify-center",
    end: "tw-justify-end",
    between: "tw-justify-between",
  }[justify];

  return (
    <div
      className={cn(
        "tw-flex tw-items-center tw-p-6 tw-pt-0",
        justifyClass,
        className
      )}
      {...props}
    />
  );
}

// Enhanced Card with Stats
export interface CardStatsProps extends CardProps {
  stats: Array<{
    label: string;
    value: string | number;
    change?: {
      value: number;
      type: "increase" | "decrease";
    };
    icon?: string;
  }>;
}

export function CardStats({
  stats,
  className,
  ...props
}: CardStatsProps): React.ReactElement {
  return (
    <Card className={cn("tw-p-0", className)} {...props}>
      <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 lg:tw-grid-cols-4 tw-divide-x tw-divide-border">
        {stats.map((stat, index) => (
          <div key={index} className="tw-p-6 tw-text-center">
            {stat.icon && (
              <Icon
                name={stat.icon}
                className="tw-mx-auto tw-mb-2 tw-h-6 tw-w-6 tw-text-muted-foreground"
              />
            )}
            <div className="tw-text-2xl tw-font-bold">{stat.value}</div>
            <div className="tw-text-sm tw-text-muted-foreground">
              {stat.label}
            </div>
            {stat.change && (
              <div
                className={cn(
                  "tw-mt-1 tw-text-xs tw-font-medium",
                  stat.change.type === "increase"
                    ? "tw-text-success"
                    : "tw-text-destructive"
                )}
              >
                {stat.change.type === "increase" ? "+" : "-"}
                {Math.abs(stat.change.value)}%
              </div>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}

// Card with Image
export interface CardWithImageProps extends CardProps {
  image?: string;
  imageAlt?: string;
  overlay?: boolean;
}

export function CardWithImage({
  image,
  imageAlt = "",
  overlay = false,
  children,
  className,
  ...props
}: CardWithImageProps): React.ReactElement {
  return (
    <Card className={cn("tw-overflow-hidden tw-p-0", className)} {...props}>
      {image && (
        <div className="tw-relative tw-h-48 tw-w-full">
          <img
            src={image}
            alt={imageAlt}
            className="tw-h-full tw-w-full tw-object-cover"
          />
          {overlay && (
            <div className="tw-absolute tw-inset-0 tw-bg-gradient-to-t tw-from-black/60 tw-to-transparent" />
          )}
        </div>
      )}
      <div className="tw-p-6">{children}</div>
    </Card>
  );
}
