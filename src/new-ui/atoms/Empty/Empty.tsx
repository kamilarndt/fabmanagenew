import { cn } from "@/new-ui/utils/cn";
import * as React from "react";

export interface EmptyProps extends React.HTMLAttributes<HTMLDivElement> {
  description?: string;
  image?: React.ReactNode;
  children?: React.ReactNode;
}

export function Empty({
  className,
  description = "No data",
  image,
  children,
  ...props
}: EmptyProps): React.ReactElement {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-12 px-4 text-center",
        className
      )}
      {...props}
    >
      {image || (
        <div className="mb-4 h-24 w-24 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
          <svg
            className="h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
      )}
      <p className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
        {description}
      </p>
      {children}
    </div>
  );
}
