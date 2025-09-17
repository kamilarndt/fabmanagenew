# FabManage-Clean Documentation

This directory contains the comprehensive, living documentation for the FabManage-Clean application. It follows modern standards for React/TypeScript web platforms with advanced design system integration, Supabase backend, and containerized deployment.

## 📚 Table of Contents

### Core Documentation

- **Architecture Overview**: [architecture.md](./architecture.md) - System design and technical decisions
- **Design System**: [design-system/README.md](./design-system/README.md) - Complete design system documentation
- **Frontend Guidelines**: [frontend.md](./frontend.md) - React/TypeScript development standards
- **UI/UX Patterns**: [ui-ux.md](./ui-ux.md) - User interface and experience guidelines
- **API Reference**: [api.md](./api.md) - Backend API documentation
- **Testing Strategy**: [testing.md](./testing.md) - Testing approaches and tools
- **Deployment Guide**: [deployment.md](./deployment.md) - Docker, PWA, and hosting
- **Security**: [security.md](./security.md) - Security policies and compliance
- **Contributing**: [contributing.md](./contributing.md) - Development workflow and standards

### Design System & UI

- **Design System Implementation**: [design-system/implementation-guide.md](./design-system/implementation-guide.md)
- **Figma Integration**: [figma-integration.md](./figma-integration.md) - Design-to-code workflow
- **New UI Structure**: [new-ui-structure.md](./new-ui-structure.md) - Modern component architecture
- **Migration Guide**: [migration-execution-guide.md](./migration-execution-guide.md) - Legacy to modern UI migration

### Architecture Decision Records

- **ADRs**: [adr/](./adr/) - Technical decision history and rationale

### Development Resources

- **Implementation Plan**: [implementation-plan.md](./implementation-plan.md) - Project roadmap
- **Training Guide**: [training/user-training-guide.md](./training/user-training-guide.md) - User onboarding
- **Tasks**: [tasks/](./tasks/) - Development task tracking

## 🎯 About This Documentation

### Target Audience

- **Product Engineers**: Frontend/backend developers working on the application
- **Designers**: UI/UX designers using the design system
- **DevOps/SRE**: Infrastructure and deployment specialists
- **QA Engineers**: Testing and quality assurance teams
- **Stakeholders**: Product managers and business stakeholders

### Documentation Scope

- **Technical Architecture**: System design, data flow, and integration patterns
- **Development Standards**: Coding conventions, testing practices, and quality gates
- **Design System**: Component library, design tokens, and UI patterns
- **Operational Runbooks**: Deployment, monitoring, and maintenance procedures
- **Compliance Baselines**: Security, accessibility, and performance standards

### Source of Truth

- **Versioned with Code**: Documentation is maintained alongside the codebase
- **Living Documentation**: Updated continuously as the system evolves
- **Single Source**: All technical decisions and standards documented here

## 🚀 Quick Facts

### Technology Stack

- **Frontend**: React 18 + TypeScript (strict) + Vite + Tailwind CSS
- **UI Framework**: Ant Design + Custom Design System (Atomic Design)
- **State Management**: Zustand (slice pattern) + TanStack Query
- **Backend**: Supabase (Auth/DB/Storage/Edge) + Node.js API
- **Testing**: Vitest + Testing Library + Playwright + Storybook
- **Deployment**: Docker multi-stage + Nginx + PWA + CDN

### Key Features

- **Modern Design System**: Atomic design with Figma integration
- **Real-time Collaboration**: Live updates and notifications
- **PWA Support**: Offline-ready with service workers
- **Containerized**: Docker with multi-stage builds
- **Type Safety**: Full TypeScript coverage with strict mode
- **Accessibility**: WCAG 2.1 AA compliance
- **Performance**: Code splitting, lazy loading, and optimization

## 🏃‍♂️ Getting Started

### Prerequisites

- Node.js 18+ and npm 9+
- Docker (optional, for containerized development)
- Git for version control

### Development Setup

```bash
# 1. Install dependencies
npm ci

# 2. Start development server
npm run dev

# 3. Run quality checks
npm run lint          # ESLint
npm run type-check    # TypeScript
npm run test          # Unit tests

# 4. Build for production
npm run build
```

### Design System Development

```bash
# Sync design tokens from Figma
npm run sync-tokens

# Start Storybook for component development
npm run storybook

# Run design system specific tests
npm run test:design-system
```

### Docker Development

```bash
# Start with Docker Compose
docker-compose up -d

# View application logs
docker-compose logs -f fabmanage-frontend
```

## 📖 Documentation Navigation

### For New Developers

1. Start with [Architecture Overview](./architecture.md)
2. Review [Frontend Guidelines](./frontend.md)
3. Explore [Design System](./design-system/README.md)
4. Check [Contributing Guide](./contributing.md)

### For Designers

1. Read [Design System Documentation](./design-system/README.md)
2. Review [Figma Integration](./figma-integration.md)
3. Check [UI/UX Patterns](./ui-ux.md)

### For DevOps/Deployment

1. Start with [Deployment Guide](./deployment.md)
2. Review [Architecture Overview](./architecture.md)
3. Check [Security Documentation](./security.md)

### For QA/Testing

1. Review [Testing Strategy](./testing.md)
2. Check [Design System Testing](./design-system/README.md#testing)
3. Explore [Component Testing](./new-ui-structure.md#testing)

## 🔄 Documentation Maintenance

### Update Process

- Documentation is updated with each code change
- Major architectural changes require ADR creation
- Design system changes are documented in the design system section
- API changes are reflected in the API reference

### Contributing to Documentation

- Follow the established structure and formatting
- Use clear, concise language
- Include code examples where appropriate
- Update related sections when making changes
- Test all code examples before committing

---

**Last Updated**: January 2025  
**Version**: 2.0.0  
**Maintainer**: FabManage Development Team
