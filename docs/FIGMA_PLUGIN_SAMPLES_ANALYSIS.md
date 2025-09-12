# Analiza przykładowych wtyczek Figma

## Spis treści
1. [Przegląd repozytoriów](#przegląd-repozytoriów)
2. [Analiza przykładowych wtyczek](#analiza-przykładowych-wtyczek)
3. [Wzorce programistyczne](#wzorce-programistyczne)
4. [Praktyczne implementacje](#praktyczne-implementacje)
5. [Najlepsze praktyki z przykładów](#najlepsze-praktyki-z-przykładów)

## Przegląd repozytoriów

### 1. [figma/plugin-samples](https://github.com/figma/plugin-samples)
Oficjalne repozytorium z przykładami wtyczek demonstrującymi różne możliwości API Figma.

**Kluczowe przykłady:**
- `barchart/` - Tworzenie wykresów słupkowych
- `piechart/` - Generowanie wykresów kołowych
- `create-shapes-connectors/` - Tworzenie kształtów z połączeniami
- `icon-drag-and-drop/` - Drag & drop ikon
- `document-statistics/` - Analiza dokumentu
- `annotations/` - Tworzenie adnotacji
- `metacards/` - Generowanie kart meta

### 2. [figma/plugin-typings](https://github.com/figma/plugin-typings)
Definicje typów TypeScript dla API wtyczek Figma.

### 3. [figma/plugin-resources](https://github.com/figma/plugin-resources)
Otwarte zasoby, wtyczki i narzędzia dla społeczności.

## Analiza przykładowych wtyczek

### 1. Bar Chart Plugin

**Lokalizacja:** `barchart/`

**Funkcjonalność:**
- Tworzy wykresy słupkowe z danych wejściowych
- Obsługuje customizację kolorów i etykiet
- Demonstruje tworzenie złożonych układów

**Kluczowe elementy kodu:**
```typescript
// Tworzenie ramki wykresu
const chartFrame = figma.createFrame();
chartFrame.layoutMode = "HORIZONTAL";
chartFrame.itemSpacing = 8;

// Tworzenie słupków
data.forEach((value, index) => {
  const bar = figma.createRectangle();
  bar.resize(barWidth, barHeight);
  bar.fills = [{ type: 'SOLID', color: barColor }];
  
  const label = figma.createText();
  label.characters = labels[index];
  label.fontSize = 12;
  
  chartFrame.appendChild(bar);
  chartFrame.appendChild(label);
});
```

**Wzorce:**
- Używanie ramek z układem do organizacji elementów
- Iteracyjne tworzenie elementów z danych
- Grupowanie powiązanych elementów

### 2. Pie Chart Plugin

**Lokalizacja:** `piechart/`

**Funkcjonalność:**
- Generuje wykresy kołowe z segmentami
- Pokazuje pracę z kątami i geometrią
- Przykład interaktywnego UI

**Kluczowe elementy kodu:**
```typescript
// Obliczanie kątów segmentów
const total = data.reduce((sum, item) => sum + item.value, 0);
let currentAngle = 0;

data.forEach((item, index) => {
  const percentage = item.value / total;
  const angle = percentage * 2 * Math.PI;
  
  // Tworzenie segmentu (uproszczone jako prostokąt)
  const segment = figma.createRectangle();
  segment.resize(segmentWidth, 20);
  segment.fills = [{ type: 'SOLID', color: item.color }];
});
```

**Wzorce:**
- Obliczenia matematyczne dla wizualizacji
- Mapowanie danych na właściwości wizualne
- Uproszczenie złożonych kształtów

### 3. Create Shapes + Connectors

**Lokalizacja:** `create-shapes-connectors/`

**Funkcjonalność:**
- Tworzy kształty i łączy je liniami
- Przykład tworzenia diagramów
- Automatyzacja układu elementów

**Kluczowe elementy kodu:**
```typescript
// Tworzenie kształtów
const shapes = [];
for (let i = 0; i < 5; i++) {
  const shape = figma.createRectangle();
  shape.resize(100, 60);
  shape.cornerRadius = 8;
  shape.x = i * 150;
  shapes.push(shape);
}

// Tworzenie połączeń
for (let i = 0; i < shapes.length - 1; i++) {
  const connector = figma.createLine();
  connector.x = shapes[i].x + shapes[i].width;
  connector.y = shapes[i].y + shapes[i].height / 2;
  connector.resize(50, 0);
  connector.strokes = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }];
}
```

**Wzorce:**
- Automatyczne rozmieszczanie elementów
- Tworzenie relacji między elementami
- Używanie pętli do generowania struktur

### 4. Icon Drag and Drop

**Lokalizacja:** `icon-drag-and-drop/`

**Funkcjonalność:**
- Umożliwia przeciąganie ikon z zewnętrznych źródeł
- Demonstruje obsługę zdarzeń drag & drop
- Integracja z zewnętrznymi API

**Kluczowe elementy kodu:**
```typescript
// Rejestracja obsługi zdarzeń drop
figma.on('drop', (event) => {
  const { items } = event;
  
  items.forEach(item => {
    if (item.type === 'image') {
      const image = figma.createImage(item.data);
      const rect = figma.createRectangle();
      rect.resize(100, 100);
      rect.fills = [{
        type: 'IMAGE',
        imageHash: image.hash,
        scaleMode: 'FIT'
      }];
      figma.currentPage.appendChild(rect);
    }
  });
});
```

**Wzorce:**
- Obsługa zdarzeń interaktywnych
- Praca z zewnętrznymi danymi
- Tworzenie elementów z obrazów

### 5. Document Statistics

**Lokalizacja:** `document-statistics/`

**Funkcjonalność:**
- Analizuje dokument i generuje statystyki
- Przykład przetwarzania istniejących elementów
- Tworzenie raportów

**Kluczowe elementy kodu:**
```typescript
// Analiza elementów w dokumencie
const stats = {
  frames: 0,
  rectangles: 0,
  ellipses: 0,
  text: 0
};

function analyzeNode(node) {
  switch (node.type) {
    case 'FRAME':
      stats.frames++;
      break;
    case 'RECTANGLE':
      stats.rectangles++;
      break;
    case 'ELLIPSE':
      stats.ellipses++;
      break;
    case 'TEXT':
      stats.text++;
      break;
  }
  
  if ('children' in node) {
    node.children.forEach(analyzeNode);
  }
}

figma.currentPage.children.forEach(analyzeNode);
```

**Wzorce:**
- Rekurencyjne przetwarzanie drzewa węzłów
- Zbieranie statystyk i metadanych
- Generowanie raportów tekstowych

## Wzorce programistyczne

### 1. Wzorzec Factory dla tworzenia elementów

```typescript
class ElementFactory {
  static createRectangle(config: RectangleConfig): RectangleNode {
    const rect = figma.createRectangle();
    rect.x = config.x;
    rect.y = config.y;
    rect.resize(config.width, config.height);
    rect.fills = [{ type: 'SOLID', color: config.color }];
    rect.cornerRadius = config.cornerRadius || 0;
    return rect;
  }
  
  static createText(config: TextConfig): TextNode {
    const text = figma.createText();
    text.x = config.x;
    text.y = config.y;
    text.characters = config.text;
    text.fontSize = config.fontSize;
    text.fontName = { family: config.fontFamily, style: config.fontStyle };
    text.fills = [{ type: 'SOLID', color: config.color }];
    return text;
  }
}

interface RectangleConfig {
  x: number;
  y: number;
  width: number;
  height: number;
  color: RGB;
  cornerRadius?: number;
}

interface TextConfig {
  x: number;
  y: number;
  text: string;
  fontSize: number;
  fontFamily: string;
  fontStyle: string;
  color: RGB;
}
```

### 2. Wzorzec Builder dla złożonych struktur

```typescript
class ChartBuilder {
  private chart: FrameNode;
  private data: ChartData[];
  
  constructor() {
    this.chart = figma.createFrame();
    this.chart.layoutMode = "HORIZONTAL";
    this.chart.itemSpacing = 8;
  }
  
  setData(data: ChartData[]): ChartBuilder {
    this.data = data;
    return this;
  }
  
  setSpacing(spacing: number): ChartBuilder {
    this.chart.itemSpacing = spacing;
    return this;
  }
  
  setPadding(padding: number): ChartBuilder {
    this.chart.paddingAll = padding;
    return this;
  }
  
  build(): FrameNode {
    this.data.forEach((item, index) => {
      const bar = this.createBar(item, index);
      this.chart.appendChild(bar);
    });
    
    return this.chart;
  }
  
  private createBar(item: ChartData, index: number): FrameNode {
    const bar = figma.createRectangle();
    bar.resize(40, item.value * 2);
    bar.fills = [{ type: 'SOLID', color: item.color }];
    
    const label = figma.createText();
    label.characters = item.label;
    label.fontSize = 12;
    
    const group = figma.createFrame();
    group.layoutMode = "VERTICAL";
    group.appendChild(bar);
    group.appendChild(label);
    
    return group;
  }
}

// Użycie
const chart = new ChartBuilder()
  .setData(chartData)
  .setSpacing(16)
  .setPadding(24)
  .build();
```

### 3. Wzorzec Observer dla komunikacji UI

```typescript
class PluginController {
  private observers: ((data: any) => void)[] = [];
  
  addObserver(observer: (data: any) => void): void {
    this.observers.push(observer);
  }
  
  notify(data: any): void {
    this.observers.forEach(observer => observer(data));
  }
  
  // Komunikacja z UI
  sendToUI(type: string, payload: any): void {
    figma.ui.postMessage({ type, payload });
  }
  
  handleUIMessage(message: any): void {
    switch (message.type) {
      case 'CREATE_CHART':
        this.createChart(message.data);
        break;
      case 'UPDATE_SETTINGS':
        this.updateSettings(message.data);
        break;
    }
  }
  
  private createChart(data: ChartData[]): void {
    const chart = new ChartBuilder()
      .setData(data)
      .build();
    
    figma.currentPage.appendChild(chart);
    this.notify({ type: 'CHART_CREATED', chart });
  }
}

// W UI
figma.ui.onmessage = (message) => {
  controller.handleUIMessage(message);
};
```

## Praktyczne implementacje

### 1. Wtyczka do tworzenia systemu kolorów

```typescript
// color-system-plugin/code.ts
interface ColorToken {
  name: string;
  value: string;
  description?: string;
  category: 'primary' | 'secondary' | 'neutral' | 'semantic';
}

class ColorSystemGenerator {
  private colors: ColorToken[] = [];
  
  addColor(color: ColorToken): void {
    this.colors.push(color);
  }
  
  generateSystem(): FrameNode {
    const systemFrame = figma.createFrame();
    systemFrame.name = "Color System";
    systemFrame.layoutMode = "VERTICAL";
    systemFrame.itemSpacing = 24;
    systemFrame.paddingAll = 32;
    
    // Grupowanie kolorów według kategorii
    const categories = this.groupByCategory();
    
    Object.entries(categories).forEach(([category, colors]) => {
      const categoryFrame = this.createCategoryFrame(category, colors);
      systemFrame.appendChild(categoryFrame);
    });
    
    return systemFrame;
  }
  
  private groupByCategory(): Record<string, ColorToken[]> {
    return this.colors.reduce((groups, color) => {
      if (!groups[color.category]) {
        groups[color.category] = [];
      }
      groups[color.category].push(color);
      return groups;
    }, {} as Record<string, ColorToken[]>);
  }
  
  private createCategoryFrame(category: string, colors: ColorToken[]): FrameNode {
    const categoryFrame = figma.createFrame();
    categoryFrame.name = category.charAt(0).toUpperCase() + category.slice(1);
    categoryFrame.layoutMode = "VERTICAL";
    categoryFrame.itemSpacing = 16;
    categoryFrame.paddingAll = 24;
    categoryFrame.fills = [{ type: 'SOLID', color: { r: 0.98, g: 0.98, b: 0.98 } }];
    categoryFrame.cornerRadius = 8;
    
    // Nagłówek kategorii
    const header = figma.createText();
    header.characters = category.charAt(0).toUpperCase() + category.slice(1);
    header.fontSize = 20;
    header.fontName = { family: "Inter", style: "SemiBold" };
    header.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }];
    categoryFrame.appendChild(header);
    
    // Kolory w kategorii
    colors.forEach(color => {
      const colorFrame = this.createColorFrame(color);
      categoryFrame.appendChild(colorFrame);
    });
    
    return categoryFrame;
  }
  
  private createColorFrame(color: ColorToken): FrameNode {
    const colorFrame = figma.createFrame();
    colorFrame.layoutMode = "HORIZONTAL";
    colorFrame.itemSpacing = 16;
    colorFrame.resize(300, 60);
    
    // Próbka koloru
    const swatch = figma.createRectangle();
    swatch.resize(60, 60);
    swatch.fills = [{ type: 'SOLID', color: this.hexToRgb(color.value) }];
    swatch.cornerRadius = 8;
    swatch.strokes = [{ type: 'SOLID', color: { r: 0.8, g: 0.8, b: 0.8 } }];
    swatch.strokeWeight = 1;
    
    // Informacje o kolorze
    const infoFrame = figma.createFrame();
    infoFrame.layoutMode = "VERTICAL";
    infoFrame.itemSpacing = 4;
    infoFrame.resize(200, 60);
    
    // Nazwa
    const nameText = figma.createText();
    nameText.characters = color.name;
    nameText.fontSize = 16;
    nameText.fontName = { family: "Inter", style: "Medium" };
    nameText.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }];
    
    // Wartość
    const valueText = figma.createText();
    valueText.characters = color.value;
    valueText.fontSize = 14;
    valueText.fontName = { family: "Inter", style: "Regular" };
    valueText.fills = [{ type: 'SOLID', color: { r: 0.5, g: 0.5, b: 0.5 } }];
    
    // Opis
    if (color.description) {
      const descText = figma.createText();
      descText.characters = color.description;
      descText.fontSize = 12;
      descText.fontName = { family: "Inter", style: "Regular" };
      descText.fills = [{ type: 'SOLID', color: { r: 0.6, g: 0.6, b: 0.6 } }];
      infoFrame.appendChild(descText);
    }
    
    infoFrame.appendChild(nameText);
    infoFrame.appendChild(valueText);
    
    colorFrame.appendChild(swatch);
    colorFrame.appendChild(infoFrame);
    
    return colorFrame;
  }
  
  private hexToRgb(hex: string): RGB {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16) / 255,
      g: parseInt(result[2], 16) / 255,
      b: parseInt(result[3], 16) / 255
    } : { r: 0, g: 0, b: 0 };
  }
}

// Główna logika wtyczki
figma.ui.onmessage = (message) => {
  if (message.type === 'GENERATE_COLOR_SYSTEM') {
    const generator = new ColorSystemGenerator();
    
    message.colors.forEach((color: ColorToken) => {
      generator.addColor(color);
    });
    
    const system = generator.generateSystem();
    figma.currentPage.appendChild(system);
    
    figma.ui.postMessage({
      type: 'SYSTEM_GENERATED',
      success: true
    });
  }
};
```

### 2. Wtyczka do tworzenia komponentów z wariantami

```typescript
// component-variants-plugin/code.ts
interface ComponentVariant {
  name: string;
  properties: Record<string, any>;
  description?: string;
}

class ComponentVariantGenerator {
  createButtonWithVariants(x: number, y: number, text: string): ComponentNode {
    // Główny komponent
    const button = figma.createComponent();
    button.name = "Button";
    button.x = x;
    button.y = y;
    button.resize(120, 40);
    button.cornerRadius = 6;
    
    // Tekst przycisku
    const buttonText = figma.createText();
    buttonText.characters = text;
    buttonText.fontSize = 14;
    buttonText.fontName = { family: "Inter", style: "Medium" };
    buttonText.textAlignHorizontal = "CENTER";
    buttonText.textAlignVertical = "CENTER";
    buttonText.resize(120, 40);
    buttonText.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
    
    button.appendChild(buttonText);
    
    // Warianty
    this.createButtonVariants(button);
    
    return button;
  }
  
  private createButtonVariants(button: ComponentNode): void {
    const variants: ComponentVariant[] = [
      {
        name: "Primary",
        properties: {
          fills: [{ type: 'SOLID', color: { r: 0.2, g: 0.5, b: 1 } }],
          textFills: [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }]
        },
        description: "Primary button style"
      },
      {
        name: "Secondary",
        properties: {
          fills: [{ type: 'SOLID', color: { r: 0.9, g: 0.9, b: 0.9 } }],
          textFills: [{ type: 'SOLID', color: { r: 0.2, g: 0.2, b: 0.2 } }]
        },
        description: "Secondary button style"
      },
      {
        name: "Danger",
        properties: {
          fills: [{ type: 'SOLID', color: { r: 0.9, g: 0.2, b: 0.2 } }],
          textFills: [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }]
        },
        description: "Danger button style"
      },
      {
        name: "Disabled",
        properties: {
          fills: [{ type: 'SOLID', color: { r: 0.8, g: 0.8, b: 0.8 } }],
          textFills: [{ type: 'SOLID', color: { r: 0.5, g: 0.5, b: 0.5 } }]
        },
        description: "Disabled button state"
      }
    ];
    
    variants.forEach(variant => {
      const variantNode = button.createVariant();
      variantNode.name = variant.name;
      variantNode.description = variant.description;
      
      // Zastosowanie właściwości wariantu
      this.applyVariantProperties(variantNode, variant.properties);
    });
  }
  
  private applyVariantProperties(variant: ComponentVariant, properties: Record<string, any>): void {
    // Zastosowanie właściwości do wariantu
    if (properties.fills) {
      variant.fills = properties.fills;
    }
    
    // Zastosowanie właściwości do tekstu
    const textNode = variant.children.find(child => child.type === 'TEXT') as TextNode;
    if (textNode && properties.textFills) {
      textNode.fills = properties.textFills;
    }
  }
}
```

## Najlepsze praktyki z przykładów

### 1. Struktura kodu

```typescript
// Dobra praktyka: Podział na klasy i moduły
class PluginController {
  private settings: PluginSettings;
  private generator: ElementGenerator;
  
  constructor() {
    this.settings = new PluginSettings();
    this.generator = new ElementGenerator();
  }
  
  async initialize(): Promise<void> {
    await this.loadSettings();
    this.setupEventListeners();
  }
  
  private setupEventListeners(): void {
    figma.ui.onmessage = (message) => {
      this.handleMessage(message);
    };
  }
  
  private async handleMessage(message: any): Promise<void> {
    try {
      switch (message.type) {
        case 'CREATE_ELEMENT':
          await this.createElement(message.data);
          break;
        case 'UPDATE_SETTINGS':
          await this.updateSettings(message.data);
          break;
      }
    } catch (error) {
      this.handleError(error);
    }
  }
  
  private handleError(error: Error): void {
    console.error('Plugin error:', error);
    figma.notify('Wystąpił błąd: ' + error.message, { error: true });
  }
}
```

### 2. Obsługa błędów

```typescript
// Dobra praktyka: Kompleksowa obsługa błędów
class ErrorHandler {
  static handlePluginError(error: Error, context: string): void {
    console.error(`Error in ${context}:`, error);
    
    // Różne typy błędów
    if (error.name === 'ValidationError') {
      figma.notify('Błąd walidacji: ' + error.message, { error: true });
    } else if (error.name === 'NetworkError') {
      figma.notify('Błąd sieci: ' + error.message, { error: true });
    } else {
      figma.notify('Nieoczekiwany błąd: ' + error.message, { error: true });
    }
  }
  
  static validateInput(data: any, schema: any): boolean {
    try {
      // Walidacja danych wejściowych
      return true;
    } catch (error) {
      this.handlePluginError(error, 'validation');
      return false;
    }
  }
}
```

### 3. Optymalizacja wydajności

```typescript
// Dobra praktyka: Optymalizacja dla dużych zbiorów danych
class PerformanceOptimizer {
  static async processLargeDataset<T>(
    data: T[],
    processor: (item: T, index: number) => Promise<void>,
    batchSize: number = 10
  ): Promise<void> {
    for (let i = 0; i < data.length; i += batchSize) {
      const batch = data.slice(i, i + batchSize);
      
      // Przetwarzanie wsadowe
      await Promise.all(
        batch.map((item, batchIndex) => 
          processor(item, i + batchIndex)
        )
      );
      
      // Pozwolenie na aktualizację UI
      await new Promise(resolve => setTimeout(resolve, 0));
      
      // Aktualizacja postępu
      const progress = Math.round((i + batch.length) / data.length * 100);
      figma.notify(`Przetwarzanie: ${progress}%`);
    }
  }
}
```

### 4. Komunikacja z UI

```typescript
// Dobra praktyka: Typowana komunikacja z UI
interface UIMessage {
  type: string;
  payload?: any;
}

interface PluginResponse {
  type: string;
  success: boolean;
  data?: any;
  error?: string;
}

class UIManager {
  static sendMessage(message: UIMessage): void {
    figma.ui.postMessage(message);
  }
  
  static sendSuccess(type: string, data?: any): void {
    this.sendMessage({
      type,
      payload: { success: true, data }
    });
  }
  
  static sendError(type: string, error: string): void {
    this.sendMessage({
      type,
      payload: { success: false, error }
    });
  }
  
  static handleUIMessage(handler: (message: UIMessage) => void): void {
    figma.ui.onmessage = (message: UIMessage) => {
      try {
        handler(message);
      } catch (error) {
        this.sendError('HANDLER_ERROR', error.message);
      }
    };
  }
}
```

## Podsumowanie

Analiza przykładowych wtyczek Figma pokazuje, że skuteczne wtyczki charakteryzują się:

1. **Modularną architekturą** - Podział na klasy i moduły
2. **Solidną obsługą błędów** - Kompleksowe error handling
3. **Optymalizacją wydajności** - Przetwarzanie wsadowe dla dużych zbiorów
4. **Typowaną komunikacją** - Bezpieczna komunikacja z UI
5. **Wzorcami projektowymi** - Factory, Builder, Observer
6. **Dokumentacją kodu** - Jasne interfejsy i komentarze

Te wzorce i praktyki można zastosować w tworzeniu własnych wtyczek, zapewniając ich stabilność, wydajność i łatwość utrzymania.
