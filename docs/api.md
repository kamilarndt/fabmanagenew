## API Reference

This document summarizes available endpoints and integration points used by the frontend. In production, Supabase is the primary API; the local Node API is provided for development/demo.

### Conventions
- JSON request/response
- ISO 8601 for dates/timestamps
- Errors: `{ error: string }` with HTTP status code

### Health
- GET `/api/health` → `{ ok: boolean, db?: boolean }`

### Clients
- GET `/api/clients` → `Client[]`
- POST `/api/clients` body `{ id, name, email?, phone? }` → created client

### Projects
- GET `/api/projects` → `Project[]`

### Tiles
- GET `/api/tiles` → `Tile[]`

### Materials / BOM
- GET `/api/materials/bom?projectId=UUID` → rows `{ tile_id, material_id, code, name, quantity, unit }[]`

### Supabase integration
- Table access and RLS policies documented in Supabase project
- Realtime channels for domain tables (tiles, materials, logistics)

### Error handling
- Use `ApiError` in `httpClient` to map HTTP errors into typed exceptions
- Show user notifications via Ant Design `message`/`notification`

### SDK/service layer
- `src/services/*` expose typed functions per domain (`projects`, `tiles`, `materials`, `speckle`)
- All services return typed data and throw errors on failure


