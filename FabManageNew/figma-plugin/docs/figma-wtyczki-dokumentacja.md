# Dokumentacja Tworzenia Wtyczek Figma

Kompleksowy przewodnik po możliwościach tworzenia wtyczek w Figmie na podstawie oficjalnej dokumentacji i przykładów z repozytoriów.

## 1. Architektura Wtyczek Figma

### 1.1 Podstawowa struktura

Wtyczki Figma składają się z dwóch głównych części:

**Plugin Code (code.ts/js)**
- Działa w głównym wątku w sandboxie
- Ma dostęp do Figma Plugin API
- Może manipulować dokumentami Figma (nodes, strony, warstwy)
- **NIE ma dostępu** do browser APIs (DOM, XMLHttpRequest, localStorage)
- Komunikuje się z UI przez `postMessage`

**Plugin UI (ui.html)**
- Działa w `<iframe>`
- Ma pełny dostęp do browser APIs (HTML, CSS, JavaScript, React, Vue, etc.)
- **NIE ma bezpośredniego dostępu** do Figma API
- Komunikuje się z Plugin Code przez `postMessage`

### 1.2 Komunikacja między komponentami

```javascript
// Z UI do Plugin Code
parent.postMessage({pluginMessage: {type: 'action', data: {...}}}, '*');

// Z Plugin Code do UI  
figma.ui.postMessage({type: 'response', result: {...}});

// Obsługa wiadomości w Plugin Code
figma.ui.onmessage = msg => {
  if (msg.type === 'action') {
    // Wykonaj operację na Figmie
    figma.ui.postMessage({type: 'response', result: 'success'});
  }
};

// Obsługa wiadomości w UI
window.onmessage = (event) => {
  const message = event.data.pluginMessage;
  if (message.type === 'response') {
    // Zaktualizuj UI
  }
};
```

## 2. Możliwości Figma Plugin API

### 2.1 Dostęp do dokumentu

```javascript
// Globalny obiekt figma
figma.root                    // DocumentNode - korzeń dokumentu
figma.currentPage            // PageNode - aktualna strona
figma.currentPage.selection  // Wybrane elementy
figma.viewport              // Kontrola viewportu
```

### 2.2 Typy Node'ów (warstw)

Figma reprezentuje wszystkie elementy jako node'y w strukturze drzewiastej:

**Podstawowe Node'y:**
- `DocumentNode` - korzeń dokumentu
- `PageNode` - strona w dokumencie  
- `FrameNode` - ramka/artboard
- `GroupNode` - grupa elementów

**Kształty i elementy:**
- `RectangleNode` - prostokąt
- `EllipseNode` - elipsa/koło
- `TextNode` - tekst
- `VectorNode` - ścieżka wektorowa
- `LineNode` - linia
- `StarNode` - gwiazda
- `PolygonNode` - wielokąt

**Zaawansowane:**
- `ComponentNode` - główny komponent
- `InstanceNode` - instancja komponentu
- `BooleanOperationNode` - operacja boolowska
- `SliceNode` - slice do eksportu

**FigJam specyficzne:**
- `StickyNode` - karteczka samoprzylepna
- `ConnectorNode` - łącznik
- `ShapeWithTextNode` - kształt z tekstem
- `StampNode` - pieczątka

### 2.3 Manipulacja elementami

```javascript
// Tworzenie elementów
const rect = figma.createRectangle();
const text = figma.createText();
const frame = figma.createFrame();

// Właściwości pozycji i rozmiaru
rect.x = 100;
rect.y = 50;
rect.resize(200, 100);

// Stylowanie
rect.fills = [{
  type: 'SOLID',
  color: {r: 1, g: 0, b: 0}  // czerwony
}];

// Dodawanie do strony
figma.currentPage.appendChild(rect);

// Wyszukiwanie elementów
const allRects = figma.currentPage.findAll(node => node.type === 'RECTANGLE');
const nodeByName = figma.currentPage.findOne(node => node.name === 'My Button');
```

## 3. Przykłady Elementów które Może Tworzyć Wtyczka

### 3.1 Podstawowe kształty

```javascript
// Prostokąt z gradientem
const gradientRect = figma.createRectangle();
gradientRect.resize(200, 100);
gradientRect.fills = [{
  type: 'GRADIENT_LINEAR',
  gradientStops: [
    {color: {r: 1, g: 0, b: 0}, position: 0},
    {color: {r: 0, g: 0, b: 1}, position: 1}
  ],
  gradientTransform: [
    [1, 0, 0],
    [0, 1, 0]
  ]
}];

// Koło z obramowaniem  
const circle = figma.createEllipse();
circle.resize(100, 100);
circle.fills = [{type: 'SOLID', color: {r: 0.2, g: 0.8, b: 0.4}}];
circle.strokes = [{type: 'SOLID', color: {r: 0, g: 0, b: 0}}];
circle.strokeWeight = 3;

// Gwiazda
const star = figma.createStar();
star.resize(80, 80);
star.pointCount = 5;
star.innerRadius = 0.4;
```

