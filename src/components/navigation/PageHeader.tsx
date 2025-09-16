import { ConfigProvider, Space } from "antd";
import React from "react";
import { AppButton } from "../ui/AppButton";
import { AppDivider } from "../ui/AppDivider";
import { Icon } from "../ui/Icon";
import { Body, Caption, H1, H2 } from "../ui/Typography";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  description?: string;
  actions?: React.ReactNode;
  backButton?: {
    onClick: () => void;
    label?: string;
  };
  breadcrumb?: React.ReactNode;
  extra?: React.ReactNode;
  size?: "default" | "small" | "large";
  className?: string;
  style?: React.CSSProperties;
}

export function PageHeader({
  title,
  subtitle,
  description,
  actions,
  backButton,
  breadcrumb,
  extra,
  size = "default",
  className,
  style,
}: PageHeaderProps) {
  const getTitleComponent = () => {
    switch (size) {
      case "small":
        return (
          <H2 style={{ margin: 0, marginBottom: subtitle ? 4 : 0 }}>{title}</H2>
        );
      case "large":
        return (
          <H1 style={{ margin: 0, marginBottom: subtitle ? 8 : 0 }}>{title}</H1>
        );
      default:
        return (
          <H1
            style={{
              margin: 0,
              marginBottom: subtitle ? 8 : 0,
              fontSize: 24,
              fontWeight: "var(--font-semibold)",
            }}
          >
            {title}
          </H1>
        );
    }
  };

  const headerStyles: React.CSSProperties = {
    padding:
      size === "small" ? "16px 0" : size === "large" ? "32px 0" : "24px 0",
    ...style,
  };

  return (
    <ConfigProvider
      theme={{
        components: {
          Space: {
            marginSM: 8,
            marginMD: 12,
            marginLG: 16,
          },
        },
      }}
    >
      <div className={className} style={headerStyles}>
        {/* Breadcrumb */}
        {breadcrumb && <div style={{ marginBottom: 12 }}>{breadcrumb}</div>}

        {/* Main header content */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 16,
            flexWrap: "wrap",
          }}
        >
          {/* Left section: Back button + Title content */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <Space
              direction="vertical"
              size={size === "small" ? 4 : 8}
              style={{ width: "100%" }}
            >
              {/* Back button + Title row */}
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                {backButton && (
                  <AppButton
                    variant="ghost"
                    size={size === "small" ? "small" : "middle"}
                    onClick={backButton.onClick}
                    style={{ padding: "4px 8px" }}
                  >
                    <Icon name="ArrowLeftOutlined" size={14} />
                    {backButton.label && (
                      <span style={{ marginLeft: 4 }}>{backButton.label}</span>
                    )}
                  </AppButton>
                )}
                <div style={{ flex: 1 }}>
                  {getTitleComponent()}
                  {subtitle && (
                    <Body
                      size={size === "small" ? "sm" : "base"}
                      color="secondary"
                      style={{ margin: 0 }}
                    >
                      {subtitle}
                    </Body>
                  )}
                </div>
              </div>

              {/* Description */}
              {description && (
                <Caption
                  style={{
                    margin: 0,
                    maxWidth: "600px",
                  }}
                >
                  {description}
                </Caption>
              )}
            </Space>
          </div>

          {/* Right section: Actions + Extra */}
          {(actions || extra) && (
            <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
              {extra && (
                <div style={{ display: "flex", alignItems: "center" }}>
                  {extra}
                </div>
              )}
              {actions && (
                <Space size="small" wrap>
                  {actions}
                </Space>
              )}
            </div>
          )}
        </div>

        {/* Divider */}
        <AppDivider spacing="md" style={{ margin: "16px 0 0 0" }} />
      </div>
    </ConfigProvider>
  );
}

// Specialized variants
interface SimplePageHeaderProps {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}

export function SimplePageHeader({
  title,
  subtitle,
  children,
}: SimplePageHeaderProps) {
  return (
    <PageHeader
      title={title}
      subtitle={subtitle}
      actions={children}
      size="default"
    />
  );
}

interface BackPageHeaderProps {
  title: string;
  onBack: () => void;
  backLabel?: string;
  children?: React.ReactNode;
}

export function BackPageHeader({
  title,
  onBack,
  backLabel = "Wstecz",
  children,
}: BackPageHeaderProps) {
  return (
    <PageHeader
      title={title}
      backButton={{ onClick: onBack, label: backLabel }}
      actions={children}
      size="default"
    />
  );
}

export default PageHeader;
