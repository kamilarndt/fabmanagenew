import { Icon } from "@/new-ui/atoms/Icon/Icon";
import { cn } from "@/new-ui/utils/cn";
import * as React from "react";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps {
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  error?: boolean;
}

export function Select({
  options,
  value,
  onChange,
  placeholder = "Select an option...",
  className,
  disabled = false,
  error = false,
}: SelectProps): React.ReactElement {
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedValue, setSelectedValue] = React.useState(value || "");

  const selectedOption = options.find(
    (option) => option.value === selectedValue
  );

  const handleSelect = (optionValue: string) => {
    setSelectedValue(optionValue);
    onChange?.(optionValue);
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  return (
    <div className={cn("tw-relative", className)}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        className={cn(
          "tw-flex tw-h-10 tw-w-full tw-items-center tw-justify-between tw-rounded-md tw-border tw-border-input tw-bg-background tw-px-3 tw-py-2 tw-text-sm tw-ring-offset-background placeholder:tw-text-muted-foreground focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-ring focus:tw-ring-offset-2 disabled:tw-cursor-not-allowed disabled:tw-opacity-50",
          error && "tw-border-destructive focus:tw-ring-destructive"
        )}
      >
        <span
          className={cn(
            selectedOption ? "tw-text-foreground" : "tw-text-muted-foreground"
          )}
        >
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <Icon
          name={isOpen ? "chevron-up" : "chevron-down"}
          className="tw-h-4 tw-w-4 tw-opacity-50"
        />
      </button>

      {isOpen && (
        <div className="tw-absolute tw-z-50 tw-mt-1 tw-w-full tw-rounded-md tw-border tw-bg-popover tw-p-1 tw-text-popover-foreground tw-shadow-md">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleSelect(option.value)}
              disabled={option.disabled}
              className={cn(
                "tw-relative tw-flex tw-w-full tw-cursor-default tw-select-none tw-items-center tw-rounded-sm tw-py-1.5 tw-pl-8 tw-pr-2 tw-text-sm tw-outline-none focus:tw-bg-accent focus:tw-text-accent-foreground data-[disabled]:tw-pointer-events-none data-[disabled]:tw-opacity-50",
                option.value === selectedValue &&
                  "tw-bg-accent tw-text-accent-foreground"
              )}
            >
              {option.value === selectedValue && (
                <Icon
                  name="check"
                  className="tw-absolute tw-left-2 tw-h-4 tw-w-4"
                />
              )}
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
