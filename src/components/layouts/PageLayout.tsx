import { ConfigProvider, Layout } from "antd";
import React from "react";

const { Content } = Layout;

interface PageLayoutProps {
  children: React.ReactNode;
  padding?: "none" | "sm" | "md" | "lg";
  maxWidth?: number | string;
  className?: string;
  style?: React.CSSProperties;
  background?: "default" | "secondary" | "transparent";
}

export function PageLayout({
  children,
  padding = "md",
  maxWidth,
  className,
  style,
  background = "default",
}: PageLayoutProps) {
  const getPaddingValue = (): string => {
    const paddingMap = {
      none: "0",
      sm: "12px",
      md: "24px",
      lg: "32px",
    };
    return paddingMap[padding];
  };

  const getBackgroundValue = (): string => {
    const backgroundMap = {
      default: "var(--bg-primary, #ffffff)",
      secondary: "var(--bg-secondary, #fafafa)",
      transparent: "transparent",
    };
    return backgroundMap[background];
  };

  const contentStyles: React.CSSProperties = {
    padding: getPaddingValue(),
    background: getBackgroundValue(),
    minHeight: "100vh",
    fontFamily: "var(--font-family)",
    ...(maxWidth && {
      maxWidth,
      margin: "0 auto",
      width: "100%",
    }),
    ...style,
  };

  return (
    <ConfigProvider
      theme={{
        components: {
          Layout: {
            bodyBg: getBackgroundValue(),
            headerBg: getBackgroundValue(),
            siderBg: getBackgroundValue(),
          },
        },
      }}
    >
      <Content className={className} style={contentStyles}>
        {children}
      </Content>
    </ConfigProvider>
  );
}

interface MainLayoutProps {
  children: React.ReactNode;
  sidebar?: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  sidebarCollapsed?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export function MainLayout({
  children,
  sidebar,
  header,
  footer,
  sidebarCollapsed = false,
  className,
  style,
}: MainLayoutProps) {
  const layoutStyles: React.CSSProperties = {
    minHeight: "100vh",
    fontFamily: "var(--font-family)",
    ...style,
  };

  const contentStyles: React.CSSProperties = {
    marginLeft: sidebar && !sidebarCollapsed ? "280px" : sidebar ? "80px" : "0",
    transition: "margin-left 0.2s",
  };

  return (
    <ConfigProvider
      theme={{
        components: {
          Layout: {
            bodyBg: "var(--bg-primary, #ffffff)",
          },
        },
      }}
    >
      <Layout className={className} style={layoutStyles}>
        {sidebar}
        <Layout style={contentStyles}>
          {header}
          <Content style={{ flex: 1 }}>{children}</Content>
          {footer}
        </Layout>
      </Layout>
    </ConfigProvider>
  );
}

export default PageLayout;
