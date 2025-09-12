# Testing Guide - SVG to Components Converter

## ✅ Wtyczka została pomyślnie zbudowana!

### 📁 Struktura plików:
```
svg-to-components-plugin/
├── dist/
│   ├── code.js          # Główny kod wtyczki (6.3 KB)
│   ├── ui.html          # Interfejs użytkownika (5.1 KB)
│   ├── ui.js            # Logika UI (9.3 KB)
│   └── *.js.map         # Source maps dla debugowania
├── src/
│   ├── code.ts          # Kod źródłowy wtyczki
│   ├── ui.ts            # Kod źródłowy UI
│   └── ui.html          # Template UI
├── manifest.json        # Manifest wtyczki (poprawiony)
├── package.json         # Zależności
├── sample-project-card.svg  # Przykładowy SVG do testów
└── README.md           # Dokumentacja
```

## 🚀 Instrukcje instalacji w Figma

### 1. Otwórz Figma Desktop App
- Upewnij się, że używasz aplikacji desktop, nie wersji web

### 2. Zaimportuj wtyczkę
1. Przejdź do **Plugins** → **Development** → **Import plugin from manifest**
2. Wybierz plik `manifest.json` z katalogu `svg-to-components-plugin/`
3. Wtyczka zostanie dodana do listy wtyczek

### 3. Uruchom wtyczkę
1. Przejdź do **Plugins** → **SVG to Components Converter**
2. Kliknij na wtyczkę, aby ją uruchomić
3. Interfejs wtyczki powinien się otworzyć

## 🧪 Testowanie wtyczki

### Test 1: Użycie przykładowego SVG
1. **Załaduj przykładowy SVG:**
   - Kliknij "Load SVG File"
   - Wybierz `sample-project-card.svg`
   - Lub skopiuj zawartość pliku i wklej do textarea

2. **Analizuj strukturę:**
   - Kliknij "Analyze SVG Structure"
   - Sprawdź czy wszystkie komponenty zostały wykryte:
     - **ELEMENTS**: Card, Progress, Tag, Avatar, Space, Typography, Button
     - **GROUPS**: ProjectHeader, ProjectMeta, ProjectInfo
     - **VARIANTS**: CompactProject, DetailedProject

3. **Utwórz komponenty:**
   - Zaznacz wszystkie komponenty (lub wybrane)
   - Kliknij "Create Components"
   - Sprawdź postęp w sekcji Progress

4. **Sprawdź wyniki:**
   - Przejdź do strony "SVG Components" w Figma
   - Sprawdź czy komponenty zostały utworzone
   - Sprawdź czy warianty zostały połączone w Component Sets

### Test 2: Własny SVG
1. **Przygotuj SVG zgodnie ze strukturą:**
   ```xml
   <svg xmlns="http://www.w3.org/2000/svg">
     <g id="ELEMENTS">
       <g id="MyElement" class="element" data-figma-component="container">
         <!-- Zawartość elementu -->
       </g>
     </g>
     <g id="GROUPS">
       <g id="MyGroup" class="group" data-figma-component="header">
         <!-- Zawartość grupy -->
       </g>
     </g>
     <g id="VARIANTS">
       <g id="MyVariant" class="variant" data-figma-variant="compact">
         <!-- Zawartość wariantu -->
       </g>
     </g>
   </svg>
   ```

2. **Testuj konwersję:**
   - Wklej SVG do wtyczki
   - Przeanalizuj strukturę
   - Utwórz komponenty

## 🔍 Weryfikacja wyników

### Sprawdź utworzone komponenty:
1. **Strona "SVG Components":**
   - Powinna zostać utworzona nowa strona
   - Komponenty powinny być zorganizowane w siatce

2. **Komponenty atomowe:**
   - `Atom/Card` - kontener karty
   - `Atom/Progress` - pasek postępu
   - `Atom/Tag` - etykieta
   - `Atom/Avatar` - awatar użytkownika
   - `Atom/Space` - element układu
   - `Atom/Typography` - elementy tekstowe
   - `Atom/Button` - przycisk

3. **Komponenty molekularne:**
   - `Molecule/ProjectHeader` - nagłówek projektu
   - `Molecule/ProjectMeta` - meta informacje
   - `Molecule/ProjectInfo` - informacje o projekcie

4. **Warianty:**
   - `ProjectCard Variants` - zestaw wariantów
   - `Variant/CompactProject` - wersja kompaktowa
   - `Variant/DetailedProject` - wersja szczegółowa

### Sprawdź właściwości komponentów:
1. **Progress**: Właściwość `value` (0-100)
2. **Typography**: Właściwość `text` (string)
3. **Tag**: Właściwość `color` (variant)
4. **Button**: Właściwość `variant` (primary/secondary/text)

## 🐛 Rozwiązywanie problemów

### Problem: "No components detected"
**Rozwiązanie:**
- Sprawdź czy SVG ma poprawną strukturę
- Upewnij się, że grupy mają poprawne `id` (ELEMENTS, GROUPS, VARIANTS)
- Sprawdź czy elementy mają `class` attributes

### Problem: "Conversion failed"
**Rozwiązanie:**
- Otwórz konsolę Figma (F12)
- Sprawdź błędy w konsoli
- Upewnij się, że SVG jest poprawny

### Problem: "Plugin not loading"
**Rozwiązanie:**
- Sprawdź czy używasz Figma Desktop App
- Sprawdź czy `manifest.json` jest poprawny
- Spróbuj ponownie zaimportować wtyczkę

### Problem: "Components not organized"
**Rozwiązanie:**
- Sprawdź czy została utworzona strona "SVG Components"
- Sprawdź czy komponenty są na tej stronie
- Sprawdź czy nie ma błędów w konsoli

## 📊 Oczekiwane wyniki

Po pomyślnej konwersji powinieneś zobaczyć:

- ✅ **7 komponentów atomowych** (Card, Progress, Tag, Avatar, Space, Typography, Button)
- ✅ **3 komponenty molekularne** (ProjectHeader, ProjectMeta, ProjectInfo)
- ✅ **1 zestaw wariantów** (ProjectCard Variants)
- ✅ **2 warianty** (CompactProject, DetailedProject)
- ✅ **Właściwości komponentów** ustawione automatycznie
- ✅ **Organizacja w siatce** na stronie "SVG Components"

## 🎯 Następne kroki

1. **Testuj z własnymi SVG** - stwórz SVG zgodnie ze strukturą
2. **Dostosuj właściwości** - edytuj `setupComponentProperties` w `code.ts`
3. **Rozszerz funkcjonalność** - dodaj nowe typy komponentów
4. **Udostępnij wtyczkę** - opublikuj w Figma Community

## 📞 Wsparcie

Jeśli napotkasz problemy:
1. Sprawdź konsolę Figma (F12)
2. Sprawdź logi wtyczki w sekcji Progress
3. Użyj przykładowego SVG do testów
4. Sprawdź dokumentację w README.md

---

**Wtyczka jest gotowa do użycia! 🎉**
