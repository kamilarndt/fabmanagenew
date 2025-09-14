import type { DividerProps } from "antd";
import { ConfigProvider, Divider } from "antd";
import React from "react";

interface AppDividerProps extends DividerProps {
  variant?: "solid" | "dashed" | "dotted";
  spacing?: "sm" | "md" | "lg";
  color?: string;
}

export function AppDivider({
  variant = "solid",
  spacing = "md",
  color,
  children,
  type = "horizontal",
  ...props
}: AppDividerProps) {
  const spacingMap: Record<string, React.CSSProperties> = {
    sm: type === "horizontal" ? { margin: "8px 0" } : { margin: "0 8px" },
    md: type === "horizontal" ? { margin: "16px 0" } : { margin: "0 16px" },
    lg: type === "horizontal" ? { margin: "24px 0" } : { margin: "0 24px" },
  };

  const dividerStyles: React.CSSProperties = {
    fontFamily: "var(--font-family)",
    ...spacingMap[spacing],
    ...(variant ? { borderStyle: variant as any } : {}),
  };

  return (
    <ConfigProvider>
      <Divider type={type} style={dividerStyles} {...props}>
        {children}
      </Divider>
    </ConfigProvider>
  );
}

export function HorizontalDivider(props: Omit<AppDividerProps, "type">) {
  return <AppDivider type="horizontal" {...props} />;
}

export function VerticalDivider(props: Omit<AppDividerProps, "type">) {
  return <AppDivider type="vertical" {...props} />;
}

export function SectionDivider({
  title,
  ...props
}: Omit<AppDividerProps, "children"> & { title?: string }) {
  return (
    <AppDivider spacing="lg" {...props}>
      {title}
    </AppDivider>
  );
}

export default AppDivider;
