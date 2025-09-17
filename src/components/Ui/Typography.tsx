import { Typography as ModernTypography } from "@/new-ui/atoms/Typography/Typography";
import React from "react";

interface TypographyBaseProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

interface HeadingProps extends TypographyBaseProps {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  color?: "primary" | "secondary" | "muted" | "danger" | "success" | "warning";
}

interface TextProps extends TypographyBaseProps {
  size?: "xs" | "sm" | "base" | "lg" | "xl";
  weight?: "normal" | "medium" | "semibold" | "bold";
  color?: "primary" | "secondary" | "muted" | "danger" | "success" | "warning";
  variant?: "body" | "caption" | "label";
}

const getColorStyle = (color?: string): React.CSSProperties => {
  const colorMap = {
    primary: { color: "var(--text-primary)" },
    secondary: { color: "var(--text-secondary)" },
    muted: { color: "var(--text-muted)" },
    danger: { color: "#ff4d4f" },
    success: { color: "#52c41a" },
    warning: { color: "#faad14" },
  } as const;
  // @ts-expect-error indexed by union
  return color ? colorMap[color] || {} : {};
};

const getSizeStyle = (size?: string): React.CSSProperties => {
  const sizeMap = {
    xs: { fontSize: 12 },
    sm: { fontSize: 14 },
    base: { fontSize: 16 },
    lg: { fontSize: 18 },
    xl: { fontSize: 20 },
  } as const;
  // @ts-expect-error indexed by union
  return size ? sizeMap[size] || {} : {};
};

const getWeightStyle = (weight?: string): React.CSSProperties => {
  const weightMap = {
    normal: { fontWeight: 400 },
    medium: { fontWeight: 500 },
    semibold: { fontWeight: 600 },
    bold: { fontWeight: 700 },
  } as const;
  // @ts-expect-error indexed by union
  return weight ? weightMap[weight] || {} : {};
};

export function H1({ children, color, className, style }: HeadingProps) {
  return (
    <ModernTypography
      variant="h1"
      className={className}
      style={{
        fontFamily: "var(--font-family)",
        ...getColorStyle(color),
        ...style,
      }}
    >
      {children}
    </ModernTypography>
  );
}

export function H2({ children, color, className, style }: HeadingProps) {
  return (
    <ModernTypography
      variant="h2"
      className={className}
      style={{
        fontFamily: "var(--font-family)",
        ...getColorStyle(color),
        ...style,
      }}
    >
      {children}
    </ModernTypography>
  );
}

export function H3({ children, color, className, style }: HeadingProps) {
  return (
    <ModernTypography
      variant="h3"
      className={className}
      style={{
        fontFamily: "var(--font-family)",
        ...getColorStyle(color),
        ...style,
      }}
    >
      {children}
    </ModernTypography>
  );
}

export function H4({ children, color, className, style }: HeadingProps) {
  return (
    <ModernTypography
      variant="h4"
      className={className}
      style={{
        fontFamily: "var(--font-family)",
        ...getColorStyle(color),
        ...style,
      }}
    >
      {children}
    </ModernTypography>
  );
}

export function H5({ children, color, className, style }: HeadingProps) {
  return (
    <ModernTypography
      variant="h5"
      className={className}
      style={{
        fontFamily: "var(--font-family)",
        ...getColorStyle(color),
        ...style,
      }}
    >
      {children}
    </ModernTypography>
  );
}

export function Body({
  children,
  size = "base",
  weight = "normal",
  color,
  variant = "body",
  className,
  style,
}: TextProps) {
  const variantStyles: React.CSSProperties = {
    ...(variant === "caption" && { fontSize: 12, color: "var(--text-muted)" }),
    ...(variant === "label" && { fontSize: 14, fontWeight: 500 }),
  };

  return (
    <ModernTypography
      variant="p"
      className={className}
      style={{
        fontFamily: "var(--font-family)",
        ...getSizeStyle(size),
        ...getWeightStyle(weight),
        ...getColorStyle(color),
        ...variantStyles,
        ...style,
      }}
    >
      {children}
    </ModernTypography>
  );
}

export function Caption({
  children,
  color = "muted",
  className,
  style,
}: TypographyBaseProps & { color?: string }) {
  return (
    <ModernTypography
      variant="span"
      className={className}
      style={{
        fontFamily: "var(--font-family)",
        fontSize: 12,
        ...getColorStyle(color),
        ...style,
      }}
    >
      {children}
    </ModernTypography>
  );
}

export function Label({
  children,
  weight = "medium",
  color,
  className,
  style,
}: TextProps) {
  return (
    <ModernTypography
      variant="span"
      className={className}
      style={{
        fontFamily: "var(--font-family)",
        fontSize: 14,
        ...getWeightStyle(weight),
        ...getColorStyle(color),
        ...style,
      }}
    >
      {children}
    </ModernTypography>
  );
}

export function AppParagraph({
  children,
  size = "base",
  color,
  className,
  style,
}: TextProps) {
  return (
    <ModernTypography
      variant="p"
      className={className}
      style={{
        fontFamily: "var(--font-family)",
        ...getSizeStyle(size),
        ...getColorStyle(color),
        ...style,
      }}
    >
      {children}
    </ModernTypography>
  );
}
