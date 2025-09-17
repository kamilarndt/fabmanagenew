# Architecture Overview

FabManage-Clean is a modern production management system for scenography/decor projects. The platform integrates comprehensive project workflow, tile-based production, CNC preparation, materials/inventory management, logistics, and client management with a focus on real-time collaboration and advanced UI/UX.

## 🏗️ Technology Stack

### Frontend

- **React 18** + **TypeScript (strict)** + **Vite** - Modern development stack
- **Tailwind CSS** - Utility-first CSS framework with design tokens
- **Ant Design** - Enterprise UI component library with custom theme
- **Custom Design System** - Atomic design with Figma integration
- **Zustand** - Lightweight state management with slice pattern
- **TanStack Query** - Server state management and caching
- **React Router v7** - Client-side routing with code splitting

### Backend & Infrastructure

- **Supabase** - Backend-as-a-Service (Auth, Database, Storage, Edge Functions)
- **Node.js/Express** - Local development API server
- **PostgreSQL** - Primary database via Supabase
- **Row Level Security (RLS)** - Database-level security policies

### Development & Quality

- **Vitest** - Unit testing framework
- **Testing Library** - Component testing utilities
- **Playwright** - End-to-end testing
- **Storybook** - Component development and documentation
- **ESLint** - Code linting and quality enforcement
- **TypeScript** - Static type checking

### Deployment & Performance

- **Docker** - Multi-stage containerization
- **Nginx** - Static file serving and reverse proxy
- **PWA** - Progressive Web App with offline support
- **Vite PWA Plugin** - Service worker generation
- **Code Splitting** - Optimized bundle loading

## 🎯 High-Level Modules

### Project Management

- **Project Lifecycle**: Pricing → Concept → Technical Design → Production → Materials → Logistics
- **Client Management**: Contact information, project history, communication tracking
- **Timeline Management**: Gantt charts, milestone tracking, deadline management

### Production System

- **Tile Management**: Unique elements flowing through design → approval → CNC → production → assembly
- **CNC Integration**: DXF file processing, estimation, queue management by priority
- **Quality Control**: Inspection checkpoints, approval workflows, revision tracking

### Materials & Inventory

- **BOM Generation**: Automatic bill of materials from project specifications
- **Inventory Management**: Stock levels, reorder points, supplier management
- **Procurement**: Purchase orders, vendor management, cost tracking

### Logistics & Installation

- **Packing Lists**: Automated generation based on project requirements
- **Route Planning**: Optimized delivery routes and scheduling
- **Installation Management**: Task assignment, progress tracking, completion verification

## 🎨 Frontend Architecture

### Component Architecture

- **Atomic Design Pattern**: Organized into atoms, molecules, organisms, and templates
- **Modern UI System**: Located in `src/new-ui/` with comprehensive design tokens
- **Legacy Components**: Gradual migration from `src/components/` to new system
- **TypeScript First**: Full type safety with strict mode and comprehensive interfaces

### State Management

- **Zustand Slices**: Domain-specific stores in `src/stores/*`
  - Clear boundaries: projects, tiles, materials, logistics, subcontractors, calendar
  - Persistence only for critical UX state, not server caches
- **TanStack Query**: Server state management and caching
  - Automatic background refetching and cache invalidation
  - Optimistic updates for better UX
- **Service Layer**: `src/services/*` for API integration
  - Never call Supabase directly from components
  - Centralized error handling and retry logic

### Data Flow

1. **User Action**: UI triggers action (e.g., edit tile in drawer)
2. **Store Action**: Zustand store action called with validated input
3. **Service Call**: Service layer handles API communication
4. **HTTP Client**: `src/lib/httpClient.ts` manages strategy (REST vs Supabase)
5. **Cache Update**: TanStack Query updates server state cache
6. **UI Update**: Zustand stores update local UI state
7. **Realtime Sync**: Supabase subscriptions broadcast changes to listening components

### Routing & Navigation

- **React Router v7**: Client-side routing with code splitting
- **Lazy Loading**: Heavy components (Speckle, DXF viewers) loaded on demand
- **Route Guards**: Authentication and authorization checks
- **Deep Linking**: Support for direct URL access to all features

## 🗄️ Backend Architecture

### Primary Backend (Supabase)

- **Authentication**: JWT-based auth with role-based access control
- **Database**: PostgreSQL with Row Level Security (RLS) policies
- **Storage**: File storage for DXF files, images, and documents
- **Edge Functions**: Serverless functions for complex business logic
- **Realtime**: WebSocket connections for live updates

