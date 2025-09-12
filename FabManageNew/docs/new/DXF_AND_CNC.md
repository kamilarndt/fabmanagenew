## DXF i CNC — obsługa i kalkulacje

### Podgląd i warstwy
- `components/DxfPreview.tsx` — szybki podgląd
- `components/DxfFullscreenModal.tsx` — pełnoekranowy viewer z listą warstw
  - Obsługa: włącz/wyłącz warstwy, dopasowanie widoku (fit extents), Esc zamyka

### Mapowanie operacji (warstwa → operacja)
- `lib/dxfConfig.ts`:
  - Typy operacji: `cut` | `mill` | `drill` | `ignore`
  - Parametry: prędkości, głębokości, czasy przygotowania/obsługi
  - Funkcja `resolveOperation(layerName)` — określa operację dla danej warstwy

### Kalkulacja czasu produkcji
- `lib/ProductionTimeCalculator.ts`:
  - Parsowanie długości ścieżek: line/polyline/circle/arc
  - Sumowanie długości tras cięcia/frezowania
  - Wykrywanie wierceń (średnice w nazwach warstw)
  - Wynik: czasy cięcia/frezowania/wierceń, łączny czas maszyny i projektu

### Przykładowy przepływ
1. Użytkownik dodaje plik DXF do kafelka (Tile)
2. Otwiera `DxfFullscreenModal` → sprawdza warstwy
3. Aplikacja mapuje warstwy → operacje (konfigurowalne)
4. Kalkulator estymuje czas produkcji do wyceny/planowania

### Dobre praktyki DXF
- Spójne nazwy warstw (prefiksy typu `CUT_`, `DRILL_`)
- Usuwanie zbędnych elementów/duplikatów przed importem
- Weryfikacja jednostek i skali


