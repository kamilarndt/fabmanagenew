import type { InputProps } from "antd";
import { ConfigProvider, Input } from "antd";
import React from "react";

const { TextArea } = Input;

interface AppInputProps extends Omit<InputProps, "variant"> {
  variant?: "default" | "outline" | "filled";
  inputSize?: "small" | "middle" | "large";
  error?: boolean;
  helperText?: string;
}

export function AppInput({
  variant = "default",
  inputSize = "middle",
  error = false,
  helperText,
  className,
  style,
  ...props
}: AppInputProps) {
  const inputStyles: React.CSSProperties = {
    fontFamily: "var(--font-family)",
    borderRadius: 6,
    backgroundColor: variant === "filled" ? "var(--bg-input)" : undefined,
    borderColor: error ? "var(--accent-error)" : undefined,
    ...style,
  };

  const getVariantStyles = () => {
    switch (variant) {
      case "outline":
        return {
          backgroundColor: "transparent",
          border: "1px solid var(--border-main)",
        };
      case "filled":
        return {
          backgroundColor: "var(--bg-input)",
          border: "1px solid transparent",
        };
      default:
        return {
          backgroundColor: "var(--bg-input)",
          border: "1px solid var(--border-main)",
        };
    }
  };

  return (
    <div>
      <ConfigProvider
        theme={{
          components: {
            Input: {
              borderRadius: 6,
              fontFamily: "var(--font-family)",
              colorText: "var(--text-primary)",
              colorTextPlaceholder: "var(--text-muted)",
              colorBgContainer: "var(--bg-input)",
              colorBorder: "var(--border-main)",
              colorPrimaryHover: "var(--primary-light)",
              colorPrimary: "var(--primary-main)",
            },
          },
        }}
      >
        <Input
          size={inputSize}
          className={className}
          style={{
            ...inputStyles,
            ...getVariantStyles(),
          }}
          status={error ? "error" : undefined}
          data-component="AppInput"
          data-variant={variant}
          data-size={inputSize}
          data-state={error ? "error" : "default"}
          {...props}
        />
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

interface AppTextAreaProps {
  variant?: "default" | "outline" | "filled";
  error?: boolean;
  helperText?: string;
  rows?: number;
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  autoSize?: boolean | { minRows?: number; maxRows?: number };
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onPressEnter?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  onResize?: (size: { width: number; height: number }) => void;
  className?: string;
  style?: React.CSSProperties;
  id?: string;
  name?: string;
  maxLength?: number;
  showCount?: boolean;
}

export function AppTextArea({
  variant = "default",
  error = false,
  helperText,
  className,
  style,
  ...props
}: AppTextAreaProps) {
  const textAreaStyles: React.CSSProperties = {
    fontFamily: "var(--font-family)",
    borderRadius: 6,
    borderColor: error ? "var(--accent-error)" : undefined,
    ...style,
  };

  const getVariantStyles = () => {
    switch (variant) {
      case "outline":
        return {
          backgroundColor: "transparent",
          border: "1px solid var(--border-main)",
        };
      case "filled":
        return {
          backgroundColor: "var(--bg-input)",
          border: "1px solid transparent",
        };
      default:
        return {
          backgroundColor: "var(--bg-input)",
          border: "1px solid var(--border-main)",
        };
    }
  };

  return (
    <div>
      <ConfigProvider
        theme={{
          components: {
            Input: {
              borderRadius: 6,
              fontFamily: "var(--font-family)",
              colorText: "var(--text-primary)",
              colorTextPlaceholder: "var(--text-muted)",
              colorBgContainer: "var(--bg-input)",
              colorBorder: "var(--border-main)",
              colorPrimaryHover: "var(--primary-light)",
              colorPrimary: "var(--primary-main)",
            },
          },
        }}
      >
        <TextArea
          className={className}
          style={{
            ...textAreaStyles,
            ...getVariantStyles(),
          }}
          status={error ? "error" : undefined}
          data-component="AppTextArea"
          data-variant={variant}
          data-state={error ? "error" : "default"}
          {...props}
        />
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
