import { cn } from "@/new-ui/utils/cn";
import * as React from "react";

export interface LoadingSpinnerOldProps
  extends React.HTMLAttributes<HTMLDivElement> {
  size?: "small" | "default" | "large";
  spinning?: boolean;
  tip?: string;
  delay?: number;
  indicator?: React.ReactNode;
}

export function LoadingSpinnerOld({
  className,
  size = "default",
  spinning = true,
  tip,
  delay = 0,
  indicator,
  ...props
}: LoadingSpinnerOldProps): React.ReactElement {
  const [delayedSpinning, setDelayedSpinning] = React.useState(
    spinning && delay === 0
  );

  React.useEffect(() => {
    if (delay > 0) {
      const timer = setTimeout(() => {
        setDelayedSpinning(spinning);
      }, delay);
      return () => clearTimeout(timer);
    } else {
      setDelayedSpinning(spinning);
    }
  }, [spinning, delay]);

  const sizeClasses = {
    small: "h-4 w-4",
    default: "h-8 w-8",
    large: "h-12 w-12",
  };

  const spinner = indicator || (
    <div
      className={cn(
        "animate-spin rounded-full border-2 border-gray-300 border-t-indigo-600",
        sizeClasses[size]
      )}
    />
  );

  if (!delayedSpinning) {
    return <></>;
  }

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center space-y-2",
        className
      )}
      {...props}
    >
      {spinner}
      {tip && <p className="text-sm text-gray-600 dark:text-gray-400">{tip}</p>}
    </div>
  );
}
