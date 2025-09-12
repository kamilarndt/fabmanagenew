# Stwórzmy kompletną strukturę plików dla workspace Cursor AI

import json
import os

# Struktura folderów dla Cursor AI workspace
cursor_structure = {
    ".cursor": {
        "description": "Główny folder konfiguracji Cursor AI",
        "files": {
            "rules": {
                "description": "Folder z regułami .mdc dla różnych wzorców plików",
                "files": {
                    "typescript.mdc": "Reguły dla plików TypeScript",
                    "react.mdc": "Reguły dla komponentów React",
                    "zustand.mdc": "Reguły dla Zustand stores",
                    "bootstrap.mdc": "Reguły dla UI i Bootstrap",
                    "supabase.mdc": "Reguły dla integracji Supabase",
                    "fabmanage-business.mdc": "Reguły specyficzne dla logiki biznesowej FabManage"
                }
            },
            "instructions.md": "Główne instrukcje projektu",
            "project-overview.mdc": "Przegląd projektu dla AI"
        }
    },
    "docs": {
        "description": "Dokumentacja dla AI i developerów",
        "files": {
            "ai-docs": {
                "description": "Dokumentacja specjalnie dla AI",
                "files": {
                    "workflow-guide.md": "Przewodnik po workflow FabManage",
                    "component-patterns.md": "Wzorce komponentów React",
                    "state-management.md": "Zarządzanie stanem Zustand",
                    "business-rules.md": "Reguły biznesowe systemu",
                    "api-integration.md": "Integracja z Supabase"
                }
            }
        }
    }
}

# Stwórzmy zawartość plików .mdc
typescript_mdc = """---
description: TypeScript excellence rules for FabManage
globs:
  - "**/*.ts"
  - "**/*.tsx"
alwaysApply: true
---

# TypeScript Rules for FabManage

## Core Principles
- Use TypeScript strict mode for all code
- Prefer `interface` over `type` for object shapes
- Avoid `any` and `unknown` - search for existing type definitions
- Avoid type assertions with `as` or `!`
- Use type guards for safe undefined/null handling

## Naming Conventions
- **PascalCase**: Components, interfaces, types
- **camelCase**: Variables, functions, methods, props
- **UPPER_SNAKE_CASE**: Constants, environment variables

## Interface Patterns
```typescript
// Prefer this pattern for FabManage entities
interface Project {
  id: string;
  name: string;
  modules: ProjectModule[];
  status: ProjectStatus;
  createdAt: Date;
  updatedAt: Date;
}

// Use proper generic constraints
interface Store<T extends { id: string }> {
  items: T[];
  getById: (id: string) => T | undefined;
}
```

## Error Handling
- Use custom error types with proper error codes
- Implement proper error boundaries
- Always handle async errors with try/catch or .catch()

## Business Logic Types
- Model all FabManage entities with proper interfaces
- Use enums for status fields with clear naming
- Include audit fields (createdAt, updatedAt, createdBy)
"""

react_mdc = """---
description: React component standards for FabManage
globs:
  - "src/components/**/*.tsx"
  - "src/pages/**/*.tsx"
alwaysApply: true
---

# React Component Rules for FabManage

## Component Structure
- Use functional components with TypeScript interfaces
- Use the `function` keyword for component definitions
- Structure: exports, interfaces, component, helpers, static content

## Patterns
```typescript
// Preferred component pattern
interface ProjectFormProps {
  project?: Project;
  onSubmit: (data: ProjectData) => void;
  onCancel?: () => void;
}

export function ProjectForm({ project, onSubmit, onCancel }: ProjectFormProps) {
  // Hooks first
  const [isLoading, setIsLoading] = useState(false);
  
  // Event handlers with handle prefix
  const handleSubmit = useCallback((data: ProjectData) => {
    setIsLoading(true);
    onSubmit(data);
  }, [onSubmit]);
  
  // Early returns for loading/error states
  if (isLoading) return <LoadingSpinner />;
  
  return (
    <div className="project-form">
      {/* Implementation */}
    </div>
  );
}
```

## Performance
- Use `React.memo()` for expensive components
- Use `useCallback` for event handlers passed as props
- Use `useMemo` for expensive computations
- Avoid inline functions in JSX

## Accessibility
- Use semantic HTML elements
- Include proper ARIA attributes
- Ensure keyboard navigation support
- Add proper labels and descriptions

## FabManage Specific
- Follow the modular project structure
- Implement proper error boundaries for each module
- Use consistent loading states across components
- Handle real-time updates gracefully
"""

