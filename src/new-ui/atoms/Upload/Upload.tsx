import { cn } from "@/new-ui/utils/cn";
import * as React from "react";

export interface UploadProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  children?: React.ReactNode;
  accept?: string;
  multiple?: boolean;
  onFileChange?: (files: FileList | null) => void;
}

export function Upload({
  className,
  children,
  accept,
  multiple = false,
  onFileChange,
  ...props
}: UploadProps): React.ReactElement {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFileChange?.(e.target.files);
  };

  return (
    <div className="relative">
      <input
        type="file"
        className="sr-only"
        accept={accept}
        multiple={multiple}
        onChange={handleFileChange}
        {...props}
      />
      <label
        className={cn(
          "flex h-10 w-full cursor-pointer items-center justify-center rounded-md border border-dashed border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700",
          className
        )}
      >
        {children || "Choose file"}
      </label>
    </div>
  );
}
