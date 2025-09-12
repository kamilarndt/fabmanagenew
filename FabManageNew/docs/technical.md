High-level Technical Architecture: FabrykaManage
Overview
This document outlines the high-level technical architecture for FabrykaManage, a production management system. The system is architected as a modern Single Page Application (SPA) using React, communicating with a powerful Backend-as-a-Service (BaaS) platform, Supabase. This approach ensures scalability, real-time capabilities, and rapid development.

Technology Stack
Frontend Framework: React (with Vite)

UI Library: Ant Design

State Management: Zustand (for UI state) & TanStack Query (for server state)

Language: TypeScript

Backend-as-a-Service (BaaS): Supabase

Database: PostgreSQL (via Supabase)

Authentication: Supabase Auth (JWT)

File Storage: Supabase Storage

Realtime Engine: Supabase Realtime

Serverless Functions: Supabase Edge Functions (for custom business logic)

Core Entities (Database Schema)
1. Project Entity
Represents a single project for a client. It's the central hub connecting all other entities.

// Based on: src/types/projects.types.ts
@Entity()
export class Project {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column()
  numer: string;

  @ManyToOne(() => Client)
  client: Client;

  @Column({ type: "varchar" })
  status: 'Nowy' | 'W realizacji' | 'Wstrzymany' | 'Zakończony';

  @Column({ type: "date" })
  deadline: string;
  
  @Column({ type: "jsonb", nullable: true })
  modules: string[];
}

2. Tile (Element) Entity
Represents a single production component ("kafelek") within a project. It contains the Bill of Materials (BOM).

// Based on: src/types/tiles.types.ts
@Entity()
export class Tile {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => Project)
  project: Project;

  @Column()
  name: string;

  @Column({ type: "varchar" })
  status: 'W KOLEJCE' | 'Projektowanie' | 'Zaakceptowane' | 'W produkcji CNC' | 'Gotowy do montażu';

  @Column({ type: "jsonb", nullable: true })
  bom: BomItem[];

  @Column({ type: "decimal", nullable: true })
  laborCost: number;

  @Column({ nullable: true })
  link_model_3d: string;
}

3. Material Entity
Represents a single material in the warehouse.

// Based on: src/hooks/useMaterialsQuery.ts
@Entity()
export class Material {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ unique: true })
  code: string;

  @Column()
  name: string;
  
  @Column("varchar", { array: true })
  category: string[];

  @Column({ type: "decimal" })
  quantity: number;

  @Column({ type: "decimal" })
  min_quantity: number;

  @Column({ type: "decimal" })
  unitCost: number;
}

4. User Entity (Managed by Supabase Auth)
Users are managed by Supabase Auth, and their profiles with roles and permissions are stored in a profiles table.

-- Table: public.profiles
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'manager', 'designer', 'production')),
  avatar_url TEXT
);

Realtime Architecture
The application leverages Supabase Realtime for live updates, eliminating the need for manual polling.

Realtime Subscription Service
// src/lib/realtime.ts
import { supabase } from './supabase';

export function subscribeToTable(table, callback) {
  const channel = supabase
    .channel(`public:${table}`)
    .on('postgres_changes', { event: '*', schema: 'public', table }, payload => {
      callback(payload);
    })
    .subscribe();
  
  return channel;
}

State Management Integration (in Zustand stores)
// Example in src/stores/projectsStore.ts
// ...
const channel = subscribeToTable('projects', (payload) => {
  if (payload.eventType === 'INSERT') {
    // Add new project to state
  }
  if (payload.eventType === 'UPDATE') {
    // Update existing project in state
  }
});
// ...

Backend & API Configuration
Supabase Client Initialization
// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

Centralized API Client (for Serverless Functions)
// src/lib/httpClient.ts
import axios from 'axios';

const httpClient = axios.create({
  baseURL: `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/`,
  headers: {
    'Content-Type': 'application/json',
  },
});

httpClient.interceptors.request.use(async (config) => {
  const { data: { session } } = await supabase.auth.getSession();
  if (session) {
    config.headers.Authorization = `Bearer ${session.access_token}`;
  }
  return config;
});

Key Services & Integrations
Production Time Calculator Service
A serverless function that processes DXF files to estimate production time.

// supabase/functions/calculate-time/index.ts
import { serve } from 'https/deno.land/std/http/server.ts';
import { ProductionTimeCalculator } from './_lib/calculator.ts';

serve(async (req) => {
  const { dxfFileContent } = await req.json();
  // ... logic to parse and calculate time
  const result = ProductionTimeCalculator.calculate(dxfFileContent);
  return new Response(JSON.stringify(result), {
    headers: { 'Content-Type': 'application/json' },
  });
});

