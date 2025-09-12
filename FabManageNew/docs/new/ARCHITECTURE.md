## Architektura — FabManageNew

### Warstwy i odpowiedzialności
- Prezentacja (React): komponenty w `src/components/` + widoki w `src/pages/`
- Moduły biznesowe: `src/modules/*` — kompozycje UI + logika domeny
- Stan aplikacji: `src/stores/*` (Zustand + persist)
- Transport danych: `src/api/*` (fetch, typy payloadów)
- Narzędzia: `src/lib/*` (DXF, kalkulatory, logger, sentry, layout helpers)
- Style i temat: `src/styles/*` + `design-tokens.json`

### Routing i nawigacja
- Router: `react-router-dom`
- Główne trasy (przykłady):
  - `/` (Dashboard)
  - `/projekty`, `/projekt/:id`
  - `/projektowanie`, `/cnc`, `/magazyn`, `/produkcja`, `/klienci`, `/demands`
- Nginx fallback dla SPA (konfiguracja w `nginx.conf`)

### Stan i persystencja (Zustand)
- Stores: `projectsStore`, `tilesStore`, `materialsStore`, `logisticsStore`, `accommodationStore`, `activityStore`, `clientsStore`
- Persystencja: localStorage (middleware persist)
- Wzorce: 
  - wyliczenia i selektory w store (np. `getByProject`, `getStats`, itp.)
  - rozdzielenie struktur domenowych (projekty, kafelki, materiały, logistyka)

### Przepływy danych (przykłady)
- Projekty → widoki projektu (`src/pages/Projekt.tsx`) renderują dynamiczne zakładki na podstawie `project.modules`
- Kafelki (Tiles) → Kanban (`src/components/Kanban/*`) + statusy produkcyjne
- Magazyn → dane z `materialsStore` + integracja z backendem (sync, demands)
- Koncepcja → pliki i Miro (store `conceptStore`, API `src/api/concept.ts`)

### Warstwa API
- `src/api/client.ts` — `apiFetch<T>(path, opts)` z obsługą JSON
- `VITE_API_BASE_URL` — baza adresowa dla backendu (compose przekazuje)
- Klienci domenowi:
  - `materials.ts` — `reloadMaterials`, `fetchBackendFlatMaterials`
  - `estimate.ts` — `fetchMaterials`, `postEstimate`
  - `concept.ts` — `createMiroBoard`
  - `demands.ts` — `createTileDemand`

### DXF i CNC
- Podgląd: `DxfPreview.tsx`, `DxfFullscreenModal.tsx` (warstwy, włącz/wyłącz, fit to extents)
- Kalkulacje: `lib/ProductionTimeCalculator.ts` + konfiguracja warstw/operacji `lib/dxfConfig.ts`

### Tematy i dostępność
- Przełączanie `data-theme` i `data-skin` (`components/ThemeToggle.tsx`)
- Style nowoczesne: `styles/modern-theme.css`, siatki szerokich ekranów: `styles/wide-screen.css`/`responsive.css`

### Budowa i wdrożenie
- Vite build + TypeScript `tsc -b`
- Profile Docker Compose: `dev` (hot reload, port 3002) i `prod` (statyczny serwis + Nginx)

### Diagram wysokiego poziomu
- UI (React) ↔ Store (Zustand) ↔ API (fetch) ↔ Backend (Node/Express) ↔ Pliki (rhino.txt/stocks.json)


