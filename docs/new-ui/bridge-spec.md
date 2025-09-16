# Strangler Bridge Specification

## Cel
Warstwa **bridge-ui** umożliwia stopniową migrację (Strangler Fig Pattern) z Ant Design do Shadcn/UI, bez łamania istniejących funkcjonalności.

## Struktura katalogu
```
src/bridge-ui/
├── antd-wrappers/
│   ├── LegacyButton.tsx
│   ├── LegacyTable.tsx
│   ├── LegacyDrawer.tsx
│   ├── LegacyForm.tsx
│   └── LegacyModal.tsx
└── migration-helpers/
    ├── ComponentBridge.tsx
    ├── ThemeBridge.tsx
    └── StyleBridge.tsx
```

## Adaptery Ant Design (`antd-wrappers`)
- **LegacyButton.tsx**
  - Wrapuje `AntButton`; parametr `migrate` decyduje, czy renderować `NewButton` czy `AntButton`.
- **LegacyTable.tsx**
  - Adapter dla `Table`; wspiera paginację i sortowanie, deleguje do `DataTable` z TanStack.
- **LegacyDrawer.tsx**
  - Wrapuje `AntDrawer`, wspiera `Sheet` z Shadcn/UI pod flagą feature.
- **LegacyForm.tsx**
  - Zbiera walidację i kontrolki `FormField`, wspiera nowy `Molecule` form patterns.
- **LegacyModal.tsx**
  - Adapter dla `Modal`, deleguje do `Dialog` lub `Sheet`.

```tsx
// Przykład LegacyDrawer.tsx
import { Drawer as AntDrawer } from 'antd';
import { Sheet } from '@/new-ui/organisms/Sheet';

export function LegacyDrawer({ migrate = false, ...props }) {
  return migrate ? <Sheet {...props} /> : <AntDrawer {...props} />;
}
```

## Helpers migracji (`migration-helpers`)
- **ComponentBridge.tsx**: logika decydująca o użyciu legacy vs new-component.
- **ThemeBridge.tsx**: synchronizacja motywów (light/dark) między Ant Design i Tailwind.
- **StyleBridge.tsx**: mapowanie zmiennych CSS-in-JS do CSS variables i Tailwind classes.

## Polityka importów
1. **Nowe komponenty**: tylko z `src/new-ui/` lub `@/new-ui/*`
2. **Adaptery**: komponenty legacy importują `antd` bezpośrednio, reszta kodu w `new-ui/` nie wolno importować `antd`.
3. **ESLint rule**: zabronione `import .* from 'antd'` poza `bridge-ui/antd-wrappers`.

## Przepływ migracji
1. **Feature flag**: zmienna `MIGRATE_UI=true` decyduje o przejściu do nowych komponentów.
2. **Route mapping**: dla każdej migracji definiujemy nową ścieżkę (np. `/materials/v2`).
3. **Cut-over**: przełączenie ruchu na nową trasę i monitorowanie metryk.
4. **Cleanup**: po 100% adoptowanej migracji usuwać wrappery i `antd`.

---
*Dokument przygotowany przez zespół migracyjny UI*
