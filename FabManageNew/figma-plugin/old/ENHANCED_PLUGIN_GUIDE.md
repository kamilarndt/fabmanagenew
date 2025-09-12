# Enhanced Figma Plugin - FabManage Component Generator

## Przegląd

Ulepszony plugin Figma do generowania komponentów z plików SVG z pełnym wsparciem dla:
- Zaawansowanego parsowania SVG
- Systemu layoutu (Flexbox)
- Stylowania tekstu i kolorów
- Hierarchii Atomic Design
- Automatycznego rozmiarowania

## Nowe Funkcje

### 1. Zaawansowany Parser SVG

Plugin teraz obsługuje:
- **Wszystkie elementy SVG**: rect, circle, ellipse, path, line, text, group
- **Parsowanie kolorów**: hex (#fff, #ffffff), rgb(), rgba(), nazwy kolorów
- **Gradienty**: Podstawowe wsparcie z fallback na kolory stałe
- **Ścieżki SVG**: Automatyczne obliczanie wymiarów z path data
- **Style CSS**: Parsowanie atrybutów style z CSS

### 2. System Layoutu

#### Atrybuty Layoutu
```svg
<g data-layout="flex-row" data-spacing="12" data-padding="16">
  <!-- Elementy w układzie poziomym -->
</g>

<g data-layout="flex-column" data-spacing="8">
  <!-- Elementy w układzie pionowym -->
</g>
```

#### Obsługiwane Tryby Layoutu
- `flex-row` → `HORIZONTAL` w Figma
- `flex-column` → `VERTICAL` w Figma
- `grid` → `NONE` (z fallback na pozycjonowanie)

#### Atrybuty Spacing
- `data-spacing` - odstępy między elementami
- `data-padding-left/right/top/bottom` - padding wewnętrzny

### 3. Stylowanie Tekstu

#### Wsparcie dla Fontów
```svg
<text font-family="Arial, sans-serif" font-size="16" font-weight="bold">
  Tekst z pełnym stylowaniem
</text>
```

#### Mapowanie Fontów
- Arial, Helvetica → Arial
- Times New Roman, Times → Times New Roman
- Courier New, Courier → Courier New
- Inne → Arial (fallback)

#### Właściwości Tekstu
- `font-size` - rozmiar czcionki
- `font-weight` - grubość (bold, light, normal)
- `text-anchor` - wyrównanie (middle, start, end)
- `fill` - kolor tekstu

### 4. Atomic Design Hierarchy

#### Klasyfikacja Komponentów
```svg
<g class="atom" id="button">...</g>        <!-- Atom -->
<g class="molecule" id="search-bar">...</g> <!-- Molecule -->
<g class="organism" id="project-card">...</g> <!-- Organism -->
```

#### Automatyczne Foldery
- ⚛️ Atoms - podstawowe elementy UI
- 🧬 Molecules - kompozycje atomów
- 🦠 Organisms - złożone komponenty

### 5. Warianty Komponentów

#### Automatyczne Warianty
- **Atoms**: Hover, Disabled
- **Molecules**: Small, Large
- **Organisms**: Default, Hover, Active, Disabled
- **ProjectCard**: Default, Hover, Selected, Loading

## Przykład Użycia

### Struktura SVG
```svg
<?xml version="1.0" encoding="UTF-8"?>
<svg width="800" height="600">
  <!-- Organism -->
  <g id="project-card" class="organism" data-layout="flex-column" data-spacing="16">
    
    <!-- Molecule -->
    <g id="card-header" class="molecule" data-layout="flex-row" data-spacing="8">
      
      <!-- Atom -->
      <g id="title" class="atom">
        <text font-family="Arial" font-size="16" font-weight="bold" fill="#333">
          Project Title
        </text>
      </g>
      
      <!-- Atom -->
      <g id="status-badge" class="atom">
        <rect width="60" height="20" fill="#52c41a" rx="10"/>
        <text font-size="10" fill="white">Active</text>
      </g>
      
    </g>
    
  </g>
</svg>
```

### Rezultat w Figma
1. **Folder Structure**: Komponenty zostaną zorganizowane w foldery Atomic Design
2. **Layout**: Automatyczne ustawienie layoutu flexbox
3. **Styling**: Pełne zachowanie kolorów, fontów i rozmiarów
4. **Variants**: Automatyczne tworzenie wariantów stanów
5. **Documentation**: Szczegółowe opisy i przykłady użycia

## Najlepsze Praktyki

### 1. Struktura SVG
- Używaj semantycznych ID i klas
- Grupuj elementy logicznie
- Dodawaj atrybuty layoutu dla lepszego układu

### 2. Naming Convention
```svg
<!-- Dobrze -->
<g id="project-card" class="organism">
<g id="card-header" class="molecule">
<g id="title-text" class="atom">

<!-- Źle -->
<g id="group1">
<g id="rect2">
```

### 3. Layout Attributes
```svg
<!-- Poziomy układ -->
<g data-layout="flex-row" data-spacing="12">

<!-- Pionowy układ -->
<g data-layout="flex-column" data-spacing="8">

<!-- Z paddingiem -->
<g data-layout="flex-column" data-padding="16">
```

### 4. Stylowanie
```svg
<!-- Kolory -->
<rect fill="#1890ff" stroke="#d9d9d9" stroke-width="1"/>

<!-- Tekst -->
<text font-family="Arial" font-size="14" font-weight="bold" fill="#333">
```

## Rozwiązywanie Problemów

### Puste Komponenty
- Sprawdź czy SVG ma poprawną strukturę grup
- Upewnij się, że elementy mają odpowiednie atrybuty
- Sprawdź czy parser może odczytać wymiary

### Problemy z Layoutem
- Użyj atrybutów `data-layout` dla lepszego układu
- Sprawdź czy grupy mają odpowiednie klasy
- Upewnij się, że spacing jest ustawiony poprawnie

### Problemy z Kolorami
- Używaj formatów hex (#fff) lub rgb()
- Sprawdź czy kolory nie są ustawione na "none"
- Upewnij się, że parser może rozpoznać format koloru

## Roadmap

### Planowane Funkcje
- [ ] Wsparcie dla gradientów liniowych
- [ ] Automatyczne wykrywanie layoutu na podstawie pozycji
- [ ] Eksport do React/TypeScript
- [ ] Wsparcie dla animacji
- [ ] Integracja z design tokens

### Znane Ograniczenia
- Gradienty są konwertowane na kolory stałe
- Złożone ścieżki SVG są upraszczane do prostokątów
- Grid layout nie jest bezpośrednio obsługiwany
- Ograniczone wsparcie dla fontów (tylko podstawowe)

## Wsparcie

W przypadku problemów:
1. Sprawdź logi w konsoli Figma
2. Upewnij się, że SVG jest poprawnie sformatowany
3. Sprawdź czy wszystkie wymagane atrybuty są obecne
4. Skontaktuj się z zespołem deweloperskim
