# FabManage New UI - Harmonogram Implementacji

## Przegląd Strategii

Migracja UI prowadzona strategią **Strangler Fig** z równoległymi trasami `/v2` i feature flagami. Zachowujemy stores (Zustand), TanStack Query i Supabase - wymieniamy tylko warstwę UI.

---

## FAZA 0: SETUP & PREPARATION (Tydzień 1)

### 🎯 Cel

Przygotowanie infrastruktury i środowiska do migracji UI.

### 📋 Zadania

- [ ] **Setup Tailwind CSS** z prefixem `tw-` i scope `.fm`
- [ ] **Design tokens** z Figma → `src/new-ui/tokens/`
- [ ] **ESLint rules** blokujące `antd` poza `bridge-ui`
- [ ] **Bridge layer** - adaptery Ant Design
- [ ] **CI/CD pipeline** z UI migration checks
- [ ] **Dokumentacja** i guidelines

### 🛠️ Techniczne

```bash
# Instalacja dependencies
npm install tailwindcss @tailwindcss/typography
npm install class-variance-authority clsx tailwind-merge
npm install @radix-ui/react-* sonner

# Konfiguracja Tailwind
npx tailwindcss init -p
```

### 📦 Deliverables

- ✅ Tailwind config z prefixem
- ✅ Design tokens z Figma
- ✅ ESLint rules
- ✅ Bridge layer setup
- ✅ CI pipeline

### 🎯 Success Criteria

- MCP connects to Figma
- Bridge layer blocks direct antd imports
- All existing functionality works
- Team can generate code from Figma

---

## FAZA 1: ATOMS FOUNDATION (Tydzień 2-3)

### 🎯 Cel

Implementacja podstawowych atomów - fundament design systemu.

### 📋 Zadania

- [ ] **Button** - wszystkie warianty (default, destructive, outline, secondary, ghost, link)
- [ ] **Input** - text, textarea, search variants
- [ ] **Label** - z required indicator
- [ ] **Badge** - status indicators
- [ ] **Icon** - Lucide React integration
- [ ] **Spinner** - loading states
- [ ] **Switch, Checkbox, RadioGroup** - form controls
- [ ] **Progress** - progress indicators

### 🛠️ Implementacja

```typescript
// src/new-ui/atoms/Button/Button.tsx
import { cva } from "class-variance-authority";
import { cn } from "@/new-ui/utils/cn";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);
```

### 📦 Deliverables

- ✅ 12+ komponentów atomów
- ✅ Dark/light mode support
- ✅ Icon system z Lucide React
- ✅ Accessibility tests passing
- ✅ Storybook documentation

### 🎯 Success Criteria

- All design tokens exported and working
- Button component matches Figma designs exactly
- Dark mode toggle works correctly
- All atoms pass accessibility audit
- Bundle size impact < 50KB

---

## FAZA 2: MOLECULES & CORE PATTERNS (Tydzień 4-5)

### 🎯 Cel

Implementacja złożonych molekuł i wzorców formularzy.

### 📋 Zadania

- [ ] **FormField** - Label + Input + Validation (Zod integration)
- [ ] **SearchBox** - Input + Search icon + Clear button
- [ ] **DropdownMenu** - Radix UI + shadcn styling
- [ ] **Select** - Custom select z search
- [ ] **DatePicker** - Date/time picker
- [ ] **Toast** - Notification system (sonner)
- [ ] **Tooltip** - Hover tooltips
- [ ] **Pagination** - Table pagination
- [ ] **Breadcrumb** - Navigation breadcrumbs

### 🛠️ Implementacja

```typescript
// src/new-ui/molecules/FormField/FormField.tsx
import { Label } from "@/new-ui/atoms/Label";
import { cn } from "@/new-ui/utils/cn";

interface FormFieldProps {
  label: string;
  name: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}

export function FormField({
  label,
  name,
  error,
  required,
  children,
}: FormFieldProps) {
  return (
    <div className="space-y-2">
      <Label
        htmlFor={name}
        className={cn(
          required && "after:content-['*'] after:text-destructive after:ml-1"
        )}
      >
        {label}
      </Label>
      {children}
      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
```

### 📦 Deliverables

- ✅ 15+ komponenty molecules
- ✅ Form validation system
- ✅ Notification system (replacement dla antd message)
- ✅ Date picker (replacement dla antd DatePicker)
- ✅ Comprehensive testing suite

### 🎯 Success Criteria

