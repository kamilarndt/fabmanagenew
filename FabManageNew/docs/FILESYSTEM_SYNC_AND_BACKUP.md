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
    - FABMANAGE_AUTO_BACKUP=true
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

## Database Storage
- **Primary DB**: `<projects_root>/.fabmanage/fabmanage.db`
- **Backups**: `<projects_root>/.fabmanage/backups/`
  - `daily/` - Daily backups (kept for 30 days)
  - `weekly/` - Weekly backups (kept for 12 weeks)
  - `manual/` - Manual backups (kept for 10 backups)

### Automatic Backups
- **Daily**: Every day at 2:00 AM
- **Weekly**: Every Sunday at 3:00 AM
- **On shutdown**: Before application restart
- **Manual**: Via API or settings page

### Database Management API
- **Status**: `GET /api/database/status` → `{ connected, path, size, projectsRoot, databaseDir, backupDir }`
- **Create backup**: `POST /api/database/backup` `{ "type": "manual|daily|weekly" }`
- **Restore**: `POST /api/database/restore` `{ "backupPath": "/path/to/backup.db" }`
- **List backups**: `GET /api/database/backups` → `{ daily: [], weekly: [], manual: [] }`

## Settings Page
- Route: `/settings`
- Functions:
  - View/set Projects Root
  - Show DB path and projects root
  - Trigger manual DB backup
  - View backup history
  - Restore from backup

## Permissions & Notes
- The application verifies write access to the chosen folder.
- On Windows, use escaped backslashes in API calls: `Z\\_NoweRozdanie`.
- For Docker, map host path to a Linux path inside the container and set `PROJECTS_ROOT_DIR` accordingly.
- Database is automatically created in the projects root directory.
- Backups are automatically cleaned up based on retention policy.

## Change Log
- 2025-01-11: Updated database storage to use projects root directory from settings, added automatic backup system with retention policy, added database management API endpoints.
- 2025-09-09: Introduced global projects root, auto folder structure, settings endpoints/UI, DB offline fallback, scheduled backups.

