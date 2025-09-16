import type { ProgressProps } from "antd";
import { Progress as AntProgress, ConfigProvider } from "antd";
import React from "react";

interface AppProgressProps extends Omit<ProgressProps, "size" | "type"> {
  variant?: "default" | "line" | "circle" | "dashboard";
  size?: "small" | "default" | "large";
  status?: "normal" | "success" | "exception" | "active";
  strokeColor?: string | string[];
  trailColor?: string;
  showInfo?: boolean;
}

export function AppProgress({
  variant = "line",
  size = "default",
  status = "normal",
  strokeColor,
  trailColor,
  showInfo = true,
  className,
  style,
  ...props
}: AppProgressProps) {
  const progressStyles: React.CSSProperties = {
    fontFamily: "var(--font-family)",
    ...style,
  };

  const getSizeStyles = (): React.CSSProperties => {
    switch (size) {
      case "small":
        return {
          fontSize: 12,
        };
      case "large":
        return {
          fontSize: 16,
        };
      default:
        return {
          fontSize: 14,
        };
    }
  };

  const getDefaultStrokeColor = (): string => {
    switch (status) {
      case "success":
        return "var(--accent-success)";
      case "exception":
        return "var(--accent-error)";
      case "active":
        return "var(--primary-main)";
      default:
        return "var(--primary-main)";
    }
  };

  const getDefaultTrailColor = (): string => {
    return "var(--bg-hover)";
  };

  return (
    <ConfigProvider
      theme={{
        components: {
          Progress: {
            fontFamily: "var(--font-family)",
            colorText: "var(--text-primary)",
            colorTextLightSolid: "var(--text-primary)",
            colorBgContainer: "var(--bg-hover)",
            colorSuccess: "var(--accent-success)",
            colorError: "var(--accent-error)",
            colorInfo: "var(--primary-main)",
            colorWarning: "var(--accent-warning)",
          },
        },
      }}
    >
      <AntProgress
        type={variant === "default" ? "line" : variant}
        size={size === "small" ? 20 : size === "large" ? 40 : 32}
        status={status}
        strokeColor={strokeColor || getDefaultStrokeColor()}
        trailColor={trailColor || getDefaultTrailColor()}
        showInfo={showInfo}
        className={className}
        style={{
          ...progressStyles,
          ...getSizeStyles(),
        }}
        data-component="AppProgress"
        data-variant={variant}
        data-size={size}
        data-status={status}
        {...props}
      />
    </ConfigProvider>
  );
}

// Specialized progress variants
export function AppProgressLine(props: Omit<AppProgressProps, "variant">) {
  return <AppProgress variant="line" {...props} />;
}

export function AppProgressCircle(props: Omit<AppProgressProps, "variant">) {
  return <AppProgress variant="circle" {...props} />;
}

export function AppProgressDashboard(props: Omit<AppProgressProps, "variant">) {
  return <AppProgress variant="dashboard" {...props} />;
}

export function AppProgressSmall(props: Omit<AppProgressProps, "size">) {
  return <AppProgress size="small" {...props} />;
}

export function AppProgressLarge(props: Omit<AppProgressProps, "size">) {
  return <AppProgress size="large" {...props} />;
}

export function AppProgressSuccess(props: Omit<AppProgressProps, "status">) {
  return <AppProgress status="success" {...props} />;
}

export function AppProgressError(props: Omit<AppProgressProps, "status">) {
  return <AppProgress status="exception" {...props} />;
}

export default AppProgress;
