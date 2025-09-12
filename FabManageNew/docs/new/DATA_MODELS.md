## Modele danych i store’y

### Projekty (`Project`)
- Pola: `id`, `name`, `clientId`, `client`, `status`, `deadline`, `budget?`, `manager?`, `description?`, `progress?`, `groups?`, `modules?`, `clientColor?`, `colorScheme?{ primary, light, dark, accent }`
- Lokalizacja: `src/stores/projectsStore.ts`, `src/types/projects.types.ts`

### Kafelki / Elementy (`Tile`)
- Pola: `id`, `name`, `status`, `project?`, `priority?`, `technology?`, `bom?`, `laborCost?`, `assignee?`, `dxfFile?`, `assemblyDrawing?`, `group?`
- BOM (`BomItem`): `id`, `type`, `name`, `quantity`, `unit`, `supplier?`, `status?`, `unitCost?`, `materialId?`
- Lokalizacja: `src/stores/tilesStore.ts`, `src/types/tiles.types.ts`

### Magazyn / Materiały (`MaterialData`)
- Warianty modeli: `src/types/magazyn.types.ts` oraz rozszerzony katalog w `src/data/rhinoMaterialsDatabase.ts`
- Typy kluczowe:
  - Material: identyfikacja, kategoria (ścieżka), grubość, jednostka, stany: `stock`, `minStock`, `maxStock`, dostawca, cena, lokalizacja, ABC, właściwości
  - MaterialCategory: węzły hierarchii z licznikami
  - MaterialStats, MaterialMovement, WarehouseLocation

### Zakupy i dostawy (store `materialsStore.ts`)
- `PurchaseRequest`: zgłoszenia zakupowe (status, priorytet, notatki)
- `SupplierQuote`: oferty dostawców (cena, waluta, lead time, ważność)
- `StockReservation`: rezerwacje magazynowe (status: reserved/released/consumed)
- `DeliveryTracking`: śledzenie dostaw (status: ordered/in_transit/delivered/delayed)

### Logistyka (store `logisticsStore.ts`)
- `PackingList`, `RoutePlanning`, `SiteInstallation`, `PunchListItem`, `SignOff`
- Każdy typ zawiera pola identyfikacyjne, powiązanie z projektem, status, terminy i metadane

### Koncepcja (store `conceptStore.ts`)
- `ConceptFile { id, name, size, type, url }`
- `ProjectConcept { files, miro?{ id, url } }`

### Klienci (store `clientsStore.ts` + `types/clients.types.ts`)
- `CompanyClient` + `ContactPerson` + aktywności/dokumenty/segmenty
- Pola koloru i identyfikatory do synchronizacji z projektami

### Aktywności (store `activityStore.ts`)
- `ActivityItem { id, projectId, category: 'activity' | 'update', text, userName, userAvatar?, timestamp }`

### Konwencje ID i atrybuty
- Projekty/Kafelki/Pozycje mają stringowe `id` (zwykle UUID/slug)
- Rhino → canonical material ID: slug pełnej ścieżki `_MATERIAL::...` (patrz `RHINO_SYNC.md`)

### Persistencja
- Lokalna (IndexedDB/localStorage via Zustand persist)
- Synchronizacja z backendem przez API dla materiałów/demands


