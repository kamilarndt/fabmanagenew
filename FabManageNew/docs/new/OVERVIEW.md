## FabManageNew — Przegląd systemu

Wersja: 1.0  
Data: 2025-01-27

### Cel aplikacji
FabManageNew to aplikacja do zarządzania projektami produkcyjnymi w Fabryce Dekoracji. Łączy obszary: planowanie projektów, projektowanie techniczne, produkcję (CNC), magazyn materiałów, logistykę oraz zakwaterowanie.

### Najważniejsze funkcje
- Projekty i moduły projektowe (dynamiczne zakładki per projekt)
- Kanban dla projektowania i produkcji (CNC)
- Integracje: Miro (koncepcje), PDF wycen
- Magazyn: przegląd, krytyczne stany, filtrowanie, szczegóły materiałów
- Logistyka: listy pakunkowe, plan tras, montaż, punch listy, potwierdzenia (sign-off)
- Zakwaterowanie: rezerwacje, koszty, statusy
- PWA + responsywny UI (w tym tryb ciemny i skiny)

### Stack technologiczny
- Frontend: React 19 + TypeScript + Vite
- UI: Materialize CSS + własne warstwy styli i design tokens
- State: Zustand (persist)
- Testy: lint (ESLint), smoke, Vitest
- Konteneryzacja: Docker + Compose (profile dev/prod)

### Struktura katalogów (skrót)
- `src/pages/` — widoki aplikacji (Dashboard, Projects, CNC, Magazyn, itp.)
- `src/modules/` — moduły per obszar (Estimate, Concept, Materials, Logistics, Accommodation)
- `src/components/` — komponenty współdzielone (Kanban, modale, magazyn)
- `src/stores/` — Zustand stores (projekty, kafelki, materiały, logistyka, itp.)
- `src/api/` — klienci HTTP i typy payloadów
- `src/lib/` — narzędzia (DXF, kalkulacje czasu, logowanie, sentry, itp.)
- `src/styles/` — style globalne i tematy
- `src/types/` — definicje typów domenowych

### Moduły biznesowe (aktywowalne per projekt)
- Wycena (Estimate): dobór materiałów, pozycje, sumowanie kosztów, PDF
- Koncepcja (Concept): pliki, tablice Miro (embed)
- Projektowanie techniczne: istniejący kanban elementów
- Produkcja (CNC): kolejka i statusy pracy
- Materiały (Materials): PR/quotes/rezerwacje/dostawy (store), widoki magazynu
- Logistyka i montaż (Logistics): listy pakunkowe, trasy, instalacje, punch listy, sign-off
- Zakwaterowanie (Accommodation): noclegi zespołów

### Integracje i synchronizacja
- `VITE_API_BASE_URL` — adres backendu
- Rhino → Magazyn: synchronizacja warstw `_MATERIAL::…` (patrz `RHINO_SYNC.md`)
- Miro: tworzenie tablic (patrz `API_REFERENCE.md` → Concept)

### Jakość i wydajność
- ESLint (konfiguracja TypeScript/React)
- Vitest (framework testowy, gotowa konfiguracja)
- Optymalizacje renderu: React.memo/useMemo, wirtualizacja (plan)
- Responsywność i ultra‑wide layout (narzędzia w `lib/` + style)

### Uruchomienie (skrót)
- Dev: `npm run dev` lub `npm run docker:dev`
- Build: `npm run build`, preview: `npm run preview`
- Prod (Docker + Nginx): `npm run docker:prod`


