import { cn } from "@/new-ui/utils/cn";
import * as React from "react";

export interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  className?: string;
}

export function Tooltip({
  content,
  children,
  side = "top",
  align = "center",
  className,
}: TooltipProps): React.ReactElement {
  const [isVisible, setIsVisible] = React.useState(false);
  const [position, setPosition] = React.useState({ x: 0, y: 0 });
  const triggerRef = React.useRef<HTMLDivElement>(null);
  const tooltipRef = React.useRef<HTMLDivElement>(null);

  const getTooltipPosition = () => {
    if (!triggerRef.current || !tooltipRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const scrollX = window.pageXOffset || document.documentElement.scrollLeft;
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;

    let x = 0;
    let y = 0;

    switch (side) {
      case "top":
        x =
          triggerRect.left +
          scrollX +
          (triggerRect.width - tooltipRect.width) / 2;
        y = triggerRect.top + scrollY - tooltipRect.height - 8;
        break;
      case "bottom":
        x =
          triggerRect.left +
          scrollX +
          (triggerRect.width - tooltipRect.width) / 2;
        y = triggerRect.bottom + scrollY + 8;
        break;
      case "left":
        x = triggerRect.left + scrollX - tooltipRect.width - 8;
        y =
          triggerRect.top +
          scrollY +
          (triggerRect.height - tooltipRect.height) / 2;
        break;
      case "right":
        x = triggerRect.right + scrollX + 8;
        y =
          triggerRect.top +
          scrollY +
          (triggerRect.height - tooltipRect.height) / 2;
        break;
    }

    // Adjust for alignment
    if (side === "top" || side === "bottom") {
      if (align === "start") x = triggerRect.left + scrollX;
      if (align === "end") x = triggerRect.right + scrollX - tooltipRect.width;
    } else {
      if (align === "start") y = triggerRect.top + scrollY;
      if (align === "end")
        y = triggerRect.bottom + scrollY - tooltipRect.height;
    }

    setPosition({ x, y });
  };

  const handleMouseEnter = () => {
    setIsVisible(true);
    setTimeout(getTooltipPosition, 0);
  };

  const handleMouseLeave = () => {
    setIsVisible(false);
  };

  return (
    <div
      ref={triggerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="tw-inline-block"
    >
      {children}
      {isVisible && (
        <div
          ref={tooltipRef}
          className={cn(
            "tw-absolute tw-z-50 tw-rounded-md tw-border tw-bg-popover tw-px-3 tw-py-1.5 tw-text-sm tw-text-popover-foreground tw-shadow-md tw-animate-in tw-fade-in-0 tw-zoom-in-95",
            className
          )}
          style={{
            left: position.x,
            top: position.y,
          }}
        >
          {content}
        </div>
      )}
    </div>
  );
}
