import { Card, ConfigProvider } from "antd";
import React from "react";
import { Icon } from "../ui/Icon";
import { Body, Caption, H3, H4 } from "../ui/Typography";

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  iconName?: string;
  iconColor?: string;
  suffix?: string;
  prefix?: string;
  description?: string;
  trend?: {
    value: number;
    isPositive?: boolean;
    label?: string;
  };
  size?: "small" | "medium" | "large";
  variant?: "default" | "outlined" | "filled";
  loading?: boolean;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

export function StatCard({
  title,
  value,
  icon,
  iconName,
  iconColor = "var(--primary-main)",
  suffix,
  prefix,
  description,
  trend,
  size = "medium",
  variant = "default",
  loading = false,
  className,
  style,
  onClick,
}: StatCardProps) {
  const getSizeStyles = () => {
    switch (size) {
      case "small":
        return {
          padding: 16,
          iconSize: 20,
          valueSize: "lg" as const,
          titleSize: "sm" as const,
        };
      case "large":
        return {
          padding: 32,
          iconSize: 32,
          valueSize: "xl" as const,
          titleSize: "base" as const,
        };
      default:
        return {
          padding: 24,
          iconSize: 24,
          valueSize: "xl" as const,
          titleSize: "base" as const,
        };
    }
  };

  const getVariantStyles = (): React.CSSProperties => {
    switch (variant) {
      case "outlined":
        return {
          border: "2px solid var(--border-main)",
          backgroundColor: "transparent",
        };
      case "filled":
        return {
          backgroundColor: "var(--bg-secondary)",
          border: "1px solid var(--border-light)",
        };
      default:
        return {};
    }
  };

  const { padding, iconSize, titleSize } = getSizeStyles();

  const cardStyles: React.CSSProperties = {
    height: "100%",
    cursor: onClick ? "pointer" : "default",
    transition: "all 0.2s ease",
    ...getVariantStyles(),
    ...style,
  };

  const iconElement =
    icon ||
    (iconName && (
      <Icon name={iconName as any} size={iconSize} color={iconColor} />
    ));

  const formatValue = () => {
    const formattedValue =
      typeof value === "number" ? value.toLocaleString() : value;

    return `${prefix || ""}${formattedValue}${suffix || ""}`;
  };

  const getTrendColor = () => {
    if (!trend) return "var(--text-muted)";
    return trend.isPositive ? "#52c41a" : "#ff4d4f";
  };

  return (
    <ConfigProvider
      theme={{
        components: {
          Card: {
            borderRadius: 8,
            fontFamily: "var(--font-family)",
          },
        },
      }}
    >
      <Card
        hoverable={!!onClick}
        loading={loading}
        className={className}
        style={cardStyles}
        bodyStyle={{ padding }}
        onClick={onClick}
      >
        <div style={{ height: "100%" }}>
          {/* Header with icon and title */}
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              marginBottom: size === "small" ? 8 : 12,
            }}
          >
            <div style={{ flex: 1, minWidth: 0 }}>
              <Body
                size={titleSize}
                color="secondary"
                weight="medium"
                style={{
                  margin: 0,
                  marginBottom: 4,
                  display: "block",
                }}
              >
                {title}
              </Body>
            </div>

            {iconElement && (
              <div
                style={{
                  flexShrink: 0,
                  marginLeft: 12,
                  opacity: 0.8,
                }}
              >
                {iconElement}
              </div>
            )}
          </div>

          {/* Value */}
          <div style={{ marginBottom: description || trend ? 8 : 0 }}>
            {size === "small" ? (
              <H4 style={{ margin: 0, color: "var(--text-primary)" }}>
                {formatValue()}
              </H4>
            ) : (
              <H3 style={{ margin: 0, color: "var(--text-primary)" }}>
                {formatValue()}
              </H3>
            )}
          </div>

          {/* Description */}
          {description && (
            <Caption
              style={{
                margin: 0,
                marginBottom: trend ? 8 : 0,
                display: "block",
              }}
            >
              {description}
            </Caption>
          )}

          {/* Trend */}
          {trend && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                marginTop: "auto",
              }}
            >
              <Icon
                name={
                  trend.isPositive ? "ArrowUpOutlined" : "ArrowDownOutlined"
                }
                size={12}
                color={getTrendColor()}
              />
              <Caption
                style={{
                  margin: 0,
                  color: getTrendColor(),
                  fontWeight: "var(--font-medium)",
                }}
              >
                {Math.abs(trend.value)}%{trend.label && ` ${trend.label}`}
              </Caption>
            </div>
          )}
        </div>
      </Card>
    </ConfigProvider>
  );
}

// Specialized variants
export function KPICard({
  title,
  value,
  target,
  ...props
}: Omit<StatCardProps, "description" | "trend"> & {
  target?: number;
}) {
  const percentage = target ? Math.round((Number(value) / target) * 100) : 0;
  const isOnTarget = percentage >= 100;

  return (
    <StatCard
      title={title}
      value={value}
      description={target ? `Cel: ${target}` : undefined}
      trend={
        target
          ? {
              value: percentage - 100,
              isPositive: isOnTarget,
              label: isOnTarget ? "powyżej celu" : "do celu",
            }
          : undefined
      }
      {...props}
    />
  );
}

export function SimpleStatCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: string | number;
  icon?: string;
}) {
  return (
    <StatCard
      title={title}
      value={value}
      iconName={icon}
      size="small"
      variant="filled"
    />
  );
}

export default StatCard;
