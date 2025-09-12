# FabManage Design System Generator - Figma Plugin

Wtyczka Figma do automatycznego generowania komponentów design systemu na podstawie analizy atomic design komponentów React z aplikacji FabManage.

## 🚀 Funkcje

- **Automatyczna analiza atomic design** - analizuje komponenty React i identyfikuje atomy, molekuły i organizmy
- **Generowanie zmiennych Figma** - tworzy zmienne kolorów, typografii, spacing i border radius
- **Dokładne odwzorowanie Ant Design** - wykorzystuje gotowe komponenty Ant Design z aplikacji
- **Zachowanie nazewnictwa** - używa identycznych nazw i struktur jak w aplikacji
- **Generowanie komponentów** - tworzy ProjectCard, ProjectElements i inne komponenty z aplikacji

## 📦 Instalacja

1. **Sklonuj repozytorium:**
   ```bash
   git clone <repository-url>
   cd FabManageNew/figma-plugin
   ```

2. **Zainstaluj zależności:**
   ```bash
   npm install
   ```

3. **Skompiluj TypeScript:**
   ```bash
   npm run build
   ```

4. **Zaimportuj do Figmy:**
   - Otwórz Figma Desktop App
   - Kliknij prawym przyciskiem na canvas → `Plugins` → `Development` → `Import plugin from manifest...`
   - Wybierz plik `manifest.json` z tego folderu

## 🎯 Użycie

### 1. Generowanie ProjectCard

```typescript
// W UI wtyczki wybierz "Project Card" i wypełnij dane:
{
  name: "Sample Project",
  numer: "PRJ-001", 
  status: "nowy",
  typ: "Targi",
  lokalizacja: "Warszawa",
  client: "Sample Client",
  deadline: "2024-12-31",
  progress: 50,
  modules: ["projektowanie", "produkcja"],
  tilesCount: 10,
  manager: "John Doe"
}
```

### 2. Generowanie ProjectElements

```typescript
// Wtyczka automatycznie generuje:
// - Kanban board z kolumnami statusów
// - TileCard komponenty
// - Grupy projektów
// - Formularze dodawania elementów
```

### 3. Generowanie Design System

```typescript
// Tworzy kompletny design system z:
// - Wszystkimi atomami (Button, Text, Badge, Progress, Avatar)
// - Molekułami (Card, Form, Input, Space)
// - Organizmami (ProjectCard, ProjectElements)
// - Paletą kolorów
// - Skalą typograficzną
// - Spacing systemem
```

## 🏗️ Architektura

### Struktura plików

```
figma-plugin/
├── manifest.json                 # Konfiguracja wtyczki
├── code.ts                      # Główna logika wtyczki
├── ui.html                      # Interface użytkownika
├── package.json                 # Zależności npm
├── tsconfig.json               # Konfiguracja TypeScript
└── src/
    ├── types/
    │   └── atomic-design.ts     # Typy atomic design
    ├── config/
    │   ├── design-system.ts     # Konfiguracja design systemu
    │   └── antd-design-system.ts # Zmienne Figma
    ├── analyzers/
    │   └── component-analyzer.ts # Analizator komponentów
    └── generators/
        ├── atom-generators.ts   # Generatory atomów
        ├── molecule-generators.ts # Generatory molekuł
        ├── organism-generators.ts # Generatory organizmów
        ├── antd-component-generators.ts # Komponenty Ant Design
        ├── fabmanage-component-generators.ts # Komponenty FabManage
        └── design-system-generator.ts # Generator design systemu
```

### Atomic Design Mapping

| Poziom        | Komponenty                                              | Opis                      |
| ------------- | ------------------------------------------------------- | ------------------------- |
| **Atomy**     | Button, Text, Badge, Progress, Avatar, Icon, Tag, Space | Podstawowe elementy UI    |
| **Molekuły**  | Card, Form, Input, Project Thumbnail, Project Content   | Złożone elementy z atomów |
| **Organizmy** | ProjectCard, ProjectElements, Kanban Column, TileCard   | Kompleksowe komponenty    |

