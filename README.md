# FabManage-Clean

Modern production management system for scenography/decor projects with advanced UI/UX and comprehensive design system integration.

## 🚀 Features

- **Modern UI/UX**: Atomic design system with Figma integration
- **Production Management**: Complete workflow from concept to installation
- **CAD Integration**: DXF file processing and CNC preparation
- **Materials Management**: BOM generation, inventory tracking, and ordering
- **Real-time Collaboration**: Live updates and notifications
- **PWA Support**: Offline-ready progressive web application
- **Docker Deployment**: Containerized with multi-stage builds

## 🏗️ Technology Stack

- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS
- **UI Framework**: Ant Design + Custom Design System
- **State Management**: Zustand + TanStack Query
- **Backend**: Supabase (Auth/DB/Storage) + Node.js API
- **Testing**: Vitest + Testing Library + Playwright
- **Deployment**: Docker + Nginx + PWA

## 📚 Documentation

- **Main Documentation**: [`docs/README.md`](docs/README.md)
- **Architecture**: [`docs/architecture.md`](docs/architecture.md)
- **Design System**: [`docs/design-system/README.md`](docs/design-system/README.md)
- **Frontend Guidelines**: [`docs/frontend.md`](docs/frontend.md)
- **UI/UX Patterns**: [`docs/ui-ux.md`](docs/ui-ux.md)
- **API Reference**: [`docs/api.md`](docs/api.md)
- **Testing Strategy**: [`docs/testing.md`](docs/testing.md)
- **Deployment Guide**: [`docs/deployment.md`](docs/deployment.md)
- **Security**: [`docs/security.md`](docs/security.md)
- **ADRs**: [`docs/adr/`](docs/adr/)

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm 9+
- Docker (optional, for containerized development)

### Development Setup

```bash
# Install dependencies
npm ci

# Start development server
npm run dev

# Run tests
npm run test

# Type checking
npm run type-check

# Linting
npm run lint

# Build for production
npm run build
```

### Design System Development

```bash
# Sync design tokens from Figma
npm run sync-tokens

# Start Storybook for component development
npm run storybook

# Run design system tests
npm run test:design-system
```

### Docker Development

```bash
# Start with Docker Compose
docker-compose up -d

# View logs
docker-compose logs -f
```

## 🎨 Design System

The project features a comprehensive design system built with atomic design principles:

- **Atoms**: Basic UI elements (Button, Input, Icon, etc.)
- **Molecules**: Simple combinations (Card, FormField, SearchBox, etc.)
- **Organisms**: Complex components (DataTable, Navigation, Forms, etc.)
- **Templates**: Page layouts and structures

### Key Features

- Figma integration with automatic token sync
- Dark/Light theme support
- WCAG 2.1 AA accessibility compliance
- Responsive design with mobile-first approach
- TypeScript-first with full type safety

## 🏗️ Project Structure

```
src/
├── new-ui/              # Modern design system components
│   ├── atoms/          # Basic UI elements
│   ├── molecules/      # Simple combinations
│   ├── organisms/      # Complex components
│   ├── templates/      # Page layouts
│   └── tokens/         # Design tokens
├── components/         # Legacy components (being migrated)
├── pages/             # Route components
├── stores/            # Zustand state management
├── services/          # API integration layer
├── lib/               # Utilities and helpers
└── types/             # TypeScript definitions
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test` - Run unit tests
- `npm run test:ui` - Run tests with UI
- `npm run test:coverage` - Run tests with coverage
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking
- `npm run storybook` - Start Storybook
- `npm run sync-tokens` - Sync design tokens from Figma

## 🚀 Deployment

The application supports multiple deployment strategies:

- **Docker**: Multi-stage builds with Nginx
- **PWA**: Offline-ready with service workers
- **Static Hosting**: Optimized for CDN deployment
- **Supabase**: Backend-as-a-Service integration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Follow the coding standards
4. Add tests for new features
5. Submit a pull request

See [`docs/contributing.md`](docs/contributing.md) for detailed guidelines.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check the [`docs/`](docs/) directory
- **Issues**: [GitHub Issues](https://github.com/your-org/fabmanage/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-org/fabmanage/discussions)

---

Built with ❤️ by the FabManage team
