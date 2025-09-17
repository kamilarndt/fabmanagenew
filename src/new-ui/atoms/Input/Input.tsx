import { cva, type VariantProps } from "class-variance-authority";
import React, { forwardRef } from "react";
import { cn } from "../../utils/cn";

const inputVariants = cva(
  "flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "border-input",
        destructive:
          "border-destructive text-destructive focus-visible:ring-destructive",
        success: "border-green-500 text-green-700 focus-visible:ring-green-500",
        warning:
          "border-yellow-500 text-yellow-700 focus-visible:ring-yellow-500",
      },
      size: {
        default: "h-10 px-3 py-2",
        sm: "h-8 px-2 py-1 text-xs",
        lg: "h-12 px-4 py-3 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      variant,
      size,
      label,
      error,
      helperText,
      required,
      icon,
      iconPosition = "left",
      ...props
    },
    ref
  ) => {
    const inputId = React.useId();
    const errorId = React.useId();
    const helperId = React.useId();

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-foreground mb-2"
          >
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </label>
        )}

        <div className="relative">
          {icon && iconPosition === "left" && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
              {icon}
            </div>
          )}

          <input
            type={type}
            className={cn(
              inputVariants({ variant, size }),
              icon && iconPosition === "left" && "pl-10",
              icon && iconPosition === "right" && "pr-10",
              error && "border-destructive focus-visible:ring-destructive",
              className
            )}
            ref={ref}
            id={inputId}
            aria-invalid={error ? "true" : "false"}
            aria-describedby={cn(error && errorId, helperText && helperId)}
            {...props}
          />

          {icon && iconPosition === "right" && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
              {icon}
            </div>
          )}
        </div>

        {error && (
          <p
            id={errorId}
            className="mt-1 text-sm text-destructive"
            role="alert"
          >
            {error}
          </p>
        )}

        {helperText && !error && (
          <p id={helperId} className="mt-1 text-sm text-muted-foreground">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

// Search component
interface SearchProps extends Omit<InputProps, "type"> {
  onSearch?: (value: string) => void;
  loading?: boolean;
  enterButton?: boolean | React.ReactNode;
}

const Search = forwardRef<HTMLInputElement, SearchProps>(
  ({ onSearch, loading, enterButton, className, ...props }, ref) => {
    const [value, setValue] = React.useState("");

    const handleSearch = () => {
      onSearch?.(value);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        handleSearch();
      }
    };

    return (
      <div className={cn("flex", className)}>
        <input
          ref={ref}
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={props.placeholder || "Search..."}
          className={cn(
            inputVariants({ variant: props.variant, size: props.size }),
            "rounded-r-none",
            props.error && "border-destructive focus-visible:ring-destructive"
          )}
          {...props}
        />
        <button
          type="button"
          onClick={handleSearch}
          disabled={loading}
          className="px-3 py-2 border border-l-0 border-input bg-background hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 rounded-r-md"
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          ) : (
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          )}
        </button>
      </div>
    );
  }
);

Search.displayName = "Search";

// Add Search to Input
const InputWithSearch = Input as typeof Input & {
  Search: typeof Search;
};

InputWithSearch.Search = Search;

export { InputWithSearch as Input, inputVariants, Search };
