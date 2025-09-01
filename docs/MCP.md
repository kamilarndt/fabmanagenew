# MCP & Debugging Runbook

## Core commands
- Frontend (Prototyp):
  - Install: `npm i --no-audit --no-fund`
  - Dev: `npm run dev`
  - Build: `npm run build` (outputs to `build/`)
- Backend (backend):
  - Install: `npm i --no-audit --no-fund`
  - Run: `node server.js` (or via Docker)

## Docker
- Build: from `docker/` → `docker compose build`
- Up: `docker compose up -d`
- Logs: `docker compose logs -f backend` / `frontend`
- Health: backend `GET http://localhost:3000/health`, frontend `http://localhost:8080`

## MCP suggestions
- Docker control: build/up/down/logs/ps (wrap standard docker compose ops)
- Web research: Brave web search + summarizer for quick tech checks
- CI checks: run ESLint/TypeScript via MCP commands when configured
- Test runner: Vitest/Jest MCP wrapper

## Status sync (important)
- Always update tile status through `updateTileStatus(tileId, status, source)`
- Project view and CNC Kanban read from the same global provider (`TileStatusProvider`)
- Status mapping between project/CNC is defined in `TileStatusSync.tsx`
