# FabManage New UI – Struktura

## Cel dokumentu
- Opisuje zasady i strukturę nowego UI opartego o shadcn/ui, Tailwind CSS i Radix.
- Definiuje reguły współistnienia z legacy Ant Design przez warstwę bridge-ui.

## Kontekst i zakres
- Migracja prowadzona strategią Strangler Fig.
- Zachowujemy stores (Zustand), TanStack Query i Supabase; wymieniamy tylko warstwę UI.
- Spójny prawy Drawer (Sheet) do edycji kafli we wszystkich miejscach.

## Struktura katalogów
src/
  new-ui/
    tokens/
    atoms/
    molecules/
    organisms/
    templates/
    utils/
  bridge-ui/
    antd-wrappers/
    migration-helpers/

## Zasady ogólne
- Nowe komponenty wyłącznie w src/new-ui; brak bezpośrednich importów antd.
- Ant Design używamy tylko w adapterach src/bridge-ui/antd-wrappers.
- Functional components, named exports, interfejsy props, RORO.
- TypeScript strict; brak any/unknown; brak asercji; Zod do walidacji.
- Loading/empty states dla wszystkich operacji async.
- Virtualizacja dla długich list; lazy load ciężkich widoków (CAD/Speckle/DXF).
- PWA i code-splitting per route; budżety bundle per route.

## Tokens i Tailwind
- Design tokens synchronizowane z Figma do src/new-ui/tokens (kolory, typografia, spacing, radii, shadows).
- Tailwind z prefixem tw- i/lub scope pod klasą .fm, aby uniknąć konfliktów z AntD.
- Mapowanie tokens -> CSS variables -> Tailwind theme (primary, foreground, muted, itp.).

## Atomic Design i konwencje
- atoms: AppButton, AppInput, Label, Badge, Icon, Spinner, Switch, Checkbox, RadioGroup, Progress.
- molecules: FormField, SearchBox, Pagination, Breadcrumb, Tooltip, Toast, DropdownMenu, Select, DatePicker.
- organisms: DataTable, Sheet (prawy Drawer), Sidebar, Header, Dashboard, KanbanBoard, GanttChart, Calendar, FileUpload.
- templates: AppShell, ProjectPage, MaterialsPage, TilesPage, DashboardPage, SettingsPage.
- Każdy komponent w osobnym folderze, z plikami: komponent, index.ts, testy, stories.

## UX i dostępność
- Sheet/Drawer z prawej strony, maskClosable=false dla krytycznych edycji.
- Kontrolowane formularze: React Hook Form + Zod; spójne komunikaty błędów.
- Focus management, klawiszologia i role ARIA zgodne z WCAG AA; Axe checks w CI.

## Bridge UI
- Adaptery: LegacyButton, LegacyTable, LegacyDrawer, LegacyForm, LegacyModal.
- API adapterów kompatybilne z nowym UI, aby ułatwić stopniową podmianę.

## Routing v2
- Nowe ekrany w trasach v2 (np. /materials/v2) z feature flagami.
- Porównujemy metryki TTI i bundle z legacy przed przełączeniem domyślnym.

## Testy i CI
- RTL + Vitest dla atomów i molekuł; Playwright smoke dla tras v2.
- Lint, type-check, build i smoke w pipeline; a11y checks dla Drawer/Modal/Dropdown.

## Checklist dodania komponentu
- Utwórz folder w atoms/molecules/organisms/templates.
- Dodaj plik komponentu, interfejs props, test i story.
- Użyj tokens i wariantów z class-variance-authority; unikaj styli inline.
- Eksportuj nazwany i (jeśli dotyczy) zarejestruj w index.ts.

## Następne kroki
- Zainicjować tokens i Tailwind; dodać regułę ESLint zakazującą importu antd poza bridge-ui.
- Zaimplementować Sheet jako pierwszy organizm i trasę demo /materials/v2.
- Patrz docs/implementation-plan.md po szczegóły harmonogramu.
