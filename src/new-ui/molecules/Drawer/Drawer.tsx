import { cn } from "@/new-ui/utils/cn";
import * as React from "react";

export interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children: React.ReactNode;
  placement?: "left" | "right" | "top" | "bottom";
  width?: number | string;
  height?: number | string;
  destroyOnClose?: boolean;
  className?: string;
  maskClosable?: boolean;
}

export function Drawer({
  open,
  onClose,
  title,
  children,
  placement = "right",
  width = 400,
  height = "100%",
  destroyOnClose = false,
  className,
  maskClosable = true,
}: DrawerProps): React.ReactElement {
  const [shouldRender, setShouldRender] = React.useState(open);

  React.useEffect(() => {
    if (open) {
      setShouldRender(true);
    } else if (destroyOnClose) {
      const timer = setTimeout(() => setShouldRender(false), 300);
      return () => clearTimeout(timer);
    }
  }, [open, destroyOnClose]);

  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const handleMaskClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && maskClosable) {
      onClose();
    }
  };

  const getDrawerStyles = () => {
    const baseStyles: React.CSSProperties = {
      backgroundColor: "var(--color-card-background)",
      borderColor: "var(--color-border-primary)",
    };

    switch (placement) {
      case "left":
        return {
          ...baseStyles,
          left: 0,
          top: 0,
          bottom: 0,
          width: typeof width === "number" ? `${width}px` : width,
        };
      case "right":
        return {
          ...baseStyles,
          right: 0,
          top: 0,
          bottom: 0,
          width: typeof width === "number" ? `${width}px` : width,
        };
      case "top":
        return {
          ...baseStyles,
          top: 0,
          left: 0,
          right: 0,
          height: typeof height === "number" ? `${height}px` : height,
        };
      case "bottom":
        return {
          ...baseStyles,
          bottom: 0,
          left: 0,
          right: 0,
          height: typeof height === "number" ? `${height}px` : height,
        };
      default:
        return baseStyles;
    }
  };

  if (!shouldRender) return null;

  return (
    <div
      className={cn(
        "fixed inset-0 z-50",
        open ? "opacity-100" : "opacity-0 pointer-events-none",
        "transition-opacity duration-300"
      )}
    >
      {/* Mask */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={handleMaskClick}
      />
      
      {/* Drawer */}
      <div
        className={cn(
          "absolute border shadow-lg transition-transform duration-300",
          placement === "left" && (open ? "translate-x-0" : "-translate-x-full"),
          placement === "right" && (open ? "translate-x-0" : "translate-x-full"),
          placement === "top" && (open ? "translate-y-0" : "-translate-y-full"),
          placement === "bottom" && (open ? "translate-y-0" : "translate-y-full"),
          className
        )}
        style={getDrawerStyles()}
      >
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: "var(--color-border-primary)" }}>
            <div className="text-lg font-semibold" style={{ color: "var(--color-foreground-primary)" }}>
              {title}
            </div>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
              style={{ color: "var(--color-foreground-secondary)" }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
        
        {/* Content */}
        <div className="p-4 h-full overflow-auto" style={{ color: "var(--color-foreground-primary)" }}>
          {children}
        </div>
      </div>
    </div>
  );
}