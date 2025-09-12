# Idealny Workspace Cursor AI dla FabManage

Ten dokument zawiera kompletną konfigurację workspace'u Cursor AI dla projektu FabManage - systemu zarządzania produkcją fabryki dekoracji.

## Struktura Projektu

FabManage to system zarządzania produkcją napisany w React 18 + TypeScript z następującymi technologiami:
- **Frontend**: React 18, TypeScript, Bootstrap 5
- **State Management**: Zustand z persystencją
- **Backend**: Supabase (PostgreSQL + Real-time)
- **Build Tool**: Vite
- **Deployment**: Docker

## Architektura Systemu

### Modułowy System Zarządzania

FabManage implementuje modułowy workflow produkcyjny:

1. **Wycena i Koncepcja** - prace kreatywne, szkice, moodboardy
2. **Projektowanie Techniczne** - modelowanie 3D (Rhino), dekompozycja na kafelki
3. **Produkcja** - system CNC, monitoring maszyn, tablica Kanban
4. **Zarządzanie Materiałami** - BOM, listy zakupowe, zamawianie
5. **Logistyka i Montaż** - transport, prace u klienta

### System Kafelków

Unikalna dekompozycja projektów na elementy produkcyjne:
- Statusy: Projektowanie → Do akceptacji → Zaakceptowane → W kolejce CNC → W produkcji CNC → Gotowy do montażu
- BOM (Bill of Materials) dla każdego kafelka
- Pliki techniczne (.dxf, .pdf) per element

## Struktura Folderów

```
FabManageNew/
├── src/
│   ├── components/        # Komponenty UI
│   ├── pages/            # Strony aplikacji
│   ├── stores/           # Zustand stores
│   ├── state/            # React Context (legacy)
│   ├── services/         # API services
│   ├── lib/              # Utilities
│   └── types/            # TypeScript types
├── docs/                 # Dokumentacja
└── docker/               # Konfiguracja Docker
```

## Kluczowe Komponenty

### 1. Zarządzanie Stanem (Zustand)
- Store dla projektów z modułami
- Store dla kafelków i statusów
- Store dla maszyn CNC
- Store dla materiałów i BOM
- Persystencja stanu w localStorage

### 2. Komponenty UI
- Dashboard z KPI produkcji
- Tablica Kanban dla CNC
- Formularze projektów i kafelków
- Komponenty do zarządzania materiałami
- Generatory list zakupowych

### 3. Integracje
- Supabase API dla danych
- Real-time subscriptions
- Eksport CSV/PDF
- Obsługa plików technicznych

## Specyficzne Wymagania Branżowe

### Scenografia i Dekoracje
- Workflow dostosowany do produkcji dekoracji
- Integracja z oprogramowaniem 3D (Rhino)
- Obsługa procesów CNC
- Zarządzanie materiałami budowlanymi

### CNC i Produkcja
- Monitoring maszyn INFOTEC EVO 1
- Kolejkowanie zadań produkcyjnych
- Śledzenie postępów w czasie rzeczywistym
- Optymalizacja wykorzystania materiałów

## Konwencje Kodowania

### Nazewnictwo
- **Komponenty**: PascalCase (np. `ProjectManager`, `CNCDashboard`)
- **Pliki**: kebab-case (np. `project-form.tsx`, `cnc-queue.tsx`)
- **Katalogi**: kebab-case (np. `components/project-management`)
- **Zmienne**: camelCase (np. `isLoading`, `projectData`)
- **Stałe**: UPPER_SNAKE_CASE (np. `PROJECT_STATUS`, `CNC_MACHINES`)

### Struktura Komponentów
```typescript
// Interfejsy na górze
interface ProjectFormProps {
  project?: Project;
  onSubmit: (data: ProjectData) => void;
}

// Komponent
export function ProjectForm({ project, onSubmit }: ProjectFormProps) {
  // Hooks i state
  const [isLoading, setIsLoading] = useState(false);
  const { addProject } = useProjectStore();
  
  // Handlers
  const handleSubmit = useCallback((data: ProjectData) => {
    // implementacja
  }, []);
  
  // Early returns
  if (!project && isRequired) return <LoadingSpinner />;
  
  // JSX
  return (
    <div className="project-form">
      {/* implementacja */}
    </div>
  );
}
```

