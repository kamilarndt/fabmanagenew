# Enhanced Tiles API Documentation

## Przegląd

Nowe API do zarządzania kafelkami/elementami projektu z rozszerzonymi funkcjonalnościami, zgodne z układem interfejsu użytkownika.

## Nowe Pola w Tabeli Tiles

### Podstawowe Pola
- `id` - Unikalny identyfikator kafelka
- `project_id` - ID projektu
- `name` - Nazwa elementu
- `code` - Kod elementu
- `quantity` - Ilość
- `description` - Opis

### Wymiary
- `width_mm` - Szerokość w mm
- `height_mm` - Wysokość w mm
- `thickness_mm` - Grubość w mm

### Zarządzanie
- `deadline` - Termin wykonania
- `assigned_designer` - Przypisany projektant
- `priority` - Priorytet (Niski, Średni, Wysoki)
- `progress_percent` - Postęp w procentach (0-100)
- `group_id` - ID grupy elementów
- `stage` - Etap produkcji (design, cnc, assembly, done)
- `status` - Status (new, design, cnc, assembly, done)

### Pliki i Modele 3D
- `speckle_object_ids` - JSON array z ID obiektów 3D
- `dxf_file_path` - Ścieżka do pliku DXF
- `assembly_drawing_path` - Ścieżka do rysunku montażowego

### Koszty
- `labor_cost` - Koszt robocizny
- `material_cost` - Koszt materiałów (obliczany automatycznie)
- `total_cost` - Koszt całkowity (obliczany automatycznie)

### Dodatkowe
- `notes` - Notatki
- `created_at` - Data utworzenia
- `updated_at` - Data ostatniej aktualizacji

## Endpointy API

### 1. Tworzenie Kafelka (Enhanced)

**POST** `/api/tiles/enhanced`

**Body:**
```json
{
  "project_id": "proj-wesele-scenografia",
  "name": "Panel frontowy",
  "code": "TN-W-001",
  "quantity": 1,
  "description": "Centralny element scenografii",
  "width_mm": 3000,
  "height_mm": 2400,
  "thickness_mm": 18,
  "deadline": "2024-12-15",
  "assigned_designer": "Anna Kowalska",
  "priority": "Wysoki",
  "group_id": "grupa-panele",
  "speckle_object_ids": ["obj-123", "obj-456"],
  "stage": "design",
  "status": "new",
  "notes": "Wymaga specjalnej obróbki"
}
```

**Response:**
```json
{
  "id": "t-1234567890-abcde",
  "name": "Panel frontowy",
  "code": "TN-W-001",
  "status": "Projektowanie",
  "project": "proj-wesele-scenografia",
  "opis": "Centralny element scenografii",
  "termin": "2024-12-15",
  "priority": "Wysoki",
  "progress": 0,
  "assigned_designer": "Anna Kowalska",
  "group_id": "grupa-panele",
  "speckle_object_ids": ["obj-123", "obj-456"],
  "dxfFile": null,
  "assemblyDrawing": null,
  "bom": [],
  "laborCost": 0,
  "materialCost": 0,
  "totalCost": 0,
  "notes": "Wymaga specjalnej obróbki",
  "dimensions": {
    "width_mm": 3000,
    "height_mm": 2400,
    "thickness_mm": 18
  },
  "created_at": "2024-09-10T10:30:00.000Z",
  "updated_at": "2024-09-10T10:30:00.000Z"
}
```

### 2. Aktualizacja Kafelka (Enhanced)

**PUT** `/api/tiles/:id/enhanced`

**Body:**
```json
{
  "name": "Panel frontowy - zaktualizowany",
  "progress_percent": 75,
  "stage": "cnc",
  "status": "W produkcji CNC",
  "labor_cost": 150.50,
  "notes": "Prawie gotowy, czeka na montaż"
}
```

**Response:** Pełny obiekt kafelka z aktualizowanymi danymi

### 3. Lista Kafelków (Enhanced)

**GET** `/api/tiles/enhanced?projectId=proj-wesele-scenografia`

**Response:**
```json
[
  {
    "id": "t-1234567890-abcde",
    "name": "Panel frontowy",
    "code": "TN-W-001",
    "status": "Projektowanie",
    "project": "proj-wesele-scenografia",
    "opis": "Centralny element scenografii",
    "termin": "2024-12-15",
    "priority": "Wysoki",
    "progress": 75,
    "assigned_designer": "Anna Kowalska",
    "group_id": "grupa-panele",
    "speckle_object_ids": ["obj-123", "obj-456"],
    "dxfFile": "/uploads/dxf/panel-frontowy.dxf",
    "assemblyDrawing": null,
    "bom": [
      {
        "id": "t-1234567890-abcde__mdf-18mm-biały",
        "type": "Materiał surowy",
        "name": "MDF 18mm biały",
        "quantity": 7.2,
        "unit": "m2",
        "supplier": "Kronopol",
        "status": "Na stanie",
        "unitCost": 85,
        "materialId": "mdf-18mm-biały"
      }
    ],
    "laborCost": 150.50,
    "materialCost": 612.00,
    "totalCost": 762.50,
    "notes": "Prawie gotowy, czeka na montaż",
    "dimensions": {
      "width_mm": 3000,
      "height_mm": 2400,
      "thickness_mm": 18
    },
    "created_at": "2024-09-10T10:30:00.000Z",
    "updated_at": "2024-09-10T14:45:00.000Z"
  }
]
```