### 3.2 Tekst i typografia

```javascript
// Podstawowy tekst
await figma.loadFontAsync({family: "Inter", style: "Regular"});
const textNode = figma.createText();
textNode.characters = "Hello Figma!";
textNode.fontSize = 24;
textNode.fontName = {family: "Inter", style: "Regular"};

// Tekst z formatowaniem
textNode.fills = [{type: 'SOLID', color: {r: 0.2, g: 0.2, b: 0.8}}];
textNode.letterSpacing = {unit: "PERCENT", value: 5};
textNode.lineHeight = {unit: "AUTO"};

// Tekst na ścieżce
const path = figma.createVector();
// ... utworzenie ścieżki
const textPath = figma.createTextPath();
textPath.characters = "Text on path";
textPath.path = path.vectorPaths[0].data;
```

### 3.3 Komponenty i instancje

```javascript
// Tworzenie komponentu
const component = figma.createComponent();
component.name = "Button Component";
component.resize(120, 40);

// Dodanie elementów do komponentu
const bg = figma.createRectangle();
bg.resize(120, 40);
bg.cornerRadius = 8;
bg.fills = [{type: 'SOLID', color: {r: 0.2, g: 0.6, b: 1}}];
component.appendChild(bg);

await figma.loadFontAsync({family: "Inter", style: "Medium"});
const label = figma.createText();
label.characters = "Click me";
label.fontName = {family: "Inter", style: "Medium"};
label.x = 35;
label.y = 12;
component.appendChild(label);

// Tworzenie instancji
const instance = component.createInstance();
instance.x = 200;
instance.y = 100;
```

### 3.4 Złożone układy

```javascript
// Auto Layout Frame
const autoFrame = figma.createFrame();
autoFrame.layoutMode = "HORIZONTAL";
autoFrame.itemSpacing = 16;
autoFrame.paddingLeft = 20;
autoFrame.paddingRight = 20;
autoFrame.paddingTop = 12;
autoFrame.paddingBottom = 12;
autoFrame.primaryAxisSizingMode = "AUTO";
autoFrame.counterAxisSizingMode = "AUTO";

// Dodawanie elementów do Auto Layout
for (let i = 0; i < 3; i++) {
  const item = figma.createRectangle();
  item.resize(60, 60);
  item.fills = [{type: 'SOLID', color: {r: Math.random(), g: Math.random(), b: Math.random()}}];
  autoFrame.appendChild(item);
}
```

### 3.5 Efekty i style

```javascript
// Shadow effect
const shadowRect = figma.createRectangle();
shadowRect.resize(100, 100);
shadowRect.effects = [{
  type: 'DROP_SHADOW',
  visible: true,
  color: {r: 0, g: 0, b: 0, a: 0.25},
  blendMode: 'NORMAL',
  offset: {x: 0, y: 4},
  radius: 8,
  spread: 0
}];

// Blur effect
const blurRect = figma.createRectangle();
blurRect.resize(100, 100);
blurRect.effects = [{
  type: 'LAYER_BLUR',
  visible: true,
  radius: 4
}];
```

### 3.6 Dane i zmienne

```javascript
// Tworzenie kolekcji zmiennych
const collection = figma.variables.createVariableCollection("Design Tokens");
const colorVar = figma.variables.createVariable("primary-color", collection, "COLOR");
const sizeVar = figma.variables.createVariable("button-height", collection, "FLOAT");

// Ustawianie wartości
const modeId = collection.modes[0].modeId;
colorVar.setValueForMode(modeId, {r: 0.2, g: 0.6, b: 1});
sizeVar.setValueForMode(modeId, 40);

// Bindowanie zmiennej do elementu
const button = figma.createRectangle();
button.setBoundVariable("height", sizeVar);
```

### 3.7 Import i eksport

```javascript
// Import obrazu
const image = figma.createRectangle();
image.resize(200, 150);

// Symulacja dodania obrazu (w rzeczywistości przez UI)
// const imageHash = figma.createImagePaint(uint8Array);
// image.fills = [imageHash];

// Eksport do PNG
const exportSettings = [{
  format: 'PNG',
  constraint: {type: 'SCALE', value: 2}
}];
const bytes = await node.exportAsync(exportSettings[0]);
```

## 4. Przykłady Wtyczek z Repozytoriów

### 4.1 Wtyczki bez UI

**Circle Text** - Układa znaki tekstu w okręgu
```javascript
function circleText(textNode: TextNode) {
  const chars = textNode.characters;
  const radius = 100;
  const angleStep = (2 * Math.PI) / chars.length;
  
  for (let i = 0; i < chars.length; i++) {
    const angle = i * angleStep;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    // Pozycjonowanie każdego znaku...
  }
}
```

