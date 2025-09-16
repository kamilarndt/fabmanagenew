import type { SpaceProps } from "antd";
import { Space as AntSpace, ConfigProvider } from "antd";
import React from "react";

interface AppSpaceProps extends SpaceProps {
  variant?: "horizontal" | "vertical";
  size?: "small" | "middle" | "large" | number;
  align?: "start" | "end" | "center" | "baseline";
  wrap?: boolean;
  split?: React.ReactNode;
  direction?: "horizontal" | "vertical";
}

export function AppSpace({
  variant = "horizontal",
  size = "middle",
  align,
  wrap = false,
  split,
  direction = "horizontal",
  className,
  style,
  children,
  ...props
}: AppSpaceProps) {
  const spaceStyles: React.CSSProperties = {
    fontFamily: "var(--font-family)",
    ...style,
  };

  const getSizeValue = () => {
    if (typeof size === "number") return size;
    switch (size) {
      case "small":
        return 8;
      case "large":
        return 24;
      default:
        return 16; // middle
    }
  };

  return (
    <ConfigProvider>
      <AntSpace
        size={getSizeValue()}
        align={align}
        wrap={wrap}
        split={split}
        direction={direction}
        className={className}
        style={spaceStyles}
        data-component="AppSpace"
        data-variant={variant}
        data-size={size}
        data-direction={direction}
        {...props}
      >
        {children}
      </AntSpace>
    </ConfigProvider>
  );
}

// Specialized space variants
export function AppSpaceHorizontal(props: Omit<AppSpaceProps, "direction">) {
  return <AppSpace direction="horizontal" {...props} />;
}

export function AppSpaceVertical(props: Omit<AppSpaceProps, "direction">) {
  return <AppSpace direction="vertical" {...props} />;
}

export function AppSpaceSmall(props: AppSpaceProps) {
  return <AppSpace size="small" {...props} />;
}

export function AppSpaceLarge(props: AppSpaceProps) {
  return <AppSpace size="large" {...props} />;
}

export default AppSpace;
