# Przykłady Elementów Tworzonych przez Wtyczki Figma

Praktyczny przewodnik z konkretnymi przykładami kodu dla tworzenia różnych elementów w Figmie.

## 1. Podstawowe Kształty

### 1.1 Prostokąt z zaokrąglonymi rogami

```javascript
function createRoundedRectangle() {
  const rect = figma.createRectangle();
  
  // Rozmiar i pozycja
  rect.resize(200, 100);
  rect.x = 50;
  rect.y = 50;
  
  // Zaokrąglone rogi
  rect.cornerRadius = 12;
  
  // Wypełnienie
  rect.fills = [{
    type: 'SOLID',
    color: {r: 0.2, g: 0.6, b: 1.0} // niebieski
  }];
  
  // Obramowanie
  rect.strokes = [{
    type: 'SOLID',
    color: {r: 0, g: 0, b: 0} // czarne
  }];
  rect.strokeWeight = 2;
  
  figma.currentPage.appendChild(rect);
  return rect;
}
```

### 1.2 Koło z gradientem

```javascript
function createGradientCircle() {
  const circle = figma.createEllipse();
  
  circle.resize(150, 150);
  circle.x = 300;
  circle.y = 50;
  
  // Gradient radialny
  circle.fills = [{
    type: 'GRADIENT_RADIAL',
    gradientStops: [
      {color: {r: 1, g: 0.8, b: 0}, position: 0},      // żółty środek
      {color: {r: 1, g: 0.2, b: 0.2}, position: 0.7},  // czerwony
      {color: {r: 0.5, g: 0, b: 0.5}, position: 1}     // fioletowy zewnętrzny
    ],
    gradientTransform: [
      [1, 0, 0.5],
      [0, 1, 0.5]
    ]
  }];
  
  figma.currentPage.appendChild(circle);
  return circle;
}
```

### 1.3 Gwiazda z customowymi właściwościami

```javascript
function createCustomStar() {
  const star = figma.createStar();
  
  star.resize(120, 120);
  star.x = 500;
  star.y = 50;
  
  // Właściwości gwiazdy
  star.pointCount = 8;          // 8 ramion
  star.innerRadius = 0.3;       // stosunek wewnętrznego do zewnętrznego promienia
  
  // Stylowanie
  star.fills = [{
    type: 'SOLID',
    color: {r: 1, g: 0.7, b: 0}  // złoty
  }];
  
  // Efekt cienia
  star.effects = [{
    type: 'DROP_SHADOW',
    visible: true,
    color: {r: 0, g: 0, b: 0, a: 0.3},
    blendMode: 'NORMAL',
    offset: {x: 5, y: 5},
    radius: 10,
    spread: 0
  }];
  
  figma.currentPage.appendChild(star);
  return star;
}
```

## 2. Tekst i Typografia

### 2.1 Formatowany tekst z różnymi stylami

```javascript
async function createStyledText() {
  // Załaduj potrzebne czcionki
  await figma.loadFontAsync({family: "Inter", style: "Regular"});
  await figma.loadFontAsync({family: "Inter", style: "Bold"});
  await figma.loadFontAsync({family: "Inter", style: "Italic"});
  
  const textNode = figma.createText();
  textNode.characters = "Hello World!\nThis is styled text";
  textNode.x = 50;
  textNode.y = 250;
  
  // Globalne właściwości
  textNode.fontSize = 24;
  textNode.fontName = {family: "Inter", style: "Regular"};
  textNode.lineHeight = {unit: "AUTO"};
  
  // Stylowanie fragmentów tekstu
  // "Hello" - bold i czerwony
  textNode.setRangeFontName(0, 5, {family: "Inter", style: "Bold"});
  textNode.setRangeFills(0, 5, [
    {type: 'SOLID', color: {r: 1, g: 0, b: 0}}
  ]);
  
  // "World!" - italic i niebieski  
  textNode.setRangeFontName(6, 12, {family: "Inter", style: "Italic"});
  textNode.setRangeFills(6, 12, [
    {type: 'SOLID', color: {r: 0, g: 0, b: 1}}
  ]);
  
  figma.currentPage.appendChild(textNode);
  return textNode;
}
```

### 2.2 Tekst na ścieżce

```javascript
async function createTextOnPath() {
  await figma.loadFontAsync({family: "Inter", style: "Regular"});
  
  // Utwórz ścieżkę (półkole)
  const path = figma.createVector();
  path.vectorPaths = [{
    windingRule: "NONZERO",
    data: "M 0 100 Q 100 0 200 100" // krzywa Béziera
  }];
  
  // Tekst na ścieżce
  const textPath = figma.createText();
  textPath.characters = "Text flowing along a curved path";
  textPath.fontSize = 16;
  textPath.fontName = {family: "Inter", style: "Regular"};
  
  // Ustaw ścieżkę dla tekstu (to wymaga bardziej zaawansowanego API)
  textPath.x = 50;
  textPath.y = 400;
  
  figma.currentPage.appendChild(textPath);
  return textPath;
}
```