zustand_mdc = """---
description: Zustand state management patterns for FabManage
globs:
  - "src/stores/**/*.ts"
alwaysApply: true
---

# Zustand Store Rules for FabManage

## Store Structure
```typescript
interface ProjectStore {
  // State
  projects: Project[];
  currentProject: Project | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchProjects: () => Promise<void>;
  addProject: (project: Omit<Project, 'id'>) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  setCurrentProject: (project: Project | null) => void;
}
```

## Implementation Pattern
- Use `create<T>()()` for TypeScript support
- Implement persistence with `persist` middleware
- Group related actions in the same store
- Use immer middleware for complex state updates

## Store Organization
- One store per business domain (projects, tiles, cnc, materials)
- Async actions should handle loading/error states
- Use optimistic updates where appropriate
- Implement proper error handling and recovery

## FabManage Stores
- **ProjectStore**: Project lifecycle and modules
- **TileStore**: Tile management and status tracking
- **CNCStore**: Machine monitoring and task queue
- **MaterialStore**: BOM and inventory management
- **UserStore**: Authentication and user preferences
"""

bootstrap_mdc = """---
description: Bootstrap 5 and UI patterns for FabManage
globs:
  - "src/components/**/*.tsx"
  - "src/pages/**/*.tsx"
  - "**/*.css"
alwaysApply: true
---

# Bootstrap 5 & UI Rules for FabManage

## Bootstrap Usage
- Use Bootstrap 5 classes for layout and basic components
- Prefer utility classes over custom CSS
- Implement responsive design with mobile-first approach
- Use Bootstrap grid system for layouts

## Component Patterns
```tsx
// Dashboard layout pattern
<div className="container-fluid">
  <div className="row">
    <div className="col-12 col-lg-8">
      <MainContent />
    </div>
    <div className="col-12 col-lg-4">
      <Sidebar />
    </div>
  </div>
</div>

// Card pattern for modules
<div className="card h-100">
  <div className="card-header d-flex justify-content-between align-items-center">
    <h5 className="card-title mb-0">{title}</h5>
    <StatusBadge status={status} />
  </div>
  <div className="card-body">
    {children}
  </div>
  <div className="card-footer">
    <ActionButtons />
  </div>
</div>
```

## Custom CSS Guidelines
- Limit custom CSS to minimum
- Use CSS custom properties for theme variables
- Follow BEM naming for custom classes
- Ensure consistent spacing using Bootstrap utilities

## FabManage UI Patterns
- Use consistent status badges across modules
- Implement proper loading states with spinners
- Use Bootstrap modals for forms and confirmations
- Apply consistent button styling and placement
"""

supabase_mdc = """---
description: Supabase integration patterns for FabManage
globs:
  - "src/services/**/*.ts"
  - "src/lib/**/*.ts"
alwaysApply: true
---

# Supabase Integration Rules for FabManage

## Service Layer Pattern
```typescript
export class ProjectService {
  private supabase = createSupabaseClient();

  async createProject(project: Omit<Project, 'id'>): Promise<Project> {
    const { data, error } = await this.supabase
      .from('projects')
      .insert(project)
      .select()
      .single();

    if (error) {
      throw new AppError({
        code: ErrorCode.DATABASE_ERROR,
        message: 'Failed to create project',
        details: error
      });
    }

    return data;
  }
}
```

## Real-time Subscriptions
- Use proper cleanup for subscriptions
- Handle connection errors gracefully
- Implement proper typing for subscription data
- Subscribe to relevant changes for CNC status updates

## Error Handling
- Always check for errors in Supabase responses
- Use custom error types for different error scenarios
- Implement proper retry logic for failed requests
- Log errors appropriately for debugging

## Security
- Implement Row Level Security (RLS) policies
- Use proper authentication checks
- Validate data before database operations
- Sanitize user inputs
"""

