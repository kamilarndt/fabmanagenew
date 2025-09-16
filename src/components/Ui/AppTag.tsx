import type { TagProps } from "antd";
import { Tag as AntTag, ConfigProvider } from "antd";
import React from "react";

interface AppTagProps extends TagProps {
  variant?: "default" | "outlined" | "filled";
  size?: "small" | "default" | "large";
  color?:
    | "primary"
    | "success"
    | "warning"
    | "error"
    | "info"
    | "default"
    | string;
  closable?: boolean;
  onClose?: () => void;
}

export function AppTag({
  variant = "default",
  size = "default",
  color = "default",
  closable = false,
  onClose,
  className,
  style,
  children,
  ...props
}: AppTagProps) {
  const tagStyles: React.CSSProperties = {
    fontFamily: "var(--font-family)",
    borderRadius: 6,
    ...style,
  };

  const getSizeStyles = (): React.CSSProperties => {
    switch (size) {
      case "small":
        return {
          fontSize: 12,
          paddingInline: 6,
          height: 20,
        };
      case "large":
        return {
          fontSize: 14,
          paddingInline: 12,
          height: 32,
        };
      default:
        return {
          fontSize: 12,
          paddingInline: 8,
          height: 24,
        };
    }
  };

  const getColorValue = (): string => {
    switch (color) {
      case "primary":
        return "var(--primary-main)";
      case "success":
        return "var(--accent-success)";
      case "warning":
        return "var(--accent-warning)";
      case "error":
        return "var(--accent-error)";
      case "info":
        return "var(--accent-info)";
      case "default":
        return "var(--text-muted)";
      default:
        return color;
    }
  };

  return (
    <ConfigProvider
      theme={{
        components: {
          Tag: {
            borderRadius: 6,
            fontFamily: "var(--font-family)",
            colorText: "var(--text-primary)",
            colorTextLightSolid: "var(--text-primary)",
            colorBorder: "var(--border-main)",
          },
        },
      }}
    >
      <AntTag
        color={getColorValue()}
        closable={closable}
        onClose={onClose}
        className={className}
        style={{
          ...tagStyles,
          ...getSizeStyles(),
        }}
        data-component="AppTag"
        data-variant={variant}
        data-size={size}
        data-color={color}
        {...props}
      >
        {children}
      </AntTag>
    </ConfigProvider>
  );
}

// Specialized tag variants
export function StatusTag({
  status,
  ...props
}: { status: string } & Omit<AppTagProps, "color">) {
  const getStatusColor = (status: string): string => {
    const statusLower = status.toLowerCase();
    if (statusLower.includes("active") || statusLower.includes("aktywny"))
      return "success";
    if (statusLower.includes("pending") || statusLower.includes("oczekuje"))
      return "warning";
    if (statusLower.includes("completed") || statusLower.includes("ukończony"))
      return "primary";
    if (statusLower.includes("error") || statusLower.includes("błąd"))
      return "error";
    if (statusLower.includes("cancelled") || statusLower.includes("anulowany"))
      return "default";
    return "default";
  };

  return (
    <AppTag color={getStatusColor(status)} {...props}>
      {status}
    </AppTag>
  );
}

export function PriorityTag({
  priority,
  ...props
}: { priority: string } & Omit<AppTagProps, "color">) {
  const getPriorityColor = (priority: string): string => {
    const priorityLower = priority.toLowerCase();
    if (priorityLower.includes("high") || priorityLower.includes("wysoki"))
      return "error";
    if (priorityLower.includes("medium") || priorityLower.includes("średni"))
      return "warning";
    if (priorityLower.includes("low") || priorityLower.includes("niski"))
      return "success";
    return "default";
  };

  return (
    <AppTag color={getPriorityColor(priority)} {...props}>
      {priority}
    </AppTag>
  );
}

export default AppTag;
