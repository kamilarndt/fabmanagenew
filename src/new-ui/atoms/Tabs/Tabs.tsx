import { cn } from "@/new-ui/utils/cn";
import * as React from "react";

export interface TabItem {
  key: string;
  label: React.ReactNode;
  children: React.ReactNode;
  disabled?: boolean;
}

export interface TabsProps {
  items: TabItem[];
  activeKey?: string;
  onChange?: (activeKey: string) => void;
  defaultActiveKey?: string;
  className?: string;
  tabBarStyle?: React.CSSProperties;
  tabPaneStyle?: React.CSSProperties;
}

export function Tabs({
  items,
  activeKey,
  onChange,
  defaultActiveKey,
  className,
  tabBarStyle,
  tabPaneStyle,
}: TabsProps): React.ReactElement {
  const [internalActiveKey, setInternalActiveKey] = React.useState(
    activeKey || defaultActiveKey || items[0]?.key || ""
  );

  const currentActiveKey = activeKey !== undefined ? activeKey : internalActiveKey;

  const handleTabClick = (key: string) => {
    if (activeKey === undefined) {
      setInternalActiveKey(key);
    }
    onChange?.(key);
  };

  const activeTab = items.find((item) => item.key === currentActiveKey);

  return (
    <div className={cn("w-full", className)}>
      {/* Tab Bar */}
      <div
        className="flex border-b"
        style={{
          borderColor: "var(--color-border-primary)",
          ...tabBarStyle,
        }}
      >
        {items.map((item) => (
          <button
            key={item.key}
            onClick={() => !item.disabled && handleTabClick(item.key)}
            disabled={item.disabled}
            className={cn(
              "px-4 py-2 text-sm font-medium border-b-2 transition-colors",
              "hover:bg-gray-50 dark:hover:bg-gray-800",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              currentActiveKey === item.key
                ? "border-[var(--color-foreground-primary)] text-[var(--color-foreground-primary)]"
                : "border-transparent text-[var(--color-foreground-secondary)] hover:text-[var(--color-foreground-primary)]"
            )}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div
        className="p-4"
        style={{
          color: "var(--color-foreground-primary)",
          ...tabPaneStyle,
        }}
      >
        {activeTab?.children}
      </div>
    </div>
  );
}

// Individual Tab Pane Component
export interface TabPaneProps {
  tab: React.ReactNode;
  key: string;
  children: React.ReactNode;
  disabled?: boolean;
}

export function TabPane({ children }: TabPaneProps): React.ReactElement {
  return <>{children}</>;
}