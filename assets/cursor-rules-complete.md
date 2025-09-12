# Cursor AI Rules dla FabManage

Niniejszy dokument zawiera wszystkie reguły i konfiguracje dla Cursor AI w projekcie FabManage.

## Podstawowe Reguły Projektowe

Jesteś ekspertem w TypeScript, React, Zustand, Bootstrap 5, i systemach zarządzania produkcją.

### Technologie Projektu
- **Frontend**: React 18 + TypeScript w strict mode
- **State Management**: Zustand z persystencją localStorage
- **UI Framework**: Bootstrap 5 + Custom CSS
- **Build Tool**: Vite
- **Backend**: Supabase (PostgreSQL + Real-time subscriptions)
- **Deployment**: Docker

### Architektura FabManage
FabManage to system zarządzania produkcją fabryki dekoracji z modułową architekturą:

1. **Wycena i Koncepcja** - prace kreatywne, szkice
2. **Projektowanie Techniczne** - modelowanie 3D, dekompozycja na kafelki
3. **Produkcja** - system CNC, monitoring maszyn
4. **Zarządzanie Materiałami** - BOM, listy zakupowe
5. **Logistyka i Montaż** - transport, instalacja

## Styl Kodu i Struktura

### Zasady Ogólne
- Pisz zwięzły, techniczny kod TypeScript z poprawnymi przykładami
- Używaj wzorców funkcyjnych i deklaratywnych; unikaj klas
- Preferuj iterację i modularyzację nad duplikacją kodu
- Używaj opisowych nazw zmiennych z czasownikami pomocniczymi (np. `isLoading`, `hasError`)
- Struktura plików: eksportowany komponent, subkomponenty, helpery, statyczna zawartość, typy

### Nazewnictwo
- **PascalCase** dla: komponentów, interfejsów, typów
- **camelCase** dla: zmiennych, funkcji, metod, propsów
- **kebab-case** dla: katalogów (np. `components/project-management`), plików (np. `project-form.tsx`)
- **UPPER_SNAKE_CASE** dla: stałych, zmiennych środowiskowych

### Konwencje TypeScript
- Używaj TypeScript dla całego kodu; preferuj `interface` nad `type`
- Unikaj `any` i `unknown` - szukaj definicji typów w kodzie
- Unikaj asercji typów z `as` lub `!`
- Unikaj enumów; używaj literal types lub maps
- Włącz strict mode w tsconfig.json
- Używaj type guards dla bezpiecznej obsługi undefined/null

## Wzorce React

### Komponenty
- Używaj komponentów funkcyjnych z interfejsami TypeScript
- Używaj słowa kluczowego `function` dla komponentów
- Implementuj `React.memo()` strategicznie dla wydajności
- Używaj `useCallback` dla memoizacji funkcji callback
- Używaj `useMemo` dla kosztownych obliczeń
- Unikaj inline funkcji w JSX

### Hooks i State
- Minimalizuj użycie `useEffect` i `useState`
- Preferuj derived state i memoization
- Używaj early returns dla warunków błędów
- Implementuj proper cleanup w useEffect

### Event Handlers
- Prefiks `handle` dla event handlerów (np. `handleClick`, `handleSubmit`)
- Używaj `useCallback` dla event handlerów przekazywanych jako props

## Zarządzanie Stanem (Zustand)

### Struktura Store
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
  clearError: () => void;
}
```

### Wzorce Store
- Używaj `create<T>()()` pattern dla TypeScript
- Implementuj persystencję z middleware `persist`
- Grupuj powiązane akcje w tym samym store
- Używaj immer middleware dla złożonych aktualizacji stanu
- Normalizuj strukturę stanu dla wydajności

### Zasady Store
- Jeden store per domenę biznesową (projects, tiles, cnc, materials)
- Asynchroniczne akcje powinny obsługiwać loading/error states
- Używaj optimistic updates gdzie to możliwe
- Implementuj proper error handling

## UI i Styling

### Bootstrap 5
- Używaj Bootstrap 5 classes dla layoutu i podstawowych komponentów
- Preferuj utility classes nad custom CSS
- Implementuj responsive design z mobile-first approach
- Używaj Bootstrap grid system dla layoutów

### Custom Components
- Twórz reusable komponenty dla specyficznych elementów UI
- Implementuj proper accessibility attributes
- Używaj semantic HTML elements
- Dodawaj proper ARIA labels

### Styling Guidelines
- Ogranicz custom CSS do minimum
- Używaj CSS modules dla component-specific styles
- Implementuj consistent spacing using Bootstrap utilities
- Używaj CSS custom properties dla theme variables

## Specyficzne Wzorce FabManage

### System Modułów Projektu
```typescript
interface ProjectModule {
  id: string;
  name: ModuleName;
  isEnabled: boolean;
  config?: ModuleConfig;
  data?: ModuleData;
}

