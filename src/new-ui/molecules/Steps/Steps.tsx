import { cn } from "@/new-ui/utils/cn";
import * as React from "react";

export interface StepItem {
  title: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  status?: "wait" | "process" | "finish" | "error";
}

export interface StepsProps {
  current?: number;
  items: StepItem[];
  direction?: "horizontal" | "vertical";
  size?: "default" | "small";
  status?: "wait" | "process" | "finish" | "error";
  onChange?: (current: number) => void;
  className?: string;
}

export function Steps({
  current = 0,
  items,
  direction = "horizontal",
  size = "default",
  status = "process",
  onChange,
  className,
}: StepsProps): React.ReactElement {
  const getStatusColor = (stepStatus: string, index: number) => {
    if (index < current) return "finish";
    if (index === current) return status;
    return "wait";
  };

  const getColorClasses = (stepStatus: string) => {
    switch (stepStatus) {
      case "finish":
        return {
          dot: "bg-[var(--color-foreground-primary)] border-[var(--color-foreground-primary)]",
          line: "bg-[var(--color-foreground-primary)]",
          title: "text-[var(--color-foreground-primary)]",
          description: "text-[var(--color-foreground-secondary)]",
        };
      case "process":
        return {
          dot: "bg-[var(--color-foreground-primary)] border-[var(--color-foreground-primary)]",
          line: "bg-gray-300 dark:bg-gray-600",
          title: "text-[var(--color-foreground-primary)] font-medium",
          description: "text-[var(--color-foreground-secondary)]",
        };
      case "error":
        return {
          dot: "bg-red-500 border-red-500",
          line: "bg-gray-300 dark:bg-gray-600",
          title: "text-red-500 font-medium",
          description: "text-[var(--color-foreground-secondary)]",
        };
      default: // wait
        return {
          dot: "bg-gray-300 dark:bg-gray-600 border-gray-300 dark:border-gray-600",
          line: "bg-gray-300 dark:bg-gray-600",
          title: "text-[var(--color-foreground-secondary)]",
          description: "text-[var(--color-foreground-secondary)]",
        };
    }
  };

  if (direction === "vertical") {
    return (
      <div className={cn("steps-vertical", className)}>
        <div className="space-y-4">
          {items.map((item, index) => {
            const stepStatus = getStatusColor(item.status || "wait", index);
            const colors = getColorClasses(stepStatus);
            const isLast = index === items.length - 1;

            return (
              <div key={index} className="relative flex">
                {/* Step line */}
                {!isLast && (
                  <div
                    className={cn(
                      "absolute left-4 top-8 w-0.5",
                      colors.line
                    )}
                    style={{ height: "calc(100% + 1rem)" }}
                  />
                )}

                {/* Step content */}
                <div className="flex items-start space-x-4">
                  {/* Step dot */}
                  <div className="flex-shrink-0">
                    <div
                      className={cn(
                        "w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-medium",
                        colors.dot,
                        "border-white dark:border-gray-900"
                      )}
                    >
                      {item.icon || (
                        stepStatus === "finish" ? (
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : stepStatus === "error" ? (
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        ) : (
                          index + 1
                        )
                      )}
                    </div>
                  </div>

                  {/* Step content */}
                  <div className="flex-1 pb-8">
                    <div
                      className={cn("text-sm font-medium mb-1", colors.title)}
                      onClick={() => onChange?.(index)}
                      style={{ cursor: onChange ? "pointer" : "default" }}
                    >
                      {item.title}
                    </div>
                    {item.description && (
                      <div className={cn("text-xs", colors.description)}>
                        {item.description}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Horizontal direction
  return (
    <div className={cn("steps-horizontal", className)}>
      <div className="flex items-center">
        {items.map((item, index) => {
          const stepStatus = getStatusColor(item.status || "wait", index);
          const colors = getColorClasses(stepStatus);
          const isLast = index === items.length - 1;

          return (
            <div key={index} className="flex items-center flex-1">
              {/* Step content */}
              <div className="flex flex-col items-center text-center">
                {/* Step dot */}
                <div
                  className={cn(
                    "w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-medium mb-2",
                    colors.dot,
                    "border-white dark:border-gray-900"
                  )}
                  onClick={() => onChange?.(index)}
                  style={{ cursor: onChange ? "pointer" : "default" }}
                >
                  {item.icon || (
                    stepStatus === "finish" ? (
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : stepStatus === "error" ? (
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    ) : (
                      index + 1
                    )
                  )}
                </div>

                {/* Step title */}
                <div
                  className={cn("text-xs font-medium mb-1", colors.title)}
                  onClick={() => onChange?.(index)}
                  style={{ cursor: onChange ? "pointer" : "default" }}
                >
                  {item.title}
                </div>

                {/* Step description */}
                {item.description && (
                  <div className={cn("text-xs", colors.description)}>
                    {item.description}
                  </div>
                )}
              </div>

              {/* Step line */}
              {!isLast && (
                <div
                  className={cn(
                    "flex-1 h-0.5 mx-4",
                    colors.line
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Individual Step Component
export interface StepProps {
  title: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  status?: "wait" | "process" | "finish" | "error";
}

export function Step({
  title,
  description,
  icon,
  status = "wait",
}: StepProps): React.ReactElement {
  return (
    <div className="step-item">
      <div className="step-title">{title}</div>
      {description && <div className="step-description">{description}</div>}
    </div>
  );
}

