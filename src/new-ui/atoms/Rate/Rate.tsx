import { cn } from "@/new-ui/utils/cn";
import * as React from "react";

export interface RateProps {
  value?: number;
  defaultValue?: number;
  count?: number;
  allowHalf?: boolean;
  allowClear?: boolean;
  disabled?: boolean;
  character?: React.ReactNode;
  onChange?: (value: number) => void;
  onHoverChange?: (value: number) => void;
  className?: string;
  style?: React.CSSProperties;
}

export function Rate({
  value,
  defaultValue = 0,
  count = 5,
  allowHalf = false,
  allowClear = true,
  disabled = false,
  character = "★",
  onChange,
  onHoverChange,
  className,
  style,
}: RateProps): React.ReactElement {
  const [internalValue, setInternalValue] = React.useState(defaultValue);
  const [hoverValue, setHoverValue] = React.useState<number | null>(null);

  const currentValue = value !== undefined ? value : internalValue;
  const displayValue = hoverValue !== null ? hoverValue : currentValue;

  const handleClick = (index: number, isHalf: boolean = false) => {
    if (disabled) return;

    const newValue = isHalf ? index + 0.5 : index + 1;
    
    // If allowClear and clicking the same value, clear it
    if (allowClear && newValue === currentValue) {
      const clearedValue = 0;
      if (value === undefined) {
        setInternalValue(clearedValue);
      }
      onChange?.(clearedValue);
    } else {
      if (value === undefined) {
        setInternalValue(newValue);
      }
      onChange?.(newValue);
    }
  };

  const handleMouseEnter = (index: number, isHalf: boolean = false) => {
    if (disabled) return;

    const newValue = isHalf ? index + 0.5 : index + 1;
    setHoverValue(newValue);
    onHoverChange?.(newValue);
  };

  const handleMouseLeave = () => {
    setHoverValue(null);
  };

  const renderStar = (index: number) => {
    const isActive = displayValue > index;
    const isHalfActive = allowHalf && displayValue > index && displayValue < index + 1;

    return (
      <span
        key={index}
        className={cn(
          "inline-block text-2xl cursor-pointer transition-colors duration-200",
          disabled && "cursor-not-allowed",
          isActive && !isHalfActive && "text-yellow-400",
          !isActive && "text-gray-300 dark:text-gray-600",
          !disabled && "hover:text-yellow-400"
        )}
        onClick={() => handleClick(index)}
        onMouseEnter={() => handleMouseEnter(index)}
        onMouseLeave={handleMouseLeave}
        style={{
          color: isActive && !isHalfActive ? "#fbbf24" : isHalfActive ? "#fbbf24" : "var(--color-border-primary)",
        }}
      >
        {character}
      </span>
    );
  };

  const renderHalfStar = (index: number) => {
    const isActive = displayValue > index;
    const isHalfActive = allowHalf && displayValue > index && displayValue < index + 1;

    return (
      <span
        key={index}
        className="relative inline-block text-2xl cursor-pointer transition-colors duration-200"
        onMouseLeave={handleMouseLeave}
      >
        {/* Full star (background) */}
        <span
          className={cn(
            "absolute inset-0",
            isActive && !isHalfActive && "text-yellow-400",
            !isActive && "text-gray-300 dark:text-gray-600"
          )}
          onClick={() => handleClick(index)}
          onMouseEnter={() => handleMouseEnter(index)}
          style={{
            color: isActive && !isHalfActive ? "#fbbf24" : "var(--color-border-primary)",
          }}
        >
          {character}
        </span>

        {/* Half star (foreground) */}
        <span
          className={cn(
            "absolute inset-0 overflow-hidden",
            isHalfActive && "text-yellow-400"
          )}
          onClick={() => handleClick(index, true)}
          onMouseEnter={() => handleMouseEnter(index, true)}
          style={{
            color: isHalfActive ? "#fbbf24" : "transparent",
            width: "50%",
          }}
        >
          {character}
        </span>
      </span>
    );
  };

  return (
    <div
      className={cn("rate-container flex items-center space-x-1", className)}
      style={style}
      onMouseLeave={handleMouseLeave}
    >
      {Array.from({ length: count }, (_, index) =>
        allowHalf ? renderHalfStar(index) : renderStar(index)
      )}
    </div>
  );
}

