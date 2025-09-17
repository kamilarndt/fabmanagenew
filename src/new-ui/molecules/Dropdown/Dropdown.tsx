import { cn } from "@/new-ui/utils/cn";
import * as React from "react";

export interface DropdownProps {
  children: React.ReactNode;
  menu?: {
    items: Array<{
      key: string;
      label: React.ReactNode;
      icon?: React.ReactNode;
      disabled?: boolean;
      onClick?: () => void;
      danger?: boolean;
    }>;
  };
  trigger?: "click" | "hover" | "contextMenu";
  placement?:
    | "bottomLeft"
    | "bottomRight"
    | "topLeft"
    | "topRight"
    | "bottomCenter"
    | "topCenter";
  className?: string;
  disabled?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function Dropdown({
  children,
  menu,
  trigger = "click",
  placement = "bottomLeft",
  className,
  disabled = false,
  open: controlledOpen,
  onOpenChange,
}: DropdownProps): React.ReactElement {
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const triggerRef = React.useRef<HTMLDivElement>(null);

  const isOpenState = controlledOpen !== undefined ? controlledOpen : isOpen;

  const handleOpenChange = (newOpen: boolean) => {
    if (controlledOpen === undefined) {
      setIsOpen(newOpen);
    }
    onOpenChange?.(newOpen);
  };

  const handleTriggerClick = () => {
    if (trigger === "click" && !disabled) {
      handleOpenChange(!isOpenState);
    }
  };

  const handleTriggerHover = () => {
    if (trigger === "hover" && !disabled) {
      handleOpenChange(true);
    }
  };

  const handleTriggerLeave = () => {
    if (trigger === "hover" && !disabled) {
      handleOpenChange(false);
    }
  };

  const handleMenuItemClick = (item: any) => {
    if (!item.disabled) {
      item.onClick?.();
      handleOpenChange(false);
    }
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    if (trigger === "contextMenu" && !disabled) {
      e.preventDefault();
      handleOpenChange(true);
    }
  };

  const getPlacementClasses = () => {
    switch (placement) {
      case "bottomLeft":
        return "top-full left-0";
      case "bottomRight":
        return "top-full right-0";
      case "topLeft":
        return "bottom-full left-0";
      case "topRight":
        return "bottom-full right-0";
      case "bottomCenter":
        return "top-full left-1/2 transform -translate-x-1/2";
      case "topCenter":
        return "bottom-full left-1/2 transform -translate-x-1/2";
      default:
        return "top-full left-0";
    }
  };

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        handleOpenChange(false);
      }
    };

    if (isOpenState) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpenState]);

  return (
    <div className={cn("relative", className)} ref={dropdownRef}>
      <div
        ref={triggerRef}
        onClick={handleTriggerClick}
        onMouseEnter={handleTriggerHover}
        onMouseLeave={handleTriggerLeave}
        onContextMenu={handleContextMenu}
        className={cn(
          "inline-block",
          disabled && "opacity-50 cursor-not-allowed"
        )}
      >
        {children}
      </div>

      {isOpenState && menu && (
        <div
          className={cn(
            "absolute z-50 min-w-[120px] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg",
            getPlacementClasses()
          )}
        >
          <div className="py-1">
            {menu.items.map((item) => (
              <button
                key={item.key}
                onClick={() => handleMenuItemClick(item)}
                disabled={item.disabled}
                className={cn(
                  "w-full px-4 py-2 text-left text-sm transition-colors",
                  "hover:bg-gray-100 dark:hover:bg-gray-700",
                  "disabled:opacity-50 disabled:cursor-not-allowed",
                  item.danger &&
                    "text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20",
                  !item.danger && "text-gray-700 dark:text-gray-300"
                )}
              >
                <div className="flex items-center gap-2">
                  {item.icon && (
                    <span className="flex-shrink-0">{item.icon}</span>
                  )}
                  <span>{item.label}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
