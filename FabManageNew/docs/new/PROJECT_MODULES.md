## Moduły projektowe

### Wycena (Estimate)
- Funkcje: dobór materiałów, pozycje, stawki robocizny, rabaty, PDF
- Pliki: `modules/Estimate/*`, store: `stores/estimateStore.ts`, API: `api/estimate.ts`

### Koncepcja (Concept)
- Funkcje: pliki, tworzenie tablic Miro, pełnoekranowy embed
- Pliki: `modules/Concept/*`, store: `stores/conceptStore.ts`, API: `api/concept.ts`

### Projektowanie techniczne
- Wykorzystuje istniejący kanban elementów
- Pliki: `components/Kanban/*`, `components/Project/ProjectElements.tsx`

### Produkcja (CNC)
- Kolejka zleceń, statusy, drag&drop
- Pliki: `pages/CNC.tsx`, DXF: `components/Dxf*`, `lib/ProductionTimeCalculator.ts`

### Materiały
- PR/Quotes/Reservations/Deliveries — store `materialsStore`
- Widoki magazynu: `pages/Magazyn.tsx`/`MagazynNew.tsx`, komponenty `components/Magazyn/*`
- API: `api/materials.ts`, `api/demands.ts`

### Logistyka i montaż
- Packing lists, trasy, instalacje, punch list, sign-off
- Pliki: `modules/Logistics/*`, store: `stores/logisticsStore.ts`

### Zakwaterowanie
- Rezerwacje hotelowe, statusy, koszty, notatki
- Pliki: `modules/Accommodation/*`, store: `stores/accommodationStore.ts`


