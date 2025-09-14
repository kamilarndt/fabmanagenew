import { Typography as AntTypography } from "antd";
import React from "react";

const { Title, Text, Paragraph } = AntTypography;

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
    <Title
      level={1}
      className={className}
      style={{
        fontFamily: "var(--font-family)",
        ...getColorStyle(color),
        ...style,
      }}
    >
      {children}
    </Title>
  );
}

export function H2({ children, color, className, style }: HeadingProps) {
  return (
    <Title
      level={2}
      className={className}
      style={{
        fontFamily: "var(--font-family)",
        ...getColorStyle(color),
        ...style,
      }}
    >
      {children}
    </Title>
  );
}

export function H3({ children, color, className, style }: HeadingProps) {
  return (
    <Title
      level={3}
      className={className}
      style={{
        fontFamily: "var(--font-family)",
        ...getColorStyle(color),
        ...style,
      }}
    >
      {children}
    </Title>
  );
}

export function H4({ children, color, className, style }: HeadingProps) {
  return (
    <Title
      level={4}
      className={className}
      style={{
        fontFamily: "var(--font-family)",
        ...getColorStyle(color),
        ...style,
      }}
    >
      {children}
    </Title>
  );
}

export function H5({ children, color, className, style }: HeadingProps) {
  return (
    <Title
      level={5}
      className={className}
      style={{
        fontFamily: "var(--font-family)",
        ...getColorStyle(color),
        ...style,
      }}
    >
      {children}
    </Title>
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
    <Text
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
    </Text>
  );
}

export function Caption({
  children,
  color = "muted",
  className,
  style,
}: TypographyBaseProps & { color?: string }) {
  return (
    <Text
      className={className}
      style={{
        fontFamily: "var(--font-family)",
        fontSize: 12,
        ...getColorStyle(color),
        ...style,
      }}
    >
      {children}
    </Text>
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
    <Text
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
    </Text>
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
    <Paragraph
      className={className}
      style={{
        fontFamily: "var(--font-family)",
        ...getSizeStyle(size),
        ...getColorStyle(color),
        ...style,
      }}
    >
      {children}
    </Paragraph>
  );
}