## 3. Komponenty i Instancje

### 3.1 Komponent Button z wariantami

```javascript
async function createButtonComponent() {
  await figma.loadFontAsync({family: "Inter", style: "Medium"});
  
  // Główny komponent
  const component = figma.createComponent();
  component.name = "Button";
  component.resize(120, 44);
  component.x = 50;
  component.y = 500;
  
  // Tło przycisku
  const background = figma.createRectangle();
  background.name = "Background";
  background.resize(120, 44);
  background.cornerRadius = 8;
  background.fills = [{
    type: 'SOLID',
    color: {r: 0.2, g: 0.6, b: 1} // niebieski
  }];
  
  // Tekst przycisku
  const label = figma.createText();
  label.name = "Label";
  label.characters = "Click me";
  label.fontSize = 16;
  label.fontName = {family: "Inter", style: "Medium"};
  label.fills = [{
    type: 'SOLID',
    color: {r: 1, g: 1, b: 1} // biały
  }];
  
  // Wyśrodkowanie tekstu
  label.x = (120 - label.width) / 2;
  label.y = (44 - label.height) / 2;
  
  // Dodaj do komponentu
  component.appendChild(background);
  component.appendChild(label);
  
  // Twórz instancje z różnymi stylami
  const primaryInstance = component.createInstance();
  primaryInstance.x = 200;
  primaryInstance.y = 500;
  
  const secondaryInstance = component.createInstance(); 
  secondaryInstance.x = 350;
  secondaryInstance.y = 500;
  
  // Nadpisz style w instancji secondary
  const secondaryBg = secondaryInstance.findOne(n => n.name === "Background") as RectangleNode;
  if (secondaryBg) {
    secondaryBg.fills = [{
      type: 'SOLID',
      color: {r: 0.9, g: 0.9, b: 0.9}
    }];
    secondaryBg.strokes = [{
      type: 'SOLID', 
      color: {r: 0.2, g: 0.6, b: 1}
    }];
    secondaryBg.strokeWeight = 1;
  }
  
  const secondaryLabel = secondaryInstance.findOne(n => n.name === "Label") as TextNode;
  if (secondaryLabel) {
    secondaryLabel.fills = [{
      type: 'SOLID',
      color: {r: 0.2, g: 0.6, b: 1}
    }];
  }
  
  return {component, primaryInstance, secondaryInstance};
}
```

### 3.2 Card Component z Auto Layout

```javascript
async function createCardComponent() {
  await figma.loadFontAsync({family: "Inter", style: "Regular"});
  await figma.loadFontAsync({family: "Inter", style: "Bold"});
  
  const card = figma.createComponent();
  card.name = "Card";
  card.x = 50;
  card.y = 600;
  
  // Ustaw Auto Layout
  card.layoutMode = "VERTICAL";
  card.itemSpacing = 16;
  card.paddingTop = 24;
  card.paddingRight = 24;
  card.paddingBottom = 24;
  card.paddingLeft = 24;
  card.primaryAxisSizingMode = "AUTO";
  card.counterAxisSizingMode = "FIXED";
  card.resize(300, 200);
  
  // Tło karty
  card.fills = [{
    type: 'SOLID',
    color: {r: 1, g: 1, b: 1}
  }];
  card.strokes = [{
    type: 'SOLID',
    color: {r: 0.9, g: 0.9, b: 0.9}
  }];
  card.strokeWeight = 1;
  card.cornerRadius = 12;
  
  // Efekt cienia
  card.effects = [{
    type: 'DROP_SHADOW',
    visible: true,
    color: {r: 0, g: 0, b: 0, a: 0.1},
    blendMode: 'NORMAL',
    offset: {x: 0, y: 4},
    radius: 12,
    spread: 0
  }];
  
  // Nagłówek
  const title = figma.createText();
  title.name = "Title";
  title.characters = "Card Title";
  title.fontSize = 18;
  title.fontName = {family: "Inter", style: "Bold"};
  title.fills = [{
    type: 'SOLID',
    color: {r: 0.1, g: 0.1, b: 0.1}
  }];
  
  // Opis
  const description = figma.createText();
  description.name = "Description";
  description.characters = "This is a description of the card content. It can be multiple lines long and will wrap accordingly.";
  description.fontSize = 14;
  description.fontName = {family: "Inter", style: "Regular"};
  description.fills = [{
    type: 'SOLID',
    color: {r: 0.4, g: 0.4, b: 0.4}
  }];
  description.lineHeight = {unit: "PERCENT", value: 140};
  description.textAutoResize = "WIDTH_AND_HEIGHT";
  
  // Dodaj elementy do karty
  card.appendChild(title);
  card.appendChild(description);
  
  return card;
}
```

