## Rhino ↔ Warehouse materials mapping and sync (v1)

### Goals
- Single source of truth: Rhino layer hierarchy reflects actual materials taxonomy and stock groups.
- App warehouse state mirrors Rhino layers; project element consumption triggers “demands” when below minimums.
- Simple, robust transport between Rhino plugin and app (text file + HTTP JSON, future WebSocket).

### Canonical naming convention (layers in Rhino)
- Root group: `_MATERIAL` (exact)
- Path segments separated by `::` in exported names (plugin should export full path). Rhino layer tree should visually mirror the same hierarchy.
- Recommended depth:
  - Level 1: Material family (e.g., `MDF`, `SKLEJKA`, `WIOROWA`, `PLEXI`, `ALUMINIUM`, `HDF`, `GK`, `DILITE`, `POZOSTALE`)
  - Level 2: Thickness or subfamily (e.g., `18mm`, `3mm`, `opal`)
  - Level 3+: Variant/finish (e.g., `sati`, `do_giecia`, `profil`, `reflex`)

Examples:
```
_MATERIAL::MDF::18mm
_MATERIAL::MDF::18mm::do_giecia
_MATERIAL::PLEXI::4mm::opal
_MATERIAL::DILITE::bialy
```

Rules:
- Use lowercase for variants; families and thickness may be uppercase + `mm` (as in Rhino screenshot). No spaces; use `_` as separator.
- One material equals one terminal path (leaf). Families and intermediate nodes are categories only.

### Canonical material ID
- Deterministic slug of `fullPath` lowercased with non-alphanumerics replaced by `-`.
- Example: `_MATERIAL::MDF::18mm` → `-material--mdf--18mm`
- This ID is used by both backend and frontend as key.

### Data exchange
1) Rhino → backend snapshot file
- Path: `fabManage/backend/rhino.txt` (current dev); production can move to HTTP POST.
- Format: one line per material reference used in model:
  - `_MATERIAL::MDF::18mm`
  - `_MATERIAL::PLEXI::4mm::opal`

Plugin should export unique list of all layers present under `_MATERIAL` plus, for project consumption, a CSV with per-element estimated usage (optional v2).

2) Backend responsibilities
- Parse `rhino.txt` into `materialsFlat` with fields: `id`, `fullPath`, `materialType (material|thickness|variant)`, `category`.
- Ensure `stocks.json` contains entries for each material ID; initialize missing with `{ stock: 0, minStock: 0 }`.
- Expose endpoints:
  - `GET /api/materials` → hierarchical structure with roll-up stock/minStock.
  - `GET /api/materials/flat` → flat list `{ id, name: fullPath, stock, minStock }`.
  - `POST /api/materials/:id/stock` → set `stock` and/or `minStock`.
  - `GET /api/demands` / `POST /api/demands` → create demand `{ materialId, requiredQty }`.

3) Project consumption (from Rhino plugin)
- For each project tile/element, plugin computes estimated sheets consumed per material. Send HTTP JSON:
```
POST /api/demands
{
  "materialId": "-material--mdf--18mm",
  "name": "_MATERIAL::MDF::18mm",
  "requiredQty": 6.5
}
```
- Backend records demand; UI lists demands for warehouse to order.

### Thickness & unit conventions
- Plate-based materials use unit `arkusz` with stock representing sheets.
- Non-plate materials (e.g., aluminum profiles) may use `mb` or `sztuka`; the terminal layer decides the default unit in `stocks.json`.

### Validation
- Rhino plugin validator checks each used layer path starts with `_MATERIAL::` and matches allowed families.
- Frontend displays unknown materials as “Unmapped” with a mapping helper.

### Future (v2)
- Replace file transport with HTTP `POST /api/rhino/snapshot` (JSON of used layers).
- WebSocket push for live stock updates.
- Automatic deduction of stocks on job completion.

---

This spec is minimal, enforces a single canonical path `_MATERIAL::…`, and matches existing backend scaffolding (`server.js`).


