# 🚨 Quick Fix: Brak Danych w Aplikacji

## Problem
Aplikacja uruchamia się, ale nie ma żadnych projektów ani materiałów.

## Rozwiązanie

### Opcja 1: Uruchom z Docker (NAJŁATWIEJSZE)
```powershell
# 1. Zatrzymaj obecną instancję
# Naciśnij Ctrl+C w terminalu gdzie działa npm run dev

# 2. Uruchom Docker
cd FabManageNew
docker-compose up -d

# 3. Sprawdź w przeglądarce
# Frontend: http://localhost:5173
# Backend: http://localhost:3001/health
```

### Opcja 2: Popraw zmienne środowiskowe lokalnie
```powershell
# 1. Zatrzymaj aplikację (Ctrl+C)

# 2. Uruchom z poprawną zmienną
$env:VITE_USE_MOCK_DATA="true"
npm run dev

# 3. Sprawdź w przeglądarce: http://localhost:5173
```

### Opcja 3: Utworz plik .env.development
```bash
# W folderze FabManageNew utwórz plik .env.development:
VITE_USE_MOCK_DATA=true
VITE_API_BASE_URL=http://localhost:3001
VITE_LOG_LEVEL=debug
```

## Sprawdzenie czy działa
Po uruchomieniu powinieneś zobaczyć:
- ✅ Projekty w sekcji "Projekty" 
- ✅ Materiały w sekcji "Magazyn"
- ✅ Kafelki w sekcji "Kafelki"
- ✅ Klientów w sekcji "Klienci"

## Logi w konsoli przeglądarki
Otwórz narzędzia developerskie (F12) i sprawdź czy widzisz:
```
🔧 App Config: { useMockData: true }
🏭 Initializing FabrykaManage with realistic production data...
✅ Projects loaded successfully: XX projects
```

## Jeśli nadal nie działa
1. Sprawdź konsolę przeglądarki (F12) - szukaj błędów
2. Sprawdź czy backend działa: http://localhost:3001/health
3. Wyczyść cache przeglądarki (Ctrl+Shift+R)
4. Sprawdź czy port 5173 nie jest zajęty przez inną aplikację
