# FabManage - Mapowanie Komponentów Legacy → New UI

## Przegląd Mapowania

Ten dokument mapuje obecne komponenty Ant Design na nową strukturę shadcn/ui + Tailwind, pokazując jak każdy komponent będzie migrowany w strategii Strangler Fig.

---

## MAPOWANIE ATOMÓW

### Button

```typescript
// LEGACY (Ant Design)
import { Button } from "antd";
<Button type="primary" size="large">
  Click me
</Button>;

// NEW UI (shadcn/ui)
import { Button } from "@/new-ui/atoms/Button";
<Button variant="default" size="lg">
  Click me
</Button>;

// BRIDGE (tymczasowy adapter)
import { LegacyButton } from "@/bridge-ui/antd-wrappers/LegacyButton";
<LegacyButton type="primary" size="large">
  Click me
</LegacyButton>;
```

### Input

```typescript
// LEGACY
import { Input } from "antd";
<Input placeholder="Enter text" />;

// NEW UI
import { Input } from "@/new-ui/atoms/Input";
<Input placeholder="Enter text" />;

// BRIDGE
import { LegacyInput } from "@/bridge-ui/antd-wrappers/LegacyInput";
<LegacyInput placeholder="Enter text" />;
```

### Badge

```typescript
// LEGACY
import { Badge } from "antd";
<Badge count={5}>
  <Button>Notifications</Button>
</Badge>;

// NEW UI
import { Badge } from "@/new-ui/atoms/Badge";
<Badge variant="destructive">5</Badge>;

// BRIDGE
import { LegacyBadge } from "@/bridge-ui/antd-wrappers/LegacyBadge";
<LegacyBadge count={5}>
  <Button>Notifications</Button>
</LegacyBadge>;
```

---

## MAPOWANIE MOLECULES

### FormField (Form.Item)

```typescript
// LEGACY
import { Form, Input } from "antd";
<Form.Item label="Name" required>
  <Input />
</Form.Item>;

// NEW UI
import { FormField, Input } from "@/new-ui/molecules/FormField";
<FormField label="Name" required>
  <Input />
</FormField>;

// BRIDGE
import { LegacyFormField } from "@/bridge-ui/antd-wrappers/LegacyFormField";
<LegacyFormField label="Name" required>
  <Input />
</LegacyFormField>;
```

### SearchBox (Input.Search)

```typescript
// LEGACY
import { Input } from "antd";
<Input.Search placeholder="Search..." onSearch={handleSearch} />;

// NEW UI
import { SearchBox } from "@/new-ui/molecules/SearchBox";
<SearchBox placeholder="Search..." onSearch={handleSearch} />;

// BRIDGE
import { LegacySearchBox } from "@/bridge-ui/antd-wrappers/LegacySearchBox";
<LegacySearchBox placeholder="Search..." onSearch={handleSearch} />;
```

### Toast (message/notification)

```typescript
// LEGACY
import { message } from "antd";
message.success("Success!");

// NEW UI
import { toast } from "sonner";
toast.success("Success!");

// BRIDGE
import { legacyToast } from "@/bridge-ui/antd-wrappers/LegacyToast";
legacyToast.success("Success!");
```

---

## MAPOWANIE ORGANISMS

### DataTable (Table)

```typescript
// LEGACY
import { Table } from "antd";
<Table
  dataSource={data}
  columns={columns}
  pagination={{ pageSize: 10 }}
  rowKey="id"
/>;

// NEW UI
import { DataTable } from "@/new-ui/organisms/DataTable";
<DataTable
  data={data}
  columns={columns}
  pagination={{ pageSize: 10 }}
  rowKey="id"
/>;

// BRIDGE
import { LegacyTable } from "@/bridge-ui/antd-wrappers/LegacyTable";
<LegacyTable
  dataSource={data}
  columns={columns}
  pagination={{ pageSize: 10 }}
  rowKey="id"
/>;
```

### Sheet (Drawer)

