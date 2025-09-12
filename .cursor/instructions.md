# FabManage AI Context

## Architecture Overview
- **Frontend**: React 18 + TypeScript + Vite
- **UI Library**: Ant Design with custom theme
- **State Management**: Zustand with slice pattern
- **Data Fetching**: TanStack Query (React Query)
- **Backend**: Supabase (Auth, Database, Storage, Edge Functions)
- **Styling**: CSS Modules + Ant Design
- **Testing**: Vitest + Playwright
- **Deployment**: Docker + Nginx

## Key Patterns
- All modals are side-drawers from the right
- Unified tile edit experience across all pages
- RORO pattern for functions
- Zod for validation
- React.memo for performance

## File Structure
- `/src/components` - Reusable UI components
- `/src/pages` - Route components
- `/src/stores` - Zustand stores
- `/src/services` - API services
- `/src/hooks` - Custom React hooks
- `/src/types` - TypeScript type definitions
- `/src/lib` - Utility functions

## Important Files
- `src/App.tsx` - Main app component
- `src/main.tsx` - App entry point
- `vite.config.ts` - Build configuration
- `package.json` - Dependencies and scripts

