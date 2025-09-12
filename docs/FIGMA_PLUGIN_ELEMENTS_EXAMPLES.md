# Przykłady elementów tworzonych przez wtyczki Figma

## Spis treści
1. [Podstawowe kształty](#podstawowe-kształty)
2. [Elementy tekstowe](#elementy-tekstowe)
3. [Kontenery i układy](#kontenery-i-układy)
4. [Komponenty i warianty](#komponenty-i-warianty)
5. [Wizualizacje danych](#wizualizacje-danych)
6. [Elementy interaktywne](#elementy-interaktywne)
7. [Systemy designu](#systemy-designu)
8. [Elementy specjalistyczne](#elementy-specjalistyczne)

## Podstawowe kształty

### 1. Prostokąty z różnymi stylami

```typescript
// Podstawowy prostokąt
function createBasicRectangle(x: number, y: number, width: number, height: number) {
  const rect = figma.createRectangle();
  rect.x = x;
  rect.y = y;
  rect.resize(width, height);
  rect.fills = [{ type: 'SOLID', color: { r: 0.2, g: 0.5, b: 1 } }];
  return rect;
}

// Prostokąt z zaokrąglonymi rogami
function createRoundedRectangle(x: number, y: number, width: number, height: number, radius: number) {
  const rect = figma.createRectangle();
  rect.x = x;
  rect.y = y;
  rect.resize(width, height);
  rect.cornerRadius = radius;
  rect.fills = [{ type: 'SOLID', color: { r: 0.9, g: 0.9, b: 0.9 } }];
  return rect;
}

// Prostokąt z gradientem
function createGradientRectangle(x: number, y: number, width: number, height: number) {
  const rect = figma.createRectangle();
  rect.x = x;
  rect.y = y;
  rect.resize(width, height);
  rect.fills = [{
    type: 'GRADIENT_LINEAR',
    gradientStops: [
      { position: 0, color: { r: 1, g: 0, b: 0 } },
      { position: 1, color: { r: 0, g: 0, b: 1 } }
    ],
    gradientTransform: [[1, 0, 0], [0, 1, 0]]
  }];
  return rect;
}

// Prostokąt z cieniem
function createShadowRectangle(x: number, y: number, width: number, height: number) {
  const rect = figma.createRectangle();
  rect.x = x;
  rect.y = y;
  rect.resize(width, height);
  rect.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
  rect.effects = [{
    type: 'DROP_SHADOW',
    color: { r: 0, g: 0, b: 0, a: 0.25 },
    offset: { x: 0, y: 4 },
    radius: 8,
    spread: 0,
    visible: true,
    blendMode: 'NORMAL'
  }];
  return rect;
}
```

### 2. Elipsy i koła

```typescript
// Koło
function createCircle(x: number, y: number, radius: number, color: RGB) {
  const circle = figma.createEllipse();
  circle.x = x - radius;
  circle.y = y - radius;
  circle.resize(radius * 2, radius * 2);
  circle.fills = [{ type: 'SOLID', color }];
  return circle;
}

// Elipsa
function createEllipse(x: number, y: number, width: number, height: number, color: RGB) {
  const ellipse = figma.createEllipse();
  ellipse.x = x;
  ellipse.y = y;
  ellipse.resize(width, height);
  ellipse.fills = [{ type: 'SOLID', color }];
  return ellipse;
}

// Pierścień (koło z dziurą)
function createRing(x: number, y: number, outerRadius: number, innerRadius: number, color: RGB) {
  const outerCircle = figma.createEllipse();
  outerCircle.x = x - outerRadius;
  outerCircle.y = y - outerRadius;
  outerCircle.resize(outerRadius * 2, outerRadius * 2);
  outerCircle.fills = [{ type: 'SOLID', color }];
  
  const innerCircle = figma.createEllipse();
  innerCircle.x = x - innerRadius;
  innerCircle.y = y - innerRadius;
  innerCircle.resize(innerRadius * 2, innerRadius * 2);
  innerCircle.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
  
  const group = figma.group([outerCircle, innerCircle], figma.currentPage);
  group.name = "Ring";
  return group;
}
```

### 3. Linie i strzałki

```typescript
// Prosta linia
function createLine(x1: number, y1: number, x2: number, y2: number, weight: number = 1) {
  const line = figma.createLine();
  line.x = x1;
  line.y = y1;
  line.resize(x2 - x1, y2 - y1);
  line.strokes = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }];
  line.strokeWeight = weight;
  return line;
}

// Strzałka
function createArrow(x1: number, y1: number, x2: number, y2: number, headSize: number = 10) {
  const line = createLine(x1, y1, x2, y2);
  
  // Obliczanie kąta strzałki
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const headAngle1 = angle - Math.PI / 6;
  const headAngle2 = angle + Math.PI / 6;
  
  // Tworzenie grotu strzałki
  const head1 = figma.createLine();
  head1.x = x2;
  head1.y = y2;
  head1.resize(Math.cos(headAngle1) * headSize, Math.sin(headAngle1) * headSize);
  head1.strokes = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }];
  head1.strokeWeight = 2;
  
  const head2 = figma.createLine();
  head2.x = x2;
  head2.y = y2;
  head2.resize(Math.cos(headAngle2) * headSize, Math.sin(headAngle2) * headSize);
  head2.strokes = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }];
  head2.strokeWeight = 2;
  
  const arrow = figma.group([line, head1, head2], figma.currentPage);
  arrow.name = "Arrow";
  return arrow;
}

// Linia przerywana
function createDashedLine(x1: number, y1: number, x2: number, y2: number) {
  const line = figma.createLine();
  line.x = x1;
  line.y = y1;
  line.resize(x2 - x1, y2 - y1);
  line.strokes = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }];
  line.strokeWeight = 2;
  line.dashPattern = [5, 5]; // Wzór przerywania
  return line;
}
```

## Elementy tekstowe

### 1. Podstawowy tekst

```typescript
// Prosty tekst
function createText(x: number, y: number, text: string, fontSize: number = 16) {
  const textNode = figma.createText();
  textNode.x = x;
  textNode.y = y;
  textNode.characters = text;
  textNode.fontSize = fontSize;
  textNode.fontName = { family: "Inter", style: "Regular" };
  textNode.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }];
  return textNode;
}

// Tekst z różnymi stylami
function createStyledText(x: number, y: number, text: string, style: TextStyle) {
  const textNode = figma.createText();
  textNode.x = x;
  textNode.y = y;
  textNode.characters = text;
  textNode.fontSize = style.fontSize || 16;
  textNode.fontName = { family: style.fontFamily || "Inter", style: style.fontStyle || "Regular" };
  textNode.fills = [{ type: 'SOLID', color: style.color || { r: 0, g: 0, b: 0 } }];
  textNode.textAlignHorizontal = style.align || "LEFT";
  textNode.textAlignVertical = "CENTER";
  return textNode;
}

// Tekst z tłem
function createTextWithBackground(x: number, y: number, text: string, backgroundColor: RGB) {
  const textNode = createText(x, y, text);
  const textBounds = textNode.absoluteBoundingBox;
  
  const background = figma.createRectangle();
  background.x = textBounds.x - 8;
  background.y = textBounds.y - 4;
  background.resize(textBounds.width + 16, textBounds.height + 8);
  background.fills = [{ type: 'SOLID', color: backgroundColor }];
  background.cornerRadius = 4;
  
  const group = figma.group([background, textNode], figma.currentPage);
  group.name = "Text with Background";
  return group;
}
```

### 2. Typografia i hierarchia

```typescript
// Nagłówek H1
function createHeading1(x: number, y: number, text: string) {
  const heading = figma.createText();
  heading.x = x;
  heading.y = y;
  heading.characters = text;
  heading.fontSize = 32;
  heading.fontName = { family: "Inter", style: "Bold" };
  heading.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }];
  return heading;
}

// Nagłówek H2
function createHeading2(x: number, y: number, text: string) {
  const heading = figma.createText();
  heading.x = x;
  heading.y = y;
  heading.characters = text;
  heading.fontSize = 24;
  heading.fontName = { family: "Inter", style: "SemiBold" };
  heading.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }];
  return heading;
}

// Paragraf
function createParagraph(x: number, y: number, text: string, maxWidth: number = 400) {
  const paragraph = figma.createText();
  paragraph.x = x;
  paragraph.y = y;
  paragraph.characters = text;
  paragraph.fontSize = 16;
  paragraph.fontName = { family: "Inter", style: "Regular" };
  paragraph.fills = [{ type: 'SOLID', color: { r: 0.2, g: 0.2, b: 0.2 } }];
  paragraph.resize(maxWidth, 0); // Auto-height
  paragraph.textAutoResize = "HEIGHT";
  return paragraph;
}
```

## Kontenery i układy

### 1. Ramki z różnymi układami

```typescript
// Ramka z układem pionowym
function createVerticalFrame(x: number, y: number, width: number, children: SceneNode[]) {
  const frame = figma.createFrame();
  frame.x = x;
  frame.y = y;
  frame.resize(width, 0);
  frame.layoutMode = "VERTICAL";
  frame.primaryAxisSizingMode = "AUTO";
  frame.counterAxisSizingMode = "AUTO";
  frame.itemSpacing = 16;
  frame.paddingAll = 24;
  frame.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
  
  children.forEach(child => {
    frame.appendChild(child);
  });
  
  return frame;
}

// Ramka z układem poziomym
function createHorizontalFrame(x: number, y: number, height: number, children: SceneNode[]) {
  const frame = figma.createFrame();
  frame.x = x;
  frame.y = y;
  frame.resize(0, height);
  frame.layoutMode = "HORIZONTAL";
  frame.primaryAxisSizingMode = "AUTO";
  frame.counterAxisSizingMode = "AUTO";
  frame.itemSpacing = 16;
  frame.paddingAll = 24;
  frame.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
  
  children.forEach(child => {
    frame.appendChild(child);
  });
  
  return frame;
}

// Ramka z układem siatki
function createGridFrame(x: number, y: number, columns: number, children: SceneNode[]) {
  const frame = figma.createFrame();
  frame.x = x;
  frame.y = y;
  frame.layoutMode = "NONE"; // Grid nie jest bezpośrednio obsługiwany
  frame.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
  
  // Ręczne rozmieszczenie elementów w siatce
  const itemWidth = 100;
  const itemHeight = 100;
  const spacing = 16;
  
  children.forEach((child, index) => {
    const row = Math.floor(index / columns);
    const col = index % columns;
    
    child.x = col * (itemWidth + spacing);
    child.y = row * (itemHeight + spacing);
    child.resize(itemWidth, itemHeight);
    
    frame.appendChild(child);
  });
  
  return frame;
}
```

### 2. Karty i panele

```typescript
// Karta z cieniem
function createCard(x: number, y: number, width: number, height: number, content: SceneNode[]) {
  const card = figma.createFrame();
  card.x = x;
  card.y = y;
  card.resize(width, height);
  card.layoutMode = "VERTICAL";
  card.primaryAxisSizingMode = "AUTO";
  card.counterAxisSizingMode = "AUTO";
  card.itemSpacing = 16;
  card.paddingAll = 24;
  card.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
  card.cornerRadius = 8;
  card.effects = [{
    type: 'DROP_SHADOW',
    color: { r: 0, g: 0, b: 0, a: 0.1 },
    offset: { x: 0, y: 2 },
    radius: 8,
    spread: 0,
    visible: true,
    blendMode: 'NORMAL'
  }];
  
  content.forEach(child => {
    card.appendChild(child);
  });
  
  return card;
}

// Panel boczny
function createSidebar(x: number, y: number, width: number, height: number, content: SceneNode[]) {
  const sidebar = figma.createFrame();
  sidebar.x = x;
  sidebar.y = y;
  sidebar.resize(width, height);
  sidebar.layoutMode = "VERTICAL";
  sidebar.primaryAxisSizingMode = "AUTO";
  sidebar.counterAxisSizingMode = "AUTO";
  sidebar.itemSpacing = 8;
  sidebar.paddingAll = 16;
  sidebar.fills = [{ type: 'SOLID', color: { r: 0.95, g: 0.95, b: 0.95 } }];
  
  content.forEach(child => {
    sidebar.appendChild(child);
  });
  
  return sidebar;
}
```

## Komponenty i warianty

### 1. Przyciski

```typescript
// Podstawowy przycisk
function createButton(x: number, y: number, text: string, variant: 'primary' | 'secondary' = 'primary') {
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
  
  // Stylowanie w zależności od wariantu
  if (variant === 'primary') {
    button.fills = [{ type: 'SOLID', color: { r: 0.2, g: 0.5, b: 1 } }];
    buttonText.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
  } else {
    button.fills = [{ type: 'SOLID', color: { r: 0.9, g: 0.9, b: 0.9 } }];
    buttonText.fills = [{ type: 'SOLID', color: { r: 0.2, g: 0.2, b: 0.2 } }];
  }
  
  button.appendChild(buttonText);
  return button;
}

// Przycisk z wariantami
function createButtonWithVariants(x: number, y: number, text: string) {
  const button = createButton(x, y, text);
  
  // Wariant hover
  const hoverVariant = button.createVariant();
  hoverVariant.name = "Hover";
  hoverVariant.fills = [{ type: 'SOLID', color: { r: 0.1, g: 0.4, b: 0.9 } }];
  
  // Wariant disabled
  const disabledVariant = button.createVariant();
  disabledVariant.name = "Disabled";
  disabledVariant.fills = [{ type: 'SOLID', color: { r: 0.8, g: 0.8, b: 0.8 } }];
  
  return button;
}
```

### 2. Pola input

```typescript
// Pole tekstowe
function createInputField(x: number, y: number, width: number, placeholder: string = "") {
  const input = figma.createFrame();
  input.x = x;
  input.y = y;
  input.resize(width, 40);
  input.layoutMode = "HORIZONTAL";
  input.primaryAxisSizingMode = "AUTO";
  input.counterAxisSizingMode = "AUTO";
  input.itemSpacing = 8;
  input.paddingLeft = 12;
  input.paddingRight = 12;
  input.paddingTop = 8;
  input.paddingBottom = 8;
  input.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
  input.strokes = [{ type: 'SOLID', color: { r: 0.8, g: 0.8, b: 0.8 } }];
  input.strokeWeight = 1;
  input.cornerRadius = 4;
  
  // Placeholder text
  const placeholderText = figma.createText();
  placeholderText.characters = placeholder;
  placeholderText.fontSize = 14;
  placeholderText.fontName = { family: "Inter", style: "Regular" };
  placeholderText.fills = [{ type: 'SOLID', color: { r: 0.6, g: 0.6, b: 0.6 } }];
  
  input.appendChild(placeholderText);
  return input;
}
```

## Wizualizacje danych

### 1. Wykresy słupkowe

```typescript
// Wykres słupkowy
function createBarChart(x: number, y: number, data: { label: string, value: number }[], maxWidth: number = 400) {
  const chartFrame = figma.createFrame();
  chartFrame.x = x;
  chartFrame.y = y;
  chartFrame.layoutMode = "HORIZONTAL";
  chartFrame.primaryAxisSizingMode = "AUTO";
  chartFrame.counterAxisSizingMode = "AUTO";
  chartFrame.itemSpacing = 8;
  chartFrame.paddingAll = 24;
  chartFrame.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
  
  const maxValue = Math.max(...data.map(d => d.value));
  const barWidth = maxWidth / data.length - 8;
  
  data.forEach((item, index) => {
    const barHeight = (item.value / maxValue) * 200;
    
    // Słupek
    const bar = figma.createRectangle();
    bar.resize(barWidth, barHeight);
    bar.fills = [{ type: 'SOLID', color: { r: 0.2, g: 0.5, b: 1 } }];
    bar.cornerRadius = 2;
    
    // Etykieta
    const label = figma.createText();
    label.characters = item.label;
    label.fontSize = 12;
    label.fontName = { family: "Inter", style: "Regular" };
    label.textAlignHorizontal = "CENTER";
    label.fills = [{ type: 'SOLID', color: { r: 0.4, g: 0.4, b: 0.4 } }];
    
    // Grupa słupka
    const barGroup = figma.createFrame();
    barGroup.layoutMode = "VERTICAL";
    barGroup.primaryAxisSizingMode = "AUTO";
    barGroup.counterAxisSizingMode = "AUTO";
    barGroup.itemSpacing = 4;
    barGroup.appendChild(bar);
    barGroup.appendChild(label);
    
    chartFrame.appendChild(barGroup);
  });
  
  return chartFrame;
}
```

### 2. Wykresy kołowe

```typescript
// Wykres kołowy (uproszczony)
function createPieChart(x: number, y: number, data: { label: string, value: number, color: RGB }[], radius: number = 100) {
  const chartFrame = figma.createFrame();
  chartFrame.x = x;
  chartFrame.y = y;
  chartFrame.layoutMode = "HORIZONTAL";
  chartFrame.primaryAxisSizingMode = "AUTO";
  chartFrame.counterAxisSizingMode = "AUTO";
  chartFrame.itemSpacing = 24;
  chartFrame.paddingAll = 24;
  chartFrame.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
  
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let currentAngle = 0;
  
  // Tworzenie segmentów (uproszczone jako prostokąty)
  data.forEach((item, index) => {
    const percentage = item.value / total;
    const segmentWidth = percentage * 200;
    
    // Segment jako prostokąt
    const segment = figma.createRectangle();
    segment.resize(segmentWidth, 20);
    segment.fills = [{ type: 'SOLID', color: item.color }];
    segment.cornerRadius = 2;
    
    // Etykieta
    const label = figma.createText();
    label.characters = `${item.label} (${Math.round(percentage * 100)}%)`;
    label.fontSize = 12;
    label.fontName = { family: "Inter", style: "Regular" };
    label.fills = [{ type: 'SOLID', color: { r: 0.4, g: 0.4, b: 0.4 } }];
    
    // Grupa segmentu
    const segmentGroup = figma.createFrame();
    segmentGroup.layoutMode = "HORIZONTAL";
    segmentGroup.primaryAxisSizingMode = "AUTO";
    segmentGroup.counterAxisSizingMode = "AUTO";
    segmentGroup.itemSpacing = 8;
    segmentGroup.appendChild(segment);
    segmentGroup.appendChild(label);
    
    chartFrame.appendChild(segmentGroup);
  });
  
  return chartFrame;
}
```

## Elementy interaktywne

### 1. Karty z hover states

```typescript
// Karta z różnymi stanami
function createInteractiveCard(x: number, y: number, width: number, height: number, content: SceneNode[]) {
  const card = figma.createComponent();
  card.name = "Interactive Card";
  card.x = x;
  card.y = y;
  card.resize(width, height);
  card.layoutMode = "VERTICAL";
  card.primaryAxisSizingMode = "AUTO";
  card.counterAxisSizingMode = "AUTO";
  card.itemSpacing = 16;
  card.paddingAll = 24;
  card.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
  card.cornerRadius = 8;
  card.effects = [{
    type: 'DROP_SHADOW',
    color: { r: 0, g: 0, b: 0, a: 0.1 },
    offset: { x: 0, y: 2 },
    radius: 4,
    spread: 0,
    visible: true,
    blendMode: 'NORMAL'
  }];
  
  content.forEach(child => {
    card.appendChild(child);
  });
  
  // Stan hover
  const hoverVariant = card.createVariant();
  hoverVariant.name = "Hover";
  hoverVariant.effects = [{
    type: 'DROP_SHADOW',
    color: { r: 0, g: 0, b: 0, a: 0.2 },
    offset: { x: 0, y: 4 },
    radius: 8,
    spread: 0,
    visible: true,
    blendMode: 'NORMAL'
  }];
  
  // Stan selected
  const selectedVariant = card.createVariant();
  selectedVariant.name = "Selected";
  selectedVariant.strokes = [{ type: 'SOLID', color: { r: 0.2, g: 0.5, b: 1 } }];
  selectedVariant.strokeWeight = 2;
  
  return card;
}
```

## Systemy designu

### 1. Paleta kolorów

```typescript
// Generator palety kolorów
function createColorPalette(x: number, y: number, colors: { name: string, hex: string, description?: string }[]) {
  const paletteFrame = figma.createFrame();
  paletteFrame.x = x;
  paletteFrame.y = y;
  paletteFrame.layoutMode = "VERTICAL";
  paletteFrame.primaryAxisSizingMode = "AUTO";
  paletteFrame.counterAxisSizingMode = "AUTO";
  paletteFrame.itemSpacing = 16;
  paletteFrame.paddingAll = 24;
  paletteFrame.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
  paletteFrame.name = "Color Palette";
  
  colors.forEach(color => {
    const colorGroup = figma.createFrame();
    colorGroup.layoutMode = "HORIZONTAL";
    colorGroup.primaryAxisSizingMode = "AUTO";
    colorGroup.counterAxisSizingMode = "AUTO";
    colorGroup.itemSpacing = 16;
    colorGroup.resize(300, 60);
    
    // Próbka koloru
    const swatch = figma.createRectangle();
    swatch.resize(60, 60);
    swatch.fills = [{ type: 'SOLID', color: hexToRgb(color.hex) }];
    swatch.cornerRadius = 8;
    
    // Informacje o kolorze
    const infoFrame = figma.createFrame();
    infoFrame.layoutMode = "VERTICAL";
    infoFrame.primaryAxisSizingMode = "AUTO";
    infoFrame.counterAxisSizingMode = "AUTO";
    infoFrame.itemSpacing = 4;
    infoFrame.resize(200, 60);
    
    // Nazwa koloru
    const nameText = figma.createText();
    nameText.characters = color.name;
    nameText.fontSize = 16;
    nameText.fontName = { family: "Inter", style: "SemiBold" };
    nameText.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }];
    
    // Wartość hex
    const hexText = figma.createText();
    hexText.characters = color.hex;
    hexText.fontSize = 14;
    hexText.fontName = { family: "Inter", style: "Regular" };
    hexText.fills = [{ type: 'SOLID', color: { r: 0.5, g: 0.5, b: 0.5 } }];
    
    // Opis (jeśli istnieje)
    if (color.description) {
      const descText = figma.createText();
      descText.characters = color.description;
      descText.fontSize = 12;
      descText.fontName = { family: "Inter", style: "Regular" };
      descText.fills = [{ type: 'SOLID', color: { r: 0.6, g: 0.6, b: 0.6 } }];
      infoFrame.appendChild(descText);
    }
    
    infoFrame.appendChild(nameText);
    infoFrame.appendChild(hexText);
    
    colorGroup.appendChild(swatch);
    colorGroup.appendChild(infoFrame);
    paletteFrame.appendChild(colorGroup);
  });
  
  return paletteFrame;
}

function hexToRgb(hex: string): RGB {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16) / 255,
    g: parseInt(result[2], 16) / 255,
    b: parseInt(result[3], 16) / 255
  } : { r: 0, g: 0, b: 0 };
}
```

### 2. Typografia

```typescript
// System typografii
function createTypographySystem(x: number, y: number, styles: TextStyle[]) {
  const typographyFrame = figma.createFrame();
  typographyFrame.x = x;
  typographyFrame.y = y;
  typographyFrame.layoutMode = "VERTICAL";
  typographyFrame.primaryAxisSizingMode = "AUTO";
  typographyFrame.counterAxisSizingMode = "AUTO";
  typographyFrame.itemSpacing = 24;
  typographyFrame.paddingAll = 24;
  typographyFrame.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
  typographyFrame.name = "Typography System";
  
  styles.forEach(style => {
    const styleGroup = figma.createFrame();
    styleGroup.layoutMode = "VERTICAL";
    styleGroup.primaryAxisSizingMode = "AUTO";
    styleGroup.counterAxisSizingMode = "AUTO";
    styleGroup.itemSpacing = 8;
    styleGroup.resize(400, 0);
    
    // Przykład tekstu
    const exampleText = figma.createText();
    exampleText.characters = style.example || "The quick brown fox jumps over the lazy dog";
    exampleText.fontSize = style.fontSize;
    exampleText.fontName = { family: style.fontFamily, style: style.fontStyle };
    exampleText.fills = [{ type: 'SOLID', color: style.color }];
    exampleText.resize(400, 0);
    exampleText.textAutoResize = "HEIGHT";
    
    // Informacje o stylu
    const infoText = figma.createText();
    infoText.characters = `${style.name} • ${style.fontSize}px • ${style.fontFamily} ${style.fontStyle}`;
    infoText.fontSize = 12;
    infoText.fontName = { family: "Inter", style: "Regular" };
    infoText.fills = [{ type: 'SOLID', color: { r: 0.5, g: 0.5, b: 0.5 } }];
    
    styleGroup.appendChild(exampleText);
    styleGroup.appendChild(infoText);
    typographyFrame.appendChild(styleGroup);
  });
  
  return typographyFrame;
}

interface TextStyle {
  name: string;
  fontSize: number;
  fontFamily: string;
  fontStyle: string;
  color: RGB;
  example?: string;
}
```

## Elementy specjalistyczne

### 1. Diagramy przepływu

```typescript
// Diagram przepływu
function createFlowDiagram(x: number, y: number, steps: FlowStep[]) {
  const diagramFrame = figma.createFrame();
  diagramFrame.x = x;
  diagramFrame.y = y;
  diagramFrame.layoutMode = "HORIZONTAL";
  diagramFrame.primaryAxisSizingMode = "AUTO";
  diagramFrame.counterAxisSizingMode = "AUTO";
  diagramFrame.itemSpacing = 40;
  diagramFrame.paddingAll = 24;
  diagramFrame.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
  diagramFrame.name = "Flow Diagram";
  
  steps.forEach((step, index) => {
    // Kształt kroku
    const shape = createFlowShape(step.type, step.text);
    
    // Dodawanie do diagramu
    diagramFrame.appendChild(shape);
    
    // Strzałka do następnego kroku
    if (index < steps.length - 1) {
      const arrow = createArrow(0, 0, 40, 0);
      diagramFrame.appendChild(arrow);
    }
  });
  
  return diagramFrame;
}

function createFlowShape(type: 'rectangle' | 'diamond' | 'circle', text: string) {
  let shape: SceneNode;
  
  switch (type) {
    case 'rectangle':
      shape = figma.createRectangle();
      shape.resize(120, 60);
      shape.cornerRadius = 8;
      break;
    case 'diamond':
      shape = figma.createPolygon();
      shape.resize(120, 60);
      break;
    case 'circle':
      shape = figma.createEllipse();
      shape.resize(120, 60);
      break;
  }
  
  shape.fills = [{ type: 'SOLID', color: { r: 0.9, g: 0.9, b: 0.9 } }];
  shape.strokes = [{ type: 'SOLID', color: { r: 0.2, g: 0.2, b: 0.2 } }];
  shape.strokeWeight = 2;
  
  // Tekst w kształcie
  const textNode = figma.createText();
  textNode.characters = text;
  textNode.fontSize = 14;
  textNode.fontName = { family: "Inter", style: "Medium" };
  textNode.textAlignHorizontal = "CENTER";
  textNode.textAlignVertical = "CENTER";
  textNode.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }];
  textNode.resize(120, 60);
  
  const group = figma.group([shape, textNode], figma.currentPage);
  group.name = `Flow Step: ${text}`;
  return group;
}

interface FlowStep {
  type: 'rectangle' | 'diamond' | 'circle';
  text: string;
}
```

### 2. Ikony i symbole

```typescript
// Generator ikon
function createIcon(x: number, y: number, iconType: string, size: number = 24) {
  const iconFrame = figma.createFrame();
  iconFrame.x = x;
  iconFrame.y = y;
  iconFrame.resize(size, size);
  iconFrame.fills = [];
  iconFrame.name = `Icon: ${iconType}`;
  
  switch (iconType) {
    case 'home':
      return createHomeIcon(iconFrame, size);
    case 'user':
      return createUserIcon(iconFrame, size);
    case 'settings':
      return createSettingsIcon(iconFrame, size);
    case 'search':
      return createSearchIcon(iconFrame, size);
    default:
      return createDefaultIcon(iconFrame, size);
  }
}

function createHomeIcon(frame: FrameNode, size: number) {
  // Tworzenie ikony domu z prostokątów i trójkąta
  const base = figma.createRectangle();
  base.resize(size * 0.6, size * 0.4);
  base.x = size * 0.2;
  base.y = size * 0.4;
  base.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }];
  
  const roof = figma.createPolygon();
  roof.resize(size * 0.8, size * 0.4);
  roof.x = size * 0.1;
  roof.y = size * 0.1;
  roof.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }];
  
  const door = figma.createRectangle();
  door.resize(size * 0.15, size * 0.25);
  door.x = size * 0.35;
  door.y = size * 0.55;
  door.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
  
  frame.appendChild(roof);
  frame.appendChild(base);
  frame.appendChild(door);
  
  return frame;
}

function createUserIcon(frame: FrameNode, size: number) {
  // Tworzenie ikony użytkownika z koła i prostokąta
  const head = figma.createEllipse();
  head.resize(size * 0.4, size * 0.4);
  head.x = size * 0.3;
  head.y = size * 0.1;
  head.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }];
  
  const body = figma.createRectangle();
  body.resize(size * 0.6, size * 0.4);
  body.x = size * 0.2;
  body.y = size * 0.5;
  body.cornerRadius = size * 0.1;
  body.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }];
  
  frame.appendChild(head);
  frame.appendChild(body);
  
  return frame;
}
```

## Podsumowanie

Wtyczki Figma mogą tworzyć praktycznie każdy element, który można narysować w Figma:

- **Kształty podstawowe**: Prostokąty, elipsy, linie, wielokąty
- **Tekst**: Z różnymi stylami, czcionkami i formatowaniem
- **Kontenery**: Ramki, grupy, komponenty z różnymi układami
- **Wizualizacje**: Wykresy, diagramy, infografiki
- **Elementy interaktywne**: Przyciski, pola input, karty z stanami
- **Systemy designu**: Palety kolorów, typografia, ikony
- **Elementy specjalistyczne**: Diagramy, schematy, prototypy

Kluczem do skutecznego tworzenia wtyczek jest zrozumienie API Figma i umiejętność łączenia podstawowych elementów w bardziej złożone struktury.
