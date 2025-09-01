# FabManageNew

Aplikacja do zarządzania projektami produkcyjnymi w fabryce, zintegrowana z Docker i lokalną persystencją stanu.

## Funkcjonalności

- **Zarządzanie projektami** - pełny cykl życia projektu
- **Kanban boards** - wizualne zarządzanie zadaniami
- **Zarządzanie klientami** - CRM dla klientów
- **Produkcja CNC** - monitoring procesów produkcyjnych
- **Magazyn** - zarządzanie materiałami i zapasami
- **Lokalna persystencja** - stan aplikacji zachowany po odświeżeniu
- **Docker** - łatwe wdrożenie i rozwój

## Technologie

- **Frontend**: React 19, TypeScript, Vite
- **UI**: Materialize CSS
- **State Management**: Zustand z persist middleware
- **Backend**: Supabase (opcjonalnie)
- **Containerization**: Docker & Docker Compose

## Szybki start

### Rozwój lokalny

```bash
# Instalacja zależności
npm install

# Uruchomienie serwera deweloperskiego
npm run dev
```

### Docker Development

```bash
# Uruchomienie w trybie deweloperskim z hot reload
npm run docker:dev

# Aplikacja dostępna na http://localhost:3002
```

### Docker Production

```bash
# Uruchomienie w trybie produkcyjnym
npm run docker:prod

# Aplikacja dostępna na http://localhost:3000
```

## Docker Commands

```bash
# Rozwój z hot reload
npm run docker:dev

# Produkcja z nginx
npm run docker:prod

# Zatrzymanie kontenerów
npm run docker:stop

# Czyszczenie (usuwa obrazy i wolumeny)
npm run docker:clean

# Logi
npm run docker:logs
```

## Struktura projektu

```
FabManageNew/
├── src/
│   ├── stores/           # Zustand stores z persist
│   │   ├── projectsStore.ts
│   │   └── tilesStore.ts
│   ├── pages/            # Komponenty stron
│   ├── components/       # Komponenty wielokrotnego użytku
│   ├── services/         # API services
│   └── lib/              # Utilities
├── Dockerfile            # Production build
├── Dockerfile.dev        # Development build
├── docker-compose.yml    # Multi-service setup
└── nginx.conf           # Reverse proxy config
```

## State Management

Aplikacja używa **Zustand** z **persist middleware** dla lokalnej persystencji stanu:

### Projekty Store
```typescript
import { useProjectsStore } from './stores/projectsStore'

const { projects, add, update, remove } = useProjectsStore()
```

### Tiles Store
```typescript
import { useTilesStore } from './stores/tilesStore'

const { tiles, setStatus, updateTile, addTile } = useTilesStore()
```

### Persystencja
- Dane automatycznie zapisywane w localStorage
- Synchronizacja z Supabase (jeśli skonfigurowane)
- Fallback do danych demo gdy brak połączenia

## Konfiguracja środowiska

### Zmienne środowiskowe

Utwórz plik `.env` (lub `.env.local`) – przykładowe klucze:

```env
# Supabase (opcjonalnie)
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=

# Aplikacja
VITE_APP_NAME=FabrykaManage
VITE_API_BASE_URL=
```

### Docker Environment

Docker Compose automatycznie przekazuje zmienne środowiskowe do kontenerów.

## Deployment

### Lokalny deployment

```bash
# Build produkcyjny
npm run build

# Uruchomienie z serve
npm run preview
```

### Docker deployment

```bash
# Production build i uruchomienie
npm run docker:prod

# Z nginx reverse proxy
# Dostępne na porcie 80 (HTTP) i 443 (HTTPS)
```

## Funkcjonalności zaawansowane

### Kanban Boards
- Drag & drop między kolumnami
- Automatyczna synchronizacja statusów
- Wizualne zarządzanie workflow

### Grupowanie elementów
- Tworzenie grup projektowych
- Przypisywanie elementów do grup
- Zarządzanie dokumentacją grup

### Filtrowanie i wyszukiwanie
- Zaawansowane filtry
- Wyszukiwanie tekstowe
- Sortowanie i paginacja

### Eksport danych
- CSV export
- Bulk operations
- Archiwizacja projektów

## Troubleshooting

### Problemy z Docker

```bash
# Sprawdź logi
npm run docker:logs

# Restart kontenerów
npm run docker:stop
npm run docker:dev

# Pełne czyszczenie
npm run docker:clean
```

### Problemy z persystencją

- Sprawdź localStorage w DevTools
- Wyczyść dane aplikacji jeśli potrzebne
- Sprawdź konfigurację Supabase

### Problemy z hot reload

```bash
# Restart serwera deweloperskiego
npm run docker:stop
npm run docker:dev
```

## Contributing

1. Fork projektu
2. Utwórz feature branch
3. Commit changes
4. Push do branch
5. Utwórz Pull Request

## License

MIT License
