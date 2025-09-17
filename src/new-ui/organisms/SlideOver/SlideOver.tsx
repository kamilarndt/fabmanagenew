import { Button } from "@/new-ui/atoms/Button/Button";
import { cn } from "@/new-ui/utils/cn";
import { X } from "lucide-react";
import React from "react";

export interface SlideOverProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export function SlideOver({
  open,
  onClose,
  title,
  children,
  footer,
  size = "md",
  className,
}: SlideOverProps): React.ReactElement {
  const sizeClasses = {
    sm: "tw-max-w-md",
    md: "tw-max-w-lg",
    lg: "tw-max-w-2xl",
    xl: "tw-max-w-4xl",
  };

  if (!open) return <></>;

  return (
    <>
      {/* Backdrop */}
      <div
        className="tw-fixed tw-inset-0 tw-z-50 tw-bg-black/50 tw-transition-opacity"
        onClick={onClose}
      />

      {/* Slide Over */}
      <div
        className={cn(
          "tw-fixed tw-top-0 tw-right-0 tw-z-50 tw-h-full tw-w-full tw-transform tw-transition-transform tw-duration-300 tw-ease-in-out",
          sizeClasses[size],
          className
        )}
        style={{
          backgroundColor: "var(--color-background-card)",
          borderLeft: "1px solid var(--color-border-default)",
        }}
      >
        <div className="tw-flex tw-h-full tw-flex-col">
          {/* Header */}
          <div
            className="tw-flex tw-items-center tw-justify-between tw-border-b tw-px-6 tw-py-4"
            style={{
              borderColor: "var(--color-border-default)",
            }}
          >
            <h2
              className="tw-text-lg tw-font-semibold"
              style={{ color: "var(--color-foreground-default)" }}
            >
              {title}
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="tw-h-8 tw-w-8"
              aria-label="Close"
            >
              <X className="tw-h-4 tw-w-4" />
            </Button>
          </div>

          {/* Content */}
          <div className="tw-flex-1 tw-overflow-y-auto tw-p-6">{children}</div>

          {/* Footer */}
          {footer && (
            <div
              className="tw-border-t tw-px-6 tw-py-4"
              style={{
                borderColor: "var(--color-border-default)",
                backgroundColor: "var(--color-background-muted)",
              }}
            >
              {footer}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
