import '@testing-library/jest-dom'
import * as matchers from '@testing-library/jest-dom/matchers'
import { cleanup } from '@testing-library/react'
import { afterEach, beforeAll, expect } from 'vitest'

// Extend Vitest's expect with jest-dom matchers
expect.extend(matchers)

// Cleanup after each test case
afterEach(() => {
  cleanup()
})

// Mock design tokens
const mockDesignTokens = {
  colors: {
    foreground: {
      default: { value: '#0f172a' },
      secondary: { value: '#475569' },
      muted: { value: '#64748b' },
      accent: { value: '#94a3b8' },
      destructive: { value: '#dc2626' },
    },
    background: {
      default: { value: '#ffffff' },
      secondary: { value: '#f8fafc' },
      muted: { value: '#f1f5f9' },
      accent: { value: '#e2e8f0' },
      destructive: { value: '#fef2f2' },
    },
    border: {
      default: { value: '#e2e8f0' },
      secondary: { value: '#cbd5e1' },
      accent: { value: '#94a3b8' },
      destructive: { value: '#fecaca' },
    },
    sidebar: {
      DEFAULT: { value: '#09090b' },
      foreground: { value: '#f2f2f2' },
      primary: { value: '#f2f2f2' },
      'primary-foreground': { value: '#09090b' },
      accent: { value: '#27272a' },
      'accent-foreground': { value: '#f2f2f2' },
      border: { value: '#27272a' },
      input: { value: '#27272a' },
      ring: { value: '#1677ff' },
    },
    brand: {
      primary: { value: '#1677ff' },
      secondary: { value: '#52c41a' },
      accent: { value: '#faad14' },
      destructive: { value: '#ff4d4f' },
    },
  },
  spacing: {
    xs: { value: '0.25rem' },
    sm: { value: '0.5rem' },
    md: { value: '1rem' },
    lg: { value: '1.5rem' },
    xl: { value: '2rem' },
    '2xl': { value: '3rem' },
  },
  radius: {
    sm: { value: '0.125rem' },
    md: { value: '0.375rem' },
    lg: { value: '0.5rem' },
    xl: { value: '0.75rem' },
  },
  typography: {
    fontFamily: {
      sans: { value: 'Inter, sans-serif' },
      mono: { value: 'JetBrains Mono, monospace' },
    },
    fontSize: {
      xs: { value: '0.75rem' },
      sm: { value: '0.875rem' },
      base: { value: '1rem' },
      lg: { value: '1.125rem' },
      xl: { value: '1.25rem' },
      '2xl': { value: '1.5rem' },
      '3xl': { value: '1.875rem' },
      '4xl': { value: '2.25rem' },
    },
    fontWeight: {
      normal: { value: '400' },
      medium: { value: '500' },
      semibold: { value: '600' },
      bold: { value: '700' },
    },
  },
}

// Mock design system module
vi.mock('@/design-system', () => ({
  designTokens: mockDesignTokens,
  getCSSVariable: vi.fn((path: string) => `var(--${path.replace(/\./g, '-')})`),
  getTokenValue: vi.fn((path: string) => {
    const keys = path.split('.')
    let value = mockDesignTokens
    for (const key of keys) {
      value = value[key]
    }
    return value?.value || ''
  }),
}))

// Mock design system hooks
vi.mock('@/design-system/hooks/useDesignTokens', () => ({
  useDesignTokens: vi.fn(() => mockDesignTokens),
}))

