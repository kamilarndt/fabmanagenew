import { cn } from "@/new-ui/utils/cn";
import * as React from "react";

export interface TimelineItem {
  key?: string;
  children: React.ReactNode;
  color?: "blue" | "red" | "green" | "gray" | "yellow";
  dot?: React.ReactNode;
  label?: React.ReactNode;
}

export interface TimelineProps {
  items: TimelineItem[];
  mode?: "left" | "alternate" | "right";
  pending?: React.ReactNode;
  reverse?: boolean;
  className?: string;
}

export function Timeline({
  items,
  mode = "left",
  pending,
  reverse = false,
  className,
}: TimelineProps): React.ReactElement {
  const sortedItems = reverse ? [...items].reverse() : items;

  const getColorClasses = (color: string) => {
    const colors = {
      blue: "bg-blue-500 border-blue-500",
      red: "bg-red-500 border-red-500",
      green: "bg-green-500 border-green-500",
      gray: "bg-gray-500 border-gray-500",
      yellow: "bg-yellow-500 border-yellow-500",
    };
    return colors[color as keyof typeof colors] || colors.gray;
  };

  return (
    <div className={cn("timeline", className)}>
      <div className="relative">
        {/* Timeline line */}
        <div
          className="absolute left-4 top-0 bottom-0 w-0.5"
          style={{ backgroundColor: "var(--color-border-primary)" }}
        />

        {sortedItems.map((item, index) => (
          <div
            key={item.key || index}
            className={cn(
              "relative flex items-start pb-8",
              mode === "right" && "flex-row-reverse",
              mode === "alternate" && (index % 2 === 0 ? "" : "flex-row-reverse")
            )}
          >
            {/* Timeline dot */}
            <div className="flex-shrink-0 relative z-10">
              {item.dot ? (
                <div className="w-8 h-8 flex items-center justify-center">
                  {item.dot}
                </div>
              ) : (
                <div
                  className={cn(
                    "w-8 h-8 rounded-full border-4 flex items-center justify-center",
                    getColorClasses(item.color || "blue"),
                    "border-white dark:border-gray-900"
                  )}
                  style={{ backgroundColor: "var(--color-card-background)" }}
                />
              )}
            </div>

            {/* Content */}
            <div
              className={cn(
                "flex-1 mx-4",
                mode === "right" && "text-right",
                mode === "alternate" && (index % 2 === 0 ? "" : "text-right")
              )}
            >
              {item.label && (
                <div
                  className="text-sm font-medium mb-2"
                  style={{ color: "var(--color-foreground-secondary)" }}
                >
                  {item.label}
                </div>
              )}
              <div
                className="p-4 rounded-lg border"
                style={{
                  backgroundColor: "var(--color-card-background)",
                  borderColor: "var(--color-border-primary)",
                  color: "var(--color-foreground-primary)",
                }}
              >
                {item.children}
              </div>
            </div>
          </div>
        ))}

        {/* Pending item */}
        {pending && (
          <div className="relative flex items-start">
            <div className="flex-shrink-0 relative z-10">
              <div
                className="w-8 h-8 rounded-full border-4 border-dashed flex items-center justify-center"
                style={{
                  borderColor: "var(--color-border-primary)",
                  backgroundColor: "var(--color-card-background)",
                }}
              >
                <div className="w-2 h-2 rounded-full bg-gray-400" />
              </div>
            </div>
            <div className="flex-1 mx-4">
              <div
                className="p-4 rounded-lg border border-dashed"
                style={{
                  backgroundColor: "var(--color-card-background)",
                  borderColor: "var(--color-border-primary)",
                  color: "var(--color-foreground-primary)",
                }}
              >
                {pending}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Individual Timeline Item Component
export interface TimelineItemProps {
  children: React.ReactNode;
  color?: "blue" | "red" | "green" | "gray" | "yellow";
  dot?: React.ReactNode;
  label?: React.ReactNode;
}

export function TimelineItem({
  children,
  color,
  dot,
  label,
}: TimelineItemProps): React.ReactElement {
  return (
    <div className="timeline-item">
      {label && (
        <div
          className="text-sm font-medium mb-2"
          style={{ color: "var(--color-foreground-secondary)" }}
        >
          {label}
        </div>
      )}
      <div
        className="p-4 rounded-lg border"
        style={{
          backgroundColor: "var(--color-card-background)",
          borderColor: "var(--color-border-primary)",
          color: "var(--color-foreground-primary)",
        }}
      >
        {children}
      </div>
    </div>
  );
}