CAD Integration (Speckle)
Integration for 3D model viewing and metadata extraction, handled by serverless functions.

// supabase/functions/speckle-webhook/index.ts
// Receives updates from Speckle streams
serve(async (req) => {
    const payload = await req.json();
    const projectId = payload.projectId;
    const streamId = payload.streamId;
    
    // Logic to update project's link_model_3d
    // and potentially extract BOM data
    
    return new Response('OK');
});

Security Implementations
Row Level Security (RLS) in Supabase
Access control is enforced directly in the database, ensuring data security.

-- Example RLS Policy for Projects
-- Users can only see projects they are assigned to (via a join table).
CREATE POLICY "Allow read access to assigned users"
ON public.projects
FOR SELECT
USING (auth.uid() IN (
  SELECT user_id FROM project_assignments WHERE project_id = id
));

-- Managers and admins can do anything.
CREATE POLICY "Allow full access for managers and admins"
ON public.projects
FOR ALL
USING (get_my_claim('role') IN ('manager', 'admin'))
WITH CHECK (get_my_claim('role') IN ('manager', 'admin'));

Deployment Architecture
Frontend Docker Configuration
# Dockerfile for React Frontend
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Serve using a static file server
FROM nginx:stable-alpine
COPY --from=0 /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

Local Development with Docker Compose
# docker-compose.yml
version: "3.8"
services:
  frontend:
    build: .
    ports:
      - "5173:80" # Maps container's port 80 to host's 5173
    
  # Supabase local development stack
  # Use Supabase CLI: `supabase start`

Scaling Considerations
Horizontal Scaling:

The frontend is a static build, scalable globally via any CDN (Vercel, Netlify).

Supabase scales automatically. Serverless functions scale based on demand.

Performance Optimization:

Frontend: Leverage TanStack Query for caching, reducing redundant API calls. Use code splitting (lazy loading) for pages and heavy components.

Backend: Optimize PostgreSQL queries, add necessary indexes, and use database connection pooling.

Monitoring and Logging:

Integrate Sentry for frontend error monitoring.

Use Supabase's built-in logging and monitoring tools for the backend.

Development Workflow
Local Development:

Use npm run dev to start the Vite development server.

Use supabase start to run the entire backend stack locally in Docker.

Testing Strategy:

Unit/Integration Tests: Use Vitest and React Testing Library for frontend components and hooks.

E2E Tests: Use Playwright or Cypress for end-to-end testing of user flows.

// Example test in src/components/ProjectCard.spec.tsx
import { render, screen } from '@testing-library/react';
import { ProjectCard } from './ProjectCard';

describe('ProjectCard', () => {
  it('should render project name correctly', () => {
    const mockProject = { /* ... */ };
    render(<ProjectCard project={mockProject} />);
    expect(screen.getByText('Project Name')).toBeInTheDocument();
  });
});

Future Considerations
Full PWA Implementation: Enhance offline capabilities, allowing users to work without an internet connection and sync data upon reconnection.

Advanced Analytics: Integrate a dedicated analytics service to gather insights on production bottlenecks and team performance.

Extensibility: Develop a plugin architecture to allow for custom integrations (e.g., accounting software, client CRMs).

### Analyzer Rules: Code QA + Task Generator for FabrykaManage

Purpose

- Define how an automated analyzer model evaluates this repository (React + Vite + Ant Design + Zustand + TanStack Query + Supabase) and emits precise, actionable tasks for a separate fixer model
- Align findings to our architecture and UX conventions

Operating Mode

- Inputs: working tree, this document, `package.json` scripts, Vite config, ESLint config, TypeScript configs, Docker files, Supabase functions and SQL, test folders
- Outputs: 1) concise Markdown report, 2) machine-readable task list (JSON schema below)
- Priorities (descending): Security & data integrity > RLS/authorization correctness > Performance & DX (build size, speed) > UX consistency > Code clarity
- Respect product conventions: single, unified tile edit experience and side-drawer modals opening from the right [[memory:8536734]] [[memory:8536213]]

Validation Pipeline (non-interactive)

1. Install: `npm ci` (or `npm install` if lock update required)
2. Lint: `npm run lint`
3. Type-check: `tsc -b --pretty false`
4. Build: `npm run build`
5. Unit tests (if configured): `npx vitest run --reporter=dot`
6. Smoke/E2E (optional locally): `npm run test:smoke` and/or `npm run playwright:smoke`
7. Bundle analysis: verify `dist/stats.html` exists (Vite visualizer); flag any single JS chunk > 300KB gzip

