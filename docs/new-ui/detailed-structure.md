# FabManage New UI - Szczegółowa Struktura

## Przegląd Systemu

FabManage to system zarządzania produkcją fabryki dekoracji z modułowym workflow:

1. **Wycena i Koncepcja** → 2. **Projektowanie Techniczne** → 3. **Produkcja CNC** → 4. **Materiały** → 5. **Logistyka**

### Kluczowe Koncepcje Biznesowe

- **Projekty** z modułami (pricing, concept, technical_design, production, materials, logistics)
- **Kafelki** (tiles) - dekompozycja projektów na elementy produkcyjne
- **Statusy kafelków**: designing → pending_approval → approved → cnc_queue → cnc_production → ready_assembly
- **CNC Management** - monitoring maszyn, kolejki zadań, priorytetyzacja
- **BOM** (Bill of Materials) - konsolidacja materiałów z kafelków
- **Real-time** - statusy CNC, inwentaryzacja, notyfikacje

---

## Nowa Struktura UI (src/new-ui/)

### 1. TOKENS (src/new-ui/tokens/)

**Design tokens zsynchronizowane z Figma**

```
tokens/
├── colors.ts          # Kolory: primary, secondary, success, warning, error, neutral
├── typography.ts      # Fonty: family, sizes, weights, line-heights
├── spacing.ts         # Marginesy, padding: xs, sm, md, lg, xl, 2xl
├── radii.ts           # Border radius: none, sm, md, lg, full
├── shadows.ts         # Cienie: sm, md, lg, xl
├── animations.ts      # Transitions, durations, easings
└── index.ts           # Eksport wszystkich tokens
```

**Mapowanie do CSS Variables:**

```css
:root {
  --color-primary: hsl(221, 83%, 53%);
  --color-primary-foreground: hsl(210, 40%, 98%);
  --spacing-md: 1rem;
  --radius-md: 0.375rem;
}
```

---

### 2. ATOMS (src/new-ui/atoms/)

**Podstawowe, niepodzielne komponenty**

```
atoms/
├── Button/
│   ├── Button.tsx           # Główny komponent z wariantami
│   ├── Button.stories.tsx   # Storybook stories
│   ├── Button.test.tsx      # Testy RTL + a11y
│   └── index.ts
├── Input/
│   ├── Input.tsx
│   ├── TextArea.tsx
│   ├── Input.stories.tsx
│   ├── Input.test.tsx
│   └── index.ts
├── Label/
├── Badge/
├── Icon/                    # Lucide React icons
├── Spinner/
├── Switch/
├── Checkbox/
├── RadioGroup/
├── Progress/
├── Separator/
├── Avatar/
└── index.ts                 # Eksport wszystkich atomów
```

**Wzorzec komponentu:**

```typescript
interface ButtonProps {
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  size?: "default" | "sm" | "lg" | "icon";
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
}

export function Button({
  variant = "default",
  size = "default",
  ...props
}: ButtonProps) {
  return (
    <button className={cn(buttonVariants({ variant, size }))} {...props}>
      {props.loading && <Spinner size="sm" />}
      {props.children}
    </button>
  );
}
```

---

### 3. MOLECULES (src/new-ui/molecules/)

**Funkcjonalne grupy atomów**

```
molecules/
├── FormField/
│   ├── FormField.tsx        # Label + Input + Error message
│   ├── FormField.stories.tsx
│   ├── FormField.test.tsx
│   └── index.ts
├── SearchBox/
│   ├── SearchBox.tsx        # Input + Search icon + Clear button
│   └── index.ts
├── Pagination/
├── Breadcrumb/
├── Tooltip/
├── Toast/                   # Notification system (sonner)
├── DropdownMenu/
├── Select/                  # Custom select z Radix
├── DatePicker/              # Date picker z Radix
├── ComboBox/                # Searchable select
├── Popover/
├── AlertDialog/
└── index.ts
```

**Wzorzec FormField:**

```typescript
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
        className={cn(required && "after:content-['*'] after:text-destructive")}
      >
        {label}
      </Label>
      {children}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
```

---

### 4. ORGANISMS (src/new-ui/organisms/)

**Złożone komponenty biznesowe**

```
organisms/
├── DataTable/
│   ├── DataTable.tsx        # @tanstack/react-table wrapper
│   ├── DataTable.stories.tsx
│   ├── DataTable.test.tsx
│   └── index.ts
├── Sheet/                   # Prawy Drawer (replacement AntD Drawer)
│   ├── Sheet.tsx
│   ├── SheetContent.tsx
│   ├── SheetHeader.tsx
│   ├── SheetTitle.tsx
│   ├── SheetDescription.tsx
│   ├── SheetFooter.tsx
│   └── index.ts
├── Sidebar/
├── Header/
├── NavigationMenu/
├── Dashboard/
│   ├── StatCard.tsx         # Karta ze statystyką
│   ├── QuickActions.tsx     # Szybkie akcje
│   └── index.ts
├── KanbanBoard/             # Tablica Kanban dla kafelków
│   ├── KanbanBoard.tsx
│   ├── KanbanColumn.tsx
│   ├── KanbanCard.tsx
│   └── index.ts
├── GanttChart/              # Harmonogram projektów
├── Calendar/                # Kalendarz zadań
├── FileUpload/              # Upload plików
├── Chart/                   # Wykresy (recharts)
└── index.ts
```

