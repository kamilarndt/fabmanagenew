import { cn } from "@/new-ui/utils/cn";
import * as React from "react";

export interface PopoverProps {
  trigger: React.ReactNode;
  content: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  className?: string;
  closeOnClickOutside?: boolean;
}

export function Popover({
  trigger,
  content,
  open: controlledOpen,
  onOpenChange,
  side = "bottom",
  align = "center",
  className,
  closeOnClickOutside = true,
}: PopoverProps): React.ReactElement {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const [position, setPosition] = React.useState({ x: 0, y: 0 });
  const triggerRef = React.useRef<HTMLDivElement>(null);
  const popoverRef = React.useRef<HTMLDivElement>(null);

  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;

  const getPopoverPosition = () => {
    if (!triggerRef.current || !popoverRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const popoverRect = popoverRef.current.getBoundingClientRect();
    const scrollX = window.pageXOffset || document.documentElement.scrollLeft;
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;

    let x = 0;
    let y = 0;

    switch (side) {
      case "top":
        x =
          triggerRect.left +
          scrollX +
          (triggerRect.width - popoverRect.width) / 2;
        y = triggerRect.top + scrollY - popoverRect.height - 8;
        break;
      case "bottom":
        x =
          triggerRect.left +
          scrollX +
          (triggerRect.width - popoverRect.width) / 2;
        y = triggerRect.bottom + scrollY + 8;
        break;
      case "left":
        x = triggerRect.left + scrollX - popoverRect.width - 8;
        y =
          triggerRect.top +
          scrollY +
          (triggerRect.height - popoverRect.height) / 2;
        break;
      case "right":
        x = triggerRect.right + scrollX + 8;
        y =
          triggerRect.top +
          scrollY +
          (triggerRect.height - popoverRect.height) / 2;
        break;
    }

    // Adjust for alignment
    if (side === "top" || side === "bottom") {
      if (align === "start") x = triggerRect.left + scrollX;
      if (align === "end") x = triggerRect.right + scrollX - popoverRect.width;
    } else {
      if (align === "start") y = triggerRect.top + scrollY;
      if (align === "end")
        y = triggerRect.bottom + scrollY - popoverRect.height;
    }

    setPosition({ x, y });
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (controlledOpen === undefined) {
      setInternalOpen(newOpen);
    }
    onOpenChange?.(newOpen);
  };

  const handleTriggerClick = () => {
    handleOpenChange(!isOpen);
  };

  const handleClickOutside = (e: MouseEvent) => {
    if (
      closeOnClickOutside &&
      popoverRef.current &&
      !popoverRef.current.contains(e.target as Node) &&
      triggerRef.current &&
      !triggerRef.current.contains(e.target as Node)
    ) {
      handleOpenChange(false);
    }
  };

  React.useEffect(() => {
    if (isOpen) {
      setTimeout(getPopoverPosition, 0);
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="tw-relative tw-inline-block">
      <div ref={triggerRef} onClick={handleTriggerClick}>
        {trigger}
      </div>
      {isOpen && (
        <div
          ref={popoverRef}
          className={cn(
            "tw-absolute tw-z-50 tw-w-72 tw-rounded-md tw-border tw-bg-popover tw-p-4 tw-text-popover-foreground tw-shadow-md tw-outline-none tw-animate-in tw-fade-in-0 tw-zoom-in-95",
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
