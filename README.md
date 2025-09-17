# FabManage-Clean2

Modern production management system for scenography and decor projects.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm 8+
- Git

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd FabManage-Clean2

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:3000`

## 📋 Available Scripts

### Development
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
```

### Testing
```bash
npm run test         # Run unit tests
npm run test:ui      # Run tests with UI
npm run test:coverage # Run tests with coverage
npm run test:e2e     # Run end-to-end tests
npm run test:e2e:ui  # Run E2E tests with UI
```

### Code Quality
```bash
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues
npm run type-check   # TypeScript type checking
```

### Analysis
```bash
npm run analyze      # Analyze bundle size
```

### Storybook
```bash
npm run storybook    # Start Storybook
npm run build-storybook # Build Storybook
```

## 🏗️ Project Structure

```
src/
├── components/          # Reusable components
│   ├── Common/         # Common UI components
│   ├── Layout/         # Layout components
│   ├── Performance/    # Performance optimization components
│   ├── Messaging/      # Messaging components
│   └── Tiles/          # Kanban board components
├── pages/              # Page components
│   ├── Materials.tsx   # Materials management
│   ├── Tiles.tsx       # Project tiles/Kanban
│   ├── Pricing.tsx     # Pricing calculations
│   ├── Logistics.tsx   # Logistics management
│   ├── Accommodation.tsx # Hotel bookings
│   ├── Files.tsx       # File management
│   ├── Concepts.tsx    # Project concepts
│   ├── Documents.tsx   # Document library
│   └── Messaging.tsx   # Real-time messaging
├── stores/             # Zustand state management
├── types/              # TypeScript type definitions
├── hooks/              # Custom React hooks
├── utils/              # Utility functions
├── services/           # API services
└── test/               # Test utilities
```

## 🎯 Features

### Core Modules
- **Materials Management**: BOM creation, inventory tracking, supplier management
- **Project Tiles**: Kanban board with drag & drop functionality
- **Pricing Engine**: Real-time cost calculations across all modules
- **Logistics**: Transport management with route optimization
- **Accommodation**: Hotel booking integration
- **File Management**: Version control, sharing, categorization
- **Document Management**: Library system with approval workflows
- **Real-time Messaging**: Chat rooms with presence indicators

### Technical Features
- **Performance Optimization**: Code splitting, lazy loading, bundle analysis
- **Comprehensive Testing**: Unit, integration, E2E, accessibility, security tests
- **Production Monitoring**: Full observability stack with alerts
- **Security**: Authentication, authorization, input validation
- **Accessibility**: WCAG 2.1 AA compliance

## 🛠️ Technology Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Ant Design** - UI component library
- **Tailwind CSS** - Utility-first CSS framework

### State Management
- **Zustand** - Lightweight state management
- **TanStack Query** - Server state management

### Testing
- **Vitest** - Unit testing
- **Playwright** - E2E testing
- **React Testing Library** - Component testing
- **Storybook** - Component documentation

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **TypeScript** - Static type checking

## 🚀 Deployment

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm run preview
```

### Docker Deployment
```bash
# Build Docker image
docker build -f Dockerfile.production -t fabmanage:latest .

# Run container
docker run -p 3000:3000 fabmanage:latest
```

### Kubernetes Deployment
```bash
# Deploy to Kubernetes
./scripts/deploy-production.sh

# Run health checks
./scripts/health-check.sh
```

## 📊 Performance

- **Bundle Size**: Optimized with code splitting
- **Load Time**: < 2 seconds initial load
- **Lighthouse Score**: 90+ across all metrics
- **Accessibility**: WCAG 2.1 AA compliant

## 🧪 Testing

### Test Coverage
- **Unit Tests**: > 80% coverage
- **Integration Tests**: All critical paths
- **E2E Tests**: Complete user workflows
- **Accessibility Tests**: WCAG compliance
- **Security Tests**: Vulnerability scanning

### Running Tests
```bash
# All tests
npm run test

# Specific test types
npm run test:unit
npm run test:integration
npm run test:e2e
```

## 📚 Documentation

- **API Documentation**: `/docs/api/`
- **Component Documentation**: Storybook
- **Deployment Guide**: `PRODUCTION-DEPLOYMENT-GUIDE.md`
- **Testing Guide**: `tests/README.md`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

### Development Guidelines
- Follow TypeScript best practices
- Write tests for new features
- Use semantic commit messages
- Follow the established code style

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- **Documentation**: Check the docs folder
- **Issues**: Create a GitHub issue
- **Email**: support@fabmanage.com

## 🎉 Acknowledgments

- React team for the amazing framework
- Ant Design for the beautiful components
- Vite team for the fast build tool
- All contributors and testers

---

**FabManage-Clean2** - Modern production management for the digital age.