business_mdc = """---
description: FabManage business logic and domain rules
globs:
  - "src/**/*.ts"
  - "src/**/*.tsx"
alwaysApply: true
---

# FabManage Business Logic Rules

## Project Lifecycle
- Projects can only advance to next module after completing previous one
- Each module has specific data requirements and validation rules
- Project cost accumulates through all active modules
- Timeline calculation based on enabled modules and historical data

## Module System
```typescript
enum ModuleName {
  PRICING = 'pricing',
  CONCEPT = 'concept', 
  TECHNICAL_DESIGN = 'technical_design',
  PRODUCTION = 'production',
  MATERIALS = 'materials',
  LOGISTICS = 'logistics'
}

interface ProjectModule {
  id: string;
  name: ModuleName;
  isEnabled: boolean;
  completedAt?: Date;
  data?: ModuleData;
}
```

## Tile System
- Tiles represent decomposed project elements
- Status flow: Designing → Pending Approval → Approved → CNC Queue → Production → Ready
- Each tile has BOM (Bill of Materials) and technical files
- Tiles automatically enter CNC queue when approved

## CNC Production Rules
- Priority determined by project deadline and client priority
- Estimated time based on historical data and material type
- Materials must be available before production starts
- Real-time status updates for production monitoring

## Material Management
- BOM consolidates automatically from all project tiles
- Orders grouped by supplier for cost optimization
- Real-time inventory tracking
- Automatic alerts for low stock levels

## Data Validation
- All dates must be in ISO format
- Status transitions must follow defined workflows
- Financial calculations must include proper rounding
- File uploads must be validated for type and size
"""

instructions_md = """# FabManage - Instrukcje Projektu dla Cursor AI

## Przegląd Systemu

FabManage to zaawansowany system zarządzania produkcją dla fabryki dekoracji i scenografii. System implementuje modułowy workflow produkcyjny od koncepcji przez projektowanie techniczne, produkcję CNC, zarządzanie materiałami aż po logistykę i montaż.

## Architektura Techniczna

### Frontend
- **React 18** z TypeScript w strict mode
- **Zustand** do zarządzania stanem z persystencją
- **Bootstrap 5** + custom CSS do UI
- **Vite** jako build tool

### Backend  
- **Supabase** (PostgreSQL + Real-time subscriptions)
- **Docker** do deploymentu

## Kluczowe Koncepcje Biznesowe

### 1. System Modułów
Każdy projekt może mieć włączone następujące moduły:
- **Wycena i Koncepcja** - prace kreatywne, szkice, moodboardy
- **Projektowanie Techniczne** - modelowanie 3D, dekompozycja na kafelki
- **Produkcja** - system CNC, monitoring maszyn, kolejki zadań
- **Zarządzanie Materiałami** - BOM, listy zakupowe, inwentaryzacja
- **Logistyka i Montaż** - transport, instalacja u klienta

### 2. System Kafelków (Tiles)
Unikalny system dekompozycji projektów na elementy produkcyjne:
- Każdy kafelek ma swój lifecycle statusów
- BOM (Bill of Materials) per kafelek
- Pliki techniczne (.dxf, .pdf) dla CNC
- Automatyczne przejścia do kolejki CNC

### 3. CNC Management
- Monitoring maszyn w czasie rzeczywistym
- Tablica Kanban dla zadań produkcyjnych  
- Priorytetyzacja na podstawie deadlinów
- Szacowanie czasów na podstawie danych historycznych

## Wzorce Implementacji

### Komponenty React
```typescript
// Wzorzec komponentu z proper typing
interface ProjectFormProps {
  project?: Project;
  onSubmit: (data: ProjectData) => void;
}

export function ProjectForm({ project, onSubmit }: ProjectFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = useCallback((data: ProjectData) => {
    // Implementation
  }, []);
  
  if (isLoading) return <LoadingSpinner />;
  
  return <form>/* Implementation */</form>;
}
```

### Zustand Stores
```typescript
// Wzorzec store dla domeny biznesowej
interface ProjectStore {
  projects: Project[];
  currentProject: Project | null;
  
  fetchProjects: () => Promise<void>;
  addProject: (project: Omit<Project, 'id'>) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
}
```

### Supabase Integration
```typescript
// Service layer pattern
export class ProjectService {
  async createProject(project: Omit<Project, 'id'>): Promise<Project> {
    const { data, error } = await supabase
      .from('projects')
      .insert(project)
      .select()
      .single();
      
    if (error) throw new AppError(error);
    return data;
  }
}
```

## Reguły Biznesowe

1. **Workflow Projektu**: Moduły muszą być ukończone sekwencyjnie
2. **System CNC**: Kafelki automatycznie trafiają do kolejki po zatwierdzeniu
3. **Materiały**: BOM konsoliduje się z wszystkich kafelków projektu
4. **Bezpieczeństwo**: Wszystkie operacje muszą uwzględniać uprawnienia użytkownika

## Cele Wydajności

- Czas ładowania głównej strony < 2s
- Real-time updates dla statusów CNC
- Responsywność na urządzeniach mobilnych
- Offline capability dla krytycznych funkcji

## Standardy Jakości

- Test coverage > 80%
- TypeScript strict mode
- ESLint + Prettier
- Semantic commit messages
- Code review wymagany dla wszystkich zmian

Gdy implementujesz nowe funkcjonalności, zawsze uwzględniaj te instrukcje i wzorce. Priorytetyzuj wydajność, bezpieczeństwo i user experience."""

