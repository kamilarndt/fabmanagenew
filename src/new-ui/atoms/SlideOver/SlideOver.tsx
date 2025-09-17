import { cn } from "@/new-ui/utils/cn";
import React from "react";

interface SlideOverProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  showCloseButton?: boolean;
}

const sizeClasses = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  full: "max-w-full",
};

export const SlideOver: React.FC<SlideOverProps> = ({
  open,
  onClose,
  title,
  children,
  className,
  size = "lg",
  showCloseButton = true,
}) => {
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

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 transition-opacity"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        onClick={onClose}
      />

      {/* SlideOver Panel */}
      <div className="absolute inset-y-0 right-0 flex max-w-full pl-10">
        <div
          className={cn(
            "relative w-screen transform transition-transform duration-300 ease-in-out",
            sizeClasses[size],
            className
          )}
          style={{
            backgroundColor: "var(--color-background-card)",
            borderLeftColor: "var(--color-border-default)",
          }}
        >
          {/* Header */}
          {title && (
            <div
              className="flex items-center justify-between border-b px-6 py-4"
              style={{ borderColor: "var(--color-border-default)" }}
            >
              <h2
                className="text-lg font-semibold"
                style={{ color: "var(--color-foreground-default)" }}
              >
                {title}
              </h2>

              {showCloseButton && (
                <button
                  onClick={onClose}
                  className="rounded-md p-2 transition-colors hover:opacity-70"
                  style={{
                    color: "var(--color-foreground-muted)",
                    backgroundColor: "transparent",
                  }}
                  aria-label="Close panel"
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </div>
          )}

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-6 py-4">{children}</div>
        </div>
      </div>
    </div>
  );
};
