import { cn } from "@/new-ui/utils/cn";
import * as React from "react";

export interface DatePickerProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "onChange" | "value"
  > {
  value?: Date | string;
  onChange?: (date: Date | null) => void;
  placeholder?: string;
  format?: string;
  showTime?: boolean;
  disabled?: boolean;
  size?: "small" | "middle" | "large";
  status?: "error" | "warning";
  className?: string;
  style?: React.CSSProperties;
}

export function DatePicker({
  value,
  onChange,
  placeholder = "Select date",
  format = "YYYY-MM-DD",
  showTime = false,
  disabled = false,
  size = "middle",
  status,
  className,
  style,
  ...props
}: DatePickerProps): React.ReactElement {
  const [isOpen, setIsOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");

  React.useEffect(() => {
    if (value) {
      const date = typeof value === "string" ? new Date(value) : value;
      if (!isNaN(date.getTime())) {
        const formatted = formatDate(date, format);
        setInputValue(formatted);
      }
    } else {
      setInputValue("");
    }
  }, [value, format]);

  const formatDate = (date: Date, format: string): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    return format
      .replace("YYYY", String(year))
      .replace("MM", month)
      .replace("DD", day)
      .replace("HH", hours)
      .replace("mm", minutes)
      .replace("ss", seconds);
  };

  const parseDate = (dateString: string): Date | null => {
    if (!dateString) return null;

    const date = new Date(dateString);
    return isNaN(date.getTime()) ? null : date;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    if (value) {
      const date = parseDate(value);
      onChange?.(date);
    } else {
      onChange?.(null);
    }
  };

  const handleInputClick = () => {
    if (!disabled) {
      setIsOpen(true);
    }
  };

  const handleCalendarSelect = (date: Date) => {
    const formatted = formatDate(date, format);
    setInputValue(formatted);
    onChange?.(date);
    setIsOpen(false);
  };

  const getSizeClasses = () => {
    switch (size) {
      case "small":
        return "px-2 py-1 text-sm";
      case "large":
        return "px-4 py-3 text-lg";
      default:
        return "px-3 py-2 text-base";
    }
  };

  const getStatusClasses = () => {
    switch (status) {
      case "error":
        return "border-red-500 focus:border-red-500 focus:ring-red-500";
      case "warning":
        return "border-yellow-500 focus:border-yellow-500 focus:ring-yellow-500";
      default:
        return "border-gray-300 focus:border-blue-500 focus:ring-blue-500";
    }
  };

  return (
    <div className="relative">
      <input
        type={showTime ? "datetime-local" : "date"}
        value={inputValue}
        onChange={handleInputChange}
        onClick={handleInputClick}
        placeholder={placeholder}
        disabled={disabled}
        className={cn(
          "w-full border rounded-md shadow-sm transition-colors",
          "focus:outline-none focus:ring-2 focus:ring-opacity-50",
          getSizeClasses(),
          getStatusClasses(),
          disabled && "bg-gray-100 cursor-not-allowed",
          className
        )}
        style={style}
        {...props}
      />

      {/* Calendar icon */}
      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
        <svg
          className="w-5 h-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </div>
    </div>
  );
}
