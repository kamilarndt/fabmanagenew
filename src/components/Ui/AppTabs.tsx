import type { TabsProps } from "antd";
import { Tabs as AntTabs, ConfigProvider } from "antd";
import React from "react";

interface AppTabsProps extends TabsProps {
  variant?: "default" | "card" | "line";
  size?: "small" | "middle" | "large";
  position?: "top" | "right" | "bottom" | "left";
  type?: "line" | "card" | "editable-card";
  centered?: boolean;
}

export function AppTabs({
  variant = "default",
  size = "middle",
  position = "top",
  type = "line",
  centered = false,
  className,
  style,
  children,
  ...props
}: AppTabsProps) {
  const tabsStyles: React.CSSProperties = {
    fontFamily:
      "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    ...style,
  };

  const getVariantConfig = (): Partial<TabsProps> => {
    switch (variant) {
      case "card":
        return {
          type: "card",
          size: "large",
        };
      case "line":
        return {
          type: "line",
          size: size,
        };
      default:
        return {
          type: type,
          size: size,
        };
    }
  };

  return (
    <ConfigProvider
      theme={{
        components: {
          Tabs: {
            // Font configuration
            fontFamily:
              "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
            fontSize: 14,
            lineHeight: 22,

            // Background colors - matching Figma design
            colorBgContainer: "#2c3038", // Main background
            colorFillSecondary: "#2e3c10", // Content area background
            colorFillTertiary: "#373C44", // Hover state

            // Border colors
            colorBorder: "#40404a", // Main border
            colorBorderSecondary: "#536d13", // Content border

            // Text colors - matching Figma design
            colorText: "rgba(255, 255, 255, 0.85)", // Inactive tab text (85% opacity)
            colorTextSecondary: "rgba(255, 255, 255, 0.88)", // Content text (88% opacity)
            colorTextHeading: "#a9d134", // Active tab text (green accent)

            // Primary colors - matching Figma green accent
            colorPrimary: "#a9d134", // Active tab color
            colorPrimaryHover: "#c5e063", // Hover state (lighter green)
            colorPrimaryActive: "#8fb82a", // Active state (darker green)

            // Tab specific styling
            itemColor: "rgba(255, 255, 255, 0.85)",
            itemHoverColor: "rgba(255, 255, 255, 0.95)",
            itemSelectedColor: "#a9d134",
            itemActiveColor: "#a9d134",

            // Spacing and sizing
            horizontalMargin: "0",
            horizontalItemGutter: 16,

            // Content area styling
            padding: 16,
          },
        },
      }}
    >
      <AntTabs
        tabPosition={position}
        centered={centered}
        className={className}
        style={tabsStyles}
        data-component="AppTabs"
        data-variant={variant}
        data-size={size}
        data-position={position}
        {...getVariantConfig()}
        {...props}
      >
        {children}
      </AntTabs>
    </ConfigProvider>
  );
}

// Specialized tab variants
export function AppTabsCard(props: Omit<AppTabsProps, "variant">) {
  return <AppTabs variant="card" {...props} />;
}

export function AppTabsLine(props: Omit<AppTabsProps, "variant">) {
  return <AppTabs variant="line" {...props} />;
}

export function AppTabsSmall(props: Omit<AppTabsProps, "size">) {
  return <AppTabs size="small" {...props} />;
}

export function AppTabsLarge(props: Omit<AppTabsProps, "size">) {
  return <AppTabs size="large" {...props} />;
}

export function AppTabsVertical(props: Omit<AppTabsProps, "position">) {
  return <AppTabs position="left" {...props} />;
}

export default AppTabs;
