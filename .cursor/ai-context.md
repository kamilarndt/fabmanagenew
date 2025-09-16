# FabManage AI Context

## Architecture Overview

- **Frontend**: React 19 + TypeScript + Vite + PWA
- **UI System**: Strangler Fig Pattern (Ant Design → Shadcn/UI + Radix)
- **State Management**: Zustand with slice pattern
- **Data Fetching**: TanStack Query (React Query)
- **Backend**: Supabase (Auth, Database, Storage, Edge Functions)
- **Styling**: Tailwind CSS + Design Tokens + CSS Modules
- **Testing**: Vitest + Playwright + Storybook
- **Deployment**: Docker + Nginx
- **Design System**: Figma MCP Integration + Design Tokens

## Key Patterns

- All modals are side-drawers from the right
- Unified tile edit experience across all pages
- RORO pattern for functions
- Zod for validation
- React.memo for performance
- Strangler Fig migration pattern for UI components
- Design tokens from Figma via MCP

## File Structure

- `/src/components` - Legacy Ant Design components
- `/src/new-ui` - New Shadcn/UI + Radix components
  - `/atoms` - Basic UI components (Button, Input, etc.)
  - `/molecules` - Composite components (FormField, SearchBox, etc.)
  - `/organisms` - Complex components (DataTable, Sheet, etc.)
  - `/templates` - Page layouts
  - `/tokens` - Design tokens from Figma
- `/src/bridge-ui` - Strangler Fig adapters
- `/src/pages` - Route components
- `/src/stores` - Zustand stores
- `/src/services` - API services
- `/src/hooks` - Custom React hooks
- `/src/types` - TypeScript type definitions
- `/src/lib` - Utility functions

## Design System

- **Design Tokens**: Generated from Figma via MCP
- **Color System**: Semantic colors with dark/light themes
- **Typography**: Consistent scale with proper hierarchy
- **Spacing**: 8px grid system
- **Components**: Atomic design methodology
- **Accessibility**: WCAG 2.1 AA compliance

## Important Files

- `src/App.tsx` - Main app component
- `src/main.tsx` - App entry point
- `vite.config.ts` - Build configuration with chunk splitting
- `tailwind.config.js` - Tailwind with design tokens
- `package.json` - Dependencies and scripts
- `src/new-ui/tokens/design-tokens.ts` - Figma design tokens
- `src/new-ui/tokens/tailwind-tokens.ts` - Tailwind integration
