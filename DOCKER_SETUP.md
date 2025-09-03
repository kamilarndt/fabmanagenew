# 🐳 FabManage Docker Setup

## 📋 Wymagania

- Docker Desktop (Windows/Mac) lub Docker Engine (Linux)
- Docker Compose

## 🚀 Szybki start

### Windows (PowerShell)
```powershell
# Uruchomienie wszystkich serwisów w tle
.\docker-manage.ps1 start

# Sprawdzenie statusu
.\docker-manage.ps1 status

# Zatrzymanie serwisów
.\docker-manage.ps1 stop
```

### Linux/Mac (Bash)
```bash
# Uruchomienie wszystkich serwisów w tle
./docker-manage.sh start

# Sprawdzenie statusu
./docker-manage.sh status

# Zatrzymanie serwisów
./docker-manage.sh stop
```

### Ręczne zarządzanie
```bash
# Uruchomienie w tle
docker-compose up -d

# Sprawdzenie statusu
docker-compose ps

# Logi
docker-compose logs -f

# Zatrzymanie
docker-compose down
```

## 🌐 Dostępne serwisy

| Serwis       | Port | URL                                 | Opis                    |
| ------------ | ---- | ----------------------------------- | ----------------------- |
| **Frontend** | 3000 | http://localhost:3000               | React + Vite dev server |
| **Backend**  | 3001 | http://localhost:3001/api/materials | Node.js API server      |

## 📁 Struktura Docker

```
docker-compose.yml          # Główna konfiguracja
├── services/
│   ├── backend/           # API server (port 3001)
│   └── frontend/          # React dev server (port 3000)
├── volumes/               # Mapowanie plików
│   ├── rhino.txt         # Baza materiałów
│   ├── stocks.json       # Stany magazynowe
│   └── demands.json      # Zapotrzebowania
└── networks/              # Sieć Docker
```

## 🔧 Konfiguracja

### Backend (Node.js)
- **Port**: 3001
- **Environment**: NODE_ENV=development
- **Volumes**: 
  - `rhino.txt` (read-only)
  - `stocks.json` (read-write)
  - `demands.json` (read-write)
- **Healthcheck**: `/health` endpoint

### Frontend (React + Vite)
- **Port**: 3000
- **Hot Reload**: ✅ Enabled
- **Volumes**: 
  - `src/` (live reload)
  - `public/` (live reload)
- **Dependencies**: Backend health check

## 📊 Zarządzanie

### Dostępne komendy
- `start` - Uruchomienie serwisów
- `stop` - Zatrzymanie serwisów  
- `restart` - Restart serwisów
- `status` - Status serwisów
- `logs` - Wyświetlenie logów
- `build` - Rebuild obrazów
- `clean` - Czyszczenie zasobów

### Monitorowanie
```bash
# Logi wszystkich serwisów
docker-compose logs -f

# Logi konkretnego serwisu
docker-compose logs -f backend
docker-compose logs -f frontend

# Status serwisów
docker-compose ps
```

## 🚨 Rozwiązywanie problemów

### Port już zajęty
```bash
# Sprawdź co używa portu
netstat -ano | findstr :3001  # Windows
lsof -i :3001                 # Linux/Mac

# Zatrzymaj proces lub zmień port w docker-compose.yml
```

### Błędy build
```bash
# Rebuild bez cache
docker-compose build --no-cache

# Usuń obrazy i rebuild
docker-compose down --rmi all
docker-compose build
```

### Problemy z volumes
```bash
# Sprawdź mapowanie plików
docker-compose exec backend ls -la /srv/app/

# Restart z czystymi volumes
docker-compose down -v
docker-compose up -d
```

## 🔄 Automatyczne restarty

- **Backend**: `restart: unless-stopped`
- **Frontend**: `restart: unless-stopped`
- **Healthcheck**: Backend sprawdza `/health` co 30s

## 💡 Wskazówki

1. **Pierwsze uruchomienie**: Użyj `build` przed `start`
2. **Development**: Frontend ma hot reload - zmiany w kodzie automatycznie odświeżają stronę
3. **API**: Backend automatycznie ładuje `rhino.txt` i watchuje zmiany
4. **Logs**: Użyj `logs -f` do monitorowania w czasie rzeczywistym
5. **Cleanup**: Użyj `clean` co jakiś czas do czyszczenia nieużywanych zasobów

## 🎯 Korzyści Docker

✅ **Automatyczne uruchamianie** - serwisy startują z systemem  
✅ **Izolacja** - każdy serwis w osobnym kontenerze  
✅ **Portability** - działa identycznie na każdym systemie  
✅ **Versioning** - kontrolowane wersje zależności  
✅ **Scaling** - łatwe skalowanie i load balancing  
✅ **Monitoring** - wbudowane health checks i logi