## 4. Złożone Układy

### 4.1 Dashboard Grid Layout

```javascript
function createDashboardGrid() {
  const dashboard = figma.createFrame();
  dashboard.name = "Dashboard Grid";
  dashboard.resize(800, 600);
  dashboard.x = 50;
  dashboard.y = 850;
  
  // Tło dashboardu
  dashboard.fills = [{
    type: 'SOLID',
    color: {r: 0.97, g: 0.97, b: 0.97}
  }];
  
  // Layout grid
  dashboard.layoutMode = "VERTICAL";
  dashboard.itemSpacing = 24;
  dashboard.paddingTop = 24;
  dashboard.paddingRight = 24;
  dashboard.paddingBottom = 24;
  dashboard.paddingLeft = 24;
  
  // Nagłówek dashboardu
  const header = figma.createFrame();
  header.name = "Header";
  header.layoutMode = "HORIZONTAL";
  header.primaryAxisSizingMode = "FIXED";
  header.counterAxisSizingMode = "AUTO";
  header.itemSpacing = 16;
  header.fills = [];
  
  const title = figma.createText();
  title.characters = "Analytics Dashboard";
  title.fontSize = 28;
  // title.fontName = {family: "Inter", style: "Bold"};
  
  header.appendChild(title);
  dashboard.appendChild(header);
  
  // Grid kart statystyk
  const statsGrid = figma.createFrame();
  statsGrid.name = "Stats Grid";
  statsGrid.layoutMode = "HORIZONTAL";
  statsGrid.itemSpacing = 16;
  statsGrid.primaryAxisSizingMode = "FIXED";
  statsGrid.counterAxisSizingMode = "AUTO";
  statsGrid.fills = [];
  
  // Twórz karty statystyk
  const statCards = [
    {title: "Users", value: "12,543", change: "+12%"},
    {title: "Revenue", value: "$45,678", change: "+8%"},
    {title: "Orders", value: "1,234", change: "+15%"},
    {title: "Conversion", value: "3.4%", change: "-2%"}
  ];
  
  statCards.forEach((stat, index) => {
    const card = createStatCard(stat);
    statsGrid.appendChild(card);
  });
  
  dashboard.appendChild(statsGrid);
  
  return dashboard;
}

function createStatCard(data: {title: string, value: string, change: string}) {
  const card = figma.createFrame();
  card.name = `Stat Card - ${data.title}`;
  card.resize(180, 120);
  
  // Layout
  card.layoutMode = "VERTICAL";
  card.itemSpacing = 8;
  card.paddingTop = 20;
  card.paddingRight = 20;
  card.paddingBottom = 20;
  card.paddingLeft = 20;
  
  // Styling
  card.fills = [{type: 'SOLID', color: {r: 1, g: 1, b: 1}}];
  card.cornerRadius = 8;
  card.effects = [{
    type: 'DROP_SHADOW',
    visible: true,
    color: {r: 0, g: 0, b: 0, a: 0.06},
    blendMode: 'NORMAL',
    offset: {x: 0, y: 2},
    radius: 8,
    spread: 0
  }];
  
  // Title
  const title = figma.createText();
  title.characters = data.title;
  title.fontSize = 12;
  title.fills = [{type: 'SOLID', color: {r: 0.6, g: 0.6, b: 0.6}}];
  
  // Value
  const value = figma.createText();
  value.characters = data.value;
  value.fontSize = 24;
  value.fills = [{type: 'SOLID', color: {r: 0.1, g: 0.1, b: 0.1}}];
  
  // Change
  const change = figma.createText();
  change.characters = data.change;
  change.fontSize = 14;
  const isPositive = data.change.startsWith('+');
  change.fills = [{
    type: 'SOLID', 
    color: isPositive ? {r: 0, g: 0.7, b: 0.3} : {r: 0.9, g: 0.2, b: 0.2}
  }];
  
  card.appendChild(title);
  card.appendChild(value);
  card.appendChild(change);
  
  return card;
}
```

### 4.2 Form Layout z Input Fields

