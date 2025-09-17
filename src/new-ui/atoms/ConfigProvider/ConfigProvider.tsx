import * as React from "react";

export interface ConfigProviderProps {
  children: React.ReactNode;
  theme?: {
    token?: {
      colorPrimary?: string;
      colorSuccess?: string;
      colorWarning?: string;
      colorError?: string;
      colorInfo?: string;
      borderRadius?: number;
      wireframe?: boolean;
    };
  };
  locale?: string;
  direction?: "ltr" | "rtl";
}

export function ConfigProvider({
  children,
  theme,
  locale = "en",
  direction = "ltr",
}: ConfigProviderProps): React.ReactElement {
  // Apply theme tokens to CSS variables
  React.useEffect(() => {
    if (theme?.token) {
      const root = document.documentElement;
      const tokens = theme.token;

      if (tokens.colorPrimary) {
        root.style.setProperty("--color-primary", tokens.colorPrimary);
      }
      if (tokens.colorSuccess) {
        root.style.setProperty("--color-success", tokens.colorSuccess);
      }
      if (tokens.colorWarning) {
        root.style.setProperty("--color-warning", tokens.colorWarning);
      }
      if (tokens.colorError) {
        root.style.setProperty("--color-error", tokens.colorError);
      }
      if (tokens.colorInfo) {
        root.style.setProperty("--color-info", tokens.colorInfo);
      }
      if (tokens.borderRadius) {
        root.style.setProperty("--radius", `${tokens.borderRadius}px`);
      }
    }
  }, [theme]);

  // Apply direction
  React.useEffect(() => {
    document.documentElement.dir = direction;
  }, [direction]);

  // Apply locale
  React.useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return <>{children}</>;
}
