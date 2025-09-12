# Instrukcja dla Cursor AI: Konwersja TSX na SVG z Strukturą dla Wtyczki Figma

## **Prompt Template dla Konwersji TSX → SVG**

```markdown
# INSTRUKCJA: Konwersja React TSX Component na Structured SVG

Jesteś ekspertem w konwersji React TSX komponentów na strukturalne pliki SVG zoptymalizowane pod wtyczki Figma do importowania komponentów.

## KONTEKST PROJEKTU
- Masz komponent ProjectCard w React TypeScript
- Musisz przekonwertować go na SVG z zachowaniem struktury komponentów
- SVG musi być kompatybilny z wtyczkami Figma do automatycznej konwersji na komponenty

## WYMAGANIA STRUKTURALNE SVG

### 1. HIERARCHIA GŁÓWNYCH GRUP
```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800">
  <!-- ELEMENTS (Elementy atomowe) -->
  <g id="ELEMENTS">
    <g id="Card" class="element" data-figma-component="container"></g>
    <g id="Progress" class="element" data-figma-component="progress"></g>
    <g id="Tag" class="element" data-figma-component="tag"></g>
    <g id="Avatar" class="element" data-figma-component="avatar"></g>
    <g id="Typography" class="element" data-figma-component="text"></g>
    <g id="Button" class="element" data-figma-component="button"></g>
  </g>
  
  <!-- GROUPS (Kombinacje elementów) -->
  <g id="GROUPS">
    <g id="ProjectHeader" class="group" data-figma-component="header"></g>
    <g id="ProjectDetails" class="group" data-figma-component="details"></g>
    <g id="ProjectActions" class="group" data-figma-component="actions"></g>
  </g>
  
  <!-- COMPONENT (Kompletny komponent) -->
  <g id="COMPONENT">
    <g id="CompleteProjectCard" class="main-component" data-figma-component="project-card"></g>
  </g>
  
  <!-- COMPONENT VARIANTS -->
  <g id="VARIANTS">
    <g id="CompactProject" class="variant" data-figma-variant="compact"></g>
    <g id="DetailedProject" class="variant" data-figma-variant="detailed"></g>
  </g>
  
  <!-- ATOMIC DESIGN LEGEND -->
  <g id="ATOMIC_DESIGN_LEGEND">
    <g id="ATOM" class="legend" data-figma-category="atoms"></g>
    <g id="MOLECULE" class="legend" data-figma-category="molecules"></g>
    <g id="ORGANISM" class="legend" data-figma-category="organisms"></g>
  </g>
</svg>
```

### 2. NAMING CONVENTIONS
- Każdy element musi mieć unikalny `id` w formacie PascalCase
- Grupy logiczne używają UPPERCASE
- Komponenty atomowe używają descriptive names
- Dodaj `class` dla łatwiejszej identyfikacji typu
- Użyj `data-figma-*` atrybutów dla integracji z wtyczkami

### 3. COMPONENT PROPERTIES
Każdy komponent musi zawierać:
```xml
<g id="ComponentName" class="component-type" data-figma-component="true">
  <title>Component Description</title>
  <desc>Usage instructions and properties</desc>
  <!-- Component content -->
</g>
```

### 4. RESPONSIVE STRUCTURE
- Użyj `viewBox` dla skalowalności
- Wszystkie wymiary w jednostkach względnych
- Elementy pozycjonowane z `transform` zamiast absolutnych współrzędnych

## ZADANIA DO WYKONANIA

1. **ANALIZUJ** dołączony kod TSX ProjectCard
2. **WYODRĘBNIJ** wszystkie elementy UI (Card, Progress, Tag, Avatar, etc.)
3. **STWÓRZ** strukturę SVG zgodnie z powyższym wzorem
4. **ZAIMPLEMENTUJ** każdy element jako osobną grupę SVG
5. **DODAJ** odpowiednie metadane dla wtyczki Figma
6. **ZACHOWAJ** układy i style wizualne z originalnego komponentu

## OCZEKIWANY OUTPUT

Wygeneruj kompletny plik SVG z:
- ✅ Hierarchiczną strukturą grup
- ✅ Wszystkimi elementami ProjectCard jako osobne komponenty
- ✅ Wariantami komponentu (Compact/Detailed)
- ✅ Metadanymi dla wtyczek Figma
- ✅ Legendą Atomic Design
- ✅ Dokumentacją w komentarzach

## SPECJALNE WYMAGANIA
- SVG musi być gotowy do importu przez wtyczki Figma
- Każda grupa powinna być konwertowalna na osobny komponent Figma
- Zachowaj kolory, fonty i układy z originalnego projektu
- Dodaj `data-*` atrybuty dla lepszej integracji z narzędziami

Rozpocznij od analizy struktury TSX i wygeneruj odpowiednią strukturę SVG.
```

## **Struktura SVG Zoptymalizowana pod Wtyczki Figma**

### **1. Główny Framework SVG**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" 
     xmlns:figma="http://www.figma.com/figma/ns"
     viewBox="0 0 1200 800" 
     width="1200" 
     height="800"
     data-figma-export="structured-components">
```

### **2. Sekcja Elementów Atomowych**

```xml
<!-- ELEMENTS (Ant Design Components) -->
<g id="ELEMENTS" transform="translate(50, 50)">
  <title>Elementy atomowe - podstawowe komponenty</title>
  
  <!-- Card Container -->
  <g id="Card" class="element" data-figma-component="container">
    <desc>Główny kontener karty z zaokrąglonymi rogami</desc>
    <rect width="300" height="400" rx="8" fill="#ffffff" 
          stroke="#d9d9d9" stroke-width="1"/>
  </g>
  
  <!-- Progress Bar -->
  <g id="Progress" class="element" data-figma-component="progress">
    <desc>Pasek postępu z animacją</desc>
    <rect width="200" height="8" rx="4" fill="#f0f0f0"/>
    <rect width="120" height="8" rx="4" fill="#1890ff"/>
  </g>
  
  <!-- Typography Elements -->
  <g id="Typography" class="element" data-figma-component="text">
    <text x="0" y="20" font-family="Inter" font-size="16" font-weight="600">
      Project Title
    </text>
    <text x="0" y="45" font-family="Inter" font-size="14" fill="#666">
      Subtitle Text
    </text>
  </g>
