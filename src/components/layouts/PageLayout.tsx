import { Layout } from "antd";
import React from "react";

const { Content } = Layout;

interface PageLayoutProps {
  children: React.ReactNode;
  variant?: "default" | "centered" | "full-width";
  padding?: "none" | "sm" | "md" | "lg";
  maxWidth?: number | string;
  className?: string;
  style?: React.CSSProperties;
}

export function PageLayout({
  children,
  variant = "default",
  padding = "md",
  maxWidth,
  className,
  style,
}: PageLayoutProps) {
  const paddingMap = {
    none: 0,
    sm: 16,
    md: 24,
    lg: 32,
  };

  const variantStyles: React.CSSProperties = {
    ...(variant === "centered" && {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100vh",
    }),
    ...(variant === "full-width" && {
      width: "100%",
    }),
    ...(maxWidth && {
      maxWidth: typeof maxWidth === "number" ? `${maxWidth}px` : maxWidth,
      margin: "0 auto",
    }),
  };

  return (
    <Layout
      className={className}
      style={{
        minHeight: "100vh",
        background: "var(--bg-primary)",
        ...variantStyles,
        ...style,
      }}
    >
      <Content
        style={{
          padding: paddingMap[padding],
          ...(variant === "centered" && {
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }),
        }}
        data-component="PageLayout"
        data-variant={variant}
        data-padding={padding}
      >
        {children}
      </Content>
    </Layout>
  );
}

export function CenteredPageLayout(props: Omit<PageLayoutProps, "variant">) {
  return <PageLayout variant="centered" {...props} />;
}

export function FullWidthPageLayout(props: Omit<PageLayoutProps, "variant">) {
  return <PageLayout variant="full-width" {...props} />;
}

export default PageLayout;
