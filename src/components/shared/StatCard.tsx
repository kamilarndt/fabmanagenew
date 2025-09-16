import React from "react";
import { AppCard } from "../ui/AppCard";
import { Icon } from "../ui/Icon";
import { Caption, H3 } from "../ui/Typography";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    direction: "up" | "down" | "neutral";
    label?: string;
  };
  color?: "primary" | "success" | "warning" | "danger" | "info";
  size?: "small" | "medium" | "large";
  loading?: boolean;
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

export function StatCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  color = "primary",
  size = "medium",
  loading = false,
  onClick,
  className,
  style,
}: StatCardProps) {
  const getColorStyles = () => {
    const colorMap = {
      primary: {
        icon: "var(--primary-main)",
        value: "var(--text-primary)",
        trend: "var(--primary-main)",
      },
      success: {
        icon: "#52c41a",
        value: "var(--text-primary)",
        trend: "#52c41a",
      },
      warning: {
        icon: "#faad14",
        value: "var(--text-primary)",
        trend: "#faad14",
      },
      danger: {
        icon: "#ff4d4f",
        value: "var(--text-primary)",
        trend: "#ff4d4f",
      },
      info: {
        icon: "#1890ff",
        value: "var(--text-primary)",
        trend: "#1890ff",
      },
    };

    return colorMap[color];
  };

  const getSizeStyles = () => {
    const sizeMap = {
      small: {
        padding: "16px",
        iconSize: 20,
        titleSize: "sm" as const,
        valueSize: "lg" as const,
      },
      medium: {
        padding: "20px",
        iconSize: 24,
        titleSize: "base" as const,
        valueSize: "xl" as const,
      },
      large: {
        padding: "24px",
        iconSize: 28,
        titleSize: "lg" as const,
        valueSize: "xl" as const,
      },
    };

    return sizeMap[size];
  };

  const colorStyles = getColorStyles();
  const sizeStyles = getSizeStyles();

  const getTrendIcon = () => {
    if (!trend) return null;

    switch (trend.direction) {
      case "up":
        return (
          <Icon name="ArrowUpOutlined" size={12} color={colorStyles.trend} />
        );
      case "down":
        return (
          <Icon name="ArrowDownOutlined" size={12} color={colorStyles.trend} />
        );
      case "neutral":
        return (
          <Icon name="MinusOutlined" size={12} color="var(--text-muted)" />
        );
      default:
        return null;
    }
  };

  const getTrendColor = () => {
    if (!trend) return "var(--text-muted)";

    switch (trend.direction) {
      case "up":
        return "#52c41a";
      case "down":
        return "#ff4d4f";
      case "neutral":
        return "var(--text-muted)";
      default:
        return "var(--text-muted)";
    }
  };

  return (
    <AppCard
      variant="outlined"
      className={className}
      style={{
        padding: sizeStyles.padding,
        cursor: onClick ? "pointer" : "default",
        transition: "all 0.2s ease",
        ...(onClick && {
          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          },
        }),
        ...style,
      }}
      onClick={onClick}
      data-component="StatCard"
      data-color={color}
      data-size={size}
      data-loading={loading}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          marginBottom: subtitle ? 8 : 0,
        }}
      >
        <div style={{ flex: 1 }}>
          <Caption
            color="muted"
            style={{
              margin: 0,
              marginBottom: 4,
              fontSize:
                sizeStyles.titleSize === "sm"
                  ? 12
                  : sizeStyles.titleSize === "lg"
                  ? 16
                  : 14,
            }}
          >
            {title}
          </Caption>
          <H3
            style={{
              margin: 0,
              fontSize: sizeStyles.valueSize === "lg" ? 18 : 20,
              fontWeight: "var(--font-semibold)",
              color: colorStyles.value,
            }}
          >
            {loading ? "..." : value}
          </H3>
          {subtitle && (
            <Caption
              color="muted"
              style={{
                margin: 0,
                marginTop: 4,
                fontSize: 12,
              }}
            >
              {subtitle}
            </Caption>
          )}
        </div>

        {icon && (
          <div
            style={{
              color: colorStyles.icon,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: sizeStyles.iconSize + 8,
              height: sizeStyles.iconSize + 8,
            }}
          >
            {icon}
          </div>
        )}
      </div>

      {trend && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
            marginTop: 8,
          }}
        >
          {getTrendIcon()}
          <Caption
            style={{
              margin: 0,
              color: getTrendColor(),
              fontSize: 12,
              fontWeight: 500,
            }}
          >
            {trend.value > 0 ? "+" : ""}
            {trend.value}%{trend.label && ` ${trend.label}`}
          </Caption>
        </div>
      )}
    </AppCard>
  );
}

interface MetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon?: React.ReactNode;
  color?: "primary" | "success" | "warning" | "danger" | "info";
  size?: "small" | "medium" | "large";
}

export function MetricCard({
  title,
  value,
  unit,
  icon,
  color = "primary",
  size = "medium",
}: MetricCardProps) {
  return (
    <StatCard
      title={title}
      value={unit ? `${value} ${unit}` : value}
      icon={icon}
      color={color}
      size={size}
    />
  );
}

interface ProgressCardProps {
  title: string;
  value: number;
  max?: number;
  unit?: string;
  icon?: React.ReactNode;
  color?: "primary" | "success" | "warning" | "danger" | "info";
  showPercentage?: boolean;
}

export function ProgressCard({
  title,
  value,
  max = 100,
  unit = "%",
  icon,
  color = "primary",
  showPercentage = true,
}: ProgressCardProps) {
  const percentage = Math.round((value / max) * 100);

  return (
    <StatCard
      title={title}
      value={showPercentage ? `${percentage}${unit}` : value}
      icon={icon}
      color={color}
      size="medium"
      subtitle={`${value} z ${max}`}
    />
  );
}

export default StatCard;