- FormField components handle all validation cases
- Toast system replaces antd notifications
- Date picker has feature parity with antd
- All molecules integrate seamlessly with atoms
- Performance benchmarks met

---

## FAZA 3: CRITICAL ORGANISMS (Tydzień 6-8)

### 🎯 Cel

Implementacja kluczowych organizmów i pierwsza migracja route.

### 📋 Zadania

- [ ] **Sheet** - Prawy Drawer (replacement AntD Drawer) - **PRIORYTET**
- [ ] **DataTable** - @tanstack/react-table wrapper
- [ ] **Sidebar** - Nowa nawigacja boczna
- [ ] **Header** - Nowy header z breadcrumbs
- [ ] **Dashboard widgets** - StatCard, QuickActions
- [ ] **Pierwsza migracja**: `/materials/v2`
- [ ] **A/B testing** setup

### 🛠️ Implementacja Sheet (PRIORYTET)

```typescript
// src/new-ui/organisms/Sheet/Sheet.tsx
import * as Dialog from "@radix-ui/react-dialog";
import { cn } from "@/new-ui/utils/cn";

interface SheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

export function Sheet({ open, onOpenChange, children }: SheetProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      {children}
    </Dialog.Root>
  );
}

export function SheetContent({
  side = "right",
  className,
  children,
  ...props
}: SheetContentProps) {
  return (
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
      <Dialog.Content
        className={cn(
          "fixed top-0 z-50 h-full w-96 bg-background p-6 shadow-lg transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right",
          side === "right" && "right-0",
          className
        )}
        {...props}
      >
        {children}
      </Dialog.Content>
    </Dialog.Portal>
  );
}
```

### 📦 Deliverables

- ✅ DataTable z pełną funkcjonalnością
- ✅ Sheet system z accessibility support
- ✅ Navigation organisms
- ✅ First migrated route: `/materials/v2`
- ✅ A/B testing infrastructure

### 🎯 Success Criteria

- DataTable performance > antd Table
- Sheet accessibility score 100%
- `/materials/v2` fully functional
- User feedback positive (>80% satisfaction)
- Bundle size reduction visible

---

## FAZA 4: DOMAIN-SPECIFIC ORGANISMS (Tydzień 9-11)

### 🎯 Cel

Implementacja organizmów specyficznych dla FabManage.

### 📋 Zadania

- [ ] **KanbanBoard** - Tablica Kanban dla kafelków
- [ ] **GanttChart** - Harmonogram projektów
- [ ] **Materials components** - MaterialCard, MaterialFilters
- [ ] **File upload** - Drag & drop file upload
- [ ] **Chart components** - Wykresy (recharts)
- [ ] **Calendar** - Kalendarz zadań
- [ ] **Druga migracja**: `/projects/v2`

### 🛠️ Implementacja KanbanBoard

```typescript
// src/new-ui/organisms/KanbanBoard/KanbanBoard.tsx
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

interface KanbanBoardProps {
  tiles: Tile[];
  columns: Column[];
  onTileUpdate: (tileId: string, updates: Partial<Tile>) => void;
  onTileMove: (
    tileId: string,
    sourceColumn: string,
    destinationColumn: string
  ) => void;
}

export function KanbanBoard({
  tiles,
  columns,
  onTileUpdate,
  onTileMove,
}: KanbanBoardProps) {
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    onTileMove(
      result.draggableId,
      result.source.droppableId,
      result.destination.droppableId
    );
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex gap-6 overflow-x-auto p-4">
        {columns.map((column) => (
          <KanbanColumn
            key={column.id}
            column={column}
            tiles={tiles.filter((tile) => tile.status === column.id)}
            onTileUpdate={onTileUpdate}
          />
        ))}
      </div>
    </DragDropContext>
  );
}
```

### 📦 Deliverables

- ✅ KanbanBoard z drag-and-drop
- ✅ Modernizowany GanttChart
- ✅ Materials management UI
- ✅ Second migrated route: `/projects/v2`
- ✅ Advanced visualization components

### 🎯 Success Criteria

- KanbanBoard performance better than legacy
- GanttChart maintains all functionality
- `/projects/v2` matches feature parity
- User adoption rate >60% for new routes
- Performance metrics improved across board

---

## FAZA 5: TEMPLATES & MASS MIGRATION (Tydzień 12-14)

### 🎯 Cel

Kompletne templates i masowa migracja pozostałych routes.