```typescript
// LEGACY
import { Drawer } from "antd";
<Drawer
  title="Edit Tile"
  placement="right"
  open={open}
  onClose={onClose}
  maskClosable={false}
>
  <TileEditForm />
</Drawer>;

// NEW UI
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/new-ui/organisms/Sheet";
<Sheet open={open} onOpenChange={setOpen}>
  <SheetContent side="right" className="w-96">
    <SheetHeader>
      <SheetTitle>Edit Tile</SheetTitle>
    </SheetHeader>
    <TileEditForm />
  </SheetContent>
</Sheet>;

// BRIDGE
import { LegacyDrawer } from "@/bridge-ui/antd-wrappers/LegacyDrawer";
<LegacyDrawer
  title="Edit Tile"
  placement="right"
  open={open}
  onClose={onClose}
  maskClosable={false}
>
  <TileEditForm />
</LegacyDrawer>;
```

### KanbanBoard

```typescript
// LEGACY
import { KanbanBoard } from "@/components/Kanban/KanbanBoard";
<KanbanBoard tiles={tiles} columns={columns} onTileUpdate={handleUpdate} />;

// NEW UI
import { KanbanBoard } from "@/new-ui/organisms/KanbanBoard";
<KanbanBoard tiles={tiles} columns={columns} onTileUpdate={handleUpdate} />;

// BRIDGE (bezpośrednie mapowanie)
import { KanbanBoard } from "@/components/Kanban/KanbanBoard";
// Używa nowych komponentów wewnętrznie
```

---

## MAPOWANIE TEMPLATES

### AppShell (BrandedLayout)

```typescript
// LEGACY
import BrandedLayout from "@/layouts/BrandedLayout";
<BrandedLayout>
  <Routes>
    <Route path="/" element={<Dashboard />} />
  </Routes>
</BrandedLayout>;

// NEW UI
import { AppShell } from "@/new-ui/templates/AppShell";
<AppShell>
  <Routes>
    <Route path="/" element={<Dashboard />} />
  </Routes>
</AppShell>;

// BRIDGE
import { LegacyAppShell } from "@/bridge-ui/antd-wrappers/LegacyAppShell";
<LegacyAppShell>
  <Routes>
    <Route path="/" element={<Dashboard />} />
  </Routes>
</LegacyAppShell>;
```

---

## MAPOWANIE STRON

### Dashboard

```typescript
// LEGACY
// src/pages/Dashboard.tsx
import { Card, Row, Col, Statistic } from "antd";

// NEW UI
// src/new-ui/templates/DashboardPage/DashboardPage.tsx
import { StatCard, QuickActions } from "@/new-ui/organisms/Dashboard";

// BRIDGE
// src/bridge-ui/antd-wrappers/LegacyDashboard.tsx
// Tymczasowy wrapper używający nowych komponentów
```

### Materials Page

```typescript
// LEGACY
// src/pages/MagazynDashboard.tsx
import { Table, Card, Button, Input } from "antd";

// NEW UI
// src/new-ui/templates/MaterialsPage/MaterialsPage.tsx
import { DataTable, MaterialCard, MaterialFilters } from "@/new-ui/organisms";

// BRIDGE
// src/bridge-ui/antd-wrappers/LegacyMaterialsPage.tsx
// Adapter używający nowych komponentów z legacy API
```

---

## STRATEGIA MIGRACJI

### Faza 1: Bridge Layer

1. **Utworzyć adaptery** w `src/bridge-ui/antd-wrappers/`
2. **Mapować API** legacy na nowe komponenty
3. **Zachować kompatybilność** z istniejącym kodem
4. **Testować** że wszystko działa bez zmian

### Faza 2: Stopniowa Migracja

1. **Route po route** migracja do nowych komponentów
2. **Feature flags** do kontrolowanego rollout
3. **A/B testing** metryk wydajności
4. **Rollback** w przypadku problemów

### Faza 3: Cleanup

1. **Usunąć bridge layer** po 100% migracji
2. **Usunąć legacy komponenty** Ant Design
3. **Optymalizować bundle** size
4. **Aktualizować dokumentację**

