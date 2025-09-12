# Instrukcja migracji bazy danych do ustawień aplikacji

## 🗄️ **ZAKTUALIZOWANY SYSTEM BAZY DANYCH Z USTAWIEŃ APLIKACJI**

### **Co zostało zmienione:**

1. **Baza danych** jest teraz zapisywana w lokalizacji wskazanej w ustawieniach aplikacji
2. **Automatyczny system backup** z retencją plików
3. **Nowe API endpointy** do zarządzania bazą danych
4. **Backup scheduler** z harmonogramem codziennych i tygodniowych backupów

### **Nowa lokalizacja bazy danych:**
- **Główna baza**: `<projects_root>/.fabmanage/fabmanage.db`
- **Backupy**: `<projects_root>/.fabmanage/backups/`
  - `daily/` - Backupy codzienne (przechowywane 30 dni)
  - `weekly/` - Backupy tygodniowe (przechowywane 12 tygodni)
  - `manual/` - Backupy ręczne (przechowywane 10 plików)

### **Instrukcja uruchomienia:**

#### **1. Zaktualizuj ustawienia aplikacji**
- Otwórz aplikację i przejdź do `/settings`
- Ustaw ścieżkę do folderu z danymi (np. `Z:\_NoweRozdanie`)
- Zapisz ustawienia

#### **2. Zainstaluj nowe zależności**
```bash
cd backend
npm install
```

#### **3. Zrestartuj aplikację**
- Zatrzymaj backend
- Uruchom ponownie: `npm start`
- Baza zostanie automatycznie utworzona w nowej lokalizacji

#### **4. Sprawdź status bazy danych**
```bash
curl http://localhost:3001/api/database/status
```

#### **5. Utwórz pierwszy backup**
```bash
curl -X POST http://localhost:3001/api/database/backup \
  -H "Content-Type: application/json" \
  -d '{"type": "manual"}'
```

### **Nowe API endpointy:**

#### **Status bazy danych**
```bash
GET /api/database/status
```
Zwraca: `{ connected, path, size, projectsRoot, databaseDir, backupDir }`

#### **Utwórz backup**
```bash
POST /api/database/backup
Content-Type: application/json
{ "type": "manual|daily|weekly" }
```

#### **Przywróć z backup**
```bash
POST /api/database/restore
Content-Type: application/json
{ "backupPath": "/path/to/backup.db" }
```

#### **Lista backupów**
```bash
GET /api/database/backups
```
Zwraca: `{ daily: [], weekly: [], manual: [] }`

### **Automatyczne backupy:**

- **Codziennie o 2:00** - backup typu `daily`
- **Tygodniowo w niedzielę o 3:00** - backup typu `weekly`
- **Przed restartem aplikacji** - backup typu `manual`

### **Konfiguracja Docker:**

Dodaj do `docker-compose.yml`:
```yaml
environment:
  - PROJECTS_ROOT_DIR=/mnt/projects
  - FABMANAGE_AUTO_BACKUP=true
volumes:
  - Z:\\_NoweRozdanie:/mnt/projects
```

### **Migracja istniejących danych:**

Jeśli masz już dane w starej lokalizacji (`backend/fabmanage.db`):

1. **Zatrzymaj aplikację**
2. **Skopiuj starą bazę** do nowej lokalizacji:
   ```bash
   mkdir -p "Z:\_NoweRozdanie\.fabmanage"
   copy "backend\fabmanage.db" "Z:\_NoweRozdanie\.fabmanage\fabmanage.db"
   ```
3. **Uruchom aplikację** - automatycznie użyje nowej lokalizacji

### **Weryfikacja:**

Po uruchomieniu sprawdź:
- ✅ Baza jest w nowej lokalizacji
- ✅ Backupy są tworzone automatycznie
- ✅ API endpointy działają
- ✅ Stare pliki można usunąć

### **Troubleshooting:**

**Problem**: Baza nie jest tworzona w nowej lokalizacji
**Rozwiązanie**: Sprawdź uprawnienia do zapisu w folderze ustawień

**Problem**: Backupy nie są tworzone
**Rozwiązanie**: Sprawdź zmienną środowiskową `FABMANAGE_AUTO_BACKUP=true`

**Problem**: API endpointy nie działają
**Rozwiązanie**: Sprawdź czy `node-cron` jest zainstalowany: `npm install node-cron`
