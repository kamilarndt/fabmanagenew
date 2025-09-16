# Module Refactoring Guide

## Przegląd

Ten dokument opisuje refaktoryzację modułów w systemie FabManage, która ma na celu ujednolicenie struktury i komponentów w całej aplikacji.

## Zidentyfikowane wzorce

### 1. Struktura modułów

Każdy moduł powinien mieć następującą strukturę:

```
src/modules/[module-name]/
├── components/          # Komponenty specyficzne dla modułu
│   ├── [Module]Card.tsx
│   ├── [Module]Grid.tsx
│   ├── [Module]Stats.tsx
│   └── index.ts
├── hooks/              # Hooki do zarządzania stanem i API
│   ├── use[Module]Query.ts
│   └── index.ts
├── services/           # Serwisy API
│   ├── [module]Service.ts
│   └── index.ts
├── types.ts           # Definicje typów
├── views/             # Główne widoki modułu
│   ├── [Module]View.tsx
│   └── index.ts
└── index.ts           # Eksporty modułu
```

### 2. Wzorce komponentów

#### BaseCard

Uniwersalny komponent karty, który może być używany we wszystkich modułach:

```typescript
interface BaseEntity {
  id: string;
  name: string;
  description?: string;
  status: string;
  priority?: string;
  assignedTo?: string;
  projectId?: string;
  createdAt: string;
  updatedAt: string;
}
```

#### BaseGrid

Komponent siatki z kolumnami statusów:

```typescript
interface BaseGridProps {
  entities: BaseEntity[];
  statusColumns: Array<{ key: string; title: string; color?: string }>;
  getStatusFromEntity?: (entity: BaseEntity) => string;
  statusColorMap?: (status: string) => string;
  priorityColorMap?: (priority: string) => string;
  customFields?: (entity: BaseEntity) => React.ReactNode;
  actions?: (entity: BaseEntity) => React.ReactNode[];
}
```

#### BaseStats

Komponent statystyk:

```typescript
interface BaseStatsProps {
  entities: BaseEntity[];
  getStatusFromEntity?: (entity: BaseEntity) => string;
  getPriorityFromEntity?: (entity: BaseEntity) => string;
  customStats?: Array<{
    title: string;
    value: number;
    color?: string;
    icon?: React.ReactNode;
  }>;
}
```

#### BaseView

Główny komponent widoku z przełączaniem między trybami:

```typescript
interface BaseViewProps {
  entities: BaseEntity[];
  views?: Array<{
    key: string;
    label: string;
    component: React.ComponentType<any>;
  }>;
  // ... inne props
}
```

### 3. Wzorce serwisów

Wszystkie serwisy powinny implementować standardowy interfejs:

```typescript
export const moduleService = {
  async getEntities(filters?: ModuleFilters): Promise<ModuleEntity[]>;
  async getEntity(id: string): Promise<ModuleEntity>;
  async createEntity(entity: Omit<ModuleEntity, "id" | "createdAt" | "updatedAt">): Promise<ModuleEntity>;
  async updateEntity(id: string, entity: Partial<ModuleEntity>): Promise<ModuleEntity>;
  async deleteEntity(id: string): Promise<void>;
  async getStats(): Promise<ModuleStats>;
};
```

### 4. Wzorce hooków

Wszystkie hooki powinny używać TanStack Query:

```typescript
export function useModuleQuery(filters?: ModuleFilters) {
  return useQuery({
    queryKey: ["module-entities", filters],
    queryFn: () => moduleService.getEntities(filters),
    staleTime: 5 * 60 * 1000,
  });
}
```

## Template modułu

W katalogu `src/modules/_template/` znajduje się kompletny template modułu, który może być używany jako podstawa dla nowych modułów.

## Refaktoryzacja istniejących modułów

### Calendar Module

- ✅ EventCard używa teraz BaseCard
- ✅ CalendarGrid używa teraz BaseGrid
- ✅ Zachowana funkcjonalność specyficzna dla kalendarza

### CNC Module

- ✅ CNCTaskCard używa teraz BaseCard
- ✅ Zachowane akcje specyficzne dla CNC (Start, Pause, Complete)
- ✅ Zachowane pola specyficzne (wymiary, postęp, błędy)

## Korzyści z refaktoryzacji

1. **Spójność**: Wszystkie moduły używają tych samych wzorców
2. **Łatwość utrzymania**: Zmiany w BaseCard wpływają na wszystkie moduły
3. **Szybkość rozwoju**: Nowe moduły można tworzyć szybciej używając template
4. **Jakość kodu**: Mniej duplikacji, lepsze typowanie
5. **Testowanie**: Łatwiejsze testowanie dzięki ujednoliconym interfejsom

## Następne kroki

1. Refaktoryzacja pozostałych modułów (Materials, Tiles, Projects)
2. Stworzenie ujednoliconych komponentów formularzy
3. Implementacja wspólnych wzorców walidacji
4. Stworzenie wspólnego systemu notyfikacji
5. Optymalizacja wydajności komponentów bazowych

## Przykład użycia

```typescript
// W module Calendar
const baseEntity: BaseEntity = {
  id: event.id,
  name: event.title,
  description: event.description,
  status: event.status || "scheduled",
  priority: event.priority,
  assignedTo: event.assignedTo,
  projectId: event.projectId,
  createdAt: event.createdAt,
  updatedAt: event.updatedAt,
};

return (
  <BaseCard
    entity={baseEntity}
    onView={onView}
    onEdit={onEdit}
    onDelete={onDelete}
    statusColorMap={getStatusColor}
    priorityColorMap={getPriorityColor}
    customFields={customFields}
  />
);
```