</g>
```

### **3. Sekcja Molekuł (Groups)**

```xml
<!-- GROUPS (Element Combinations) -->
<g id="GROUPS" transform="translate(400, 50)">
  <title>Kombinacje elementów</title>
  
  <!-- Project Header -->
  <g id="ProjectHeader" class="molecule" data-figma-component="header">
    <desc>Nagłówek projektu z tytułem i statusem</desc>
    <!-- Kompozycja elementów -->
    <use href="#Card" transform="scale(0.8)"/>
    <use href="#Typography"/>
    <g id="StatusBadge" transform="translate(200, 5)">
      <rect width="60" height="24" rx="12" fill="#52c41a"/>
      <text x="30" y="16" text-anchor="middle" fill="white" font-size="12">
        Active
      </text>
    </g>
  </g>
</g>
```

### **4. Warianty Komponentu**

```xml
<!-- COMPONENT VARIANTS -->
<g id="VARIANTS" transform="translate(750, 50)">
  <title>Warianty komponentu ProjectCard</title>
  
  <!-- Compact Version -->
  <g id="CompactProject" class="variant" data-figma-variant="compact">
    <desc>Kompaktowa wersja karty projektu</desc>
    <rect width="250" height="150" rx="8" fill="#ffffff" stroke="#e8e8e8"/>
    <!-- Uproszczona zawartość -->
  </g>
  
  <!-- Detailed Version -->
  <g id="DetailedProject" class="variant" data-figma-variant="detailed">
    <desc>Szczegółowa wersja karty projektu</desc>
    <rect width="350" height="500" rx="8" fill="#ffffff" stroke="#e8e8e8"/>
    <!-- Pełna zawartość -->
  </g>
</g>
```

### **5. Metadane dla Wtyczek Figma**

```xml
<!-- FIGMA PLUGIN METADATA -->
<defs>
  <metadata id="figma-structure">
    <figma:components>
      <figma:component id="Card" type="container" category="atoms"/>
      <figma:component id="Progress" type="indicator" category="atoms"/>
      <figma:component id="Typography" type="text" category="atoms"/>
      <figma:component id="ProjectHeader" type="composite" category="molecules"/>
      <figma:component id="CompactProject" type="variant" category="organisms"/>
      <figma:component id="DetailedProject" type="variant" category="organisms"/>
    </figma:components>
    <figma:properties>
      <figma:property component="Progress" name="value" type="number" default="50"/>
      <figma:property component="Typography" name="text" type="string" default="Sample Text"/>
      <figma:property component="ProjectHeader" name="status" type="enum" values="active,inactive,pending"/>
    </figma:properties>
  </metadata>
</defs>
```

## **Zalecenia dla Wtyczek Figma**

### **1. Kompatybilne Wtyczki**
- **SVGReactify** - do konwersji SVG → React komponenty
- **Convertify** - do optymalizacji i importu SVG
- **SVG to Code: React Component** - bezpośrednia konwersja
- **Advanced SVG Export** - eksport z Figma

### **2. Struktura Nazewnictwa**
```
[Category]/[Subcategory]/[ComponentName]/[Variant]
Atoms/Interactive/Button/Primary
Molecules/Cards/ProjectCard/Compact
Organisms/Layouts/Dashboard/Default
```

### **3. Właściwości Komponentów**
- Każdy komponent powinien mieć `data-figma-*` atrybuty
- Użyj `<title>` i `<desc>` dla dokumentacji
- Dodaj `class` dla kategoryzacji (atom, molecule, organism)
- Zaimplementuj `id` w PascalCase dla łatwiejszej identyfikacji

### **4. Responsywność i Skalowalność**
```xml
<!-- Responsive container with constraints -->
<g id="ResponsiveCard" data-figma-constraints="scale">
  <rect width="100%" height="100%" fill="transparent"/>
  <!-- Content with relative positioning -->
  <g transform="translate(5%, 5%)">
    <!-- Component content -->
  </g>
</g>
```

## **Implementacja w Cursor**

### **1. Szablon Cursor Rules**
Dodaj do `.cursorrules`:
```
- When converting TSX to SVG, always create structured groups for Figma plugin compatibility
- Use semantic naming: ELEMENTS, GROUPS, VARIANTS, COMPONENT
- Include figma-specific metadata and data attributes
- Maintain visual hierarchy with proper nesting
- Add descriptive titles and descriptions for each component group
```

### **2. Przykładowy Prompt**
```
Convert this ProjectCard TSX component to structured SVG format optimized for Figma plugins:

1. Extract atomic elements (Card, Progress, Tag, Avatar, Typography, Button)
2. Create molecular groups (ProjectName, ProjectDetails) 
3. Build complete component variants (Compact, Detailed)
4. Add Figma plugin metadata with data-* attributes
5. Ensure proper scaling with viewBox and relative units
6. Include Atomic Design legend and documentation

Output should be ready for import via Figma plugins like SVGReactify or Convertify.
```

Ta struktura zapewni maksymalną kompatybilność z wtyczkami Figma, umożliwiając łatwą konwersję każdej grupy SVG na osobny komponent lub frame w Figma, zachowując przy tym hierarchię projektową i możliwość dalszej edycji.
