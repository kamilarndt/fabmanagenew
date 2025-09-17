import { Card as ModernCard } from "@/new-ui/atoms/Card/Card";
import { LoadingSpinner as ModernLoadingSpinner } from "@/new-ui/atoms/LoadingSpinner/LoadingSpinner";
import React from "react";

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
  const sizeMap = {
    small: "sm" as const,
    default: "md" as const,
    large: "lg" as const,
  };

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
        <ModernLoadingSpinner size={sizeMap[size]} text={message} />
      </div>
    );
  }

  if (type === "card") {
    return (
      <ModernCard
        className={className}
        style={{
          textAlign: "center",
          padding: size === "large" ? 48 : 24,
          ...style,
        }}
      >
        <ModernLoadingSpinner size={sizeMap[size]} text={message} />
      </ModernCard>
    );
  }

  return (
    <ModernLoadingSpinner
      className={className}
      size={sizeMap[size]}
      text={message}
      style={style}
    />
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
