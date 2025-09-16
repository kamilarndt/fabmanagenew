# FabManage Design System - Implementation Guide

This guide provides step-by-step instructions for implementing the FabManage Design System in your React application.

## 🚀 Quick Start

### 1. Installation

```bash
# Install required dependencies
npm install @radix-ui/react-slot class-variance-authority clsx tailwind-merge lucide-react

# Install Tailwind CSS
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### 2. Configuration

#### Tailwind Configuration

```javascript
// tailwind.config.js
import { tailwindTokens } from "./src/new-ui/tokens/tailwind-tokens.js";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  prefix: "tw-",
  theme: {
    extend: {
      colors: {
        ...tailwindTokens.colors,
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      spacing: tailwindTokens.spacing,
      borderRadius: {
        ...tailwindTokens.borderRadius,
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [],
};
```

#### CSS Variables

```css
/* src/index.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 222.2 47.4% 11.2%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96%;
    --secondary-foreground: 222.2 84% 4.9%;
    --muted: 210 40% 96%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96%;
    --accent-foreground: 222.2 84% 4.9%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 222.2 84% 4.9%;
    --radius: 0.5rem;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
    --primary: 210 40% 98%;
    --primary-foreground: 222.2 47.4% 11.2%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 212.7 26.8% 83.9%;
  }
}

@layer base {
  * {
    @apply tw-border-border;
  }
  body {
    @apply tw-bg-background tw-text-foreground;
  }
}
```

### 3. Utility Functions

#### Class Name Utility

```typescript
// src/new-ui/utils/cn.ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

#### Variants Utility

```typescript
// src/new-ui/utils/variants.ts
import { cva, type VariantProps } from "class-variance-authority";

export { cva, type VariantProps };
```

## 🧩 Component Implementation

### 1. Basic Button Component

```typescript
// src/new-ui/atoms/Button/Button.tsx
import { cn } from "@/new-ui/utils/cn";
import { cva, type VariantProps } from "@/new-ui/utils/variants";
import * as React from "react";

const buttonVariants = cva(
  "tw-inline-flex tw-items-center tw-justify-center tw-gap-2 tw-whitespace-nowrap tw-rounded-md tw-text-sm tw-font-medium tw-transition-colors focus-visible:tw-outline-none focus-visible:tw-ring-2 focus-visible:tw-ring-ring focus-visible:tw-ring-offset-2 tw-ring-offset-background disabled:tw-pointer-events-none disabled:tw-opacity-50",
  {
    variants: {
      variant: {
        default:
          "tw-bg-primary tw-text-primary-foreground hover:tw-bg-primary/90",
        destructive:
          "tw-bg-destructive tw-text-destructive-foreground hover:tw-bg-destructive/90",
        outline:
          "tw-border tw-border-input tw-bg-background hover:tw-bg-accent hover:tw-text-accent-foreground",
        secondary:
          "tw-bg-secondary tw-text-secondary-foreground hover:tw-bg-secondary/80",
        ghost: "hover:tw-bg-accent hover:tw-text-accent-foreground",
        link: "tw-text-primary tw-underline-offset-4 hover:tw-underline",
      },
      size: {
        default: "tw-h-10 tw-px-4 tw-py-2",
        sm: "tw-h-9 tw-rounded-md tw-px-3",
        lg: "tw-h-11 tw-rounded-md tw-px-8",
        icon: "tw-h-10 tw-w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
}

export function Button({
  className,
  variant,
  size,
  loading,
  children,
  disabled,
  ...props
}: ButtonProps): React.ReactElement {
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <span
          aria-hidden
          className="tw-inline-block tw-h-4 tw-w-4 tw-animate-spin tw-rounded-full tw-border-2 tw-border-current tw-border-r-transparent"
        />
      )}
      {children}
    </button>
  );
}
```

### 2. Card Component

```typescript
// src/new-ui/molecules/Card/Card.tsx
import { cn } from "@/new-ui/utils/cn";
import * as React from "react";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Card({ className, ...props }: CardProps): React.ReactElement {
  return (
    <div
      className={cn(
        "tw-rounded-lg tw-border tw-bg-card tw-text-card-foreground tw-shadow-sm",
        className
      )}
      {...props}
    />
  );
}

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

export function CardHeader({
  className,
  ...props
}: CardHeaderProps): React.ReactElement {
  return (
    <div
      className={cn("tw-flex tw-flex-col tw-space-y-1.5 tw-p-6", className)}
      {...props}
    />
  );
}

export interface CardTitleProps
  extends React.HTMLAttributes<HTMLHeadingElement> {}

export function CardTitle({
  className,
  ...props
}: CardTitleProps): React.ReactElement {
  return (
    <h3
      className={cn(
        "tw-text-2xl tw-font-semibold tw-leading-none tw-tracking-tight",
        className
      )}
      {...props}
    />
  );
}

export interface CardDescriptionProps
  extends React.HTMLAttributes<HTMLParagraphElement> {}

export function CardDescription({
  className,
  ...props
}: CardDescriptionProps): React.ReactElement {
  return (
    <p
      className={cn("tw-text-sm tw-text-muted-foreground", className)}
      {...props}
    />
  );
}

export interface CardContentProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export function CardContent({
  className,
  ...props
}: CardContentProps): React.ReactElement {
  return <div className={cn("tw-p-6 tw-pt-0", className)} {...props} />;
}

export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

export function CardFooter({
  className,
  ...props
}: CardFooterProps): React.ReactElement {
  return (
    <div
      className={cn("tw-flex tw-items-center tw-p-6 tw-pt-0", className)}
      {...props}
    />
  );
}
```

### 3. Form Field Component

```typescript
// src/new-ui/molecules/FormField/FormField.tsx
import { Label } from "@/new-ui/atoms/Label/Label";
import { cn } from "@/new-ui/utils/cn";
import * as React from "react";

export interface FormFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}

export function FormField({
  label,
  error,
  required,
  children,
  className,
  ...props
}: FormFieldProps): React.ReactElement {
  const childId = React.useId();
  const errorId = React.useId();

  return (
    <div className={cn("tw-space-y-2", className)} {...props}>
      {label && (
        <Label
          htmlFor={childId}
          className={
            required
              ? "tw-after:tw-content-['*'] tw-after:tw-text-destructive tw-after:tw-ml-1"
              : ""
          }
        >
          {label}
        </Label>
      )}
      {React.cloneElement(
        children as React.ReactElement,
        {
          id: childId,
          "aria-invalid": !!error,
          "aria-describedby": error ? errorId : undefined,
        } as any
      )}
      {error && (
        <p id={errorId} className="tw-text-sm tw-text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
```

## 🎨 Theme Implementation

### 1. Theme Provider

```typescript
// src/new-ui/providers/ThemeProvider.tsx
import * as React from "react";

type Theme = "light" | "dark" | "system";

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
}

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "fabmanage-theme",
}: ThemeProviderProps): React.ReactElement {
  const [theme, setTheme] = React.useState<Theme>(defaultTheme);

  React.useEffect(() => {
    const root = window.document.documentElement;

    root.classList.remove("light", "dark");

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";

      root.classList.add(systemTheme);
      return;
    }

    root.classList.add(theme);
  }, [theme]);

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme);
      setTheme(theme);
    },
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

const ThemeContext = React.createContext<{
  theme: Theme;
  setTheme: (theme: Theme) => void;
}>({
  theme: "system",
  setTheme: () => {},
});

export const useTheme = () => {
  const context = React.useContext(ThemeContext);

  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
};
```

### 2. Theme Toggle Component

```typescript
// src/new-ui/components/ThemeToggle.tsx
import { Button } from "@/new-ui/atoms/Button/Button";
import { Icon } from "@/new-ui/atoms/Icon/Icon";
import { useTheme } from "@/new-ui/providers/ThemeProvider";

export function ThemeToggle(): React.ReactElement {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      aria-label="Toggle theme"
    >
      <Icon
        name={theme === "light" ? "moon" : "sun"}
        className="tw-h-4 tw-w-4"
      />
    </Button>
  );
}
```

## 📱 Responsive Design

### 1. Breakpoint Utilities

```typescript
// src/new-ui/utils/responsive.ts
export const breakpoints = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
} as const;

export type Breakpoint = keyof typeof breakpoints;

export function useBreakpoint(breakpoint: Breakpoint): boolean {
  const [matches, setMatches] = React.useState(false);

  React.useEffect(() => {
    const mediaQuery = window.matchMedia(
      `(min-width: ${breakpoints[breakpoint]})`
    );

    setMatches(mediaQuery.matches);

    const handler = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    mediaQuery.addEventListener("change", handler);

    return () => {
      mediaQuery.removeEventListener("change", handler);
    };
  }, [breakpoint]);

  return matches;
}
```

### 2. Responsive Component Example

```typescript
// src/new-ui/components/ResponsiveCard.tsx
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/new-ui/molecules/Card/Card";
import { useBreakpoint } from "@/new-ui/utils/responsive";

export function ResponsiveCard(): React.ReactElement {
  const isMobile = !useBreakpoint("md");
  const isTablet = useBreakpoint("md") && !useBreakpoint("lg");

  return (
    <Card
      className={cn(
        "tw-w-full",
        isMobile && "tw-p-4",
        isTablet && "tw-p-6",
        !isMobile && !isTablet && "tw-p-8"
      )}
    >
      <CardHeader>
        <CardTitle>
          {isMobile ? "Mobile View" : isTablet ? "Tablet View" : "Desktop View"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p>This card adapts its padding based on screen size.</p>
      </CardContent>
    </Card>
  );
}
```

## ♿ Accessibility Implementation

### 1. Focus Management

```typescript
// src/new-ui/utils/focus.ts
export function trapFocus(element: HTMLElement): () => void {
  const focusableElements = element.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );

  const firstElement = focusableElements[0] as HTMLElement;
  const lastElement = focusableElements[
    focusableElements.length - 1
  ] as HTMLElement;

  const handleTabKey = (e: KeyboardEvent) => {
    if (e.key !== "Tab") return;

    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        lastElement.focus();
        e.preventDefault();
      }
    } else {
      if (document.activeElement === lastElement) {
        firstElement.focus();
        e.preventDefault();
      }
    }
  };

  element.addEventListener("keydown", handleTabKey);
  firstElement?.focus();

  return () => {
    element.removeEventListener("keydown", handleTabKey);
  };
}
```

### 2. ARIA Utilities

```typescript
// src/new-ui/utils/aria.ts
export function generateId(prefix = "id"): string {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
}

export function announceToScreenReader(message: string): void {
  const announcement = document.createElement("div");
  announcement.setAttribute("aria-live", "polite");
  announcement.setAttribute("aria-atomic", "true");
  announcement.className = "tw-sr-only";
  announcement.textContent = message;

  document.body.appendChild(announcement);

  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}
```

## 🧪 Testing Implementation

### 1. Component Testing Setup

```typescript
// src/new-ui/__tests__/Button.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { Button } from "@/new-ui/atoms/Button/Button";

describe("Button", () => {
  it("renders with correct text", () => {
    render(<Button>Click me</Button>);
    expect(
      screen.getByRole("button", { name: "Click me" })
    ).toBeInTheDocument();
  });

  it("handles click events", () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    fireEvent.click(screen.getByRole("button"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("shows loading state", () => {
    render(<Button loading>Loading</Button>);
    expect(screen.getByRole("button")).toBeDisabled();
    expect(screen.getByRole("button")).toHaveClass("tw-animate-spin");
  });

  it("applies correct variant classes", () => {
    render(<Button variant="destructive">Delete</Button>);
    expect(screen.getByRole("button")).toHaveClass("tw-bg-destructive");
  });
});
```

### 2. Accessibility Testing

```typescript
// src/new-ui/__tests__/Button.a11y.test.tsx
import { render } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import { Button } from "@/new-ui/atoms/Button/Button";

expect.extend(toHaveNoViolations);

describe("Button Accessibility", () => {
  it("should not have accessibility violations", async () => {
    const { container } = render(<Button>Accessible Button</Button>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("should have proper ARIA attributes when disabled", async () => {
    const { container } = render(<Button disabled>Disabled Button</Button>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
```

## 📦 Bundle Optimization

### 1. Tree Shaking Configuration

```typescript
// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          "design-system": [
            "./src/new-ui/atoms",
            "./src/new-ui/molecules",
            "./src/new-ui/organisms",
          ],
        },
      },
    },
  },
});
```

### 2. Dynamic Imports

```typescript
// src/new-ui/components/LazyComponents.tsx
import { lazy, Suspense } from "react";
import { Spinner } from "@/new-ui/atoms/Spinner/Spinner";

const DataTable = lazy(() => import("@/new-ui/organisms/DataTable/DataTable"));
const Chart = lazy(() => import("@/new-ui/organisms/Chart/Chart"));

export function LazyDataTable(props: any) {
  return (
    <Suspense fallback={<Spinner />}>
      <DataTable {...props} />
    </Suspense>
  );
}

export function LazyChart(props: any) {
  return (
    <Suspense fallback={<Spinner />}>
      <Chart {...props} />
    </Suspense>
  );
}
```

## 🚀 Performance Optimization

### 1. Memoization

```typescript
// src/new-ui/components/OptimizedCard.tsx
import { memo, useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/new-ui/molecules/Card/Card";

interface OptimizedCardProps {
  title: string;
  content: string;
  items: Array<{ id: string; name: string }>;
}

export const OptimizedCard = memo<OptimizedCardProps>(
  ({ title, content, items }) => {
    const sortedItems = useMemo(() => {
      return items.sort((a, b) => a.name.localeCompare(b.name));
    }, [items]);

    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{content}</p>
          <ul>
            {sortedItems.map((item) => (
              <li key={item.id}>{item.name}</li>
            ))}
          </ul>
        </CardContent>
      </Card>
    );
  }
);

OptimizedCard.displayName = "OptimizedCard";
```

### 2. Virtual Scrolling

```typescript
// src/new-ui/organisms/VirtualList/VirtualList.tsx
import { FixedSizeList as List } from "react-window";

interface VirtualListProps<T> {
  items: T[];
  height: number;
  itemHeight: number;
  renderItem: (props: {
    index: number;
    style: React.CSSProperties;
    data: T;
  }) => React.ReactNode;
}

export function VirtualList<T>({
  items,
  height,
  itemHeight,
  renderItem,
}: VirtualListProps<T>): React.ReactElement {
  return (
    <List
      height={height}
      itemCount={items.length}
      itemSize={itemHeight}
      itemData={items}
    >
      {({ index, style, data }) =>
        renderItem({ index, style, data: data[index] })
      }
    </List>
  );
}
```

## 🔧 Development Tools

### 1. Storybook Configuration

```typescript
// .storybook/main.ts
import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  stories: ["../src/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: [
    "@storybook/addon-essentials",
    "@storybook/addon-a11y",
    "@storybook/addon-design-tokens",
  ],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  typescript: {
    check: false,
    reactDocgen: "react-docgen-typescript",
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      propFilter: (prop) =>
        prop.parent ? !/node_modules/.test(prop.parent.fileName) : true,
    },
  },
};

export default config;
```

### 2. Design Token Sync

```typescript
// scripts/sync-tokens.ts
import { syncFigmaTokens } from "@figma/tokens-sync";

async function syncTokens() {
  try {
    await syncFigmaTokens({
      figmaFileId: process.env.FIGMA_FILE_ID,
      figmaToken: process.env.FIGMA_TOKEN,
      outputPath: "./src/new-ui/tokens/design-tokens.ts",
    });
    console.log("✅ Design tokens synced successfully");
  } catch (error) {
    console.error("❌ Failed to sync design tokens:", error);
  }
}

syncTokens();
```

This implementation guide provides a comprehensive foundation for building and maintaining the FabManage Design System. Follow these patterns and practices to ensure consistency, accessibility, and performance across your application.
