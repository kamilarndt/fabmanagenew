## FabManage-Clean Documentation

This directory contains the official, living documentation for the FabManage-Clean application. It follows pragmatic, industry-aligned standards for React/TypeScript web platforms backed by Supabase, with Dockerized deployment and PWA support.

### Table of contents
- Architecture overview: [architecture.md](./architecture.md)
- Frontend guidelines: [frontend.md](./frontend.md)
- UI/UX (Ant Design) guidelines: [ui-ux.md](./ui-ux.md)
- Security & compliance: [security.md](./security.md)
- API reference: [api.md](./api.md)
- Testing strategy: [testing.md](./testing.md)
- Deployment guide (Docker, PWA): [deployment.md](./deployment.md)
- Architecture Decision Records (ADRs): [adr/](./adr/)
- Contributing guide: [contributing.md](./contributing.md)

### About this documentation
- Audience: product engineers, SREs/DevOps, QA, and stakeholders
- Scope: technical architecture, coding standards, operational runbooks, and compliance baselines
- Source of truth: this repository; documentation is versioned with the code

### Quick facts
- Frontend: React 18, TypeScript (strict), Vite, Ant Design, Zustand, TanStack Query
- Backend: Supabase (Auth/DB/Storage/Edge) + lightweight Node server for demo/local integration
- Quality: ESLint, Vitest, Playwright
- Deploy: Docker multi-stage, Nginx static hosting, PWA

### Getting started
1) Install dependencies: `npm ci`
2) Run development server: `npm run dev`
3) Lint/typecheck/tests:
   - `npm run lint`
   - `npm run type-check`
   - `npm run test`
4) Production build: `npm run build`

For a deeper overview, start with [architecture.md](./architecture.md).


