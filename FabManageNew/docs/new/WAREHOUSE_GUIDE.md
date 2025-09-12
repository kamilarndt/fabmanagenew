## Przewodnik — Moduł Magazynowy

### Widoki i funkcje
- Drzewo kategorii (lewy panel) — wielopoziomowe, liczniki pozycji
- Lista/kafelki/tabela — przełączane widoki z sortowaniem i filtrami
- Panel krytycznych stanów — szybkie zamówienia, wskaźniki, dni zapasu
- Panel szczegółów materiału — stan, właściwości, historia, analityka
- Dashboard KPI — wartość magazynu, liczba pozycji, ABC, trendy

### Dane i filtrowanie
- Model `Material` i hierarchia kategorii (zob. `DATA_MODELS.md`)
- Filtry: tekst, dostawca, status zapasów, ABC, tagi
- Statusy stanów: critical/low/normal/excess (kolorystyka spójna z UI)

### Operacje (planowane/implementowane)
- Przyjęcia (PZ), Wydania (WZ), Korekty, Transfery — formularz `OperationForm`
- Rezerwacje stocku i zamówienia — store `materialsStore` (PurchaseRequest/Reservation)
- Zamówienia szybkie z listy krytycznych pozycji

### Synchronizacja z backendem
- `Sync` z `src/api/materials.ts` — wczytanie materiałów z backendu
- Demands: tworzone z poziomu kafelków/projektów → lista zapotrzebowań

### Ekosystem komponentów
- `CategoryTree`, `MaterialCard`, `MaterialDetailsPanel`, `TagFilter`, `WarehouseDashboard`, `WarehouseMap`
- Style: `src/styles/warehouse.css`, `modern-theme.css`, `magazyn.css`

### UX i responsywność
- Mobile: ukrywanie lewego panelu w hamburger menu
- Duże ekrany: siatki (ultra‑wide) + sticky panele
- Klawisze: Esc zamyka panele/modalne okna

### Dobre praktyki danych
- Minimalne progi (`minStock`) utrzymywane i aktualizowane per materiał
- Jednostki (arkusz/mb/szt) dopasowane do źródła (Rhino → terminalny węzeł)
- ABC dla priorytetyzacji decyzji zakupowych


