import { cn } from "@/new-ui/utils/cn";
import * as React from "react";

export interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  children?: React.ReactNode;
  fields?: any[];
  layout?: "horizontal" | "vertical" | "inline";
  size?: "small" | "middle" | "large";
  disabled?: boolean;
  loading?: boolean;
  submitText?: string;
  cancelText?: string;
  showSubmit?: boolean;
  showReset?: boolean;
  onSubmit?: (data: any) => void;
  onCancel?: () => void;
}

export function Form({
  className,
  children,
  layout = "vertical",
  size = "middle",
  disabled = false,
  showSubmit = true,
  showReset = false,
  submitText = "Submit",
  cancelText = "Cancel",
  onSubmit,
  onCancel,
  ...props
}: FormProps): React.ReactElement {
  const layoutClasses = {
    horizontal: "tw-flex tw-flex-row tw-items-center tw-space-x-4",
    vertical: "tw-flex tw-flex-col tw-space-y-4",
    inline: "tw-flex tw-flex-row tw-items-center tw-space-x-2",
  };

  const sizeClasses = {
    small: "tw-text-sm",
    middle: "tw-text-base",
    large: "tw-text-lg",
  };

  return (
    <form
      className={cn(
        layoutClasses[layout],
        sizeClasses[size],
        disabled && "tw-opacity-50 tw-pointer-events-none",
        className
      )}
      onSubmit={onSubmit}
      {...props}
    >
      {children}
      {showSubmit && (
        <div className="tw-flex tw-justify-end tw-space-x-2 tw-mt-4">
          {showReset && (
            <button
              type="reset"
              className="tw-px-4 tw-py-2 tw-text-sm tw-font-medium tw-text-gray-700 tw-bg-white tw-border tw-border-gray-300 tw-rounded-md tw-shadow-sm hover:tw-bg-gray-50 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-offset-2 focus:tw-ring-indigo-500"
            >
              Reset
            </button>
          )}
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="tw-px-4 tw-py-2 tw-text-sm tw-font-medium tw-text-gray-700 tw-bg-white tw-border tw-border-gray-300 tw-rounded-md tw-shadow-sm hover:tw-bg-gray-50 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-offset-2 focus:tw-ring-indigo-500"
            >
              {cancelText}
            </button>
          )}
          <button
            type="submit"
            disabled={disabled}
            className="tw-px-4 tw-py-2 tw-text-sm tw-font-medium tw-text-white tw-bg-indigo-600 tw-border tw-border-transparent tw-rounded-md tw-shadow-sm hover:tw-bg-indigo-700 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-offset-2 focus:tw-ring-indigo-500 disabled:tw-opacity-50 disabled:tw-cursor-not-allowed"
          >
            {submitText}
          </button>
        </div>
      )}
    </form>
  );
}

export interface FormItemProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}

export function FormItem({
  className,
  label,
  required = false,
  error,
  children,
  ...props
}: FormItemProps): React.ReactElement {
  return (
    <div className={cn("tw-space-y-2", className)} {...props}>
      {label && (
        <label className="tw-block tw-text-sm tw-font-medium tw-text-gray-700 dark:tw-text-gray-300">
          {label}
          {required && <span className="tw-text-red-500 tw-ml-1">*</span>}
        </label>
      )}
      {children}
      {error && <p className="tw-text-sm tw-text-red-500">{error}</p>}
    </div>
  );
}
