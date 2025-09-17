import * as React from "react";

export interface ConfigProviderProps {
  children: React.ReactNode;
  theme?: {
    primaryColor?: string;
    borderRadius?: number;
    fontFamily?: string;
    fontSize?: number;
  };
  locale?: string;
  direction?: "ltr" | "rtl";
  componentSize?: "small" | "middle" | "large";
  space?: {
    size?: number;
  };
  form?: {
    validateMessages?: any;
    requiredMark?: boolean;
  };
  renderEmpty?: (componentName?: string) => React.ReactNode;
}

const ConfigContext = React.createContext<ConfigProviderProps>({});

export function ConfigProvider({
  children,
  theme,
  locale = "en-US",
  direction = "ltr",
  componentSize = "middle",
  space,
  form,
  renderEmpty,
}: ConfigProviderProps): React.ReactElement {
  const config: ConfigProviderProps = {
    theme,
    locale,
    direction,
    componentSize,
    space,
    form,
    renderEmpty,
  };

  return (
    <ConfigContext.Provider value={config}>
      <div
        dir={direction}
        style={{
          fontFamily: theme?.fontFamily,
          fontSize: theme?.fontSize,
        }}
      >
        {children}
      </div>
    </ConfigContext.Provider>
  );
}

export function useConfig(): ConfigProviderProps {
  return React.useContext(ConfigContext);
}