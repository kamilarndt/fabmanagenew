# Filesystem Sync and Database Backup

This document defines the agreed setup for storing project files on disk and managing database fallbacks/backups.

## Global Projects Root
- Default Windows path: `Z:\_NoweRozdanie` (can be changed).
- Effective root is resolved in this order:
  1) `PROJECTS_ROOT_DIR` environment variable
  2) `backend/projects-config.json` → `projectsRootDir`
  3) Fallback: `PROJECTS_FILES` directory inside the repo (for local dev)

### How to configure
- App UI: open `/settings` → set folder path → Save.
- API: `POST /api/settings/files-root` `{ "path": "Z\\_NoweRozdanie" }`
- Read current: `GET /api/settings/files-root`
- Persisted at `backend/projects-config.json`.

### Docker (recommended)
Add to `docker-compose.yml` for backend service:
```yaml
  environment:
    - PROJECTS_ROOT_DIR=/mnt/projects
  volumes:
    - Z:\\_NoweRozdanie:/mnt/projects
```
Ensure Docker Desktop file sharing for drive `Z:` is enabled.

## Per-Project Folder Structure
Projects are stored under `<root>/<ClientName>/<ProjectName>`.

Created subfolders depend on enabled modules:
- `wycena/` when Estimate module is enabled
- `koncepcja/` when Concept module is enabled
- `materialy_od_klienta/` when client materials are present
- `produkcja/elementy/{pdf,dxf,preview}` when Production module is enabled

### Automatic creation
- On project creation: backend ensures base folder structure.
- Manual sync: `POST /api/projects/:id/fs-sync`
  - Body example: `{ "modules":["koncepcja","wycena","produkcja"], "hasClientMaterials":true }`

## Database Fallback and Backups
- Primary DB file: `backend/fabmanage.db`.
- Offline fallback DB: `<root>/.fabmanage/fabmanage.db` (used automatically if primary is unavailable).
- Backups: `<root>/_db_backups/`
  - Auto-backup every 60 minutes.
  - Manual backup: `POST /admin/db-backup`
  - DB status: `GET /admin/db-status` → `{ path, exists, projectsRoot }`

## Settings Page
- Route: `/settings`
- Functions:
  - View/set Projects Root
  - Show DB path and projects root
  - Trigger manual DB backup

## Permissions & Notes
- The application verifies write access to the chosen folder.
- On Windows, use escaped backslashes in API calls: `Z\\_NoweRozdanie`.
- For Docker, map host path to a Linux path inside the container and set `PROJECTS_ROOT_DIR` accordingly.

## Change Log
- 2025-09-09: Introduced global projects root, auto folder structure, settings endpoints/UI, DB offline fallback, scheduled backups.

