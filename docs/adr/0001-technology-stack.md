## ADR 0001: Technology Stack

Status: Accepted
Date: 2025-09-12

### Context
We need a modern, type-safe stack for a production management system with fast iteration, strong typing, and robust ecosystem support.

### Decision
- Frontend: React 18 + TypeScript + Vite
- UI: Ant Design (custom theme)
- State: Zustand (slice pattern) + TanStack Query
- Backend: Supabase (Auth/DB/Storage, RLS policies), optional Node/Express for local demo
- Tooling: ESLint, Vitest, Playwright
- Deploy: Docker multi-stage, Nginx static hosting, PWA

### Consequences
- Rapid DX with strong type safety and predictable performance
- Clear separation of concerns (components, stores, services)
- RLS + Zod validation cover security and data integrity
- PWA + Docker enable flexible deployment targets


