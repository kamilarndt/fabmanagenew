import { Button } from "@/new-ui/atoms/Button/Button";
import { Icon } from "@/new-ui/atoms/Icon/Icon";
import { Input } from "@/new-ui/atoms/Input/Input";
import { cn } from "@/new-ui/utils/cn";
import * as React from "react";

export interface SearchBoxProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onSearch?: (value: string) => void;
  onClear?: () => void;
  className?: string;
  disabled?: boolean;
  loading?: boolean;
}

export function SearchBox({
  placeholder = "Search...",
  value = "",
  onChange,
  onSearch,
  onClear,
  className,
  disabled = false,
  loading = false,
}: SearchBoxProps): React.ReactElement {
  const [internalValue, setInternalValue] = React.useState(value);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInternalValue(newValue);
    onChange?.(newValue);
  };

  const handleSearch = () => {
    onSearch?.(internalValue);
  };

  const handleClear = () => {
    setInternalValue("");
    onChange?.("");
    onClear?.();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className={cn("tw-relative tw-flex tw-items-center", className)}>
      <div className="tw-relative tw-flex-1">
        <Input
          type="text"
          placeholder={placeholder}
          value={internalValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          className="tw-pr-20"
        />
        {internalValue && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClear}
            className="tw-absolute tw-right-2 tw-top-1/2 tw-h-6 tw-w-6 tw--translate-y-1/2 tw-p-0"
          >
            <Icon name="x" className="tw-h-4 tw-w-4" />
          </Button>
        )}
      </div>
      <Button
        onClick={handleSearch}
        disabled={disabled || loading}
        className="tw-ml-2"
      >
        {loading ? (
          <Icon name="loader-2" className="tw-h-4 tw-w-4 tw-animate-spin" />
        ) : (
          <Icon name="search" className="tw-h-4 tw-w-4" />
        )}
      </Button>
    </div>
  );
}