project_overview_mdc = """---
description: Complete FabManage project overview for AI context
alwaysApply: true
---

# FabManage - Production Management System

## Project Overview
FabManage is a comprehensive production management system for decoration and scenography factories. It manages the complete lifecycle from concept to installation.

## Technology Stack
- **Frontend**: React 18 + TypeScript + Bootstrap 5
- **State**: Zustand with persistence
- **Backend**: Supabase (PostgreSQL + Real-time)
- **Build**: Vite
- **Deploy**: Docker

## Core Architecture

### Module System
Projects are composed of optional modules:
1. **Pricing & Concept** - Creative work, sketches, moodboards
2. **Technical Design** - 3D modeling, tile decomposition  
3. **Production** - CNC systems, machine monitoring
4. **Materials** - BOM management, purchasing
5. **Logistics** - Transport, on-site installation

### Tile System
Unique decomposition of projects into production elements:
- Status workflow: Design → Approval → CNC Queue → Production → Assembly
- Each tile has BOM and technical files
- Automatic CNC queue integration

### CNC Management
- Real-time machine monitoring
- Kanban board for production tasks
- Priority-based scheduling
- Historical time estimation

## File Structure
```
src/
├── components/     # Reusable UI components
├── pages/         # Page-level components  
├── stores/        # Zustand state management
├── services/      # API integration layer
├── lib/           # Utilities and helpers
└── types/         # TypeScript definitions
```

## Key Business Rules
- Sequential module completion required
- Automatic tile → CNC queue progression
- Consolidated BOM from all project tiles
- Real-time status synchronization
- Permission-based access control

## Development Priorities
1. Type safety (TypeScript strict mode)
2. Performance (< 2s load times)
3. Real-time updates
4. Mobile responsiveness
5. Offline capability

Use this context to understand the domain and implement features accordingly."""

# Zapisujemy wszystkie pliki
files_content = {
    ".cursor/rules/typescript.mdc": typescript_mdc,
    ".cursor/rules/react.mdc": react_mdc,
    ".cursor/rules/zustand.mdc": zustand_mdc,
    ".cursor/rules/bootstrap.mdc": bootstrap_mdc,
    ".cursor/rules/supabase.mdc": supabase_mdc,
    ".cursor/rules/fabmanage-business.mdc": business_mdc,
    ".cursor/instructions.md": instructions_md,
    ".cursor/project-overview.mdc": project_overview_mdc
}

# Zapisujemy zawartość do pliku CSV dla lepszego przeglądu
import csv

csv_data = []
for file_path, content in files_content.items():
    csv_data.append({
        'File': file_path,
        'Description': content.split('\n')[0] if content else '',
        'Content_Preview': content[:200] + '...' if len(content) > 200 else content
    })

# Zapisujemy strukturę workspace do CSV
with open('cursor_workspace_structure.csv', 'w', newline='', encoding='utf-8') as csvfile:
    fieldnames = ['File', 'Description', 'Content_Preview']
    writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
    writer.writeheader()
    writer.writerows(csv_data)

print("✅ Struktura workspace Cursor AI została przygotowana!")
print(f"📁 Utworzono {len(files_content)} plików konfiguracyjnych")
print("📄 Struktura zapisana w cursor_workspace_structure.csv")

# Podsumowanie
summary = {
    "total_files": len(files_content),
    "mdc_rules": len([f for f in files_content.keys() if f.endswith('.mdc')]),
    "documentation": len([f for f in files_content.keys() if f.endswith('.md')]),
    "structure": cursor_structure
}

print("\n📊 Podsumowanie workspace:")
print(f"• Łączna liczba plików: {summary['total_files']}")
print(f"• Pliki reguł .mdc: {summary['mdc_rules']}")
print(f"• Pliki dokumentacji .md: {summary['documentation']}")