import type { SelectProps } from "antd";
import { ConfigProvider, Select } from "antd";
import React from "react";

interface AppSelectProps<T = any> extends Omit<SelectProps<T>, "variant"> {
  variant?: "default" | "outline" | "filled";
  selectSize?: "small" | "middle" | "large";
  error?: boolean;
  helperText?: string;
  searchable?: boolean;
}

export function AppSelect<T = any>({
  variant = "default",
  selectSize = "middle",
  error = false,
  helperText,
  searchable = false,
  className,
  style,
  children,
  ...props
}: AppSelectProps<T>) {
  const selectStyles: React.CSSProperties = {
    fontFamily: "var(--font-family)",
    width: "100%",
    ...style,
  };

  return (
    <div>
      <ConfigProvider
        theme={{
          components: {
            Select: {
              borderRadius: 6,
              fontFamily: "var(--font-family)",
              colorText: "var(--text-primary)",
              colorTextPlaceholder: "var(--text-muted)",
              colorBgContainer: "var(--bg-input)",
              colorBorder: error ? "var(--accent-error)" : "var(--border-main)",
              colorPrimaryHover: "var(--primary-light)",
              colorPrimary: "var(--primary-main)",
              colorBgElevated: "var(--bg-secondary)",
              controlItemBgHover: "var(--bg-hover)",
            },
          },
        }}
      >
        <Select
          size={selectSize}
          className={className}
          style={selectStyles}
          status={error ? "error" : undefined}
          showSearch={searchable}
          optionFilterProp={searchable ? "children" : undefined}
          filterOption={
            searchable
              ? (input, option) =>
                  (option?.children as unknown as string)
                    ?.toLowerCase()
                    ?.includes(input.toLowerCase()) ?? false
              : undefined
          }
          data-component="AppSelect"
          data-variant={variant}
          data-size={selectSize}
          data-state={error ? "error" : "default"}
          {...props}
        >
          {children}
        </Select>
      </ConfigProvider>
      {helperText && (
        <div
          style={{
            fontSize: 12,
            marginTop: 4,
            color: error ? "var(--accent-error)" : "var(--text-muted)",
          }}
        >
          {helperText}
        </div>
      )}
    </div>
  );
}

// Shorthand for common select types
export function AppSelectOption({
  value,
  children,
  disabled = false,
}: {
  value: string | number;
  children: React.ReactNode;
  disabled?: boolean;
}) {
  return (
    <Select.Option value={value} disabled={disabled}>
      {children}
    </Select.Option>
  );
}

export function AppSelectOptGroup({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return <Select.OptGroup label={label}>{children}</Select.OptGroup>;
}
