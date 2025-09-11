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