Checks & Heuristics

1) Architecture & Config

- Vite: ensure chunking groups are effective (`react-vendor`, `antd-vendor`, `calendar-vendor`, `forms-vendor`, `http-vendor`, `state-vendor`, `dnd-vendor`, `utils-vendor`, `three-vendor`); report large residual `vendor` chunk
- PWA: `VitePWA` config present; flag missing icons, oversize Workbox cache (>6MB per asset) and disabled `devOptions` only in dev
- Docker: frontend build works and exposes static assets via Nginx; ensure no secrets baked into image

2) TypeScript & ESLint

- TS strictness: fail on implicit any, unreachable code, unused locals; prefer `interface` for object contracts
- Enforce consistent type imports, no `any` in exported types, eliminate unused variables, prefer RORO
- Public exports and component props must be explicitly typed

3) React & Ant Design

- Functional components only; named exports; avoid inline lambdas in JSX props for hot paths
- Use `React.memo` selectively; wrap expensive lists with virtualization where needed (`react-window`)
- AntD: prefer controlled components, form validation via Zod + React Hook Form resolvers; tree-shaking safe imports
- Loading and empty states must be explicit; all lists require stable `key` (no index unless immutable order)

4) State & Data (Zustand + TanStack Query)

- Zustand: create focused slices; use selectors to minimize re-renders; avoid storing server cache
- React Query: define `queryKey` factories, set `staleTime`/`gcTime`; use mutations with optimistic updates and rollback; no `useEffect` for fetching when Query can handle it

5) Supabase (Auth, RLS, Realtime, Storage, Edge Functions)

- Client: never ship service-role keys; auth token attached via interceptor only
- RLS: verify policies exist for projects/materials/tiles; managers/admins have full, others scoped by assignment
- Realtime: subscriptions cleaned on unmount; channel names scoped; debounce UI updates if high-frequency
- Storage: bucket policies restrict cross-tenant read/write; signed URLs for private assets with proper TTL
- Edge Functions: validate inputs with Zod; return problem details JSON on errors; avoid long CPU tasks in request path

6) Security

- Sanitize any HTML with DOMPurify; validate all user inputs; never interpolate untrusted strings into `dangerouslySetInnerHTML`
- Secrets from environment only; forbid leaking keys into client bundles
- Add rate limiting and error redaction in serverless endpoints

7) Performance & Web Vitals

- Enforce image optimization (WebP preferred), lazy loading, explicit sizes
- Code-split heavy views (CAD/Speckle, DXF) via dynamic import; ensure those bundles do not load on unrelated screens
- Set performance budgets: each route total JS < 250KB gzip; flag regressions against `dist/stats.html`

8) Accessibility

- Semantic HTML with ARIA as needed; keyboard navigation; focus management on dialogs/drawers; color contrast AA+

9) CAD/Speckle/DXF

- Load Speckle viewer and DXF parsing lazily; consider running parsing in a Web Worker; avoid blocking main thread

10) UX Consistency

- Tile editing uses a single shared component and presents as a right-side Drawer for all pages [[memory:8536734]] [[memory:8219734]]
- All modals default to right-side sliding drawers with consistent widths and close behavior; no disparate modal styles [[memory:8219734]]

Deliverables

- Markdown report: sections for Failures, Warnings, Infos, with file links and suggested edits
- JSON tasks: one per issue with severity and clear acceptance criteria

Task JSON Schema (Analyzer → Fixer)

```json
{
  "id": "string",
  "title": "Fix: concise, outcome-focused",
  "severity": "critical|high|medium|low",
  "priority": "P0|P1|P2|P3",
  "area": "security|rls|performance|ux|accessibility|typescript|lint|build|supabase|testing|docs|devops",
  "files": ["relative/path.tsx"],
  "summary": "What is wrong and why it matters",
  "proposed_solution": "Approach at a high level",
  "acceptance_criteria": ["measurable outcome 1", "measurable outcome 2"],
  "repro_steps": ["optional reproduction steps"],
  "blockers": ["optional known dependencies"]
}
```

Severity & Priority Mapping

- critical: security/authorization flaws, data loss, broken builds → P0
- high: significant performance regressions, UX-breaking bugs → P1
- medium: maintainability, a11y issues, missing tests → P2
- low: stylistic inconsistencies, minor refactors → P3

Stop Criteria

- Build, lint, and type-check pass; no critical/high issues remain; performance budgets satisfied

Notes for Fixer Model

- Prefer minimal, localized edits; include tests when changing logic
- For UX changes, conform to the unified side-drawer pattern for edits and modals ([[memory:8536734]], [[memory:8219734]])