// Mock CSS variables
beforeAll(() => {
  // Create a style element with CSS variables
  const style = document.createElement('style')
  style.textContent = `
    :root {
      --color-foreground-default: #0f172a;
      --color-foreground-secondary: #475569;
      --color-foreground-muted: #64748b;
      --color-foreground-accent: #94a3b8;
      --color-foreground-destructive: #dc2626;
      --color-background-default: #ffffff;
      --color-background-secondary: #f8fafc;
      --color-background-muted: #f1f5f9;
      --color-background-accent: #e2e8f0;
      --color-background-destructive: #fef2f2;
      --color-border-default: #e2e8f0;
      --color-border-secondary: #cbd5e1;
      --color-border-accent: #94a3b8;
      --color-border-destructive: #fecaca;
      --color-sidebar-DEFAULT: #09090b;
      --color-sidebar-foreground: #f2f2f2;
      --color-sidebar-primary: #f2f2f2;
      --color-sidebar-primary-foreground: #09090b;
      --color-sidebar-accent: #27272a;
      --color-sidebar-accent-foreground: #f2f2f2;
      --color-sidebar-border: #27272a;
      --color-sidebar-input: #27272a;
      --color-sidebar-ring: #1677ff;
      --color-brand-primary: #1677ff;
      --color-brand-secondary: #52c41a;
      --color-brand-accent: #faad14;
      --color-brand-destructive: #ff4d4f;
      --spacing-xs: 0.25rem;
      --spacing-sm: 0.5rem;
      --spacing-md: 1rem;
      --spacing-lg: 1.5rem;
      --spacing-xl: 2rem;
      --spacing-2xl: 3rem;
      --radius-sm: 0.125rem;
      --radius-md: 0.375rem;
      --radius-lg: 0.5rem;
      --radius-xl: 0.75rem;
      --font-family-sans: Inter, sans-serif;
      --font-family-mono: JetBrains Mono, monospace;
      --font-size-xs: 0.75rem;
      --font-size-sm: 0.875rem;
      --font-size-base: 1rem;
      --font-size-lg: 1.125rem;
      --font-size-xl: 1.25rem;
      --font-size-2xl: 1.5rem;
      --font-size-3xl: 1.875rem;
      --font-size-4xl: 2.25rem;
      --font-weight-normal: 400;
      --font-weight-medium: 500;
      --font-weight-semibold: 600;
      --font-weight-bold: 700;
    }
  `
  document.head.appendChild(style)
})

// Mock Tailwind CSS classes
beforeAll(() => {
  // Add Tailwind CSS classes to document
  const tailwindStyle = document.createElement('style')
  tailwindStyle.textContent = `
    .tw-bg-primary { background-color: var(--color-brand-primary); }
    .tw-bg-secondary { background-color: var(--color-brand-secondary); }
    .tw-bg-destructive { background-color: var(--color-brand-destructive); }
    .tw-text-primary { color: var(--color-brand-primary); }
    .tw-text-secondary { color: var(--color-brand-secondary); }
    .tw-text-destructive { color: var(--color-brand-destructive); }
    .tw-border-primary { border-color: var(--color-brand-primary); }
    .tw-border-secondary { border-color: var(--color-brand-secondary); }
    .tw-border-destructive { border-color: var(--color-brand-destructive); }
    .tw-p-xs { padding: var(--spacing-xs); }
    .tw-p-sm { padding: var(--spacing-sm); }
    .tw-p-md { padding: var(--spacing-md); }
    .tw-p-lg { padding: var(--spacing-lg); }
    .tw-p-xl { padding: var(--spacing-xl); }
    .tw-rounded-sm { border-radius: var(--radius-sm); }
    .tw-rounded-md { border-radius: var(--radius-md); }
    .tw-rounded-lg { border-radius: var(--radius-lg); }
    .tw-rounded-xl { border-radius: var(--radius-xl); }
    .tw-font-sans { font-family: var(--font-family-sans); }
    .tw-font-mono { font-family: var(--font-family-mono); }
    .tw-text-xs { font-size: var(--font-size-xs); }
    .tw-text-sm { font-size: var(--font-size-sm); }
    .tw-text-base { font-size: var(--font-size-base); }
    .tw-text-lg { font-size: var(--font-size-lg); }
    .tw-text-xl { font-size: var(--font-size-xl); }
    .tw-font-normal { font-weight: var(--font-weight-normal); }
    .tw-font-medium { font-weight: var(--font-weight-medium); }
    .tw-font-semibold { font-weight: var(--font-weight-semibold); }
    .tw-font-bold { font-weight: var(--font-weight-bold); }
  `
  document.head.appendChild(tailwindStyle)
})