### 4. Pojedynczy Kafelek (Enhanced)

**GET** `/api/tiles/:id/enhanced`

**Response:** Pełny obiekt kafelka (jak w liście)

### 5. Grupy Kafelków

**GET** `/api/tiles/groups?projectId=proj-wesele-scenografia`

**Response:**
```json
[
  {
    "group_id": "grupa-panele",
    "tile_count": 3,
    "first_created": "2024-09-10T10:30:00.000Z",
    "last_updated": "2024-09-10T14:45:00.000Z"
  },
  {
    "group_id": "grupa-podesty",
    "tile_count": 1,
    "first_created": "2024-09-10T11:00:00.000Z",
    "last_updated": "2024-09-10T11:00:00.000Z"
  }
]
```

## Mapowanie Statusów

### Backend → UI
- `design` → `Projektowanie`
- `cnc` → `W produkcji CNC`
- `assembly` → `Składanie (Produkcja)`
- `done` → `Gotowy do montażu`
- `new` → `Do akceptacji`

### UI → Backend
- `Projektowanie` → `design`
- `W produkcji CNC` → `cnc`
- `Składanie (Produkcja)` → `assembly`
- `Gotowy do montażu` → `done`
- `Do akceptacji` → `design`

## Automatyczne Obliczenia

### Koszty Materiałów
System automatycznie oblicza koszt materiałów na podstawie BOM (Bill of Materials):
```javascript
material_cost = SUM(quantity * price_per_uom) for all materials in BOM
```

### Koszt Całkowity
```javascript
total_cost = material_cost + labor_cost
```

### Aktualizacja Kosztów
Koszty są automatycznie przeliczane przy:
- Dodaniu/usunięciu materiału z BOM
- Zmianie ilości materiału
- Zmianie kosztu robocizny

## BOM (Bill of Materials)

Każdy kafelek ma automatycznie generowany BOM na podstawie tabeli `tile_materials`:

```json
"bom": [
  {
    "id": "tile_id__material_id",
    "type": "Materiał surowy",
    "name": "MDF 18mm biały",
    "quantity": 7.2,
    "unit": "m2",
    "supplier": "Kronopol",
    "status": "Na stanie", // lub "Do zamówienia"
    "unitCost": 85,
    "materialId": "mdf-18mm-biały"
  }
]
```

## Grupowanie Kafelków

Kafelki można grupować używając pola `group_id`:
- Grupy są tworzone automatycznie przy pierwszym użyciu `group_id`
- Można pobrać listę grup dla projektu
- Grupy pomagają w organizacji elementów

## Integracja z 3D

### Speckle Object IDs
Pole `speckle_object_ids` przechowuje JSON array z ID obiektów 3D:
```json
"speckle_object_ids": ["obj-123", "obj-456", "obj-789"]
```

### Pliki DXF
Pole `dxf_file_path` przechowuje ścieżkę do pliku DXF:
```json
"dxfFile": "/uploads/dxf/panel-frontowy.dxf"
```

## Przykłady Użycia

### Tworzenie Kafelka z Wymiarami
```bash
curl -X POST http://localhost:3001/api/tiles/enhanced \
  -H "Content-Type: application/json" \
  -d '{
    "project_id": "proj-wesele-scenografia",
    "name": "Panel frontowy",
    "code": "TN-W-001",
    "width_mm": 3000,
    "height_mm": 2400,
    "thickness_mm": 18,
    "priority": "Wysoki",
    "assigned_designer": "Anna Kowalska"
  }'
```

### Aktualizacja Postępu
```bash
curl -X PUT http://localhost:3001/api/tiles/t-1234567890-abcde/enhanced \
  -H "Content-Type: application/json" \
  -d '{
    "progress_percent": 75,
    "stage": "cnc",
    "notes": "Prawie gotowy"
  }'
```

### Pobranie Kafelków Projektu
```bash
curl "http://localhost:3001/api/tiles/enhanced?projectId=proj-wesele-scenografia"
```

## Kompatybilność

Nowe API jest kompatybilne z istniejącymi endpointami:
- Stare endpointy (`/api/tiles`) nadal działają
- Nowe endpointy (`/api/tiles/enhanced`) oferują rozszerzone funkcjonalności
- Można stopniowo migrować z starych na nowe endpointy

## Audit Log

Wszystkie operacje są logowane w tabeli `audit_logs`:
- `tile.create_enhanced` - tworzenie kafelka
- `tile.update_enhanced` - aktualizacja kafelka
- `tile.delete` - usuwanie kafelka (istniejący)

## Błędy

### 400 Bad Request
- Brak wymaganego pola `name`
- Nieprawidłowy format danych

### 404 Not Found
- Kafelek o podanym ID nie istnieje

### 500 Internal Server Error
- Błąd bazy danych
- Błąd walidacji danych