```javascript
async function createFormLayout() {
  await figma.loadFontAsync({family: "Inter", style: "Regular"});
  await figma.loadFontAsync({family: "Inter", style: "Medium"});
  
  const form = figma.createFrame();
  form.name = "Contact Form";
  form.resize(400, 500);
  form.x = 900;
  form.y = 50;
  
  // Layout
  form.layoutMode = "VERTICAL";
  form.itemSpacing = 20;
  form.paddingTop = 32;
  form.paddingRight = 32;
  form.paddingBottom = 32;
  form.paddingLeft = 32;
  
  // Tło formularza
  form.fills = [{type: 'SOLID', color: {r: 1, g: 1, b: 1}}];
  form.cornerRadius = 12;
  form.effects = [{
    type: 'DROP_SHADOW',
    visible: true,
    color: {r: 0, g: 0, b: 0, a: 0.1},
    blendMode: 'NORMAL',
    offset: {x: 0, y: 8},
    radius: 24,
    spread: 0
  }];
  
  // Nagłówek formularza
  const formTitle = figma.createText();
  formTitle.characters = "Contact Us";
  formTitle.fontSize = 24;
  formTitle.fontName = {family: "Inter", style: "Medium"};
  formTitle.fills = [{type: 'SOLID', color: {r: 0.1, g: 0.1, b: 0.1}}];
  
  // Pola formularza
  const fields = [
    {label: "Full Name", placeholder: "Enter your full name", type: "text"},
    {label: "Email", placeholder: "Enter your email address", type: "email"},
    {label: "Phone", placeholder: "Enter your phone number", type: "tel"},
    {label: "Message", placeholder: "Enter your message", type: "textarea"}
  ];
  
  form.appendChild(formTitle);
  
  fields.forEach(field => {
    const fieldGroup = createFormField(field);
    form.appendChild(fieldGroup);
  });
  
  // Submit button
  const submitButton = figma.createFrame();
  submitButton.name = "Submit Button";
  submitButton.resize(336, 48); // form width minus padding
  submitButton.cornerRadius = 8;
  submitButton.fills = [{type: 'SOLID', color: {r: 0.2, g: 0.6, b: 1}}];
  
  const buttonText = figma.createText();
  buttonText.characters = "Send Message";
  buttonText.fontSize = 16;
  buttonText.fontName = {family: "Inter", style: "Medium"};
  buttonText.fills = [{type: 'SOLID', color: {r: 1, g: 1, b: 1}}];
  
  // Wyśrodkowanie tekstu w przycisku
  buttonText.x = (submitButton.width - buttonText.width) / 2;
  buttonText.y = (submitButton.height - buttonText.height) / 2;
  
  submitButton.appendChild(buttonText);
  form.appendChild(submitButton);
  
  return form;
}

function createFormField(field: {label: string, placeholder: string, type: string}) {
  const fieldGroup = figma.createFrame();
  fieldGroup.name = `Field - ${field.label}`;
  fieldGroup.layoutMode = "VERTICAL";
  fieldGroup.itemSpacing = 8;
  fieldGroup.primaryAxisSizingMode = "FIXED";
  fieldGroup.counterAxisSizingMode = "AUTO";
  fieldGroup.fills = [];
  
  // Label
  const label = figma.createText();
  label.characters = field.label;
  label.fontSize = 14;
  label.fontName = {family: "Inter", style: "Medium"};
  label.fills = [{type: 'SOLID', color: {r: 0.2, g: 0.2, b: 0.2}}];
  
  // Input field
  const input = figma.createFrame();
  input.name = "Input";
  input.resize(336, field.type === "textarea" ? 100 : 48);
  input.cornerRadius = 6;
  input.fills = [{type: 'SOLID', color: {r: 0.98, g: 0.98, b: 0.98}}];
  input.strokes = [{type: 'SOLID', color: {r: 0.9, g: 0.9, b: 0.9}}];
  input.strokeWeight = 1;
  
  // Placeholder text
  const placeholder = figma.createText();
  placeholder.characters = field.placeholder;
  placeholder.fontSize = 14;
  placeholder.fills = [{type: 'SOLID', color: {r: 0.6, g: 0.6, b: 0.6}}];
  placeholder.x = 12;
  placeholder.y = field.type === "textarea" ? 12 : (48 - placeholder.height) / 2;
  
  input.appendChild(placeholder);
  fieldGroup.appendChild(label);
  fieldGroup.appendChild(input);
  
  return fieldGroup;
}
```

## 5. Wizualizacje Danych

### 5.1 Bar Chart Generator

