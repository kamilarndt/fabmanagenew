# FabManage - Struktura Bazy Danych

## Przegląd

Dokument zawiera kompletną strukturę bazy danych FabManage wyekstraktowaną z Figma. System zarządza klientami, projektami, elementami projektów (kafelkami) i materiałami.

---

## Diagram ERD

```
Client (1) ──── (N) Client_Contact
  │
  │ (1)
  │
  │ (N)
  │
Project (1) ──── (N) ProjectElement
  │
  │ (N)
  │
  │ (M)
  │
Material
```

---

## Tabele Bazy Danych

### 1. **Client** (Klienci)

| Pole           | Typ            | Opis                                         |
| -------------- | -------------- | -------------------------------------------- |
| `id`           | `uuid (PK)`    | Primary Key - unikalny identyfikator klienta |
| `nazwa_firmy`  | `varchar(255)` | Nazwa firmy klienta                          |
| `nip`          | `varchar(20)`  | Numer NIP firmy                              |
| `mail_firmowy` | `varchar(255)` | Email firmowy                                |
| `status`       | `enum`         | Status klienta (active, inactive, pending)   |
| `contacts`     | `jsonb`        | Dodatkowe kontakty w formacie JSON           |
| `website`      | `varchar(255)` | Strona internetowa firmy                     |
| `logotyp`      | `varchar(500)` | URL do logotypu firmy                        |
| `created_at`   | `timestamp`    | Data utworzenia rekordu                      |

