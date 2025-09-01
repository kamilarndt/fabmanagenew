# Moduł Magazynowy - Dokumentacja

## Przegląd

Nowy moduł magazynowy został kompletnie przeprojektowany zgodnie z najlepszymi praktykami UX/UI. System oferuje zaawansowane funkcje zarządzania materiałami z intuicyjnym interfejsem.

## Główne funkcjonalności

### 1. Hierarchiczne drzewo kategorii
- **Lokalizacja**: Lewy panel
- **Funkcje**:
  - Rozwijalne/zwijalne kategorie
  - Liczniki materiałów w każdej kategorii
  - Szybka nawigacja po strukturze materiałów
  - Wsparcie dla wielopoziomowej hierarchii (np. _M > MDF > 18mm > DO_GIECIA)

### 2. Widok kafelkowy i listowy
- **Tryb kafelkowy**:
  - Wizualne karty materiałów z kluczowymi informacjami
  - Kolorowanie według klasy ABC
  - Paski postępu stanu magazynowego
  - Przyciski szybkich akcji
- **Tryb listowy**:
  - Tabelaryczny widok z sortowaniem
  - Kompaktowe wyświetlanie dużej ilości danych
  - Inline edycja i akcje

### 3. System tagów i filtrowania
- **Dynamiczne tagi**:
  - Automatycznie generowane na podstawie danych
  - Kategorie: MDF, SKLEJKA, PLEXI, etc.
  - Właściwości: Trudnopalne, Wodoodporne, Do gięcia
  - Statusy: Krytyczne, Niskie zapasy
- **Filtry zaawansowane**:
  - Wyszukiwanie tekstowe
  - Filtr po dostawcy
  - Filtr po statusie zapasów
  - Filtr po klasie ABC

### 4. Panel krytycznych zapasów
- Dedykowana sekcja dla materiałów wymagających uzupełnienia
- Wizualne wskaźniki poziomu zapasów
- Obliczanie dni zapasu
- Przycisk szybkiego zamawiania
- Akcje zbiorcze dla wielu materiałów

### 5. Panel szczegółów materiału
- **Zakładka "Szczegóły"**:
  - Pełne informacje o materiale
  - Stan magazynowy z wizualizacją
  - Właściwości i parametry
  - Informacje o dostawcy i lokalizacji
- **Zakładka "Historia"**:
  - Timeline ruchów magazynowych
  - Przyjęcia i wydania
  - Dokumenty i użytkownicy
- **Zakładka "Analityka"**:
  - Średnie miesięczne zużycie
  - Dni zapasu
  - Trendy i wykresy
  - Metryki wydajności

### 6. Dashboard z metrykami
- Wartość magazynu
- Liczba pozycji
- Krytyczne braki
- Niskie stany
- Rozkład ABC
- Wykresy analityczne

## Struktura danych

### Kategorie materiałów
```typescript
- _M (Płyty meblowe)
  - MDF
  - SKLEJKA
  - PLYTA_WIÓROWA
  - OSB
- _PLEXI (Plexi / Akryl)
  - PLEXI_EXTRUDOWANA
  - PLEXI_LANA
- _DIBOND (Dibond / Kompozyt)
  - DIBOND
  - ALURAPID
- _ELEKTRYKA
  - LED
  - KABLE
```

### Właściwości materiałów
- Grubość (dla płyt)
- Kolor
- Wykończenie
- Trudnopalność
- Wodoodporność
- Giętkość

## Technologie

- **React** z TypeScript
- **Bootstrap 5** dla stylów
- **React Router** dla nawigacji
- **React DnD** dla drag & drop (przyszłe funkcje)

## Responsywność

System jest w pełni responsywny:
- Na urządzeniach mobilnych drzewo kategorii chowa się do hamburger menu
- Karty materiałów dostosowują się do szerokości ekranu
- Panel szczegółów zajmuje pełną szerokość na małych ekranach

## Planowane rozszerzenia

1. **Integracja z systemem zamówień**
2. **Automatyczne powiadomienia o niskich stanach**
3. **Import/Export danych (Excel, CSV)**
4. **Kody kreskowe i QR**
5. **Mapa magazynu z lokalizacjami**
6. **Prognozy zapotrzebowania**
7. **Integracja z API dostawców**

## Użytkowanie

1. **Nawigacja**: Użyj drzewa kategorii po lewej stronie
2. **Wyszukiwanie**: Wpisz kod, nazwę lub dostawcę w pole wyszukiwania
3. **Filtrowanie**: Kliknij na tagi lub użyj dropdownów
4. **Szczegóły**: Kliknij na kartę/wiersz materiału
5. **Zamawianie**: Użyj przycisków "Zamów" dla materiałów poniżej minimum

## Konfiguracja

Dane materiałów znajdują się w pliku:
```
src/data/materialsMockData.ts
```

Style CSS w:
```
src/styles/magazyn.css
```