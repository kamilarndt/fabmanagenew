import { cn } from "@/new-ui/utils/cn";
import * as React from "react";

export interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
}

export function Tabs({
  className,
  children,
  defaultValue,
  value,
  onValueChange,
  ...props
}: TabsProps): React.ReactElement {
  const [activeTab, setActiveTab] = React.useState(defaultValue || "");

  const currentValue = value ?? activeTab;

  const handleTabChange = (newValue: string) => {
    if (value === undefined) {
      setActiveTab(newValue);
    }
    onValueChange?.(newValue);
  };

  return (
    <div className={cn("w-full", className)} {...props}>
      <div
        className="tabs-context"
        data-value={currentValue}
        data-on-change={handleTabChange}
      >
        {children}
      </div>
    </div>
  );
}

export interface TabsListProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function TabsList({
  className,
  children,
  ...props
}: TabsListProps): React.ReactElement {
  return (
    <div
      className={cn(
        "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export interface TabsTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  value: string;
}

export function TabsTrigger({
  className,
  children,
  value,
  ...props
}: TabsTriggerProps): React.ReactElement {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
        className
      )}
      data-state="inactive"
      {...props}
    >
      {children}
    </button>
  );
}

export interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  value: string;
}

export function TabsContent({
  className,
  children,
  value,
  ...props
}: TabsContentProps): React.ReactElement {
  return (
    <div
      className={cn(
        "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        className
      )}
      data-state="inactive"
      {...props}
    >
      {children}
    </div>
  );
}