**Wzorzec Sheet (prawy Drawer):**

```typescript
interface SheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

export function Sheet({ open, onOpenChange, children }: SheetProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" side="right">
        {children}
      </DialogContent>
    </Dialog>
  );
}
```

---

### 5. TEMPLATES (src/new-ui/templates/)

**Kompletne layouts stron**

```
templates/
├── AppShell/
│   ├── AppShell.tsx         # Główny layout aplikacji
│   ├── AppSidebar.tsx       # Nowa nawigacja boczna
│   ├── AppHeader.tsx        # Nowy header
│   ├── AppContent.tsx       # Obszar treści
│   └── index.ts
├── ProjectPage/
│   ├── ProjectPage.tsx      # Layout strony projektu
│   ├── ProjectHeader.tsx    # Header z breadcrumb
│   ├── ProjectTabs.tsx      # Tabs modułów
│   └── index.ts
├── MaterialsPage/
│   ├── MaterialsPage.tsx    # Layout strony materiałów
│   ├── MaterialsFilters.tsx # Filtry materiałów
│   ├── MaterialsGrid.tsx    # Siatka materiałów
│   └── index.ts
├── TilesPage/
├── DashboardPage/
├── SettingsPage/
└── index.ts
```

**Wzorzec AppShell:**

```typescript
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

---

### 6. UTILS (src/new-ui/utils/)

**Utilities i helpers**

```
utils/
├── cn.ts                    # clsx + tailwind-merge
├── variants.ts              # class-variance-authority
├── animations.ts            # Framer Motion presets
├── responsive.ts            # Breakpoint helpers
├── theme.ts                 # Theme switching
└── index.ts
```

---

## BRIDGE UI (src/bridge-ui/)

**Warstwa przejściowa Strangler Fig**

```
bridge-ui/
├── antd-wrappers/
│   ├── LegacyButton.tsx     # Adapter AntD Button
│   ├── LegacyTable.tsx      # Adapter AntD Table
│   ├── LegacyDrawer.tsx     # Adapter AntD Drawer
│   ├── LegacyForm.tsx       # Adapter AntD Form
│   ├── LegacyModal.tsx      # Adapter AntD Modal
│   └── index.ts
├── migration-helpers/
│   ├── ComponentBridge.tsx  # Helper do migracji
│   ├── ThemeBridge.tsx      # Bridge tematów
│   ├── StyleBridge.tsx      # Bridge styli
│   └── index.ts
└── index.ts
```

**Wzorzec LegacyButton:**

```typescript
interface LegacyButtonProps {
  type?: "primary" | "default" | "dashed" | "link" | "text";
  size?: "small" | "middle" | "large";
  children: React.ReactNode;
  onClick?: () => void;
}

export function LegacyButton({
  type = "default",
  size = "middle",
  ...props
}: LegacyButtonProps) {
  // Mapowanie na nowy Button
  const variant = type === "primary" ? "default" : "outline";
  const buttonSize =
    size === "small" ? "sm" : size === "large" ? "lg" : "default";

  return <Button variant={variant} size={buttonSize} {...props} />;
}
```

---

## STRUKTURA STRON (src/pages/)

### Obecne strony do migracji:

#### 1. **Dashboard** (`/`)

- **Obecny**: `src/pages/Dashboard.tsx`
- **Nowy**: `src/new-ui/templates/DashboardPage/`
- **Komponenty**: StatCard, QuickActions, RecentProjects

#### 2. **Projekty** (`/projects`)

- **Obecny**: `src/pages/Projects.tsx`
- **Nowy**: `src/new-ui/templates/ProjectPage/`
- **Komponenty**: ProjectCard, ProjectFilters, ProjectStats

#### 3. **Kafelki** (`/kafelki`)

- **Obecny**: `src/pages/Tiles.tsx`
- **Nowy**: `src/new-ui/templates/TilesPage/`
- **Komponenty**: KanbanBoard, TileCard, TileEditSheet

#### 4. **Materiały** (`/magazyn`)

- **Obecny**: `src/pages/MagazynDashboard.tsx`
- **Nowy**: `src/new-ui/templates/MaterialsPage/`
- **Komponenty**: MaterialsGrid, MaterialCard, MaterialFilters

#### 5. **CNC** (`/cnc`)

- **Obecny**: `src/pages/CNC.tsx`
- **Nowy**: `src/new-ui/templates/CNCPage/`
- **Komponenty**: CNCQueue, MachineStatus, ProductionChart

#### 6. **Produkcja** (`/produkcja`)

- **Obecny**: `src/pages/Produkcja.tsx`
- **Nowy**: `src/new-ui/templates/ProductionPage/`
- **Komponenty**: ProductionKanban, TaskCard, ProgressChart

#### 7. **Kalendarz** (`/calendar`)

- **Obecny**: `src/pages/CalendarPage.tsx`
- **Nowy**: `src/new-ui/templates/CalendarPage/`
- **Komponenty**: Calendar, EventForm, EventCard

#### 8. **Ustawienia** (`/settings`)

- **Obecny**: `src/pages/Settings.tsx`
- **Nowy**: `src/new-ui/templates/SettingsPage/`
- **Komponenty**: SettingsForm, UserProfile, SystemConfig

---

## ROUTING V2

### Strategia migracji:

1. **Równoległe trasy** `/v2` (np. `/materials/v2`)
2. **Feature flags** do kontrolowanego rollout
3. **A/B testing** metryk wydajności
4. **Stopniowe przełączanie** ruchu

### Przykład routingu:

```typescript
// src/App.tsx
<Routes>
  {/* Legacy routes */}
  <Route path="/materials" element={<LegacyMaterialsPage />} />

  {/* New UI routes */}
  <Route path="/materials/v2" element={<NewMaterialsPage />} />

  {/* Feature flag controlled */}
  {featureFlags.newUI && (
    <Route path="/materials" element={<NewMaterialsPage />} />
  )}
