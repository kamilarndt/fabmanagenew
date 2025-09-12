## API Reference (Frontend ↔ Backend)

Baza URL: `VITE_API_BASE_URL` (np. `http://fabmanage:3001` w Docker Compose)

### Klient bazowy
- `src/api/client.ts` — `apiFetch<T>(path: string, opts?: RequestInit & { json?: unknown })`
  - Automatyczna serializacja `opts.json` do body + nagłówki JSON

### Materials API (`src/api/materials.ts`)
- Typ: `BackendFlatMaterial { id, name, stock, minStock, price?, supplier?, location?, unit?, materialType?, category? }`
- `reloadMaterials(baseUrl?) => Promise<boolean>`
  - Wywołuje backend do ponownego wczytania/synchronizacji materiałów (np. z `rhino.txt`)
- `fetchBackendFlatMaterials(baseUrl?) => Promise<BackendFlatMaterial[]>`

Oczekiwane endpointy backendu (spec):
- `GET /api/materials` → struktura hierarchiczna materiałów (sumy stock/min)
- `GET /api/materials/flat` → lista płaska `BackendFlatMaterial[]`
- `POST /api/materials/:id/stock` → ustawienie `stock`/`minStock`

### Demands API (`src/api/demands.ts`)
- `createTileDemand(tileId: string, payload: { materialId: string; requiredQty: number; projectId?; name? })`
- Backend (spec):
  - `GET /api/demands`
  - `POST /api/demands` body: `{ materialId, name, requiredQty, projectId? }`

### Estimate API (`src/api/estimate.ts`)
- Typ materiału wyceny: `{ id, category, name, unit, unitCost, description? }`
- `fetchMaterials() => Promise<Material[]>` — źródło do selektora materiałów
- `postEstimate({ projectId, lineItems: { materialId, quantity }[], laborRate, discountRate })`

### Concept API (`src/api/concept.ts`)
- `createMiroBoard(projectId: string) => Promise<{ id: string; url: string }>`

### Zmienne środowiskowe (Vite)
- `VITE_API_BASE_URL` — baza API (ustawiana w Docker Compose)
- `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` — opcjonalne integracje

### Przykład użycia `apiFetch`
```ts
import { apiFetch } from '@/api/client'

async function example() {
  const materials = await apiFetch('/api/materials/flat')
  return materials
}
```


