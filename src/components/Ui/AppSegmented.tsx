import type { SegmentedProps } from "antd";
import { Segmented as AntSegmented, ConfigProvider } from "antd";
import React from "react";

interface AppSegmentedProps extends SegmentedProps {
  variant?: "default" | "compact" | "outlined";
  size?: "small" | "middle" | "large";
  block?: boolean;
  disabled?: boolean;
  options: (
    | string
    | number
    | { label: React.ReactNode; value: string | number; disabled?: boolean }
  )[];
}

export function AppSegmented({
  variant = "default",
  size = "middle",
  block = false,
  disabled = false,
  options,
  className,
  style,
  ...props
}: AppSegmentedProps) {
  const segmentedStyles: React.CSSProperties = {
    fontFamily: "var(--font-family)",
    ...style,
  };

  const getSizeConfig = () => {
    switch (size) {
      case "small":
        return "small";
      case "large":
        return "large";
      default:
        return "middle";
    }
  };

  const getVariantStyles = (): React.CSSProperties => {
    switch (variant) {
      case "compact":
        return {
          padding: "2px 4px",
        };
      case "outlined":
        return {
          border: "1px solid var(--border-main)",
          borderRadius: 6,
        };
      default:
        return {};
    }
  };

  return (
    <ConfigProvider
      theme={{
        components: {
          Segmented: {
            fontFamily: "var(--font-family)",
            colorText: "var(--text-primary)",
            colorTextLabel: "var(--text-primary)",
            colorBgContainer: "var(--bg-input)",
            colorBorder: "var(--border-main)",
            colorPrimary: "var(--primary-main)",
            colorPrimaryHover: "var(--primary-light)",
          },
        },
      }}
    >
      <AntSegmented
        size={getSizeConfig()}
        block={block}
        disabled={disabled}
        options={options}
        className={className}
        style={{
          ...segmentedStyles,
          ...getVariantStyles(),
        }}
        data-component="AppSegmented"
        data-variant={variant}
        data-size={size}
        data-block={block}
        {...props}
      />
    </ConfigProvider>
  );
}

// Specialized segmented variants
export function AppSegmentedCompact(props: Omit<AppSegmentedProps, "variant">) {
  return <AppSegmented variant="compact" {...props} />;
}

export function AppSegmentedOutlined(
  props: Omit<AppSegmentedProps, "variant">
) {
  return <AppSegmented variant="outlined" {...props} />;
}

export function AppSegmentedSmall(props: Omit<AppSegmentedProps, "size">) {
  return <AppSegmented size="small" {...props} />;
}

export function AppSegmentedLarge(props: Omit<AppSegmentedProps, "size">) {
  return <AppSegmented size="large" {...props} />;
}

export function AppSegmentedBlock(props: Omit<AppSegmentedProps, "block">) {
  return <AppSegmented block={true} {...props} />;
}

export default AppSegmented;
