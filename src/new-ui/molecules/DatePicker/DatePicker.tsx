import { cn } from "@/new-ui/utils/cn";
import React from "react";

interface DatePickerProps {
  value?: any; // dayjs object
  onChange?: (date: any) => void;
  placeholder?: string;
  className?: string;
  style?: React.CSSProperties;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  placeholder = "Select date",
  className,
  style,
}) => {
  return (
    <input
      type="date"
      value={value ? value.format("YYYY-MM-DD") : ""}
      onChange={(e) => {
        if (onChange && e.target.value) {
          // This is a simplified implementation
          // In a real app, you'd use dayjs or another date library
          const date = new Date(e.target.value);
          onChange({ toDate: () => date });
        }
      }}
      placeholder={placeholder}
      className={cn(
        "px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
        className
      )}
      style={style}
    />
  );
};
