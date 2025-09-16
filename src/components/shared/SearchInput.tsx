import { ConfigProvider, Input } from "antd";
import React, { useCallback, useState } from "react";
import { AppInput } from "../ui/AppInput";
import { Icon } from "../ui/Icon";

const { Search } = Input;

interface SearchInputProps {
  placeholder?: string;
  onSearch?: (value: string) => void;
  onChange?: (value: string) => void;
  debounceMs?: number;
  loading?: boolean;
  disabled?: boolean;
  size?: "small" | "middle" | "large";
  variant?: "default" | "outline" | "filled";
  className?: string;
  style?: React.CSSProperties;
  allowClear?: boolean;
  enterButton?: boolean | React.ReactNode;
}

export function SearchInput({
  placeholder = "Szukaj...",
  onSearch,
  onChange,
  debounceMs = 300,
  loading = false,
  disabled = false,
  size = "middle",
  variant = "default",
  className,
  style,
  allowClear = true,
  enterButton = false,
}: SearchInputProps) {
  const [searchValue, setSearchValue] = useState("");
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(
    null
  );

  const handleSearch = useCallback(
    (value: string) => {
      if (onSearch) {
        onSearch(value);
      }
    },
    [onSearch]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setSearchValue(value);

      if (onChange) {
        onChange(value);
      }

      // Debounce search
      if (debounceMs > 0 && onSearch) {
        if (debounceTimer) {
          clearTimeout(debounceTimer);
        }

        const timer = setTimeout(() => {
          onSearch(value);
        }, debounceMs);

        setDebounceTimer(timer);
      }
    },
    [onChange, onSearch, debounceMs, debounceTimer]
  );

  const searchInputStyles: React.CSSProperties = {
    fontFamily: "var(--font-family)",
    borderRadius: 6,
    ...style,
  };

  if (enterButton) {
    return (
      <ConfigProvider
        theme={{
          components: {
            Input: {
              borderRadius: 6,
              fontFamily: "var(--font-family)",
              colorText: "var(--text-primary)",
              colorTextPlaceholder: "var(--text-muted)",
              colorBgContainer:
                variant === "filled" ? "var(--bg-input)" : "var(--bg-primary)",
              colorBorder: "var(--border-main)",
              colorPrimaryHover: "var(--primary-light)",
              colorPrimary: "var(--primary-main)",
            },
          },
        }}
      >
        <Search
          placeholder={placeholder}
          onSearch={handleSearch}
          onChange={handleChange}
          loading={loading}
          disabled={disabled}
          size={size}
          allowClear={allowClear}
          enterButton={enterButton}
          className={className}
          style={searchInputStyles}
          data-component="SearchInput"
          data-variant={variant}
          data-size={size}
        />
      </ConfigProvider>
    );
  }

  return (
    <div className={className} style={style}>
      <AppInput
        placeholder={placeholder}
        value={searchValue}
        onChange={handleChange}
        variant={variant}
        inputSize={size}
        disabled={disabled}
        allowClear={allowClear}
        prefix={
          <Icon name="SearchOutlined" size={14} color="var(--text-muted)" />
        }
        style={searchInputStyles}
        data-component="SearchInput"
        data-variant={variant}
        data-size={size}
      />
    </div>
  );
}

interface QuickSearchInputProps {
  placeholder?: string;
  onSearch?: (value: string) => void;
  debounceMs?: number;
  size?: "small" | "middle" | "large";
}

export function QuickSearchInput({
  placeholder = "Szybkie wyszukiwanie...",
  onSearch,
  debounceMs = 200,
  size = "middle",
}: QuickSearchInputProps) {
  return (
    <SearchInput
      placeholder={placeholder}
      onSearch={onSearch}
      debounceMs={debounceMs}
      size={size}
      variant="outline"
      enterButton={<Icon name="SearchOutlined" size={14} />}
    />
  );
}

interface FilterSearchInputProps {
  placeholder?: string;
  onSearch?: (value: string) => void;
  onClear?: () => void;
  size?: "small" | "middle" | "large";
}

export function FilterSearchInput({
  placeholder = "Filtruj...",
  onSearch,
  onClear,
  size = "small",
}: FilterSearchInputProps) {
  return (
    <SearchInput
      placeholder={placeholder}
      onSearch={onSearch}
      onChange={onClear ? (value) => value === "" && onClear() : undefined}
      debounceMs={150}
      size={size}
      variant="filled"
      allowClear={true}
    />
  );
}

export default SearchInput;
