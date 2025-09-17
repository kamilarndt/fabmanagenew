import { Button } from "@/new-ui/atoms/Button/Button";
import { Icon } from "@/new-ui/atoms/Icon/Icon";
import { cn } from "@/new-ui/utils/cn";
import * as React from "react";

export interface SheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  side?: "left" | "right" | "top" | "bottom";
  size?: "sm" | "md" | "lg" | "xl" | "full";
}

export function Sheet({
  open,
  onOpenChange,
  title,
  description,
  children,
  className,
  side = "right",
  size = "md",
}: SheetProps): React.ReactElement {
  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onOpenChange(false);
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return side === "left" || side === "right" ? "tw-w-80" : "tw-h-80";
      case "md":
        return side === "left" || side === "right" ? "tw-w-96" : "tw-h-96";
      case "lg":
        return side === "left" || side === "right"
          ? "tw-w-[32rem]"
          : "tw-h-[32rem]";
      case "xl":
        return side === "left" || side === "right"
          ? "tw-w-[40rem]"
          : "tw-h-[40rem]";
      case "full":
        return side === "left" || side === "right" ? "tw-w-full" : "tw-h-full";
      default:
        return side === "left" || side === "right" ? "tw-w-96" : "tw-h-96";
    }
  };

  const getSideClasses = () => {
    switch (side) {
      case "left":
        return "tw-left-0 tw-top-0 tw-h-full";
      case "right":
        return "tw-right-0 tw-top-0 tw-h-full";
      case "top":
        return "tw-top-0 tw-left-0 tw-w-full";
      case "bottom":
        return "tw-bottom-0 tw-left-0 tw-w-full";
      default:
        return "tw-right-0 tw-top-0 tw-h-full";
    }
  };

  if (!open) return null as unknown as React.ReactElement;

  return (
    <div className="tw-fixed tw-inset-0 tw-z-50">
      {/* Backdrop */}
      <div
        className="tw-absolute tw-inset-0 tw-bg-black/50 tw-transition-opacity"
        onClick={handleBackdropClick}
      />

      {/* Sheet */}
      <div
        className={cn(
          "tw-absolute tw-bg-background tw-border tw-shadow-lg tw-transition-transform tw-duration-300 tw-ease-in-out",
          getSideClasses(),
          getSizeClasses(),
          className
        )}
      >
        {/* Header */}
        {(title || description) && (
          <div className="tw-flex tw-items-center tw-justify-between tw-border-b tw-p-6">
            <div className="tw-space-y-1">
              {title && (
                <h2 className="tw-text-lg tw-font-semibold tw-tracking-tight">
                  {title}
                </h2>
              )}
              {description && (
                <p className="tw-text-sm tw-text-muted-foreground">
                  {description}
                </p>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onOpenChange(false)}
            >
              <Icon name="x" className="tw-h-4 tw-w-4" />
            </Button>
          </div>
        )}

        {/* Content */}
        <div className="tw-flex-1 tw-overflow-auto tw-p-6">{children}</div>
      </div>
    </div>
  );
}
