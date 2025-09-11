# Implementacja Lokalnego Przechowywania Bazy Danych

## Podsumowanie

System FabManage został ulepszony o kompleksowe rozwiązanie lokalnego przechowywania bazy danych zgodnie z dokumentacją FILESYSTEM_SYNC_AND_BACKUP.md.

## Architektura Bazy Danych

### 1. Podwójna Strategia Przechowywania
- **Główna baza**: `backend/fabmanage.db` (preferowana lokalizacja)
- **Fallback**: `<PROJECTS_ROOT>/.fabmanage/fabmanage.db` (automatyczne przełączenie przy problemach)

### 2. Automatyczne Backupy
- **Częstotliwość**: Co 60 minut + backup przy starcie aplikacji
- **Lokalizacja**: `<PROJECTS_ROOT>/_db_backups/`
- **Retencja**: Ostatnie 30 backupów (automatyczne czyszczenie)
- **Format**: `fabmanage.YYYY-MM-DD_HH-MM-SS.db` + `fabmanage.latest.db`

### 3. Synchronizacja Plików Systemowych
- **Automatyczne tworzenie** struktury folderów przy tworzeniu projektu
- **Struktura**: `<root>/<ClientName>/<ProjectName>/[wycena|koncepcja|materialy_od_klienta|produkcja/elementy/{pdf,dxf,preview}]`
- **Endpoint**: `POST /api/fs-sync` do ręcznej synchronizacji

## Nowe Endpointy API

### Zarządzanie Backupami
```bash
# Lista dostępnych backupów
GET /admin/db-backups

# Ręczny backup
POST /admin/db-backup

# Przywracanie z backupu
POST /admin/db-restore
Body: { "backupName": "fabmanage.2025-01-09_14-30-00.db" }
```

### Status Systemu
```bash
# Status bazy danych
GET /admin/db-status

# Status systemu plików
GET /admin/fs-status

# Status danych
GET /admin/data-status
```

### Konfiguracja
```bash
# Ustawienie głównego katalogu projektów
POST /api/settings/files-root
Body: { "path": "Z:\\_NoweRozdanie" }

# Pobranie aktualnej konfiguracji
GET /api/settings/files-root
```

## Konfiguracja Docker

Dla środowiska Docker, dodaj do `docker-compose.yml`:

```yaml
services:
  backend:
    environment:
      - PROJECTS_ROOT_DIR=/mnt/projects
    volumes:
      - Z:\\_NoweRozdanie:/mnt/projects
```

## Funkcje Bezpieczeństwa

### 1. Automatyczne Fallback
- System automatycznie przełącza się na bazę fallback przy problemach z główną bazą
- Logowanie wszystkich operacji w `audit_logs`

### 2. Weryfikacja Uprawnień
- Sprawdzanie uprawnień zapisu do katalogu projektów
- Test zapisu przed ustawieniem nowej ścieżki

### 3. Bezpieczne Przywracanie
- Automatyczny backup przed przywróceniem
- Weryfikacja istnienia pliku backupu

## Monitoring i Logowanie

### Logi Backupów
```
[backup] Scheduled backup completed: /path/to/backup.db
[backup] Initial backup completed: /path/to/backup.db
[backup] Cleaned up old backup: fabmanage.old.db
```

### Logi Synchronizacji
```
[fs] Project folders created: 5 directories
[fs] Project folder creation failed: permission denied
```

## Przykład Użycia

### 1. Tworzenie Projektu z Automatyczną Synchronizacją
```javascript
// POST /api/projects
{
  "client_id": "c-123",
  "name": "Projekt Testowy",
  "modules": ["koncepcja", "wycena", "produkcja"],
  "hasClientMaterials": true
}
```

System automatycznie:
- Utworzy strukturę folderów
- Zaktualizuje lokalizację w bazie danych
- Zaloguje operację w audit_logs

### 2. Sprawdzenie Statusu Systemu
```javascript
// GET /admin/fs-status
{
  "projectsRoot": "Z:/_NoweRozdanie",
  "projectsRootExists": true,
  "projectsRootWritable": true,
  "backupDirExists": true,
  "offlineDirExists": true,
  "filesystemProjects": 15
}
```

## Zalety Implementacji

1. **Niezawodność**: Podwójna strategia przechowywania
2. **Automatyzacja**: Automatyczne backupy i synchronizacja
3. **Bezpieczeństwo**: Weryfikacja uprawnień i audit logi
4. **Elastyczność**: Konfigurowalna ścieżka głównego katalogu
5. **Monitoring**: Kompleksowe endpointy statusu
6. **Retencja**: Automatyczne czyszczenie starych backupów

## Następne Kroki

1. **Testowanie**: Przetestować wszystkie endpointy w środowisku produkcyjnym
2. **Monitoring**: Skonfigurować alerty dla błędów backupów
3. **Dokumentacja**: Dodać instrukcje dla użytkowników końcowych
4. **Optymalizacja**: Monitorować wydajność przy dużej liczbie projektów

---

*Implementacja zakończona: 2025-01-09*
*Zgodna z dokumentacją: FILESYSTEM_SYNC_AND_BACKUP.md*