### State Management (Zustand)
```typescript
interface ProjectStore {
  projects: Project[];
  currentProject: Project | null;
  addProject: (project: Omit<Project, 'id'>) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
}

export const useProjectStore = create<ProjectStore>()(
  persist(
    (set, get) => ({
      projects: [],
      currentProject: null,
      
      addProject: (projectData) => set((state) => ({
        projects: [...state.projects, { ...projectData, id: generateId() }]
      })),
      
      updateProject: (id, updates) => set((state) => ({
        projects: state.projects.map(p => 
          p.id === id ? { ...p, ...updates } : p
        )
      })),
      
      deleteProject: (id) => set((state) => ({
        projects: state.projects.filter(p => p.id !== id)
      }))
    }),
    { name: 'fab-manage-projects' }
  )
);
```

## Wzorce Projektowe

### 1. Modułowość Projektów
```typescript
interface ProjectModule {
  id: string;
  name: string;
  isEnabled: boolean;
  config?: ModuleConfig;
}

interface Project {
  id: string;
  name: string;
  modules: ProjectModule[];
  status: ProjectStatus;
  timeline: ProjectTimeline;
}
```

### 2. System Kafelków
```typescript
interface Tile {
  id: string;
  projectId: string;
  name: string;
  status: TileStatus;
  bom: BOMItem[];
  files: TechnicalFile[];
  cncQueue?: CNCQueueItem;
}

enum TileStatus {
  DESIGNING = 'designing',
  PENDING_APPROVAL = 'pending_approval',
  APPROVED = 'approved',
  CNC_QUEUE = 'cnc_queue',
  CNC_PRODUCTION = 'cnc_production',
  READY_ASSEMBLY = 'ready_assembly'
}
```

### 3. CNC Management
```typescript
interface CNCMachine {
  id: string;
  name: string;
  status: MachineStatus;
  currentTask?: CNCTask;
  queue: CNCTask[];
  utilization: number;
}

interface CNCTask {
  id: string;
  tileId: string;
  estimatedTime: number;
  priority: TaskPriority;
  files: TechnicalFile[];
}
```

## Integracja z Branżą

### Rhino 3D Integration
- Import/export plików .3dm
- Generowanie plików .dxf dla CNC
- Automatyczne tworzenie dokumentacji technicznej

### Material Management
- Baza danych materiałów budowlanych
- Kalkulacja kosztów w czasie rzeczywistym
- Automatyczne generowanie zamówień
- Śledzenie stanu magazynu

### Production Workflows
- Automatyzacja przejść między statusami
- Powiadomienia o postępach
- Raportowanie efektywności
- Analiza kosztów produkcji

## Performance & Optimization

### React Optimizations
- `React.memo()` dla komponentów list
- `useCallback()` dla event handlerów
- `useMemo()` dla kosztownych obliczeń
- Lazy loading dla modułów

### Data Management
- Debouncing dla search/filter
- Virtualizacja długich list
- Caching API responses
- Optimistic updates

### Bundle Optimization
- Code splitting per module
- Dynamic imports
- Tree shaking
- Asset optimization

## Security Considerations

### Data Protection
- Enkrypcja danych wrażliwych
- Secure API communication
- User authentication/authorization
- Audit logging

### Business Logic
- Validacja danych wejściowych
- Sanitizacja user input
- Rate limiting
- Error handling

## Development Workflow

### Git Strategy
- Feature branches
- Semantic commit messages
- Code review requirements
- Automated testing

### CI/CD Pipeline
- Automated testing
- Type checking
- Linting/formatting
- Deployment automation

## Specific Business Rules

### Project Lifecycle
1. Projekt może mieć włączone tylko te moduły, które są potrzebne
2. Przejście między modułami wymaga akceptacji poprzedniego
3. Każdy moduł ma swoje specyficzne dane i workflow
4. Koszt projektu akumuluje się przez wszystkie moduły

### CNC Production Rules
1. Kafelki trafiają do kolejki CNC automatycznie po akceptacji
2. Priorytet zadań określa deadline projektu
3. Czas produkcji szacowany na podstawie historycznych danych
4. Materiały muszą być dostępne przed rozpoczęciem produkcji

### Material Management Rules
1. BOM konsoliduje się automatycznie z wszystkich kafelków
2. Zamówienia grupowane są po dostawcach
3. Stany magazynowe aktualizowane w czasie rzeczywistym
4. Alerty o niskich stanach magazynowych

## Testing Strategy

### Unit Tests
- Store logic (Zustand)
- Utility functions
- Component behaviors
- Business logic

### Integration Tests
- API integrations
- Workflow transitions
- Data persistence
- User interactions

### E2E Tests
- Critical user journeys
- Cross-module workflows
- Data consistency
- Performance benchmarks

Ten workspace został zaprojektowany specjalnie dla potrzeb systemu FabManage, uwzględniając unikalne wymagania branży scenograficznej i production management. Konfiguracja zapewnia wysoką jakość kodu, maintainability i performance wymagane w profesjonalnym środowisku produkcyjnym.