## 🎨 Design System

### Kolory

Wtyczka tworzy zmienne kolorów zgodne z aplikacją:

```typescript
// Podstawowe kolory
primary: #3399ff
secondary: #999999
success: #33cc4d
warning: #ffb333
error: #e63333

// Kolory tekstu
text-primary: #1a1a1a
text-secondary: #666666
text-disabled: #999999

// Kolory tła
background-primary: #ffffff
background-secondary: #fafafa
background-tertiary: #f2f2f2

// Kolory obramowań
border-primary: #e6e6e6
border-secondary: #cccccc
```

### Typografia

```typescript
// Rozmiary czcionek
font-size-xs: 10px
font-size-sm: 12px
font-size-base: 14px
font-size-lg: 16px
font-size-xl: 18px
font-size-2xl: 24px
font-size-3xl: 28px
font-size-4xl: 36px

// Wysokości linii
line-height-xs: 14px
line-height-sm: 16px
line-height-base: 20px
line-height-lg: 24px
line-height-xl: 28px
line-height-2xl: 32px
line-height-3xl: 36px
line-height-4xl: 44px
```

### Spacing

```typescript
spacing-xs: 4px
spacing-sm: 8px
spacing-md: 12px
spacing-lg: 16px
spacing-xl: 24px
spacing-xxl: 32px
```

### Border Radius

```typescript
border-radius-sm: 4px
border-radius-md: 8px
border-radius-lg: 12px
border-radius-xl: 16px
```

## 🔧 Rozwój

### Skrypty npm

```bash
npm run build      # Kompilacja TypeScript
npm run watch      # Watch mode dla development
npm run dev        # Development z watch mode
```

### Debugging

1. **Otwórz Dev Tools w Figmie:**
   - `Plugins` → `Development` → `Open Console`

2. **Debug UI:**
   - F12 w iframe wtyczki

3. **Logi:**
   - Wszystkie logi są wyświetlane w konsoli Figmy

### Dodawanie nowych komponentów

1. **Dodaj typ w `atomic-design.ts`**
2. **Zaimplementuj generator w odpowiednim pliku**
3. **Dodaj do `component-analyzer.ts`**
4. **Zaktualizuj UI w `ui.html`**

## 📋 Komponenty

### ProjectCard

Generuje kartę projektu z:
- Miniaturą projektu
- Nazwą i numerem projektu
- Statusem (badge)
- Typem projektu (tag)
- Lokalizacją
- Informacjami o kliencie i deadline
- Paskiem postępu
- Listą modułów
- Liczbą elementów
- Informacjami o managerze

### ProjectElements

Generuje interfejs elementów projektu z:
- Formularzem szybkiego dodawania
- Kanban board z kolumnami statusów
- TileCard komponentami
- Sekcją grup
- Przyciskami akcji

### Design System

Tworzy kompletny design system z:
- Wszystkimi atomami i ich wariantami
- Molekułami i ich wariantami
- Organizmami
- Paletą kolorów
- Skalą typograficzną
- Spacing systemem

## 🚀 Wdrożenie

1. **Testuj wtyczkę** w różnych scenariuszach
2. **Optymalizuj wydajność** dla dużych projektów
3. **Dodaj error handling** dla edge cases
4. **Napisz dokumentację** dla użytkowników
5. **Opublikuj** w Figma Community

## 📝 Licencja

MIT License - zobacz plik LICENSE dla szczegółów.

## 🤝 Współpraca

1. Fork repozytorium
2. Utwórz branch dla nowej funkcji
3. Commit zmiany
4. Push do branch
5. Utwórz Pull Request

## 📞 Wsparcie

W przypadku problemów:
1. Sprawdź logi w konsoli Figmy
2. Sprawdź czy wszystkie zmienne są utworzone
3. Sprawdź czy czcionki są załadowane
4. Utwórz issue w repozytorium
