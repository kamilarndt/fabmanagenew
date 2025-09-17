# Testing Strategy

This document outlines the comprehensive testing strategy for the FabManage-Clean application, covering unit tests, integration tests, end-to-end tests, and visual regression testing.

## 🎯 Testing Philosophy

### Testing Pyramid

- **Unit Tests (70%)**: Fast, isolated tests for individual components and functions
- **Integration Tests (20%)**: Test component interactions and API integration
- **E2E Tests (10%)**: Full user workflow testing in real browser environment

### Quality Gates

- **Code Coverage**: Minimum 80% code coverage for all components
- **Performance**: All tests must complete within acceptable time limits
- **Accessibility**: All components must pass accessibility tests
- **Visual Regression**: No unintended visual changes allowed

## 🧪 Testing Tools & Setup

### Core Testing Framework

- **Vitest**: Fast unit testing framework
- **Testing Library**: Component testing utilities
- **Playwright**: End-to-end testing
- **Storybook**: Component documentation and visual testing
- **Jest DOM**: Custom matchers for DOM testing

### Testing Configuration

```typescript
// vitest.config.ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: [
        "node_modules/",
        "src/test/",
        "**/*.d.ts",
        "**/*.stories.tsx",
        "**/*.config.*",
      ],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
```

## 🔬 Unit Testing

### Component Testing Patterns

#### Basic Component Test

```typescript
// Button.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { Button } from "@/new-ui/atoms/Button/Button";

describe("Button", () => {
  test("renders with correct text", () => {
    render(<Button>Click me</Button>);
    expect(
      screen.getByRole("button", { name: "Click me" })
    ).toBeInTheDocument();
  });

  test("applies correct variant classes", () => {
    render(<Button variant="primary">Primary</Button>);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("tw-bg-primary");
  });

  test("handles click events", () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    fireEvent.click(screen.getByRole("button"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test("is disabled when disabled prop is true", () => {
    render(<Button disabled>Disabled</Button>);
    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
  });
});
```

#### Form Component Test

```typescript
// FormField.test.tsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FormField } from "@/new-ui/molecules/FormField/FormField";

describe("FormField", () => {
  test("renders label and input", () => {
    render(
      <FormField label="Email" name="email">
        <input type="email" />
      </FormField>
    );

    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  test("shows validation error", async () => {
    const user = userEvent.setup();

    render(
      <FormField label="Email" name="email" error="Invalid email">
        <input type="email" />
      </FormField>
    );

    expect(screen.getByText("Invalid email")).toBeInTheDocument();
  });

  test("calls onChange when input changes", async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();

    render(
      <FormField label="Email" name="email">
        <input type="email" onChange={handleChange} />
      </FormField>
    );

    await user.type(screen.getByRole("textbox"), "test@example.com");
    expect(handleChange).toHaveBeenCalled();
  });
});
```

### Hook Testing

```typescript
// useProjects.test.ts
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useProjects } from "@/hooks/useProjects";

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("useProjects", () => {
  test("fetches projects successfully", async () => {
    const { result } = renderHook(() => useProjects(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toBeDefined();
  });
});
```

### Utility Function Testing

```typescript
// utils.test.ts
import { formatDate, validateEmail, debounce } from "@/utils";

describe("formatDate", () => {
  test("formats date correctly", () => {
    const date = new Date("2025-01-16T10:30:00Z");
    expect(formatDate(date)).toBe("Jan 16, 2025");
  });
});

describe("validateEmail", () => {
  test("validates correct email", () => {
    expect(validateEmail("test@example.com")).toBe(true);
  });

  test("rejects invalid email", () => {
    expect(validateEmail("invalid-email")).toBe(false);
  });
});

describe("debounce", () => {
  test("debounces function calls", async () => {
    const mockFn = jest.fn();
    const debouncedFn = debounce(mockFn, 100);

    debouncedFn();
    debouncedFn();
    debouncedFn();

    await new Promise((resolve) => setTimeout(resolve, 150));
    expect(mockFn).toHaveBeenCalledTimes(1);
  });
});
```

## 🔗 Integration Testing

