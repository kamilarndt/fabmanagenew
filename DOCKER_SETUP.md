# 🐳 FabManage Docker Setup

Kompletna dokumentacja konfiguracji i uruchamiania aplikacji FabManage w kontenerach Docker.

## 📋 Wymagania

- **Docker Desktop** - [Pobierz tutaj](https://www.docker.com/products/docker-desktop/)
- **Git** - do klonowania repozytorium
- **Minimum 4GB RAM** - dla stabilnego działania kontenerów

## 🚀 Szybki Start

### Windows (PowerShell)
```powershell
# Uruchom środowisko deweloperskie
.\docker-manage.ps1 dev

# Zobacz logi
.\docker-manage.ps1 logs

# Zatrzymaj aplikację
.\docker-manage.ps1 stop
```

### Linux/macOS (Bash)
```bash
# Uruchom środowisko deweloperskie
./docker-manage.sh dev

# Zobacz logi
./docker-manage.sh logs

# Zatrzymaj aplikację
./docker-manage.sh stop
```

## 🏗️ Architektura

Aplikacja składa się z dwóch głównych serwisów:

### Frontend (React + Vite)
- **Port**: 5173
- **URL**: http://localhost:5173
- **Technologie**: React 18, TypeScript, Ant Design, Zustand
- **Hot Reload**: Automatyczne przeładowanie przy zmianach

### Backend (Node.js + Express)
- **Port**: 3001  
- **URL**: http://localhost:3001
- **Health Check**: http://localhost:3001/health
- **Baza danych**: SQLite (plik lokalny)
- **API**: REST endpoints dla zarządzania danymi

## 📁 Struktura Plików

```
fabManage/
├── FabManageNew/           # Frontend React
│   ├── src/               # Kod źródłowy
│   ├── public/            # Pliki statyczne
│   ├── docker-compose.yml # Konfiguracja kontenerów
│   └── package.json       # Zależności npm
├── backend/               # Backend Node.js
│   ├── server.js          # Główny serwer
│   ├── db.js             # Konfiguracja bazy danych
│   └── package.json       # Zależności npm
├── docker/               # Pliki Docker
│   ├── Dockerfile.backend
│   ├── Dockerfile.frontend.dev
│   └── docker-compose.yml
├── docker-manage.ps1     # Skrypt zarządzania (Windows)
└── docker-manage.sh      # Skrypt zarządzania (Linux/macOS)
```

## 🔧 Dostępne Komendy

### Podstawowe operacje

| Komenda   | Opis                             |
| --------- | -------------------------------- |
| `dev`     | Uruchom środowisko deweloperskie |
| `prod`    | Uruchom środowisko produkcyjne   |
| `stop`    | Zatrzymaj wszystkie kontenery    |
| `restart` | Restartuj kontenery              |
| `logs`    | Pokaż logi wszystkich serwisów   |
| `build`   | Przebuduj obrazy Docker          |
| `clean`   | Wyczyść kontenery i obrazy       |

### Przykłady użycia

```bash
# Przebuduj tylko frontend
./docker-manage.sh build frontend

# Zobacz logi tylko backendu
./docker-manage.sh logs backend

# Restartuj konkretny serwis
./docker-manage.sh restart frontend
```

## 🔍 Monitorowanie

### Health Checks
Backend ma zaimplementowany endpoint health check:
```bash
curl http://localhost:3001/health
```

Odpowiedź:
```json
{
  "status": "ok",
  "timestamp": "2025-01-09T10:30:00.000Z",
  "uptime": 125.5,
  "db": true
}
```

### Logi w czasie rzeczywistym
```bash
# Wszystkie serwisy
docker-compose logs -f

# Konkretny serwis
docker-compose logs -f frontend
```

## 🛠️ Rozwiązywanie Problemów

### Problem: Kontenery nie startują
```bash
# Sprawdź status Docker
docker info

# Wyczyść środowisko i spróbuj ponownie
./docker-manage.sh clean
./docker-manage.sh dev
```

### Problem: Port już zajęty
```bash
# Znajdź proces używający portu
netstat -tulpn | grep :5173
# lub na Windows
netstat -ano | findstr :5173

# Zatrzymaj konfliktowe procesy
./docker-manage.sh stop
```

### Problem: Brak dostępu do plików
```bash
# Sprawdź uprawnienia (Linux/macOS)
ls -la FabManageNew/
chmod -R 755 FabManageNew/

# Na Windows - uruchom PowerShell jako Administrator
```

### Problem: Błędy kompilacji frontend
```bash
# Przebuduj frontend z czystym cache
./docker-manage.sh build frontend

# Sprawdź logi
./docker-manage.sh logs frontend
```

## 🔒 Bezpieczeństwo

### Produkcja
- Kontenery uruchamiają się z nieprivilegowanym użytkownikiem
- Baza danych jest chroniona w wolumenie Docker
- Pliki uploads są izolowane w kontenerze

### Development
- Hot reload umożliwia szybkie iteracje
- Wolumeny zapewniają synchronizację kodu
- Debug logi są dostępne w czasie rzeczywistym

## 📊 Monitoring Zasobów

```bash
# Sprawdź użycie zasobów
docker stats

# Sprawdź rozmiar obrazów
docker images

# Sprawdź wolumeny
docker volume ls
```

## 🔄 Aktualizacje

### Aktualizacja kodu
```bash
# 1. Zatrzymaj kontenery
./docker-manage.sh stop

# 2. Zaktualizuj kod (git pull, etc.)
git pull origin main

# 3. Przebuduj obrazy
./docker-manage.sh build

# 4. Uruchom ponownie
./docker-manage.sh dev
```

### Aktualizacja zależności
```bash
# 1. Zatrzymaj kontenery
./docker-manage.sh stop

# 2. Wyczyść cache
./docker-manage.sh clean

# 3. Uruchom z przebudową
./docker-manage.sh build
./docker-manage.sh dev
```

## 📝 Zmienne Środowiskowe

### Frontend
- `VITE_API_BASE_URL` - URL do API backendu (domyślnie: http://localhost:3001)
- `VITE_USE_MOCK_DATA` - czy używać mock danych (false w Docker)
- `NODE_ENV` - środowisko (development/production)

### Backend  
- `PORT` - port serwera (domyślnie: 3001)
- `NODE_ENV` - środowisko aplikacji
- `DB_PATH` - ścieżka do bazy SQLite

## 🆘 Wsparcie

Jeśli napotkasz problemy:

1. **Sprawdź logi**: `./docker-manage.sh logs`
2. **Zrestartuj serwisy**: `./docker-manage.sh restart`
3. **Wyczyść środowisko**: `./docker-manage.sh clean && ./docker-manage.sh dev`
4. **Sprawdź dokumentację**: Ten plik zawiera rozwiązania typowych problemów

---

**Powodzenia w rozwoju! 🚀**