**Vector Path** - Tworzy trójkąt używając ścieżek wektorowych
```javascript
const triangle = figma.createVector();
triangle.vectorPaths = [{
  windingRule: "NONZERO",
  data: "M 0 100 L 50 0 L 100 100 Z"
}];
```

**Sierpinski** - Generuje fraktal używając kół
```javascript
function createSierpinski(depth: number, x: number, y: number, size: number) {
  if (depth === 0) {
    const circle = figma.createEllipse();
    circle.x = x;
    circle.y = y;
    circle.resize(size, size);
    return circle;
  }
  // Rekurencyjne tworzenie mniejszych kół...
}
```

### 4.2 Wtyczki z UI

**Bar Chart** - Generuje wykres słupkowy
- UI: formularz do wprowadzania danych
- Plugin Code: tworzenie prostokątów reprezentujących dane

**Document Statistics** - Zlicza typy node'ów
- UI: wyświetla statystyki w tabeli
- Plugin Code: przechodzi przez drzewo node'ów

**Text Search** - Wyszukuje tekst w dokumencie
- UI: pole wyszukiwania i lista wyników
- Plugin Code: przeszukuje wszystkie TextNode'y

**Icon Drag-and-Drop** - Biblioteka ikon z drag & drop
- UI: siatka ikon do przeciągnięcia
- Plugin Code: obsługa drop events

### 4.3 Wtyczki dla Dev Mode

**Code Generation** - Generuje kod CSS/React
```javascript
// Pobieranie CSS dla node'a
const cssStyles = await node.getCSSAsync();
console.log(cssStyles);
// {
//   "background": "rgb(255, 0, 0)",
//   "border-radius": "8px",
//   "width": "100px",
//   "height": "50px"
// }
```

**Snippet Saver** - Zapisuje snippety kodu na node'ach
```javascript
// Dodawanie snippet'a do node'a
node.setPluginData('codeSnippet', JSON.stringify({
  language: 'react',
  code: '<Button variant="primary">Click me</Button>'
}));
```

## 5. Zaawansowane Możliwości

### 5.1 Asynchroniczne operacje

```javascript
// Ładowanie stron dynamicznie
const allPages = figma.root.children;
for (const page of allPages) {
  await page.loadAsync(); // Ładuje zawartość strony
  // Praca z zawartością strony...
}

// Ładowanie czcionek
await figma.loadFontAsync({family: "Roboto", style: "Regular"});

// Pobieranie node'ów po ID
const node = await figma.getNodeByIdAsync("123:456");
```

### 5.2 Manipulation obrazów

```javascript
// Odczytywanie pikseli obrazu
const imageNode = figma.currentPage.selection[0] as RectangleNode;
const image = imageNode.fills[0] as ImagePaint;
const imageHash = image.imageHash;

// W UI iframe można manipulować pikselami
figma.ui.postMessage({
  type: 'process-image',
  imageBytes: await figma.getImageByHashAsync(imageHash)
});
```

### 5.3 Praca z parametrami wtyczki

```javascript
// manifest.json
{
  "parameters": [
    {
      "name": "Size",
      "key": "size",
      "type": "string"
    }
  ]
}

// code.ts
const parameters = figma.parameters;
const size = parameters?.size || "medium";
```

### 5.4 Storage i dane użytkownika

```javascript
// Zapisywanie danych użytkownika
await figma.clientStorage.setAsync('userPrefs', {
  defaultColor: '#FF0000',
  autoSave: true
});

// Odczytywanie danych
const prefs = await figma.clientStorage.getAsync('userPrefs');

// Dane per-node
node.setPluginData('customData', JSON.stringify({timestamp: Date.now()}));
const data = node.getPluginData('customData');
```

## 6. UI i Design System

### 6.1 Rekomendowane biblioteki UI

**Figma Plugin DS**
- Lekki system designu stylizowany jak Figma
- Komponenty CSS i JavaScript
- Spójna stylistyka z interfejsem Figma

**Figma Kit (React)**
- Rozbudowany zestaw komponentów React  
- Wsparcie dla Tailwind CSS
- Gotowość na UI3

**Create Figma Plugin**
- Preact komponenty replikujące UI Figma
- Zero-config setup
- TypeScript support

### 6.2 Przykład UI z komponentami

```html
<!-- ui.html -->
<div class="figma-plugin">
  <div class="section-header">
    <h2>Generate Elements</h2>
  </div>
  
  <div class="input-group">
    <label>Count:</label>
    <input type="number" id="count" value="5" min="1" max="100">
  </div>
  
  <div class="input-group">
    <label>Type:</label>
    <select id="type">
      <option value="rectangle">Rectangle</option>
      <option value="circle">Circle</option>
      <option value="text">Text</option>
    </select>
  </div>
  
  <button id="generate" class="button button--primary">Generate</button>
  <button id="cancel" class="button button--secondary">Cancel</button>
</div>
```

