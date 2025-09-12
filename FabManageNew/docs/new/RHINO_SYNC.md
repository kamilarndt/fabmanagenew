## Rhino ↔ Magazyn — Synchronizacja materiałów

### Cel
Ujednolicone źródło prawdy: struktura warstw w Rhino odzwierciedla taksonomię materiałów oraz grupy stanów w aplikacji.

### Konwencja nazw (warstwy Rhino)
- Root: `_MATERIAL` (dokładnie)
- Separator ścieżki: `::`
- Zalecana głębokość:
  - 1: rodzina (np. `MDF`, `SKLEJKA`, `PLEXI`, `DILITE`)
  - 2: grubość lub podrodzina (np. `18mm`, `3mm`)
  - 3+: wariant/wykończenie (np. `do_giecia`, `opal`)

Przykłady:
```
_MATERIAL::MDF::18mm
_MATERIAL::MDF::18mm::do_giecia
_MATERIAL::PLEXI::4mm::opal
_MATERIAL::DILITE::bialy
```

Reguły:
- Warianty: lowercase, rodziny i grubości: uppercase + `mm` (jeśli dotyczy)
- Brak spacji; separator `_` w nazwach
- Terminalny węzeł = konkretny materiał (liść)

### Canonical material ID
- Deterministyczny slug z `fullPath.toLowerCase()` i zamianą znaków nie‑alfanumerycznych na `-`
- Przykład: `_MATERIAL::MDF::18mm` → `-material--mdf--18mm`
- ID używane w backendzie i froncie (klucz materiału)

### Wymiana danych
1) Rhino → backend snapshot (dev)
- Plik: `backend/rhino.txt` — jedna linia na referencję warstwy użytej w modelu
- Backend parsuje do `materialsFlat`, uzupełnia `stocks.json`, wystawia API

2) Endpointy backendu (v1)
- `GET /api/materials` — hierarchia + agregaty stanów
- `GET /api/materials/flat` — płaska lista `{ id, name, stock, minStock, ... }`
- `POST /api/materials/:id/stock` — aktualizacja stock/minStock
- `GET/POST /api/demands` — rejestracja zapotrzebowań z projektów

3) Zużycie projektowe (z Rhino plugin)
- JSON POST:
```json
{ "materialId": "-material--mdf--18mm", "name": "_MATERIAL::MDF::18mm", "requiredQty": 6.5, "projectId": "..." }
```
- Backend zapisuje demand; UI pokazuje listę do zamówienia

### Jednostki i grubości
- Płyty: jednostka `arkusz`
- Profile/druty: `mb` / `sztuka` — określa liść ścieżki

### Walidacja
- Wtyczka Rhino powinna weryfikować prefiks `_MATERIAL::` i dozwolone rodziny
- Front: nieznane materiały oznaczone jako „Unmapped” z kreatorem mapowania

### Kierunki rozwoju
- HTTP `POST /api/rhino/snapshot` zamiast pliku
- WebSocket dla aktualizacji live
- Automatyczne odpisy stanów przy zakończeniu zleceń