```javascript
function createBarChart(data: Array<{label: string, value: number}>) {
  const chart = figma.createFrame();
  chart.name = "Bar Chart";
  chart.resize(600, 400);
  chart.x = 50;
  chart.y = 1500;
  
  // Tło wykresu
  chart.fills = [{type: 'SOLID', color: {r: 1, g: 1, b: 1}}];
  chart.cornerRadius = 8;
  
  // Znajdź maksymalną wartość dla skalowania
  const maxValue = Math.max(...data.map(d => d.value));
  const chartHeight = 300;
  const chartWidth = 500;
  const barWidth = chartWidth / data.length * 0.8;
  const barSpacing = chartWidth / data.length * 0.2;
  
  data.forEach((item, index) => {
    const barHeight = (item.value / maxValue) * chartHeight;
    const x = 50 + index * (barWidth + barSpacing);
    const y = 50 + (chartHeight - barHeight);
    
    // Słupek
    const bar = figma.createRectangle();
    bar.name = `Bar - ${item.label}`;
    bar.resize(barWidth, barHeight);
    bar.x = x;
    bar.y = y;
    bar.cornerRadius = 4;
    bar.fills = [{
      type: 'SOLID',
      color: {
        r: 0.2 + (index * 0.15) % 0.8,
        g: 0.6,
        b: 0.9 - (index * 0.1) % 0.4
      }
    }];
    
    // Label
    const label = figma.createText();
    label.characters = item.label;
    label.fontSize = 12;
    label.x = x + (barWidth - label.width) / 2;
    label.y = 50 + chartHeight + 10;
    label.fills = [{type: 'SOLID', color: {r: 0.3, g: 0.3, b: 0.3}}];
    
    // Value label
    const valueLabel = figma.createText();
    valueLabel.characters = item.value.toString();
    valueLabel.fontSize = 11;
    valueLabel.x = x + (barWidth - valueLabel.width) / 2;
    valueLabel.y = y - 20;
    valueLabel.fills = [{type: 'SOLID', color: {r: 0.2, g: 0.2, b: 0.2}}];
    
    chart.appendChild(bar);
    chart.appendChild(label);
    chart.appendChild(valueLabel);
  });
  
  return chart;
}

// Przykład użycia
const sampleData = [
  {label: "Jan", value: 150},
  {label: "Feb", value: 230},
  {label: "Mar", value: 180},
  {label: "Apr", value: 290},
  {label: "May", value: 320},
  {label: "Jun", value: 250}
];
// const chart = createBarChart(sampleData);
```

### 5.2 Progress Indicators

```javascript
function createProgressBar(percentage: number, label: string) {
  const container = figma.createFrame();
  container.name = `Progress - ${label}`;
  container.resize(300, 60);
  container.layoutMode = "VERTICAL";
  container.itemSpacing = 8;
  container.fills = [];
  
  // Label
  const labelText = figma.createText();
  labelText.characters = `${label} (${percentage}%)`;
  labelText.fontSize = 14;
  labelText.fills = [{type: 'SOLID', color: {r: 0.2, g: 0.2, b: 0.2}}];
  
  // Progress track
  const track = figma.createRectangle();
  track.name = "Track";
  track.resize(300, 8);
  track.cornerRadius = 4;
  track.fills = [{type: 'SOLID', color: {r: 0.9, g: 0.9, b: 0.9}}];
  
  // Progress fill
  const fill = figma.createRectangle();
  fill.name = "Fill";
  fill.resize((300 * percentage) / 100, 8);
  fill.cornerRadius = 4;
  fill.fills = [{
    type: 'GRADIENT_LINEAR',
    gradientStops: [
      {color: {r: 0.2, g: 0.8, b: 0.4}, position: 0},
      {color: {r: 0.1, g: 0.6, b: 0.3}, position: 1}
    ],
    gradientTransform: [
      [1, 0, 0],
      [0, 1, 0]
    ]
  }];
  
  container.appendChild(labelText);
  container.appendChild(track);
  container.appendChild(fill);
  
  return container;
}

// Przykład - zestaw progress barów
function createProgressSet() {
  const progressSet = figma.createFrame();
  progressSet.name = "Progress Set";
  progressSet.layoutMode = "VERTICAL";
  progressSet.itemSpacing = 16;
  progressSet.x = 700;
  progressSet.y = 1500;
  progressSet.fills = [];
  
  const progressData = [
    {label: "Design", percentage: 85},
    {label: "Development", percentage: 60},
    {label: "Testing", percentage: 30},
    {label: "Deployment", percentage: 10}
  ];
  
  progressData.forEach(data => {
    const progress = createProgressBar(data.percentage, data.label);
    progressSet.appendChild(progress);
  });
  
  return progressSet;
}
```

## 6. Efekty i Animacje

### 6.1 Loading Spinner

```javascript
function createLoadingSpinner() {
  const spinner = figma.createFrame();
  spinner.name = "Loading Spinner";
  spinner.resize(40, 40);
  spinner.x = 50;
  spinner.y = 2000;
  spinner.fills = [];
  
  // Tło koła
  const circle = figma.createEllipse();
  circle.resize(40, 40);
  circle.fills = [];
  circle.strokes = [{
    type: 'SOLID',
    color: {r: 0.9, g: 0.9, b: 0.9}
  }];
  circle.strokeWeight = 3;
  
  // Aktywny arc (symulacja przez gradient)
  const activeArc = figma.createEllipse();
  activeArc.resize(40, 40);
  activeArc.fills = [];
  activeArc.strokes = [{
    type: 'GRADIENT_ANGULAR',
    gradientStops: [
      {color: {r: 0.2, g: 0.6, b: 1, a: 1}, position: 0},
      {color: {r: 0.2, g: 0.6, b: 1, a: 0.3}, position: 0.7},
      {color: {r: 0.2, g: 0.6, b: 1, a: 0}, position: 1}
    ],
    gradientTransform: [
      [1, 0, 0.5],
      [0, 1, 0.5]
    ]
  }];
  activeArc.strokeWeight = 3;
  
  spinner.appendChild(circle);
  spinner.appendChild(activeArc);
  
  return spinner;
}
```