### Development API (Node.js)

- **Local Server**: `backend/src/server.ts` for development/demo
- **Endpoints**: Health checks, CRUD operations, file processing
- **Mock Data**: Seed data for development and testing
- **Proxy Integration**: Vite dev server proxies API calls

### Security & Compliance

- **Row Level Security**: Database-level access control
- **Input Validation**: Zod schemas for all user inputs
- **Sanitization**: DOMPurify for HTML content
- **CORS**: Properly configured cross-origin resource sharing
- **Rate Limiting**: API rate limiting and abuse prevention

## 📁 Directory Structure

```
src/
├── new-ui/              # Modern design system (Atomic Design)
│   ├── atoms/          # Basic UI elements (Button, Input, Icon)
│   ├── molecules/      # Simple combinations (Card, FormField)
│   ├── organisms/      # Complex components (DataTable, Navigation)
│   ├── templates/      # Page layouts and structures
│   └── tokens/         # Design tokens and theme configuration
├── components/         # Legacy components (being migrated)
├── pages/             # Route components and page layouts
├── stores/            # Zustand state management slices
├── services/          # API integration and business logic
├── lib/               # Utilities and shared functionality
│   ├── httpClient.ts  # HTTP client with strategy pattern
│   ├── logger.ts      # Structured logging
│   ├── realtime.ts    # Supabase realtime subscriptions
│   └── a11y.ts        # Accessibility helpers
├── types/             # TypeScript type definitions
└── styles/            # Global styles and CSS variables
```

## 🔧 Cross-Cutting Concerns

### Validation & Type Safety

- **Zod Schemas**: Runtime validation for all user inputs and API responses
- **TypeScript**: Compile-time type checking with strict mode
- **Type Guards**: Runtime type checking for external data
- **API Types**: Generated types from OpenAPI/Swagger specifications

### Error Handling

- **Error Boundaries**: React error boundaries for graceful failure handling
- **ApiError Type**: Consistent error structure across the application
- **User Feedback**: Ant Design notifications for user-friendly error messages
- **Logging**: Structured logging with different severity levels

### Performance Optimization

- **Code Splitting**: Route-based and component-based code splitting
- **Lazy Loading**: Heavy components loaded on demand
- **Virtualization**: Efficient rendering of large lists and tables
- **Memoization**: React.memo and useMemo for expensive computations
- **Bundle Analysis**: Rollup visualizer for bundle size monitoring

### Accessibility (A11y)

- **WCAG 2.1 AA**: Compliance with accessibility standards
- **Keyboard Navigation**: Full keyboard support for all interactions
- **Screen Reader Support**: Proper ARIA labels and semantic HTML
- **Focus Management**: Logical focus order and visible focus indicators
- **Color Contrast**: Meets accessibility contrast requirements

## 📱 Progressive Web App (PWA)

### PWA Features

- **Offline Support**: Service worker for offline functionality
- **Installable**: Add to home screen on mobile devices
- **App Shell**: Cached shell for instant loading
- **Background Sync**: Sync data when connection is restored
- **Push Notifications**: Real-time notifications (future enhancement)

### Service Worker

- **Vite PWA Plugin**: Automatic service worker generation
- **Cache Strategy**: Stale-while-revalidate for optimal performance
- **Update Handling**: Automatic updates with user notification
- **Fallback Pages**: Offline fallback for critical pages

## 🔄 Real-time Features

### Live Updates

- **Supabase Realtime**: WebSocket connections for live data
- **Selective Subscriptions**: Subscribe only to relevant data changes
- **Conflict Resolution**: Optimistic updates with conflict resolution
- **Connection Management**: Automatic reconnection and error handling

### Collaboration

- **Multi-user Support**: Real-time collaboration on projects
- **Presence Indicators**: Show who's currently viewing/editing
- **Change Notifications**: Notify users of relevant changes
- **Version Control**: Track changes and maintain history

## 📊 Monitoring & Observability

### Logging

- **Structured Logging**: JSON-formatted logs with context
- **Log Levels**: Debug, info, warn, error with appropriate filtering
- **Performance Metrics**: Track component render times and API response times
- **Error Tracking**: Centralized error collection and analysis

### Analytics

- **User Behavior**: Track user interactions and feature usage
- **Performance Metrics**: Core Web Vitals and performance indicators
- **Business Metrics**: Project completion rates, user engagement
- **Error Rates**: Track and monitor application errors

---

**Last Updated**: January 2025  
**Architecture Version**: 2.0.0  
**Next Review**: March 2025
