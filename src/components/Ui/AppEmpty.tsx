import type { EmptyProps } from "antd";
import { Empty as AntEmpty, ConfigProvider } from "antd";
import React from "react";

interface AppEmptyProps extends EmptyProps {
  variant?: "default" | "simple" | "custom";
  size?: "small" | "default" | "large";
  description?: React.ReactNode;
  image?: React.ReactNode;
  imageStyle?: React.CSSProperties;
}

export function AppEmpty({
  variant = "default",
  size = "default",
  description = "Brak danych",
  image,
  imageStyle,
  className,
  style,
  children,
  ...props
}: AppEmptyProps) {
  const emptyStyles: React.CSSProperties = {
    fontFamily: "var(--font-family)",
    color: "var(--text-secondary)",
    ...style,
  };

  const getSizeStyles = (): React.CSSProperties => {
    switch (size) {
      case "small":
        return {
          fontSize: 12,
          padding: 16,
        };
      case "large":
        return {
          fontSize: 16,
          padding: 48,
        };
      default:
        return {
          fontSize: 14,
          padding: 32,
        };
    }
  };

  const getDefaultImage = (): React.ReactNode => {
    if (image) return image;

    switch (variant) {
      case "simple":
        return <div style={{ fontSize: 48, opacity: 0.3 }}>📄</div>;
      case "custom":
        return null;
      default:
        return <div style={{ fontSize: 64, opacity: 0.3 }}>📂</div>;
    }
  };

  const defaultImageStyle: React.CSSProperties = {
    height: size === "small" ? 80 : size === "large" ? 120 : 100,
    ...imageStyle,
  };

  return (
    <ConfigProvider
      theme={{
        components: {
          Empty: {
            fontFamily: "var(--font-family)",
            colorText: "var(--text-secondary)",
            colorTextSecondary: "var(--text-muted)",
          },
        },
      }}
    >
      <AntEmpty
        description={description}
        image={getDefaultImage()}
        imageStyle={defaultImageStyle}
        className={className}
        style={{
          ...emptyStyles,
          ...getSizeStyles(),
        }}
        data-component="AppEmpty"
        data-variant={variant}
        data-size={size}
        {...props}
      >
        {children}
      </AntEmpty>
    </ConfigProvider>
  );
}

// Specialized empty variants
export function AppEmptySimple(props: Omit<AppEmptyProps, "variant">) {
  return <AppEmpty variant="simple" {...props} />;
}

export function AppEmptyCustom(props: Omit<AppEmptyProps, "variant">) {
  return <AppEmpty variant="custom" {...props} />;
}

export function AppEmptySmall(props: Omit<AppEmptyProps, "size">) {
  return <AppEmpty size="small" {...props} />;
}

export function AppEmptyLarge(props: Omit<AppEmptyProps, "size">) {
  return <AppEmpty size="large" {...props} />;
}

// Common empty states
export function AppEmptyProjects(
  props: Omit<AppEmptyProps, "description" | "image">
) {
  return (
    <AppEmpty
      description="Brak projektów"
      image={<div style={{ fontSize: 64, opacity: 0.3 }}>📋</div>}
      {...props}
    />
  );
}

export function AppEmptyTiles(
  props: Omit<AppEmptyProps, "description" | "image">
) {
  return (
    <AppEmpty
      description="Brak kafelków"
      image={<div style={{ fontSize: 64, opacity: 0.3 }}>🧩</div>}
      {...props}
    />
  );
}

export function AppEmptyMaterials(
  props: Omit<AppEmptyProps, "description" | "image">
) {
  return (
    <AppEmpty
      description="Brak materiałów"
      image={<div style={{ fontSize: 64, opacity: 0.3 }}>📦</div>}
      {...props}
    />
  );
}

export function AppEmptySearch(
  props: Omit<AppEmptyProps, "description" | "image">
) {
  return (
    <AppEmpty
      description="Nie znaleziono wyników"
      image={<div style={{ fontSize: 64, opacity: 0.3 }}>🔍</div>}
      {...props}
    />
  );
}

export default AppEmpty;
