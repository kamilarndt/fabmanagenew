# Przewodnik tworzenia wtyczek Figma

## Spis treści
1. [Wprowadzenie](#wprowadzenie)
2. [Architektura wtyczek Figma](#architektura-wtyczek-figma)
3. [Elementy, które można tworzyć](#elementy-które-można-tworzyć)
4. [Przykłady kodu](#przykłady-kodu)
5. [Najlepsze praktyki](#najlepsze-praktyki)
6. [Zasoby i narzędzia](#zasoby-i-narzędzia)

## Wprowadzenie

Wtyczki Figma to potężne narzędzia, które pozwalają na rozszerzenie funkcjonalności Figma poprzez automatyzację zadań, tworzenie nowych elementów i integrację z zewnętrznymi usługami. Wtyczki są napisane w JavaScript/TypeScript i mogą mieć interfejs użytkownika w HTML/CSS/JS.

### Kluczowe możliwości wtyczek:
- **Manipulacja warstwami**: Tworzenie, modyfikacja i usuwanie elementów
- **Automatyzacja**: Wykonywanie powtarzalnych zadań
- **Integracja**: Połączenie z zewnętrznymi API i usługami
- **Generowanie treści**: Tworzenie diagramów, wykresów, dokumentacji
- **Analiza**: Przetwarzanie i analiza danych projektowych

## Architektura wtyczek Figma

### Struktura plików
```
my-plugin/
├── manifest.json          # Konfiguracja wtyczki
├── code.js               # Główna logika wtyczki
├── ui.html               # Interfejs użytkownika (opcjonalny)
├── package.json          # Zależności (opcjonalny)
└── tsconfig.json         # Konfiguracja TypeScript (opcjonalny)
```

### Komunikacja między komponentami
- **code.js**: Działa w kontekście Figma, ma dostęp do API
- **ui.html**: Działa w iframe, komunikuje się z code.js przez postMessage
- **Manifest**: Definiuje uprawnienia i konfigurację wtyczki

## Elementy, które można tworzyć

### 1. Podstawowe kształty

#### Prostokąty
```typescript
const rect = figma.createRectangle();
rect.x = 100;
rect.y = 100;
rect.resize(200, 100);
rect.fills = [{ type: 'SOLID', color: { r: 0.2, g: 0.5, b: 1 } }];
rect.cornerRadius = 8;
figma.currentPage.appendChild(rect);
```

#### Elipsy i koła
```typescript
const ellipse = figma.createEllipse();
ellipse.x = 100;
ellipse.y = 100;
ellipse.resize(100, 100);
ellipse.fills = [{ type: 'SOLID', color: { r: 1, g: 0.5, b: 0.2 } }];
figma.currentPage.appendChild(ellipse);
```

#### Linie
```typescript
const line = figma.createLine();
line.x = 100;
line.y = 100;
line.resize(200, 0);
line.strokes = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }];
line.strokeWeight = 2;
figma.currentPage.appendChild(line);
```

### 2. Tekst

```typescript
const text = figma.createText();
text.x = 100;
text.y = 100;
text.characters = "Hello, Figma!";
text.fontSize = 24;
text.fontName = { family: "Inter", style: "Bold" };
text.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }];
figma.currentPage.appendChild(text);
```

### 3. Ramki i kontenery

```typescript
const frame = figma.createFrame();
frame.name = "My Frame";
frame.x = 100;
frame.y = 100;
frame.resize(300, 200);
frame.layoutMode = "VERTICAL";
frame.primaryAxisSizingMode = "AUTO";
frame.counterAxisSizingMode = "AUTO";
frame.itemSpacing = 16;
frame.paddingLeft = 24;
frame.paddingRight = 24;
frame.paddingTop = 24;
frame.paddingBottom = 24;
figma.currentPage.appendChild(frame);
```

### 4. Komponenty

```typescript
// Tworzenie komponentu
const component = figma.createComponent();
component.name = "Button";
component.resize(120, 40);
component.fills = [{ type: 'SOLID', color: { r: 0.2, g: 0.5, b: 1 } }];

// Tworzenie instancji komponentu
const instance = component.createInstance();
instance.x = 100;
instance.y = 100;
figma.currentPage.appendChild(instance);
```

### 5. Warianty komponentów

```typescript
// Tworzenie wariantów
const primaryVariant = component.createVariant();
primaryVariant.name = "Primary";
primaryVariant.fills = [{ type: 'SOLID', color: { r: 0.2, g: 0.5, b: 1 } }];

const secondaryVariant = component.createVariant();
secondaryVariant.name = "Secondary";
secondaryVariant.fills = [{ type: 'SOLID', color: { r: 0.8, g: 0.8, b: 0.8 } }];
```

### 6. Grupy i hierarchie

```typescript
const group = figma.group([rect, text], figma.currentPage);
group.name = "Button Group";
```

### 7. Ścieżki i kształty złożone

```typescript
const vector = figma.createVector();
// Konfiguracja ścieżki vector
vector.vectorPaths = [{
  windingRule: "NONZERO",
  data: "M 0 0 L 100 0 L 100 100 L 0 100 Z"
}];
vector.fills = [{ type: 'SOLID', color: { r: 1, g: 0, b: 0 } }];
figma.currentPage.appendChild(vector);
```

### 8. Obrazy

```typescript
// Wstawianie obrazu z URL
const image = figma.createImage();
const imageHash = figma.createImageFromBytes(imageBytes);
image.fills = [{
  type: 'IMAGE',
  imageHash: imageHash,
  scaleMode: 'FIT'
}];
```

## Przykłady kodu

### Tworzenie wykresu słupkowego

```typescript
function createBarChart(data: number[], labels: string[]) {
  const chartFrame = figma.createFrame();
  chartFrame.name = "Bar Chart";
  chartFrame.layoutMode = "HORIZONTAL";
  chartFrame.itemSpacing = 8;
  chartFrame.paddingAll = 24;
  
  const maxValue = Math.max(...data);
  
  data.forEach((value, index) => {
    const bar = figma.createRectangle();
    const height = (value / maxValue) * 200;
    bar.resize(40, height);
    bar.fills = [{ type: 'SOLID', color: { r: 0.2, g: 0.5, b: 1 } }];
    
    const label = figma.createText();
    label.characters = labels[index];
    label.fontSize = 12;
    label.textAlignHorizontal = "CENTER";
    
    const barGroup = figma.createFrame();
    barGroup.layoutMode = "VERTICAL";
    barGroup.itemSpacing = 4;
    barGroup.appendChild(bar);
    barGroup.appendChild(label);
    
    chartFrame.appendChild(barGroup);
  });
  
  figma.currentPage.appendChild(chartFrame);
  return chartFrame;
}
```

### Tworzenie diagramu przepływu

```typescript
function createFlowDiagram(steps: string[]) {
  const diagramFrame = figma.createFrame();
  diagramFrame.name = "Flow Diagram";
  diagramFrame.layoutMode = "HORIZONTAL";
  diagramFrame.itemSpacing = 40;
  diagramFrame.paddingAll = 24;
  
  const shapes = [];
  
  steps.forEach((step, index) => {
    // Tworzenie kształtu kroku
    const shape = figma.createRectangle();
    shape.resize(120, 60);
    shape.cornerRadius = 8;
    shape.fills = [{ type: 'SOLID', color: { r: 0.9, g: 0.9, b: 0.9 } }];
    
    // Dodawanie tekstu
    const text = figma.createText();
    text.characters = step;
    text.fontSize = 14;
    text.textAlignHorizontal = "CENTER";
    text.textAlignVertical = "CENTER";
    
    const stepGroup = figma.createFrame();
    stepGroup.layoutMode = "VERTICAL";
    stepGroup.appendChild(shape);
    stepGroup.appendChild(text);
    
    diagramFrame.appendChild(stepGroup);
    shapes.push(shape);
    
    // Dodawanie strzałki między krokami
    if (index < steps.length - 1) {
      const arrow = figma.createLine();
      arrow.resize(40, 0);
      arrow.strokes = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }];
      arrow.strokeWeight = 2;
      diagramFrame.appendChild(arrow);
    }
  });
  
  figma.currentPage.appendChild(diagramFrame);
  return diagramFrame;
}
```

### Tworzenie systemu kolorów

```typescript
function createColorSystem(colors: { name: string, hex: string }[]) {
  const colorFrame = figma.createFrame();
  colorFrame.name = "Color System";
  colorFrame.layoutMode = "VERTICAL";
  colorFrame.itemSpacing = 16;
  colorFrame.paddingAll = 24;
  
  colors.forEach(color => {
    const colorGroup = figma.createFrame();
    colorGroup.layoutMode = "HORIZONTAL";
    colorGroup.itemSpacing = 12;
    colorGroup.resize(200, 40);
    
    // Próbka koloru
    const colorSwatch = figma.createRectangle();
    colorSwatch.resize(40, 40);
    colorSwatch.fills = [{ type: 'SOLID', color: hexToRgb(color.hex) }];
    
    // Nazwa koloru
    const colorName = figma.createText();
    colorName.characters = color.name;
    colorName.fontSize = 14;
    
    // Wartość hex
    const hexValue = figma.createText();
    hexValue.characters = color.hex;
    hexValue.fontSize = 12;
    hexValue.fills = [{ type: 'SOLID', color: { r: 0.5, g: 0.5, b: 0.5 } }];
    
    colorGroup.appendChild(colorSwatch);
    colorGroup.appendChild(colorName);
    colorGroup.appendChild(hexValue);
    
    colorFrame.appendChild(colorGroup);
  });
  
  figma.currentPage.appendChild(colorFrame);
  return colorFrame;
}

function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16) / 255,
    g: parseInt(result[2], 16) / 255,
    b: parseInt(result[3], 16) / 255
  } : { r: 0, g: 0, b: 0 };
}
```

## Najlepsze praktyki

### 1. Zarządzanie błędami
```typescript
try {
  const rect = figma.createRectangle();
  // Operacje na prostokącie
} catch (error) {
  console.error('Błąd podczas tworzenia prostokąta:', error);
  figma.notify('Wystąpił błąd podczas tworzenia elementu', { error: true });
}
```

### 2. Optymalizacja wydajności
```typescript
// Używanie batch operations
figma.currentPage.appendChild(rect1);
figma.currentPage.appendChild(rect2);
figma.currentPage.appendChild(rect3);

// Zamiast wielokrotnych wywołań
const elements = [rect1, rect2, rect3];
elements.forEach(element => {
  figma.currentPage.appendChild(element);
});
```

### 3. Responsywność
```typescript
// Pokazywanie postępu dla długich operacji
function processLargeDataset(data: any[]) {
  const total = data.length;
  let processed = 0;
  
  for (const item of data) {
    // Przetwarzanie elementu
    processItem(item);
    processed++;
    
    // Aktualizacja postępu co 10 elementów
    if (processed % 10 === 0) {
      figma.notify(`Przetworzono ${processed}/${total} elementów`);
    }
  }
}
```

### 4. Walidacja danych
```typescript
function validateInput(data: any): boolean {
  if (!data || typeof data !== 'object') {
    figma.notify('Nieprawidłowe dane wejściowe', { error: true });
    return false;
  }
  
  if (!Array.isArray(data.values) || data.values.length === 0) {
    figma.notify('Brak danych do przetworzenia', { error: true });
    return false;
  }
  
  return true;
}
```

## Zasoby i narzędzia

### Oficjalne repozytoria
- **[plugin-samples](https://github.com/figma/plugin-samples)**: Przykłady wtyczek demonstrujące różne możliwości API
- **[plugin-typings](https://github.com/figma/plugin-typings)**: Definicje typów TypeScript dla API Figma
- **[plugin-resources](https://github.com/figma/plugin-resources)**: Otwarte zasoby i narzędzia dla wtyczek

### Przykładowe wtyczki z repozytoriów

#### 1. Bar Chart (barchart/)
- Tworzy wykresy słupkowe z danych wejściowych
- Obsługuje customizację kolorów i etykiet
- Demonstruje tworzenie złożonych układów

#### 2. Pie Chart (piechart/)
- Generuje wykresy kołowe
- Pokazuje pracę z kątami i geometrią
- Przykład interaktywnego UI

#### 3. Icon Drag and Drop (icon-drag-and-drop/)
- Umożliwia przeciąganie ikon z zewnętrznych źródeł
- Demonstruje obsługę zdarzeń drag & drop
- Integracja z zewnętrznymi API

#### 4. Create Shapes + Connectors (create-shapes-connectors/)
- Tworzy kształty i łączy je liniami
- Przykład tworzenia diagramów
- Automatyzacja układu elementów

#### 5. Document Statistics (document-statistics/)
- Analizuje dokument i generuje statystyki
- Przykład przetwarzania istniejących elementów
- Tworzenie raportów

### Narzędzia deweloperskie

#### TypeScript Setup
```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["ES2017"],
    "module": "commonjs",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "types": ["@figma/plugin-typings"]
  }
}
```

#### Package.json
```json
{
  "name": "my-figma-plugin",
  "version": "1.0.0",
  "description": "My Figma Plugin",
  "main": "code.js",
  "scripts": {
    "build": "tsc",
    "watch": "tsc --watch"
  },
  "devDependencies": {
    "@figma/plugin-typings": "^1.0.0",
    "typescript": "^4.0.0"
  }
}
```

### Manifest.json
```json
{
  "name": "My Plugin",
  "id": "unique-plugin-id",
  "api": "1.0.0",
  "main": "code.js",
  "ui": "ui.html",
  "capabilities": [],
  "enableProposedApi": false,
  "documentAccess": "dynamic-page",
  "editorType": ["figma", "figjam"],
  "networkAccess": {
    "allowedDomains": ["https://api.example.com"]
  }
}
```

## Podsumowanie

Wtyczki Figma oferują ogromne możliwości automatyzacji i rozszerzania funkcjonalności. Dzięki API można tworzyć:

- **Podstawowe kształty**: Prostokąty, elipsy, linie, tekst
- **Złożone struktury**: Ramki, komponenty, warianty, grupy
- **Wizualizacje danych**: Wykresy, diagramy, infografiki
- **Systemy designu**: Palety kolorów, typografia, komponenty
- **Automatyzację**: Przetwarzanie masowe, generowanie treści
- **Integracje**: Połączenia z zewnętrznymi API i usługami

Kluczem do sukcesu jest zrozumienie API, odpowiednie planowanie architektury wtyczki i stosowanie najlepszych praktyk programistycznych.