### 6.2 Notification Toast

```javascript
function createNotificationToast(type: 'success' | 'warning' | 'error', message: string) {
  const toast = figma.createFrame();
  toast.name = `Toast - ${type}`;
  toast.resize(350, 60);
  toast.x = 150;
  toast.y = 2000;
  
  // Layout
  toast.layoutMode = "HORIZONTAL";
  toast.itemSpacing = 12;
  toast.paddingTop = 16;
  toast.paddingRight = 16;
  toast.paddingBottom = 16;
  toast.paddingLeft = 16;
  toast.primaryAxisAlignItems = "CENTER";
  
  // Styling na podstawie typu
  const colors = {
    success: {bg: {r: 0.9, g: 0.98, b: 0.9}, border: {r: 0.2, g: 0.8, b: 0.3}, icon: {r: 0.2, g: 0.8, b: 0.3}},
    warning: {bg: {r: 0.99, g: 0.97, b: 0.9}, border: {r: 1, g: 0.7, b: 0.2}, icon: {r: 1, g: 0.7, b: 0.2}},
    error: {bg: {r: 0.99, g: 0.9, b: 0.9}, border: {r: 0.9, g: 0.2, b: 0.2}, icon: {r: 0.9, g: 0.2, b: 0.2}}
  };
  
  const color = colors[type];
  
  toast.fills = [{type: 'SOLID', color: color.bg}];
  toast.strokes = [{type: 'SOLID', color: color.border}];
  toast.strokeWeight = 1;
  toast.cornerRadius = 8;
  
  // Icon (prostokąt jako placeholder)
  const icon = figma.createRectangle();
  icon.name = "Icon";
  icon.resize(20, 20);
  icon.cornerRadius = 10; // koło
  icon.fills = [{type: 'SOLID', color: color.icon}];
  
  // Message text
  const messageText = figma.createText();
  messageText.characters = message;
  messageText.fontSize = 14;
  messageText.fills = [{type: 'SOLID', color: {r: 0.2, g: 0.2, b: 0.2}}];
  messageText.textAutoResize = "WIDTH_AND_HEIGHT";
  
  toast.appendChild(icon);
  toast.appendChild(messageText);
  
  return toast;
}

// Przykład użycia
// const successToast = createNotificationToast('success', 'File saved successfully!');
// const errorToast = createNotificationToast('error', 'Failed to save file. Please try again.');
```

## 7. Ikony i Ilustracje

### 7.1 Simple Icon Set

```javascript
function createIconSet() {
  const iconSet = figma.createFrame();
  iconSet.name = "Icon Set";
  iconSet.layoutMode = "HORIZONTAL";
  iconSet.itemSpacing = 24;
  iconSet.x = 50;
  iconSet.y = 2200;
  iconSet.fills = [];
  
  // Check icon
  const checkIcon = createCheckIcon();
  
  // Home icon
  const homeIcon = createHomeIcon();
  
  // Settings icon
  const settingsIcon = createSettingsIcon();
  
  // User icon
  const userIcon = createUserIcon();
  
  iconSet.appendChild(checkIcon);
  iconSet.appendChild(homeIcon);
  iconSet.appendChild(settingsIcon);
  iconSet.appendChild(userIcon);
  
  return iconSet;
}

function createCheckIcon() {
  const icon = figma.createFrame();
  icon.name = "Check Icon";
  icon.resize(24, 24);
  icon.fills = [];
  
  const checkmark = figma.createVector();
  checkmark.vectorPaths = [{
    windingRule: "NONZERO",
    data: "M20 6L9 17L4 12"
  }];
  checkmark.strokes = [{
    type: 'SOLID',
    color: {r: 0.2, g: 0.8, b: 0.3}
  }];
  checkmark.strokeWeight = 2;
  checkmark.strokeCap = "ROUND";
  checkmark.strokeJoin = "ROUND";
  
  icon.appendChild(checkmark);
  return icon;
}

function createHomeIcon() {
  const icon = figma.createFrame();
  icon.name = "Home Icon";
  icon.resize(24, 24);
  icon.fills = [];
  
  const house = figma.createVector();
  house.vectorPaths = [{
    windingRule: "NONZERO",
    data: "M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z"
  }];
  house.strokes = [{
    type: 'SOLID',
    color: {r: 0.3, g: 0.3, b: 0.3}
  }];
  house.strokeWeight = 2;
  house.strokeJoin = "ROUND";
  
  const door = figma.createVector();
  door.vectorPaths = [{
    windingRule: "NONZERO",
    data: "M9 22V12H15V22"
  }];
  door.strokes = [{
    type: 'SOLID',
    color: {r: 0.3, g: 0.3, b: 0.3}
  }];
  door.strokeWeight = 2;
  door.strokeJoin = "ROUND";
  
  icon.appendChild(house);
  icon.appendChild(door);
  return icon;
}

function createSettingsIcon() {
  const icon = figma.createFrame();
  icon.name = "Settings Icon";
  icon.resize(24, 24);
  icon.fills = [];
  
  // Uproszczone koło zębate jako gwiazda z wieloma ramionami
  const gear = figma.createStar();
  gear.resize(20, 20);
  gear.x = 2;
  gear.y = 2;
  gear.pointCount = 8;
  gear.innerRadius = 0.7;
  gear.fills = [];
  gear.strokes = [{
    type: 'SOLID',
    color: {r: 0.3, g: 0.3, b: 0.3}
  }];
  gear.strokeWeight = 1.5;
  
  // Środkowe koło
  const center = figma.createEllipse();
  center.resize(8, 8);
  center.x = 8;
  center.y = 8;
  center.fills = [];
  center.strokes = [{
    type: 'SOLID',
    color: {r: 0.3, g: 0.3, b: 0.3}
  }];
  center.strokeWeight = 1.5;
  
  icon.appendChild(gear);
  icon.appendChild(center);
  return icon;
}

function createUserIcon() {
  const icon = figma.createFrame();
  icon.name = "User Icon";
  icon.resize(24, 24);
  icon.fills = [];
  
  // Głowa
  const head = figma.createEllipse();
  head.resize(8, 8);
  head.x = 8;
  head.y = 4;
  head.fills = [];
  head.strokes = [{
    type: 'SOLID',
    color: {r: 0.3, g: 0.3, b: 0.3}
  }];
  head.strokeWeight = 2;
  
  // Ciało (łuk)
  const body = figma.createVector();
  body.vectorPaths = [{
    windingRule: "NONZERO",
    data: "M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21"
  }];
  body.strokes = [{
    type: 'SOLID',
    color: {r: 0.3, g: 0.3, b: 0.3}
  }];
  body.strokeWeight = 2;
  body.strokeCap = "ROUND";
  body.strokeJoin = "ROUND";
  
  icon.appendChild(head);
  icon.appendChild(body);
  return icon;
}
```

