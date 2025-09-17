import { cn } from "@/new-ui/utils/cn";
import * as React from "react";

export interface DividerProps {
  type?: "horizontal" | "vertical";
  orientation?: "left" | "right" | "center";
  orientationMargin?: number | string;
  dashed?: boolean;
  plain?: boolean;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function Divider({
  type = "horizontal",
  orientation = "center",
  orientationMargin,
  dashed = false,
  plain = false,
  children,
  className,
  style,
}: DividerProps): React.ReactElement {
  const dividerStyle: React.CSSProperties = {
    borderColor: "var(--color-border-primary)",
    ...style,
  };

  if (type === "vertical") {
    return (
      <div
        className={cn(
          "inline-block h-full w-0 border-l border-solid",
          dashed && "border-dashed",
          className
        )}
        style={dividerStyle}
      />
    );
  }

  // Horizontal divider
  return (
    <div
      className={cn(
        "divider-horizontal flex items-center w-full my-4",
        className
      )}
    >
      {children ? (
        <>
          {/* Left line */}
          <div
            className={cn(
              "flex-1 h-0 border-t border-solid",
              dashed && "border-dashed",
              orientation === "left" && "flex-none",
              orientation === "right" && "flex-1"
            )}
            style={{
              borderColor: "var(--color-border-primary)",
              width: orientation === "left" ? orientationMargin : undefined,
            }}
          />

          {/* Content */}
          <div
            className={cn(
              "px-4 text-sm",
              !plain && "font-medium"
            )}
            style={{
              color: "var(--color-foreground-secondary)",
              whiteSpace: "nowrap",
            }}
          >
            {children}
          </div>

          {/* Right line */}
          <div
            className={cn(
              "flex-1 h-0 border-t border-solid",
              dashed && "border-dashed",
              orientation === "right" && "flex-none",
              orientation === "left" && "flex-1"
            )}
            style={{
              borderColor: "var(--color-border-primary)",
              width: orientation === "right" ? orientationMargin : undefined,
            }}
          />
        </>
      ) : (
        <div
          className={cn(
            "w-full h-0 border-t border-solid",
            dashed && "border-dashed"
          )}
          style={{ borderColor: "var(--color-border-primary)" }}
        />
      )}
    </div>
  );
}