### API Integration Tests

```typescript
// api.test.ts
import { rest } from "msw";
import { setupServer } from "msw/node";
import { projectService } from "@/services/projectService";

const server = setupServer(
  rest.get("/api/projects", (req, res, ctx) => {
    return res(
      ctx.json([
        { id: "1", name: "Project 1", status: "active" },
        { id: "2", name: "Project 2", status: "completed" },
      ])
    );
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("Project Service", () => {
  test("fetches projects from API", async () => {
    const projects = await projectService.getProjects();

    expect(projects).toHaveLength(2);
    expect(projects[0]).toMatchObject({
      id: "1",
      name: "Project 1",
      status: "active",
    });
  });
});
```

### Component Integration Tests

```typescript
// ProjectList.test.tsx
import { render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ProjectList } from "@/components/ProjectList";

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("ProjectList Integration", () => {
  test("renders projects from API", async () => {
    render(<ProjectList />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText("Project 1")).toBeInTheDocument();
      expect(screen.getByText("Project 2")).toBeInTheDocument();
    });
  });

  test("handles loading state", () => {
    render(<ProjectList />, { wrapper: createWrapper() });
    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
  });

  test("handles error state", async () => {
    // Mock API error
    server.use(
      rest.get("/api/projects", (req, res, ctx) => {
        return res(ctx.status(500));
      })
    );

    render(<ProjectList />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText("Failed to load projects")).toBeInTheDocument();
    });
  });
});
```

## 🎭 End-to-End Testing

### Playwright Configuration

```typescript
// playwright.config.ts
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  use: {
    baseURL: "http://localhost:5173",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },
    {
      name: "Mobile Chrome",
      use: { ...devices["Pixel 5"] },
    },
  ],
  webServer: {
    command: "npm run dev",
    url: "http://localhost:5173",
    reuseExistingServer: !process.env.CI,
  },
});
```

### E2E Test Examples

```typescript
// tests/e2e/project-management.spec.ts
import { test, expect } from "@playwright/test";

test.describe("Project Management", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/projects");
  });

  test("creates a new project", async ({ page }) => {
    // Click create project button
    await page.click('[data-testid="create-project-button"]');

    // Fill form
    await page.fill('[data-testid="project-name-input"]', "Test Project");
    await page.fill(
      '[data-testid="project-description-input"]',
      "Test Description"
    );
    await page.selectOption('[data-testid="client-select"]', "client-1");

    // Submit form
    await page.click('[data-testid="submit-button"]');

    // Verify project was created
    await expect(page.locator('[data-testid="project-list"]')).toContainText(
      "Test Project"
    );
  });

  test("edits an existing project", async ({ page }) => {
    // Click edit button on first project
    await page.click(
      '[data-testid="project-item-0"] [data-testid="edit-button"]'
    );

    // Update project name
    await page.fill(
      '[data-testid="project-name-input"]',
      "Updated Project Name"
    );

    // Save changes
    await page.click('[data-testid="save-button"]');

    // Verify changes
    await expect(page.locator('[data-testid="project-item-0"]')).toContainText(
      "Updated Project Name"
    );
  });

  test("deletes a project", async ({ page }) => {
    // Get initial project count
    const initialCount = await page
      .locator('[data-testid="project-item"]')
      .count();

    // Click delete button on first project
    await page.click(
      '[data-testid="project-item-0"] [data-testid="delete-button"]'
    );

    // Confirm deletion
    await page.click('[data-testid="confirm-delete-button"]');

    // Verify project was deleted
    await expect(page.locator('[data-testid="project-item"]')).toHaveCount(
      initialCount - 1
    );
  });
});
```

## 🎨 Visual Regression Testing

### Storybook Visual Tests

```typescript
// Button.stories.tsx
import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "@/new-ui/atoms/Button/Button";

const meta: Meta<typeof Button> = {
  title: "Atoms/Button",
  component: Button,
  parameters: {
    layout: "centered",
    chromatic: { disableSnapshot: false },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    variant: "primary",
    children: "Primary Button",
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="tw-space-x-2">
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="destructive">Destructive</Button>
    </div>
  ),
};
```