enum ModuleName {
  PRICING = 'pricing',
  CONCEPT = 'concept',
  TECHNICAL_DESIGN = 'technical_design',
  PRODUCTION = 'production',
  MATERIALS = 'materials',
  LOGISTICS = 'logistics'
}
```

### System Kafelków
```typescript
interface Tile {
  id: string;
  projectId: string;
  name: string;
  status: TileStatus;
  bom: BOMItem[];
  files: TechnicalFile[];
  estimatedTime: number;
  priority: number;
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

### CNC Management
```typescript
interface CNCMachine {
  id: string;
  name: string;
  status: MachineStatus;
  currentTask?: CNCTask;
  queue: CNCTask[];
  utilization: number;
  capabilities: MachineCapability[];
}

interface CNCTask {
  id: string;
  tileId: string;
  machineId: string;
  estimatedTime: number;
  actualTime?: number;
  priority: TaskPriority;
  files: TechnicalFile[];
  status: TaskStatus;
}
```

## Error Handling

### Ogólne Zasady
- Priorytetyzuj obsługę błędów i edge cases
- Używaj early returns dla warunków błędów
- Implementuj guard clauses dla preconditions
- Umieszczaj happy path na końcu funkcji

### Error Types
```typescript
interface AppError {
  code: string;
  message: string;
  details?: Record<string, any>;
  timestamp: Date;
}

enum ErrorCode {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
  PERMISSION_ERROR = 'PERMISSION_ERROR',
  BUSINESS_LOGIC_ERROR = 'BUSINESS_LOGIC_ERROR'
}
```

### Error Boundaries
- Implementuj error boundaries dla krytycznych sekcji
- Loguj błędy do external service
- Wyświetlaj user-friendly error messages
- Zapewnij fallback UI

## Performance i Optymalizacja

### React Performance
- Używaj `React.memo()` dla komponentów list
- Implementuj proper key props w listach (unikaj index jako key)
- Używaj `Suspense` z fallbackami dla lazy-loaded komponentów
- Implementuj virtualizację dla długich list

### Data Fetching
- Używaj proper caching strategies
- Implementuj optimistic updates
- Debounce search/filter inputs
- Batch API requests gdzie to możliwe

### Bundle Optimization
- Implementuj code splitting per module
- Używaj dynamic imports dla non-critical komponentów
- Optimize images (WebP format, lazy loading)
- Tree shake unused code

## Walidacja i Bezpieczeństwo

### Input Validation
- Waliduj wszystkie user inputs
- Używaj Zod lub podobnej biblioteki do schema validation
- Sanityzuj dane przed zapisem
- Implementuj proper type checking

### Security Best Practices
- Unikaj `eval()` i `new Function()`
- Nie commituj API keys w kodzie (używaj environment variables)
- Implementuj proper authentication/authorization
- Sanityzuj HTML content używając DOMPurify

## Testowanie

### Unit Tests
- Testuj store logic (Zustand actions)
- Testuj utility functions
- Testuj component behaviors
- Używaj Jest + React Testing Library

### Integration Tests
- Testuj API integrations
- Testuj workflow transitions
- Testuj data persistence
- Testuj user interactions

## Dokumentacja

### Code Documentation
- Używaj JSDoc dla funkcji i komponentów
- Dokumentuj złożoną business logic
- Komentuj non-obvious code
- Utrzymuj README up-to-date

### Type Documentation
```typescript
/**
 * Represents a production tile in the FabManage system
 * 
 * @interface Tile
 * @property {string} id - Unique identifier for the tile
 * @property {string} projectId - ID of the parent project
 * @property {TileStatus} status - Current status in production workflow
 * @property {BOMItem[]} bom - Bill of materials for this tile
 */
interface Tile {
  id: string;
  projectId: string;
  status: TileStatus;
  bom: BOMItem[];
}
```

## Business Logic Specific Rules

### Project Workflow
- Projekt może przejść do następnego modułu tylko po ukończeniu poprzedniego
- Każdy moduł ma swoje specyficzne dane i wymagania
- Koszt projektu akumuluje się przez wszystkie aktywne moduły
- Timeline projektu kalkuluje się na podstawie włączonych modułów

### CNC Production Rules
- Kafelki automatycznie trafiają do kolejki CNC po zatwierdzeniu
- Priorytet zadań określa deadline projektu i priorytet klienta
- Szacowany czas produkcji bazuje na historycznych danych i typie materiału
- Materiały muszą być dostępne przed rozpoczęciem produkcji

### Material Management
- BOM konsoliduje się automatycznie z wszystkich kafelków w projekcie
- Zamówienia grupowane są po dostawcach dla optymalizacji kosztów
- Stany magazynowe aktualizowane w real-time
- Automatyczne alerty o niskich stanach magazynowych

## Supabase Integration

### Database Schema
- Używaj proper foreign keys i constraints
- Implementuj Row Level Security (RLS)
- Używaj database functions dla complex queries
- Implementuj proper indexing dla performance

### Real-time Subscriptions
- Subscribe do zmian w real-time dla CNC status updates
- Implementuj proper cleanup dla subscriptions
- Handle connection errors gracefully
- Używaj proper typing dla subscription data

### API Integration
```typescript
// Przykład proper Supabase integration
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

## Development Workflow

### Git Conventions
- Używaj semantic commit messages (feat:, fix:, docs:, style:, refactor:, test:, chore:)
- Twórz feature branches dla nowych funkcjonalności
- Wymagaj code review przed merge
- Użyj proper branch naming (feature/module-name, fix/bug-description)

### Code Quality
- Uruchom `npm run lint` przed commitem
- Uruchom `npm run type-check` dla TypeScript errors
- Uruchom testy przed merge do main
- Utrzymuj test coverage powyżej 80%

Te reguły są specjalnie zaprojektowane dla systemu FabManage i uwzględniają jego unikalne wymagania w zakresie zarządzania produkcją, systemów CNC i workflow branży scenograficznej.