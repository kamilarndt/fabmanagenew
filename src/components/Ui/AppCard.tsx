import type { CardProps } from "antd";
import { Card as AntCard, ConfigProvider } from "antd";
import React from "react";

interface AppCardProps extends Omit<CardProps, "variant"> {
  variant?: "default" | "outlined" | "filled";
  hoverable?: boolean;
  loading?: boolean;
  size?: "default" | "small";
  headerStyle?: React.CSSProperties;
  bodyStyle?: React.CSSProperties;
}

export function AppCard({
  variant = "default",
  hoverable = false,
  loading = false,
  size = "default",
  headerStyle,
  bodyStyle,
  className,
  style,
  children,
  ...props
}: AppCardProps) {
  const cardStyles: React.CSSProperties = {
    fontFamily: "var(--font-family)",
    borderRadius: 6,
    borderColor: "var(--border-main)",
    backgroundColor:
      variant === "filled" ? "var(--bg-hover)" : "var(--bg-card)",
    ...(variant === "outlined" && {
      backgroundColor: "transparent",
      border: "1px solid var(--border-main)",
    }),
    ...style,
  };

  const defaultHeaderStyle: React.CSSProperties = {
    backgroundColor: "var(--bg-secondary)",
    borderBottom: "1px solid var(--border-main)",
    ...headerStyle,
  };

  const defaultBodyStyle: React.CSSProperties = {
    backgroundColor:
      variant === "filled" ? "var(--bg-hover)" : "var(--bg-card)",
    color: "var(--text-primary)",
    ...bodyStyle,
  };

  return (
    <ConfigProvider
      theme={{
        components: {
          Card: {
            borderRadius: 6,
            fontFamily: "var(--font-family)",
            colorText: "var(--text-primary)",
            colorTextHeading: "var(--text-primary)",
            colorBgContainer: "var(--bg-card)",
            colorBorder: "var(--border-main)",
            colorBorderSecondary: "var(--border-light)",
          },
        },
      }}
    >
      <AntCard
        hoverable={hoverable}
        loading={loading}
        size={size}
        className={className}
        style={cardStyles}
        styles={{
          header: defaultHeaderStyle,
          body: defaultBodyStyle,
        }}
        data-component="AppCard"
        data-variant={variant}
        data-size={size}
        data-state={hoverable ? "hoverable" : loading ? "loading" : "default"}
        {...props}
      >
        {children}
      </AntCard>
    </ConfigProvider>
  );
}

// Specialized card variants
export function ProjectCard(props: AppCardProps) {
  return <AppCard variant="default" hoverable {...props} />;
}

export function KanbanCard(props: AppCardProps) {
  return <AppCard variant="outlined" size="small" {...props} />;
}

export function StatsCard(props: AppCardProps) {
  return <AppCard variant="filled" {...props} />;
}

export default AppCard;