### Chromatic Configuration

```typescript
// .storybook/main.ts
import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  stories: ["../src/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: [
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    "chromatic",
  ],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  chromatic: {
    projectToken: process.env.CHROMATIC_PROJECT_TOKEN,
  },
};

export default config;
```

## ♿ Accessibility Testing

### Automated A11y Tests

```typescript
// accessibility.test.tsx
import { render } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import { Button } from "@/new-ui/atoms/Button/Button";

expect.extend(toHaveNoViolations);

describe("Button Accessibility", () => {
  test("should not have accessibility violations", async () => {
    const { container } = render(<Button>Click me</Button>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test("should be keyboard accessible", async () => {
    const { container } = render(<Button>Click me</Button>);
    const button = container.querySelector("button");

    expect(button).toHaveAttribute("tabindex", "0");
    expect(button).toHaveAttribute("role", "button");
  });
});
```

### Manual A11y Testing Checklist

- [ ] All interactive elements are keyboard accessible
- [ ] Focus indicators are visible and clear
- [ ] Color contrast meets WCAG AA standards
- [ ] Screen reader announces content correctly
- [ ] Form labels are properly associated
- [ ] Error messages are announced to screen readers

## 📊 Performance Testing

### Component Performance Tests

```typescript
// performance.test.tsx
import { render } from "@testing-library/react";
import { Button } from "@/new-ui/atoms/Button/Button";

describe("Button Performance", () => {
  test("renders quickly", () => {
    const start = performance.now();
    render(<Button>Click me</Button>);
    const end = performance.now();

    expect(end - start).toBeLessThan(10); // Should render in less than 10ms
  });

  test("handles rapid clicks efficiently", () => {
    const handleClick = jest.fn();
    const { getByRole } = render(
      <Button onClick={handleClick}>Click me</Button>
    );
    const button = getByRole("button");

    // Simulate rapid clicks
    for (let i = 0; i < 100; i++) {
      button.click();
    }

    expect(handleClick).toHaveBeenCalledTimes(100);
  });
});
```

### Bundle Size Testing

```typescript
// bundle-size.test.ts
import { getBundleSize } from "@/utils/bundle-analysis";

describe("Bundle Size", () => {
  test("Button component bundle size is acceptable", () => {
    const size = getBundleSize("Button");
    expect(size).toBeLessThan(5000); // Less than 5KB
  });

  test("Total bundle size is within limits", () => {
    const totalSize = getBundleSize("total");
    expect(totalSize).toBeLessThan(1000000); // Less than 1MB
  });
});
```

## 🚀 Test Execution

### Running Tests

```bash
# Run all tests
npm run test

# Run unit tests only
npm run test:unit

# Run integration tests
npm run test:integration

# Run E2E tests
npm run test:e2e

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch

# Run specific test file
npm run test Button.test.tsx

# Run tests matching pattern
npm run test -- --grep "Button"
```

### CI/CD Integration

```yaml
# .github/workflows/test.yml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: "18"
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Run unit tests
        run: npm run test:unit

      - name: Run integration tests
        run: npm run test:integration

      - name: Run E2E tests
        run: npm run test:e2e

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          file: ./coverage/lcov.info
```

## 📈 Test Metrics & Reporting

### Coverage Reports

- **Line Coverage**: Percentage of code lines executed
- **Branch Coverage**: Percentage of code branches executed
- **Function Coverage**: Percentage of functions executed
- **Statement Coverage**: Percentage of statements executed

### Test Reports

- **HTML Reports**: Detailed HTML coverage reports
- **JSON Reports**: Machine-readable coverage data
- **Console Output**: Real-time test results
- **CI Integration**: Automated test reporting in CI/CD

### Quality Metrics

- **Test Execution Time**: Track test performance
- **Flaky Test Detection**: Identify unreliable tests
- **Coverage Trends**: Monitor coverage over time
- **Test Maintenance**: Track test maintenance effort

---

**Last Updated**: January 2025  
**Testing Strategy Version**: 2.0.0  
**Next Review**: March 2025
