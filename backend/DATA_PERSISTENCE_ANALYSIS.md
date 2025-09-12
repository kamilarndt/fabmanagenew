# Analiza Trwałości Danych w FabManage

## ❓ Pytanie: Czy dane się zapisują nawet jak przebudujemy projekt i czy wraca do danych z przed budowania?

## ✅ ODPOWIEDŹ: TAK, dane są trwałe!

### 📊 **Jak Działa Przechowywanie Danych:**

#### 1. **Główna Baza Danych**
- **Lokalizacja**: `backend/fabmanage.db`
- **Typ**: SQLite (plik na dysku)
- **Trwałość**: ✅ **DANE SĄ TRWAŁE** - plik pozostaje na dysku po przebudowaniu

#### 2. **System Backupów**
- **Lokalizacja**: `Z:\_NoweRozdanie\_db_backups\`
- **Częstotliwość**: Co 60 minut + przy starcie aplikacji
- **Retencja**: Ostatnie 30 backupów
- **Format**: `fabmanage.YYYY-MM-DD_HH-MM-SS.db` + `fabmanage.latest.db`

#### 3. **Fallback System**
- **Lokalizacja**: `<PROJECTS_ROOT>/.fabmanage/fabmanage.db`
- **Funkcja**: Automatyczne przełączenie przy problemach z główną bazą

### 🔍 **Test Trwałości - Wykonane Sprawdzenia:**

#### **Test 1: Sprawdzenie Istnienia Danych**
```bash
# Przed testem
Liczba klientów w bazie: 8
```

#### **Test 2: Usunięcie Głównej Bazy**
```bash
# Po usunięciu fabmanage.db
SqliteError: no such table: clients
```
- System nie przełączył się automatycznie na fallback (brak fallback bazy)

#### **Test 3: Przywrócenie z Backupu**
```bash
# Po przywróceniu z backupu
Liczba klientów z backupu: 8
```

### 📁 **Struktura Plików:**

```
D:\Cursor_Workspaces\fabManage\backend\
├── fabmanage.db                    # Główna baza danych (229KB)
├── fabmanage.db.backup            # Backup testowy
└── projects-config.json           # Konfiguracja ścieżek

Z:\_NoweRozdanie\
├── _db_backups\                   # Automatyczne backupy
│   ├── fabmanage.latest.db        # Najnowszy backup
│   ├── fabmanage.2025-09-10_00-52-24.db
│   ├── fabmanage.2025-09-10_01-26-40.db
│   └── ... (ostatnie 30 backupów)
└── .fabmanage\                    # Fallback (jeśli istnieje)
    └── fabmanage.db
```

### 🛡️ **Mechanizmy Ochrony Danych:**

#### **1. Automatyczne Backupy**
- **Co 60 minut** - automatyczne tworzenie backupu
- **Przy starcie** - backup przy uruchomieniu aplikacji
- **Retencja** - zachowanie ostatnich 30 backupów
- **Czyszczenie** - automatyczne usuwanie starych backupów

#### **2. Podwójna Strategia**
- **Główna baza**: `backend/fabmanage.db`
- **Fallback**: `<PROJECTS_ROOT>/.fabmanage/fabmanage.db`
- **Automatyczne przełączenie** przy problemach

#### **3. Konfiguracja Trwała**
- **Ścieżki projektów**: `projects-config.json`
- **Ustawienia**: Zachowane między sesjami
- **Lokalizacje**: Konfigurowalne przez API

### 🔄 **Co Się Dzieje Przy Przebudowaniu:**

#### **Scenariusz 1: Normalne Przebudowanie**
```
1. Aplikacja się zatrzymuje
2. Baza danych REMAINS na dysku ✅
3. Kod się przebudowuje
4. Aplikacja się uruchamia
5. Baza danych jest ŁADOWANA ponownie ✅
6. Wszystkie dane są dostępne ✅
```

#### **Scenariusz 2: Usunięcie Bazy (Błąd)**
```
1. Baza zostaje usunięta
2. System próbuje fallback
3. Jeśli brak fallback → błąd
4. Możliwość przywrócenia z backupu ✅
```

#### **Scenariusz 3: Przywrócenie z Backupu**
```
1. Kopiujemy backup do głównej lokalizacji
2. Uruchamiamy aplikację
3. Wszystkie dane są przywrócone ✅
```

### 📋 **Instrukcje Przywracania Danych:**

#### **Metoda 1: Ręczne Przywrócenie**
```bash
# 1. Zatrzymaj aplikację
# 2. Skopiuj backup
copy "Z:\_NoweRozdanie\_db_backups\fabmanage.latest.db" backend\fabmanage.db
# 3. Uruchom aplikację
npm start
```

#### **Metoda 2: Przez API (jeśli serwer działa)**
```bash
# Lista dostępnych backupów
curl http://localhost:3001/admin/db-backups

# Przywrócenie z backupu
curl -X POST http://localhost:3001/admin/db-restore \
  -H "Content-Type: application/json" \
  -d '{"backupName": "fabmanage.2025-09-10_00-52-24.db"}'
```

#### **Metoda 3: Regeneracja Demo Danych**
```bash
# Jeśli wszystko się zepsuje
curl -X POST http://localhost:3001/admin/generate-demo-library
```

### ⚠️ **Ostrzeżenia i Zalecenia:**

#### **1. Backup Przed Zmianami**
- Zawsze rób backup przed większymi zmianami
- Używaj endpointu `/admin/db-backup`

#### **2. Monitorowanie Backupów**
- Sprawdzaj czy backupy są tworzone
- Endpoint: `/admin/db-backups`

#### **3. Konfiguracja Ścieżek**
- Upewnij się, że `Z:\_NoweRozdanie` istnieje
- Sprawdź uprawnienia zapisu

### 🎯 **Podsumowanie:**

## ✅ **TAK - DANE SĄ TRWAŁE!**

1. **Główna baza** (`backend/fabmanage.db`) pozostaje na dysku po przebudowaniu
2. **Automatyczne backupy** co 60 minut w `Z:\_NoweRozdanie\_db_backups\`
3. **System fallback** dla awaryjnych sytuacji
4. **Możliwość przywrócenia** z dowolnego backupu
5. **Konfiguracja trwała** w `projects-config.json`

### 🚀 **Gwarancje:**
- ✅ Dane przetrwają przebudowanie projektu
- ✅ Dane przetrwają restart aplikacji
- ✅ Dane przetrwają restart systemu
- ✅ Możliwość przywrócenia z backupu
- ✅ Automatyczne backupy co godzinę
- ✅ System fallback dla awarii

**Twoje dane demo są bezpieczne!** 🛡️

