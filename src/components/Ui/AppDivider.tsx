import { AppDivider as ModernAppDivider } from "@/new-ui/atoms/AppDivider/AppDivider";
import React from "react";

interface AppDividerProps {
  variant?: "solid" | "dashed" | "dotted";
  spacing?: "sm" | "md" | "lg";
  color?: string;
  children?: React.ReactNode;
  type?: "horizontal" | "vertical";
  style?: React.CSSProperties;
  className?: string;
}

export function AppDivider({
  variant = "solid",
  spacing = "md",
  color,
  children,
  type = "horizontal",
  ...props
}: AppDividerProps) {
  return (
    <ModernAppDivider
      type={type}
      color={color}
      variant={variant}
      spacing={spacing}
      {...props}
    >
      {children}
    </ModernAppDivider>
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