---

## PRZYKŁAD MIGRACJI STRONY

### Przed migracją (Legacy)

```typescript
// src/pages/MaterialsPage.tsx
import { Table, Card, Button, Input, Drawer } from "antd";

export function MaterialsPage() {
  return (
    <div>
      <Card title="Materials">
        <Input.Search placeholder="Search materials..." />
        <Table dataSource={materials} columns={columns} />
        <Button type="primary">Add Material</Button>
      </Card>

      <Drawer
        title="Edit Material"
        placement="right"
        open={editOpen}
        onClose={() => setEditOpen(false)}
      >
        <MaterialEditForm />
      </Drawer>
    </div>
  );
}
```

### Po migracji (New UI)

```typescript
// src/new-ui/templates/MaterialsPage/MaterialsPage.tsx
import { DataTable } from "@/new-ui/organisms/DataTable";
import { Sheet } from "@/new-ui/organisms/Sheet";
import { SearchBox } from "@/new-ui/molecules/SearchBox";
import { Button } from "@/new-ui/atoms/Button";
import { Card } from "@/new-ui/atoms/Card";

export function MaterialsPage() {
  return (
    <div className="space-y-6">
      <Card>
        <div className="space-y-4">
          <SearchBox placeholder="Search materials..." />
          <DataTable data={materials} columns={columns} />
          <Button variant="default">Add Material</Button>
        </div>
      </Card>

      <Sheet open={editOpen} onOpenChange={setEditOpen}>
        <SheetContent side="right">
          <SheetHeader>
            <SheetTitle>Edit Material</SheetTitle>
          </SheetHeader>
          <MaterialEditForm />
        </SheetContent>
      </Sheet>
    </div>
  );
}
```

### Bridge (tymczasowy)

```typescript
// src/bridge-ui/antd-wrappers/LegacyMaterialsPage.tsx
import { MaterialsPage } from "@/new-ui/templates/MaterialsPage/MaterialsPage";

export function LegacyMaterialsPage() {
  // Mapowanie legacy props na nowe
  return <MaterialsPage />;
}
```

---

## CHECKLIST MIGRACJI KOMPONENTU

### 1. Analiza

- [ ] Zidentyfikować wszystkie użycia komponentu
- [ ] Sprawdzić API i props
- [ ] Zidentyfikować zależności
- [ ] Zaplanować testy

### 2. Implementacja

- [ ] Stworzyć nowy komponent w `src/new-ui/`
- [ ] Zaimplementować wszystkie warianty
- [ ] Dodać testy RTL + a11y
- [ ] Stworzyć Storybook stories

### 3. Bridge

- [ ] Stworzyć adapter w `src/bridge-ui/`
- [ ] Mapować legacy API na nowe
- [ ] Testować kompatybilność
- [ ] Dokumentować zmiany

### 4. Migracja

- [ ] Zastąpić użycia legacy → bridge
- [ ] Testować funkcjonalność
- [ ] Sprawdzić wydajność
- [ ] Zbierać feedback

### 5. Cleanup

- [ ] Zastąpić bridge → nowy komponent
- [ ] Usunąć adapter
- [ ] Usunąć legacy komponent
- [ ] Aktualizować dokumentację

---

## METRYKI SUKCESU

### Wydajność

- **Bundle size**: -60% per route
- **TTI**: -40% improvement
- **Runtime performance**: -30% memory usage

### Jakość

- **A11y score**: 100% WCAG AA
- **Test coverage**: >90%
- **Type safety**: 0 `any` types

### Developer Experience

- **Build time**: -50% faster
- **Hot reload**: <1s
- **Component creation**: -40% time

### User Experience

- **Load time**: <2s
- **Interaction response**: <100ms
- **Mobile performance**: 90+ Lighthouse score

Ta mapa zapewnia płynną migrację bez breaking changes, zachowując funkcjonalność podczas przejścia na nową architekturę UI.