## 7. Najlepsze Praktyki

### 7.1 Performance

```javascript
// Grupowanie operacji
figma.skipInvisibleInstanceChildren = true; // Pomija niewidoczne dzieci instancji

// Batch operations
const elements = [];
for (let i = 0; i < 100; i++) {
  const rect = figma.createRectangle();
  rect.x = i * 10;
  elements.push(rect);
}
// Dodaj wszystkie na raz
elements.forEach(el => figma.currentPage.appendChild(el));
```

### 7.2 Error Handling

```javascript
try {
  const selection = figma.currentPage.selection[0];
  if (!selection) {
    throw new Error('Nothing selected');
  }
  
  if (selection.type !== 'FRAME') {
    throw new Error('Please select a frame');
  }
  
  // Operacja na ramce...
  
} catch (error) {
  figma.notify(`Error: ${error.message}`, {error: true});
  figma.closePlugin();
}
```

### 7.3 TypeScript Types

```typescript
// Sprawdzanie typu node'a
function isTextNode(node: SceneNode): node is TextNode {
  return node.type === 'TEXT';
}

function processTextNodes(nodes: readonly SceneNode[]) {
  nodes.forEach(node => {
    if (isTextNode(node)) {
      // TypeScript wie że to TextNode
      console.log(node.characters);
    }
  });
}

// Type guards dla node'ów z dziećmi
type NodeWithChildren = FrameNode | ComponentNode | InstanceNode | GroupNode;

function hasChildren(node: SceneNode): node is NodeWithChildren {
  return 'children' in node;
}
```

## 8. Deployment i Dystrybucja

### 8.1 Manifest wtyczki

```json
{
  "name": "My Awesome Plugin",
  "id": "123456789",
  "api": "1.0.0",
  "main": "code.js",
  "ui": "ui.html",
  "editorType": ["figma", "figjam"],
  "networkAccess": {
    "allowedDomains": ["https://api.example.com"]
  },
  "permissions": ["currentuser"],
  "menu": [
    {"name": "Create Elements", "command": "create"},
    {"name": "Settings", "command": "settings"}
  ]
}
```

### 8.2 Build Process

```bash
# TypeScript compilation  
tsc

# Webpack bundling (dla bardziej złożonych wtyczek)
npm run build

# Development z watch mode
tsc --watch
```

## 9. Przykłady Praktycznych Zastosowań

### 9.1 Design System Tools
- **Batch Styler**: masowa edycja stylów
- **Design Tokens**: export/import tokenów designu
- **Component Organizer**: organizacja bibliotek komponentów

### 9.2 Content Generation  
- **Lorem ipsum generators**: generowanie tekstu placeholder
- **Chart generators**: tworzenie wykresów z danych
- **Icon libraries**: biblioteki ikon z drag & drop

### 9.3 Developer Tools
- **Code generation**: CSS, React, Vue, Angular
- **Export utilities**: zaawansowany eksport assetów  
- **Measurement tools**: dodawanie wymiarów i adnotacji

### 9.4 Workflow Automation
- **Bulk operations**: masowe operacje na elementach
- **Template generators**: generatory szablonów projektów
- **Organization tools**: automatyczne organizowanie warstw

## 10. Podsumowanie Możliwości

Wtyczki Figma oferują szerokie możliwości automatyzacji i rozszerzania funkcjonalności:

**Elementy które można tworzyć:**
- Wszystkie podstawowe kształty (prostokąty, koła, linie, gwiazdy)  
- Złożone obiekty wektorowe z custom ścieżkami
- Teksty z zaawansowanym formatowaniem
- Komponenty i ich instancje z właściwościami
- Auto Layout frames z responsywnymi układami
- Efekty wizualne (cienie, rozmycia, gradienty)
- Style i zmienne designu  
- Adnotacje i elementy pomiarowe

**Operacje które można wykonywać:**
- Manipulacja istniejących elementów (pozycja, rozmiar, style)
- Wyszukiwanie i filtrowanie elementów
- Import/export treści i assetów
- Generowanie contentu na podstawie danych
- Automatyzacja powtarzalnych zadań
- Integracja z zewnętrznymi API i usługami
- Analiza i raportowanie zawartości dokumentu

**Integracje możliwe:**
- Design systemy (Tokens Studio, Zeplin)
- Narzędzia deweloperskie (generatory kodu)
- Biblioteki assetów (ikony, zdjęcia)
- Analytics i monitoring
- Project management tools
- Collaboration platforms

Wtyczki Figma są potężnym narzędziem do automatyzacji workflow designu i mogą znacząco przyspieszyć pracę zespołów projektowych oraz poprawić konsystencję projektów.