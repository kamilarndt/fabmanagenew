# Frontend Guidelines

This document outlines the development standards and best practices for the FabManage-Clean frontend application. It covers React/TypeScript development, component architecture, state management, and quality assurance.

## 🚀 Framework & Language

### Core Technology Stack

- **React 18** with modern hooks and concurrent features
- **TypeScript (strict mode)** - No `any` or `unknown` types allowed
- **Vite** for fast development and optimized builds
- **Tailwind CSS** for utility-first styling with design tokens

### TypeScript Standards

- **Strict Mode**: All TypeScript strict mode options enabled
- **Interface Preference**: Use `interface` for public API shapes
- **Type Guards**: Prefer type guards over type assertions
- **Generic Constraints**: Use proper generic constraints for reusable components
- **No Implicit Any**: All variables must have explicit types

## 🧩 Component Architecture

### Component Structure

- **Functional Components**: Use `function` keyword for all components
- **Named Exports**: One component per file with named exports
- **Atomic Design**: Organize components by complexity level (atoms, molecules, organisms, templates)
- **Co-location**: Keep related files together (component, test, story, types)

### Component Patterns

- **Shallow JSX**: Avoid deeply nested JSX structures
- **No Inline Lambdas**: Extract event handlers to avoid re-renders
- **Memoization**: Use `React.memo` for expensive components
- **Callback Optimization**: Wrap handlers in `useCallback`
- **Computation Optimization**: Use `useMemo` for heavy computations

## 🗃️ State Management

### Zustand Store Pattern

- **Domain Boundaries**: Clear separation by business domain
- **Slice Pattern**: One store per domain (projects, tiles, materials, etc.)
- **Persistence**: Only persist critical UX state, not server caches
- **Immutability**: Use immer for complex state updates

### TanStack Query Integration

- **Server State**: Use TanStack Query for all server data
- **Caching Strategy**: Implement proper cache invalidation
- **Optimistic Updates**: Use optimistic updates for better UX
- **Error Handling**: Centralized error handling with retry logic

## 🔄 Data Fetching

### Service Layer Architecture

- **Service Classes**: Organize API calls by domain
- **No Direct Supabase**: Never call Supabase directly from components
- **Error Handling**: Centralized error handling and retry logic
- **Type Safety**: Full TypeScript coverage for all API calls

### HTTP Client Strategy

- **Strategy Pattern**: Switch between REST and Supabase based on environment
- **Authentication**: Automatic token handling and refresh
- **Retry Logic**: Exponential backoff for failed requests
- **Request/Response Interceptors**: Centralized request/response handling

## ✅ Validation & Typing

### Zod Integration

- **Runtime Validation**: Validate all user inputs and API responses
- **Type Inference**: Use Zod schemas to infer TypeScript types
- **Error Messages**: User-friendly error messages from validation
- **Form Integration**: Integrate with React Hook Form for form validation

## 🚨 Error Handling

### Error Boundary Implementation

- **Global Boundaries**: Catch all unhandled errors
- **Sectional Boundaries**: Isolate error-prone sections
- **Fallback UI**: User-friendly error messages
- **Error Reporting**: Log errors for debugging

### User Feedback

- **Ant Design Notifications**: Use for operation feedback
- **Toast Messages**: For non-critical notifications
- **Loading States**: Show loading indicators for async operations
- **Error Messages**: Clear, actionable error messages

## 🔄 Realtime Features

### Supabase Realtime Integration

- **Selective Subscriptions**: Subscribe only to relevant data
- **Connection Management**: Handle connection drops and reconnection
- **Cleanup**: Proper cleanup in useEffect hooks
- **Error Handling**: Handle realtime connection errors

## 📊 Logging & Analytics

### Structured Logging

- **Logger Service**: Use `src/lib/logger.ts` for all logging
- **Log Levels**: Debug, info, warn, error with appropriate filtering
- **Context**: Include relevant context in log messages
- **No Console**: Avoid `console.*` in production code

## 🛣️ Routing

### React Router v7

- **Page Components**: Organize pages in `src/pages/*`
- **Code Splitting**: Use lazy loading for heavy routes
- **Route Guards**: Implement authentication and authorization checks
- **Deep Linking**: Support direct URL access to all features

## ♿ Accessibility (A11y)

### WCAG 2.1 AA Compliance

- **Semantic HTML**: Use proper HTML elements
- **ARIA Attributes**: Include proper ARIA labels and roles
- **Keyboard Navigation**: Full keyboard support
- **Focus Management**: Logical focus order and visible indicators
- **Color Contrast**: Meet accessibility contrast requirements

### A11y Helpers

- **Focus Management**: Use `src/lib/a11y.ts` helpers
- **Screen Reader Support**: Proper announcements for dynamic content
- **Keyboard Shortcuts**: Implement common keyboard shortcuts
- **Testing**: Include accessibility testing in component tests

---

**Last Updated**: January 2025  
**Frontend Guidelines Version**: 2.0.0  
**Next Review**: March 2025
