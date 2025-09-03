# FabManage Docker Setup

## Quick Start

### Backend Only (for Rhino Plugin)
```powershell
# Windows PowerShell
cd D:\Cursor_Workspaces\fabManage
.\docker\start-backend-only.ps1
```

```bash
# Linux/Mac
cd /path/to/fabManage
./docker/start-backend-only.sh
```

### Full Development Environment
```powershell
# Windows PowerShell
cd D:\Cursor_Workspaces\fabManage
.\docker\start-dev.ps1
```

## Manual Commands

### Start Backend Only
```bash
docker compose -f docker/docker-compose.dev.yml up -d --build backend
```

### Start Full Development
```bash
docker compose -f docker/docker-compose.dev.yml up -d --build
```

### View Logs
```bash
# Backend logs
docker compose -f docker/docker-compose.dev.yml logs -f backend

# All logs
docker compose -f docker/docker-compose.dev.yml logs -f
```

### Stop Services
```bash
# Stop all
docker compose -f docker/docker-compose.dev.yml down

# Stop backend only
docker compose -f docker/docker-compose.dev.yml stop backend
```

## URLs
- Backend: http://localhost:3001
- Frontend: http://localhost:5173 (if running full dev)

## For Rhino Plugin
1. Start backend: `.\docker\start-backend-only.ps1`
2. Set API URL in plugin to: `http://localhost:3001`
3. Test connection and use Materials tab

## Troubleshooting
- If port 3001 is busy: `netstat -ano | findstr :3001` then kill process
- Rebuild containers: add `--build` flag to docker compose commands
- View container status: `docker ps`

