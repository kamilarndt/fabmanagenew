import { Card, ConfigProvider, Spin } from "antd";
import React from "react";
import { LoadingIcon } from "./Icon";
import { Caption } from "./Typography";

interface LoadingSpinnerProps {
  message?: string;
  size?: "small" | "default" | "large";
  type?: "simple" | "card" | "overlay";
  style?: React.CSSProperties;
  className?: string;
}

export function LoadingSpinner({
  message = "Ładowanie...",
  size = "default",
  type = "simple",
  style,
  className,
}: LoadingSpinnerProps) {
  const icon = (
    <LoadingIcon size={size === "large" ? 24 : size === "small" ? 14 : 20} />
  );

  if (type === "overlay") {
    return (
      <div
        className={className}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "rgba(255,255,255,0.8)",
          zIndex: 1000,
          ...style,
        }}
      >
        <div style={{ textAlign: "center" }}>
          <Spin indicator={icon} size={size} />
          {message && (
            <Caption
              style={{
                display: "block",
                marginTop: 12,
                fontSize: size === "small" ? 12 : 14,
              }}
            >
              {message}
            </Caption>
          )}
        </div>
      </div>
    );
  }

  if (type === "card") {
    return (
      <ConfigProvider>
        <Card
          className={className}
          style={{
            textAlign: "center",
            padding: size === "large" ? 48 : 24,
            ...style,
          }}
        >
          <Spin indicator={icon} size={size} />
          {message && (
            <Caption
              style={{
                display: "block",
                marginTop: 16,
                fontSize: size === "small" ? 12 : 14,
              }}
            >
              {message}
            </Caption>
          )}
        </Card>
      </ConfigProvider>
    );
  }

  return (
    <div
      className={className}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
        padding: size === "large" ? 32 : size === "small" ? 8 : 16,
        ...style,
      }}
    >
      <Spin indicator={icon} size={size} />
      {message && (
        <Caption style={{ fontSize: size === "small" ? 12 : 14 }}>
          {message}
        </Caption>
      )}
    </div>
  );
}

export function ModuleLoading() {
  return (
    <LoadingSpinner
      type="card"
      message="Ładowanie modułu..."
      size="default"
      style={{ margin: "24px 0" }}
    />
  );
}

export function PageLoading() {
  return (
    <LoadingSpinner
      type="simple"
      message="Ładowanie strony..."
      size="large"
      style={{ minHeight: "50vh", flexDirection: "column", gap: 16 }}
    />
  );
}

export function ComponentLoading({ message }: { message?: string }) {
  return (
    <LoadingSpinner
      type="simple"
      message={message || "Ładowanie..."}
      size="small"
      style={{ padding: 16 }}
    />
  );
}

export default LoadingSpinner;