## 8. Templates i Generators

### 8.1 Business Card Template

```javascript
async function createBusinessCardTemplate() {
  await figma.loadFontAsync({family: "Inter", style: "Regular"});
  await figma.loadFontAsync({family: "Inter", style: "Bold"});
  
  const businessCard = figma.createFrame();
  businessCard.name = "Business Card Template";
  businessCard.resize(350, 200); // 3.5" x 2" @ 100dpi
  businessCard.x = 50;
  businessCard.y = 2300;
  
  // Tło karty
  businessCard.fills = [{
    type: 'GRADIENT_LINEAR',
    gradientStops: [
      {color: {r: 0.1, g: 0.2, b: 0.4}, position: 0},
      {color: {r: 0.2, g: 0.3, b: 0.6}, position: 1}
    ],
    gradientTransform: [
      [1, 0, 0],
      [0, 1, 0]
    ]
  }];
  businessCard.cornerRadius = 8;
  
  // Layout container
  const content = figma.createFrame();
  content.name = "Content";
  content.resize(310, 160);
  content.x = 20;
  content.y = 20;
  content.layoutMode = "VERTICAL";
  content.itemSpacing = 8;
  content.fills = [];
  
  // Logo placeholder
  const logo = figma.createRectangle();
  logo.name = "Logo";
  logo.resize(40, 40);
  logo.cornerRadius = 8;
  logo.fills = [{type: 'SOLID', color: {r: 1, g: 1, b: 1, a: 0.2}}];
  
  // Name
  const name = figma.createText();
  name.name = "Name";
  name.characters = "John Doe";
  name.fontSize = 18;
  name.fontName = {family: "Inter", style: "Bold"};
  name.fills = [{type: 'SOLID', color: {r: 1, g: 1, b: 1}}];
  
  // Title
  const title = figma.createText();
  title.name = "Title";
  title.characters = "Senior Designer";
  title.fontSize = 12;
  title.fills = [{type: 'SOLID', color: {r: 1, g: 1, b: 1, a: 0.8}}];
  
  // Contact info
  const contactInfo = figma.createFrame();
  contactInfo.name = "Contact Info";
  contactInfo.layoutMode = "VERTICAL";
  contactInfo.itemSpacing = 4;
  contactInfo.fills = [];
  
  const phone = figma.createText();
  phone.characters = "+1 (555) 123-4567";
  phone.fontSize = 10;
  phone.fills = [{type: 'SOLID', color: {r: 1, g: 1, b: 1, a: 0.7}}];
  
  const email = figma.createText();
  email.characters = "john.doe@company.com";
  email.fontSize = 10;
  email.fills = [{type: 'SOLID', color: {r: 1, g: 1, b: 1, a: 0.7}}];
  
  const website = figma.createText();
  website.characters = "www.company.com";
  website.fontSize = 10;
  website.fills = [{type: 'SOLID', color: {r: 1, g: 1, b: 1, a: 0.7}}];
  
  contactInfo.appendChild(phone);
  contactInfo.appendChild(email);
  contactInfo.appendChild(website);
  
  content.appendChild(logo);
  content.appendChild(name);
  content.appendChild(title);
  content.appendChild(contactInfo);
  
  businessCard.appendChild(content);
  
  return businessCard;
}
```

