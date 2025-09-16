import { ConfigProvider, Input } from "antd";
import React, { useCallback, useEffect, useState } from "react";
import { Icon } from "../ui/Icon";

const { Search } = Input;

interface SearchInputProps {
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  onSearch?: (value: string) => void;
  onChange?: (value: string) => void;
  onClear?: () => void;
  loading?: boolean;
  disabled?: boolean;
  size?: "small" | "middle" | "large";
  allowClear?: boolean;
  debounceMs?: number;
  variant?: "outlined" | "filled" | "borderless";
  showSearchButton?: boolean;
  searchButtonText?: string;
  className?: string;
  style?: React.CSSProperties;
}

export function SearchInput({
  value,
  defaultValue,
  placeholder = "Szukaj...",
  onSearch,
  onChange,
  onClear,
  loading = false,
  disabled = false,
  size = "middle",
  allowClear = true,
  debounceMs = 300,
  variant = "outlined",
  showSearchButton = true,
  searchButtonText = "Szukaj",
  className,
  style,
}: SearchInputProps) {
  const [internalValue, setInternalValue] = useState(
    value || defaultValue || ""
  );
  const [debouncedValue, setDebouncedValue] = useState(internalValue);

  // Debounce effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(internalValue);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [internalValue, debounceMs]);

  // Call onChange when debounced value changes
  useEffect(() => {
    if (onChange && debouncedValue !== (value || defaultValue || "")) {
      onChange(debouncedValue);
    }
  }, [debouncedValue, onChange, value, defaultValue]);

  // Update internal value when external value changes
  useEffect(() => {
    if (value !== undefined) {
      setInternalValue(value);
    }
  }, [value]);

  const handleSearch = useCallback(
    (searchValue: string) => {
      if (onSearch) {
        onSearch(searchValue);
      }
    },
    [onSearch]
  );

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setInternalValue(e.target.value);
  }, []);

  const handleClear = useCallback(() => {
    setInternalValue("");
    if (onClear) {
      onClear();
    }
  }, [onClear]);

  const getVariantStyles = (): React.CSSProperties => {
    switch (variant) {
      case "filled":
        return {
          backgroundColor: "var(--bg-secondary)",
          border: "none",
        };
      case "borderless":
        return {
          border: "none",
          boxShadow: "none",
        };
      default:
        return {};
    }
  };

  const inputStyles: React.CSSProperties = {
    fontFamily: "var(--font-family)",
    ...getVariantStyles(),
    ...style,
  };

  return (
    <ConfigProvider
      theme={{
        components: {
          Input: {
            borderRadius: 6,
            fontFamily: "var(--font-family)",
          },
        },
      }}
    >
      <Search
        value={internalValue}
        placeholder={placeholder}
        allowClear={allowClear}
        enterButton={showSearchButton ? searchButtonText : false}
        size={size}
        loading={loading}
        disabled={disabled}
        onSearch={handleSearch}
        onChange={handleChange}
        onClear={handleClear}
        className={className}
        style={inputStyles}
        prefix={
          <Icon name="SearchOutlined" size={14} color="var(--text-muted)" />
        }
      />
    </ConfigProvider>
  );
}

// Simplified variant for quick usage
interface QuickSearchProps {
  onSearch: (value: string) => void;
  placeholder?: string;
  className?: string;
  style?: React.CSSProperties;
}

export function QuickSearch({
  onSearch,
  placeholder = "Szukaj...",
  className,
  style,
}: QuickSearchProps) {
  return (
    <SearchInput
      onSearch={onSearch}
      placeholder={placeholder}
      showSearchButton={false}
      allowClear
      size="middle"
      className={className}
      style={style}
    />
  );
}

// Search with filters
interface SearchWithFiltersProps extends SearchInputProps {
  filters?: React.ReactNode;
  filtersPosition?: "left" | "right";
}

export function SearchWithFilters({
  filters,
  filtersPosition = "right",
  ...searchProps
}: SearchWithFiltersProps) {
  return (
    <div
      style={{
        display: "flex",
        gap: 12,
        alignItems: "center",
        flexWrap: "wrap",
      }}
    >
      {filtersPosition === "left" && filters && (
        <div style={{ display: "flex", gap: 8 }}>{filters}</div>
      )}

      <SearchInput {...searchProps} style={{ flex: 1, ...searchProps.style }} />

      {filtersPosition === "right" && filters && (
        <div style={{ display: "flex", gap: 8 }}>{filters}</div>
      )}
    </div>
  );
}

export default SearchInput;