**Przykład danych:**

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "nazwa_firmy": "ABC Decorations Sp. z o.o.",
  "nip": "1234567890",
  "mail_firmowy": "kontakt@abcdecorations.pl",
  "status": "active",
  "contacts": {
    "phone": "+48 123 456 789",
    "address": "ul. Przykładowa 123, 00-001 Warszawa"
  },
  "website": "https://abcdecorations.pl",
  "logotyp": "/uploads/logos/abc-logo.png",
  "created_at": "2024-01-15T10:30:00Z"
}
```

---

### 2. **Client_Contact** (Kontakty Klientów)

| Pole                 | Typ            | Opis                                          |
| -------------------- | -------------- | --------------------------------------------- |
| `id`                 | `uuid (PK)`    | Primary Key - unikalny identyfikator kontaktu |
| `client_id`          | `uuid (FK)`    | Foreign Key do tabeli Client                  |
| `imie`               | `varchar(100)` | Imię osoby kontaktowej                        |
| `nazwisko`           | `varchar(100)` | Nazwisko osoby kontaktowej                    |
| `adres_email`        | `varchar(255)` | Email osoby kontaktowej                       |
| `telefon_kontaktowy` | `varchar(20)`  | Numer telefonu                                |
| `opis`               | `text`         | Opis roli/stanowiska osoby                    |

**Przykład danych:**

```json
{
  "id": "660e8400-e29b-41d4-a716-446655440001",
  "client_id": "550e8400-e29b-41d4-a716-446655440000",
  "imie": "Jan",
  "nazwisko": "Kowalski",
  "adres_email": "j.kowalski@abcdecorations.pl",
  "telefon_kontaktowy": "+48 123 456 789",
  "opis": "Dyrektor ds. marketingu"
}
```

---

### 3. **Project** (Projekty)

| Pole                 | Typ             | Opis                                                     |
| -------------------- | --------------- | -------------------------------------------------------- |
| `id`                 | `uuid (PK)`     | Primary Key - unikalny identyfikator projektu            |
| `numer`              | `varchar(50)`   | Numer projektu (np. PRJ-2024-001)                        |
| `name`               | `varchar(255)`  | Nazwa projektu                                           |
| `typ`                | `enum`          | Typ projektu (scenografia, dekoracja, event)             |
| `clientId`           | `uuid (FK)`     | Foreign Key do tabeli Client                             |
| `contact_PersonID`   | `uuid (FK)`     | Foreign Key do Client_Contact                            |
| `status`             | `enum`          | Status projektu (planning, active, completed, cancelled) |
| `budget`             | `decimal(12,2)` | Budżet projektu                                          |
| `manager`            | `varchar(255)`  | Manager projektu                                         |
| `deadline`           | `date`          | Termin realizacji                                        |
| `description`        | `text`          | Opis projektu                                            |
| `modules`            | `jsonb`         | Moduły projektu w JSON                                   |
| `speckle_stream_url` | `varchar(500)`  | URL do stream Speckle                                    |
| `colorScheme`        | `jsonb`         | Schemat kolorów projektu                                 |
| `created_at`         | `timestamp`     | Data utworzenia                                          |
| `updated_at`         | `timestamp`     | Data ostatniej aktualizacji                              |

**Przykład danych:**

```json
{
  "id": "770e8400-e29b-41d4-a716-446655440002",
  "numer": "PRJ-2024-001",
  "name": "Scenografia do spektaklu 'Hamlet'",
  "typ": "scenografia",
  "clientId": "550e8400-e29b-41d4-a716-446655440000",
  "contact_PersonID": "660e8400-e29b-41d4-a716-446655440001",
  "status": "active",
  "budget": 50000.0,
  "manager": "Anna Nowak",
  "deadline": "2024-06-15",
  "description": "Kompletna scenografia do produkcji teatralnej",
  "modules": {
    "pricing": true,
    "concept": true,
    "technical_design": true,
    "production": false,
    "materials": false,
    "logistics": false
  },
  "speckle_stream_url": "https://speckle.xyz/streams/abc123",
  "colorScheme": {
    "primary": "#1a365d",
    "secondary": "#2d3748",
    "accent": "#e53e3e"
  },
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-20T14:45:00Z"
}
```

---

### 4. **ProjectElement** (Elementy Projektu - Kafelki)

| Pole                    | Typ             | Opis                                                                                               |
| ----------------------- | --------------- | -------------------------------------------------------------------------------------------------- |
| `id`                    | `uuid (PK)`     | Primary Key - unikalny identyfikator elementu                                                      |
| `project_id`            | `uuid (FK)`     | Foreign Key do tabeli Project                                                                      |
| `name`                  | `varchar(255)`  | Nazwa elementu/kafelka                                                                             |
| `status`                | `enum`          | Status elementu (designing, pending_approval, approved, cnc_queue, cnc_production, ready_assembly) |
| `priority`              | `enum`          | Priorytet (low, medium, high, urgent)                                                              |
| `termin`                | `date`          | Termin realizacji elementu                                                                         |
| `estimated_cost`        | `decimal(10,2)` | Szacowany koszt elementu                                                                           |
| `przypisany_projektant` | `varchar(255)`  | Przypisany projektant                                                                              |
| `Materials`             | `jsonb`         | Materiały potrzebne do elementu                                                                    |
| `dependencies`          | `jsonb`         | Zależności od innych elementów                                                                     |
| `geometry_data`         | `jsonb`         | Dane geometryczne elementu                                                                         |
| `created_at`            | `timestamp`     | Data utworzenia                                                                                    |

**Przykład danych:**

```json
{
  "id": "880e8400-e29b-41d4-a716-446655440003",
  "project_id": "770e8400-e29b-41d4-a716-446655440002",
  "name": "Ściana tylna - panel główny",
  "status": "approved",
  "priority": "high",
  "termin": "2024-05-30",
  "estimated_cost": 2500.0,
  "przypisany_projektant": "Piotr Wiśniewski",
  "Materials": [
    {
      "material_id": "990e8400-e29b-41d4-a716-446655440004",
      "quantity": 2.5,
      "unit": "m2"
    }
  ],
  "dependencies": ["880e8400-e29b-41d4-a716-446655440005"],
  "geometry_data": {
    "width": 3000,
    "height": 2500,
    "thickness": 18,
    "dxf_file": "/files/panel_glowny.dxf"
  },
  "created_at": "2024-01-16T09:15:00Z"
}
```

---

### 5. **Material** (Materiały)

| Pole         | Typ             | Opis                                           |
| ------------ | --------------- | ---------------------------------------------- |
| `id`         | `uuid (PK)`     | Primary Key - unikalny identyfikator materiału |
| `code`       | `varchar(50)`   | Kod materiału                                  |
| `name`       | `varchar(255)`  | Nazwa materiału                                |
| `category`   | `jsonb`         | Kategoria materiału w JSON                     |
| `thickness`  | `decimal(5,2)`  | Grubość materiału (mm)                         |
| `stock`      | `decimal(10,2)` | Stan magazynowy                                |
| `price`      | `decimal(10,2)` | Cena za jednostkę                              |
| `supplier`   | `varchar(255)`  | Dostawca materiału                             |
| `location`   | `varchar(255)`  | Lokalizacja w magazynie                        |
| `abcClass`   | `enum`          | Klasa ABC (A, B, C)                            |
| `properties` | `jsonb`         | Dodatkowe właściwości materiału                |

**Przykład danych:**

```json
{
  "id": "990e8400-e29b-41d4-a716-446655440004",
  "code": "MDF-18-1220",
  "name": "Płyta MDF 18mm 1220x2440",
  "category": {
    "main": "drewno",
    "sub": "płyty",
    "type": "MDF"
  },
  "thickness": 18.0,
  "stock": 25.5,
  "price": 45.0,
  "supplier": "Drewno Sp. z o.o.",
  "location": "A-15-3",
  "abcClass": "A",
  "properties": {
    "density": 750,
    "moisture": 8,
    "color": "natural",
    "finish": "raw"
  }
}
```

---

## Relacje i Klucze Obce

### Relacje 1:N (One-to-Many)

1. **Client → Client_Contact**

   - Jeden klient może mieć wiele kontaktów
   - `Client_Contact.client_id` → `Client.id`

2. **Client → Project**

   - Jeden klient może mieć wiele projektów
   - `Project.clientId` → `Client.id`

3. **Project → ProjectElement**
   - Jeden projekt może mieć wiele elementów (kafelków)
   - `ProjectElement.project_id` → `Project.id`

### Relacje N:M (Many-to-Many)

4. **ProjectElement ↔ Material**
   - Elementy projektów używają wielu materiałów
   - Materiały są używane w wielu elementach
   - Relacja realizowana przez pole `Materials` (JSON) w `ProjectElement`

---

## Enums (Typy Wyliczeniowe)

### Client.status

- `active` - Aktywny klient
- `inactive` - Nieaktywny klient
- `pending` - Oczekujący na aktywację

### Project.typ

- `scenografia` - Projekt scenograficzny
- `dekoracja` - Projekt dekoracyjny
- `event` - Projekt eventowy

### Project.status

- `planning` - W planowaniu
- `active` - Aktywny projekt
- `completed` - Ukończony
- `cancelled` - Anulowany

### ProjectElement.status

- `designing` - W projektowaniu
- `pending_approval` - Oczekuje na akceptację
- `approved` - Zaakceptowany
- `cnc_queue` - W kolejce CNC
- `cnc_production` - W produkcji CNC
- `ready_assembly` - Gotowy do montażu

### ProjectElement.priority

- `low` - Niski priorytet
- `medium` - Średni priorytet
- `high` - Wysoki priorytet
- `urgent` - Pilny

### Material.abcClass

- `A` - Klasa A (wysoka wartość, niska częstotliwość)
- `B` - Klasa B (średnia wartość, średnia częstotliwość)
- `C` - Klasa C (niska wartość, wysoka częstotliwość)

---

## Indeksy i Optymalizacja

### Indeksy Primary Key

- Wszystkie tabele mają indeksy na `id` (uuid)

### Indeksy Foreign Key

- `Client_Contact.client_id`
- `Project.clientId`
- `ProjectElement.project_id`

### Indeksy dla zapytań

- `Client.nip` (unique)
- `Project.numer` (unique)
- `Material.code` (unique)
- `ProjectElement.status`
- `ProjectElement.priority`
- `Material.abcClass`

---

## Pola JSON - Struktura

### Client.contacts

```json
{
  "phone": "string",
  "address": "string",
  "additional_contacts": [
    {
      "name": "string",
      "phone": "string",
      "email": "string"
    }
  ]
}
```

### Project.modules

```json
{
  "pricing": boolean,
  "concept": boolean,
  "technical_design": boolean,
  "production": boolean,
  "materials": boolean,
  "logistics": boolean
}
```

### Project.colorScheme

```json
{
  "primary": "string (hex color)",
  "secondary": "string (hex color)",
  "accent": "string (hex color)",
  "background": "string (hex color)",
  "text": "string (hex color)"
}
```

### ProjectElement.Materials

```json
[
  {
    "material_id": "uuid",
    "quantity": "number",
    "unit": "string",
    "notes": "string"
  }
]
```

### ProjectElement.dependencies

```json
["uuid (ProjectElement.id)", "uuid (ProjectElement.id)"]
```

### ProjectElement.geometry_data

```json
{
  "width": "number (mm)",
  "height": "number (mm)",
  "thickness": "number (mm)",
  "dxf_file": "string (file path)",
  "pdf_file": "string (file path)",
  "3d_model": "string (file path)"
}
```

### Material.category

```json
{
  "main": "string",
  "sub": "string",
  "type": "string",
  "brand": "string"
}
```

### Material.properties

```json
{
  "density": "number",
  "moisture": "number",
  "color": "string",
  "finish": "string",
  "fire_rating": "string",
  "certifications": ["string"]
}
```

---

## Następne Kroki

1. **TypeScript Interfaces** - Stworzenie interfejsów TypeScript dla wszystkich tabel
2. **Zod Schemas** - Walidacja danych z użyciem Zod
3. **Supabase Schema** - Implementacja w Supabase z RLS policies
4. **Zustand Stores** - Integracja z obecnymi stores
5. **API Endpoints** - Stworzenie endpointów CRUD
6. **Migration Scripts** - Skrypty migracji bazy danych

Ta struktura zapewnia:

- **Skalowalność** - JSON fields dla elastycznych danych
- **Wydajność** - Proper indexing i foreign keys
- **Integralność** - Enums i constraints
- **Elastyczność** - JSON dla danych specyficznych dla domeny
