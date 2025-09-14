import { ConfigProvider, theme } from "antd";
import React, { createContext, useContext, useEffect, useState } from "react";
import { designTokens } from "../../styles/design-tokens";

type ThemeMode = "light" | "dark";
type ThemeContextType = {
  mode: ThemeMode;
  toggleTheme: () => void;
  tokens: typeof designTokens;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: ThemeMode;
}

export function ThemeProvider({
  children,
  defaultTheme = "light",
}: ThemeProviderProps) {
  const [mode, setMode] = useState<ThemeMode>(() => {
    const stored = localStorage.getItem("fab-manage-theme") as ThemeMode;
    if (stored) return stored;
    const system = window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
    return system || defaultTheme;
  });

  const toggleTheme = () => {
    const next = mode === "light" ? "dark" : "light";
    setMode(next);
    localStorage.setItem("fab-manage-theme", next);
  };

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", mode);
  }, [mode]);

  const antdTheme = {
    algorithm: mode === "dark" ? theme.darkAlgorithm : theme.defaultAlgorithm,
    token: {
      colorPrimary: designTokens.colors.brand[500],
      colorSuccess: designTokens.colors.semantic.success.main,
      colorWarning: designTokens.colors.semantic.warning.main,
      colorError: designTokens.colors.semantic.error.main,
      colorInfo: designTokens.colors.semantic.info.main,
      fontFamily: designTokens.typography.fontFamily.sans.join(", "),
      borderRadius: parseInt(designTokens.borderRadius.base),
    },
    components: {
      Button: { borderRadius: parseInt(designTokens.borderRadius.md) },
      Card: { borderRadius: parseInt(designTokens.borderRadius.lg) },
      Modal: { borderRadius: parseInt(designTokens.borderRadius.lg) },
    },
  } as const;

  const contextValue: ThemeContextType = {
    mode,
    toggleTheme,
    tokens: designTokens,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      <ConfigProvider theme={antdTheme}>{children}</ConfigProvider>
    </ThemeContext.Provider>
  );
}