</Routes>
```

---

## ZASADY I KONWENCJE

### 1. **Atomic Design**

- **Atoms**: Button, Input, Label, Badge, Icon
- **Molecules**: FormField, SearchBox, Pagination, Tooltip
- **Organisms**: DataTable, Sheet, KanbanBoard, GanttChart
- **Templates**: AppShell, ProjectPage, MaterialsPage

### 2. **TypeScript**

- Strict mode, brak `any`/`unknown`
- Interfejsy dla props, type dla danych
- Named exports, brak default exports
- Explicit return types dla exported functions

### 3. **Styling**

- Tailwind CSS z prefixem `tw-` lub scope `.fm`
- Design tokens z Figma → CSS variables → Tailwind
- class-variance-authority dla wariantów
- Brak inline styles

### 4. **Accessibility**

- WCAG AA compliance
- Focus management dla Drawer/Modal
- ARIA labels i roles
- Keyboard navigation
- Axe checks w CI

### 5. **Testing**

- RTL + Vitest dla atomów/molekuł
- Playwright smoke dla tras v2
- Snapshot tests dla komponentów
- A11y tests w pipeline

### 6. **Performance**

- Code splitting per route
- Lazy loading ciężkich komponentów
- Virtualization dla długich list
- Bundle size monitoring

---

## CHECKLIST MIGRACJI

### Faza 1: Setup

- [ ] Zainicjować `src/new-ui/tokens/`
- [ ] Skonfigurować Tailwind z prefixem
- [ ] Dodać ESLint regułę blokującą `antd` poza `bridge-ui`
- [ ] Utworzyć `src/bridge-ui/antd-wrappers/`

### Faza 2: Atomy

- [ ] Button, Input, Label, Badge, Icon, Spinner
- [ ] Testy RTL + a11y
- [ ] Storybook stories
- [ ] Design tokens integration

### Faza 3: Molekuły

- [ ] FormField, SearchBox, Pagination, Tooltip
- [ ] Toast system (sonner)
- [ ] DropdownMenu, Select, DatePicker
- [ ] Testy interakcyjne

### Faza 4: Organizmy

- [ ] Sheet (prawy Drawer) - **PRIORYTET**
- [ ] DataTable z @tanstack/react-table
- [ ] KanbanBoard dla kafelków
- [ ] AppShell (Sidebar + Header)

### Faza 5: Templates

- [ ] AppShell template
- [ ] MaterialsPage v2 (`/materials/v2`)
- [ ] TilesPage v2 (`/kafelki/v2`)
- [ ] Feature flag rollout

### Faza 6: Cleanup

- [ ] Usunąć legacy komponenty
- [ ] Usunąć `bridge-ui` po 100% migracji
- [ ] Optymalizacja bundle
- [ ] Dokumentacja

---

## NASTĘPNE KROKI

1. **Zainicjować tokens i Tailwind** - ekstrakt z Figma
2. **Zaimplementować Sheet** jako pierwszy organizm
3. **Stworzyć trasę demo** `/materials/v2`
4. **Porównać metryki** TTI i bundle z legacy
5. **Rollout kontrolowany** z feature flagami

Ta struktura zapewnia:

- **Izolację** nowego UI od legacy
- **Skalowalność** przez Atomic Design
- **Bezpieczeństwo** przez Strangler Fig
- **Wydajność** przez optymalizację bundle
- **Spójność** przez design tokens z Figma