### 📋 Zadania

- [ ] **AppShell** - Główny layout aplikacji
- [ ] **All page templates** - Dashboard, Settings, etc.
- [ ] **Responsive design** optimization
- [ ] **Mass migration** remaining routes
- [ ] **Performance optimization** pass
- [ ] **Accessibility final** audit

### 🛠️ Implementacja AppShell

```typescript
// src/new-ui/templates/AppShell/AppShell.tsx
import { AppSidebar } from "./AppSidebar";
import { AppHeader } from "./AppHeader";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-background">
      <AppSidebar />
      <div className="pl-64">
        <AppHeader />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
```

### 📦 Deliverables

- ✅ Complete AppShell template
- ✅ All page templates responsive
- ✅ 95%+ routes migrated to new UI
- ✅ Performance optimizations applied
- ✅ Accessibility compliance achieved

### 🎯 Success Criteria

- All routes migrated successfully
- Mobile experience excellent
- Bundle size reduced by 80%+
- Core Web Vitals improved
- Zero accessibility violations

---

## FAZA 6: LEGACY CLEANUP (Tydzień 15-16)

### 🎯 Cel

Usunięcie legacy kodu i finalna optymalizacja.

### 📋 Zadania

- [ ] **Removal** wszystkich antd dependencies
- [ ] **Cleanup** bridge-ui layer
- [ ] **Final bundle** optimization
- [ ] **Documentation** update
- [ ] **Team training** sessions
- [ ] **Go-live** preparation

### 🛠️ Cleanup Script

```bash
# Usunięcie legacy dependencies
npm uninstall antd @ant-design/icons

# Cleanup bridge-ui
rm -rf src/bridge-ui

# Final bundle optimization
npm run build:analyze
```

### 📦 Deliverables

- ✅ Zero antd dependencies
- ✅ Clean codebase without bridge layer
- ✅ Optimized production build
- ✅ Updated documentation
- ✅ Trained team
- ✅ Production deployment

### 🎯 Success Criteria

- Bundle size reduced by 85%+
- Build time improved by 50%+
- Developer experience improved
- Zero legacy code remaining
- Production stable and performant

---

## METRYKI I MONITORING

### Performance KPIs

- **Bundle size reduction**: Target 85% (from 850KB to ~127KB)
- **Initial load time**: Target 70% improvement
- **Runtime performance**: Target 95% improvement
- **Memory usage**: Target 80% reduction

### Development KPIs

- **Component development time**: Target 40% reduction
- **Design-to-code time**: Target 60% reduction (dzięki MCP)
- **Developer satisfaction**: Target >85%

### Business KPIs

- **User satisfaction**: Target >90%
- **Feature delivery velocity**: Target 25% increase
- **Production incidents**: Target 0 related to UI

---

## ROLLBACK PLAN

### Immediate Rollback

- Feature flags toggle → antd components
- Bridge layer activation
- CI/CD pipeline revert

### Partial Rollback

- Component-specific rollback przez bridge layer
- Route-specific rollback (np. tylko `/materials/v2`)
- User-group specific rollback

---

## KEY MILESTONES

- **Week 1**: ✅ Environment setup + MCP integration working
- **Week 3**: ✅ Design tokens + Atoms complete
- **Week 6**: ✅ Molecules + Core patterns ready
- **Week 8**: ✅ First route migration (`/materials/v2`) successful
- **Week 11**: ✅ All critical organisms implemented
- **Week 14**: ✅ Mass migration complete (95%+ routes)
- **Week 16**: ✅ Legacy cleanup + production optimization
- **Week 17**: 🚀 Go-live + monitoring

---

## RISK MANAGEMENT

### High Risks

- **Breaking changes w production**: Mitigation przez Strangler Fig + A/B testing
- **Performance regression**: Continuous monitoring + rollback procedures
- **Team adoption**: Training + pair programming + dokumentacja

### Medium Risks

- **MCP integration issues**: Manual fallback + backup design tokens
- **Accessibility regressions**: Automated testing + manual audits

---

## NEXT STEPS

1. **Get team approval** for implementation plan
2. **Setup Figma workspace** with shadcn/ui kit
3. **Configure Cursor IDE** with MCP plugin
4. **Initialize Phase 0**: Setup & Preparation
5. **Begin design token extraction** from Figma

Ten harmonogram zapewnia systematyczną, bezpieczną migrację z minimalnym ryzykiem i maksymalną wartością biznesową.