### 8.2 Social Media Post Template

```javascript
async function createSocialMediaTemplate() {
  await figma.loadFontAsync({family: "Inter", style: "Bold"});
  await figma.loadFontAsync({family: "Inter", style: "Regular"});
  
  const post = figma.createFrame();
  post.name = "Social Media Post";
  post.resize(400, 400); // kwadrat 1:1
  post.x = 450;
  post.y = 2300;
  
  // Tło z gradientem
  post.fills = [{
    type: 'GRADIENT_RADIAL',
    gradientStops: [
      {color: {r: 1, g: 0.9, b: 0.7}, position: 0},
      {color: {r: 1, g: 0.7, b: 0.3}, position: 1}
    ],
    gradientTransform: [
      [1, 0, 0.5],
      [0, 1, 0.3]
    ]
  }];
  
  // Content area
  const contentArea = figma.createFrame();
  contentArea.name = "Content Area";
  contentArea.resize(360, 360);
  contentArea.x = 20;
  contentArea.y = 20;
  contentArea.layoutMode = "VERTICAL";
  contentArea.primaryAxisAlignItems = "CENTER";
  contentArea.counterAxisAlignItems = "CENTER";
  contentArea.itemSpacing = 20;
  contentArea.fills = [];
  
  // Main heading
  const heading = figma.createText();
  heading.name = "Heading";
  heading.characters = "SUMMER\nSALE";
  heading.fontSize = 36;
  heading.fontName = {family: "Inter", style: "Bold"};
  heading.fills = [{type: 'SOLID', color: {r: 1, g: 1, b: 1}}];
  heading.textAlignHorizontal = "CENTER";
  heading.lineHeight = {unit: "PERCENT", value: 90};
  
  // Subheading
  const subheading = figma.createText();
  subheading.name = "Subheading";
  subheading.characters = "Up to 50% OFF";
  subheading.fontSize = 18;
  subheading.fontName = {family: "Inter", style: "Regular"};
  subheading.fills = [{type: 'SOLID', color: {r: 1, g: 1, b: 1, a: 0.9}}];
  
  // CTA
  const cta = figma.createFrame();
  cta.name = "CTA Button";
  cta.resize(150, 40);
  cta.cornerRadius = 20;
  cta.fills = [{type: 'SOLID', color: {r: 1, g: 1, b: 1}}];
  
  const ctaText = figma.createText();
  ctaText.characters = "SHOP NOW";
  ctaText.fontSize = 14;
  ctaText.fontName = {family: "Inter", style: "Bold"};
  ctaText.fills = [{type: 'SOLID', color: {r: 1, g: 0.7, b: 0.3}}];
  ctaText.x = (150 - ctaText.width) / 2;
  ctaText.y = (40 - ctaText.height) / 2;
  
  cta.appendChild(ctaText);
  
  contentArea.appendChild(heading);
  contentArea.appendChild(subheading);
  contentArea.appendChild(cta);
  
  post.appendChild(contentArea);
  
  return post;
}
```

## 9. Podsumowanie

Ten przewodnik przedstawia szeroką gamę elementów, które można tworzyć przy użyciu Figma Plugin API:

### Elementy podstawowe:
- Kształty geometryczne z zaawansowanym stylowaniem
- Tekst z formatowaniem i efektami
- Komponenty wielokrotnego użytku

### Układy złożone:
- Auto Layout frames z responsywnymi właściwościami
- Formularze i interfejsy użytkownika
- Dashboard'y i systemy gridów

### Wizualizacje:
- Wykresy i diagramy danych
- Progress bar'y i wskaźniki
- Elementy nawigacyjne

### Efekty wizualne:
- Gradienty i cienie
- Blur i inne efekty
- Loading states i animacje

### Praktyczne zastosowania:
- Szablony dokumentów
- Zestawy ikon
- Templates mediów społecznościowych

Każdy przykład można dostosować i rozszerzyć według potrzeb konkretnego projektu. Kluczem jest zrozumienie struktury node'ów Figma i efektywne wykorzystanie komunikacji między Plugin Code a UI.

Pamiętaj o:
- Asynchronicznym ładowaniu czcionek przed użyciem
- Właściwym zarządzaniu hierarchią node'ów
- Optymalizacji wydajności przy tworzeniu wielu elementów
- Używaniu TypeScript dla lepszego type safety