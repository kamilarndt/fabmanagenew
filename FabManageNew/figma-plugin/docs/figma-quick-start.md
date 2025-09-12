# Quick Start Guide - Tworzenie Wtyczek Figma

Szybki przewodnik po rozpoczęciu pracy z tworzeniem wtyczek dla Figmy.

## 1. Setup Środowiska Deweloperskiego

### 1.1 Wymagania wstępne

```bash
# Node.js (wersja 14+)
node --version

# TypeScript (globalnie)
npm install -g typescript

# Sprawdź wersję TypeScript
tsc --version
```

### 1.2 Inicjalizacja projektu wtyczki

```bash
# Utwórz folder projektu
mkdir my-figma-plugin
cd my-figma-plugin

# Inicjalizuj pakiet npm
npm init -y

# Zainstaluj typy Figma
npm install --save-dev @figma/plugin-typings
```

### 1.3 Struktura podstawowego projektu

```
my-figma-plugin/
├── manifest.json     # Konfiguracja wtyczki
├── code.ts          # Główna logika wtyczki
├── ui.html          # Interface użytkownika (opcjonalny)
├── tsconfig.json    # Konfiguracja TypeScript
└── package.json     # Informacje o pakiecie npm
```

## 2. Konfiguracja Plików

### 2.1 manifest.json

```json
{
  "name": "My First Plugin",
  "id": "123456789",
  "api": "1.0.0",
  "main": "code.js",
  "ui": "ui.html",
  "editorType": ["figma"],
  "menu": [
    {"name": "Create Rectangles", "command": "create-rectangles"}
  ]
}
```

### 2.2 tsconfig.json

```json
{
  "compilerOptions": {
    "target": "es6",
    "lib": ["es6"],
    "strict": true,
    "typeRoots": ["./node_modules/@types", "./node_modules/@figma"]
  }
}
```

### 2.3 package.json - dodaj skrypty

```json
{
  "scripts": {
    "build": "tsc",
    "watch": "tsc --watch"
  }
}
```

## 3. Pierwszy Kod Wtyczki

### 3.1 code.ts - Podstawowa wtyczka bez UI

```typescript
// code.ts
console.log("Plugin started!");

// Sprawdź co jest zaznaczone
const selection = figma.currentPage.selection;
console.log(`Selected ${selection.length} objects`);

// Utwórz prostokąt
const rect = figma.createRectangle();
rect.resize(100, 100);
rect.x = 100;
rect.y = 100;
rect.fills = [{
  type: 'SOLID',
  color: {r: Math.random(), g: Math.random(), b: Math.random()}
}];

// Dodaj do strony
figma.currentPage.appendChild(rect);

// Zaznacz nowy element
figma.currentPage.selection = [rect];

// Pokaż notyfikację
figma.notify("Rectangle created!");

// Zamknij wtyczkę
figma.closePlugin();
```

### 3.2 Kompilacja i test

```bash
# Kompiluj TypeScript do JavaScript
npm run build

# Lub uruchom watch mode dla development
npm run watch
```

## 4. Wtyczka z Interface'm Użytkownika

### 4.1 code.ts z UI

```typescript
// code.ts
console.log("Plugin with UI started!");

// Pokaż UI
figma.showUI(__html__, {
  width: 300,
  height: 200,
  title: "My Plugin"
});

// Obsługa wiadomości z UI
figma.ui.onmessage = (msg) => {
  console.log("Received message:", msg);
  
  if (msg.type === 'create-rectangles') {
    const count = msg.count || 5;
    
    for (let i = 0; i < count; i++) {
      const rect = figma.createRectangle();
      rect.resize(50, 50);
      rect.x = i * 60;
      rect.y = 100;
      rect.fills = [{
        type: 'SOLID',
        color: {
          r: Math.random(),
          g: Math.random(),
          b: Math.random()
        }
      }];
      figma.currentPage.appendChild(rect);
    }
    
    figma.notify(`Created ${count} rectangles!`);
    
    // Wyślij potwierdzenie do UI
    figma.ui.postMessage({
      type: 'rectangles-created',
      count: count
    });
  }
  
  if (msg.type === 'close-plugin') {
    figma.closePlugin();
  }
};
```

### 4.2 ui.html

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>My Plugin</title>
    <style>
        body {
            font-family: 'Segoe UI', system-ui, sans-serif;
            margin: 20px;
            background: #f8f8f8;
        }
        .container {
            display: flex;
            flex-direction: column;
            gap: 16px;
        }
        label {
            font-weight: 500;
            font-size: 14px;
            margin-bottom: 8px;
        }
        input {
            padding: 8px 12px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 14px;
        }
        button {
            padding: 12px 16px;
            background: #18a0fb;
            color: white;
            border: none;
            border-radius: 6px;
            font-size: 14px;
            cursor: pointer;
            font-weight: 500;
        }
        button:hover {
            background: #0d8bd9;
        }
        .secondary {
            background: #e3e3e3;
            color: #333;
        }
        .secondary:hover {
            background: #d0d0d0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div>
            <label for="count">Number of rectangles:</label>
            <input type="number" id="count" value="5" min="1" max="100">
        </div>
        
        <button id="create">Create Rectangles</button>
        <button id="close" class="secondary">Close</button>
        
        <div id="status"></div>
    </div>

    <script>
        const countInput = document.getElementById('count');
        const createButton = document.getElementById('create');
        const closeButton = document.getElementById('close');
        const status = document.getElementById('status');

        // Wyślij wiadomość do plugin code
        createButton.addEventListener('click', () => {
            const count = parseInt(countInput.value) || 5;
            
            parent.postMessage({
                pluginMessage: {
                    type: 'create-rectangles',
                    count: count
                }
            }, '*');
            
            status.textContent = `Creating ${count} rectangles...`;
        });

        closeButton.addEventListener('click', () => {
            parent.postMessage({
                pluginMessage: {
                    type: 'close-plugin'
                }
            }, '*');
        });

        // Odbierz wiadomości z plugin code
        window.onmessage = (event) => {
            const message = event.data.pluginMessage;
            
            if (message.type === 'rectangles-created') {
                status.textContent = `✓ Created ${message.count} rectangles successfully!`;
                status.style.color = '#0d8bd9';
            }
        };
    </script>
</body>
</html>
```

## 5. Testowanie Wtyczki

### 5.1 Import do Figmy

1. **Otwórz Figma Desktop App** (nie web version dla development)
2. **Kliknij prawym przyciskiem** na canvas → `Plugins` → `Development` → `Import plugin from manifest...`
3. **Wybierz plik `manifest.json`** z twojego projektu
4. **Kliknij prawym przyciskiem** → `Plugins` → `Development` → `My First Plugin`

### 5.2 Debugging

```typescript
// W code.ts używaj console.log
console.log("Debug info:", {
    selection: figma.currentPage.selection.length,
    currentPage: figma.currentPage.name
});

// W UI (ui.html) również możesz używać console.log
console.log("UI loaded");
```

**Otwórz Dev Tools:** `Plugins` → `Development` → `Open Console` (dla plugin code) lub F12 w iframe (dla UI)

## 6. Najczęstsze Błędy i Rozwiązania

### 6.1 Font loading errors

```typescript
// ZAWSZE załaduj czcionkę przed użyciem
try {
    await figma.loadFontAsync({family: "Inter", style: "Regular"});
    
    const textNode = figma.createText();
    textNode.fontName = {family: "Inter", style: "Regular"};
    textNode.characters = "Hello World";
} catch (error) {
    console.error("Failed to load font:", error);
    figma.notify("Font loading failed", {error: true});
}
```

### 6.2 Selection validation

```typescript
// Sprawdź czy coś jest zaznaczone
const selection = figma.currentPage.selection;

if (selection.length === 0) {
    figma.notify("Please select something first", {error: true});
    figma.closePlugin();
    return;
}

// Sprawdź typ zaznaczonego elementu
const node = selection[0];
if (node.type !== 'RECTANGLE') {
    figma.notify("Please select a rectangle", {error: true});
    return;
}
```

### 6.3 PostMessage communication

```typescript
// Plugin Code - zawsze sprawdź type wiadomości
figma.ui.onmessage = (msg) => {
    // Dodaj walidację
    if (!msg.type) {
        console.error("Message missing type:", msg);
        return;
    }
    
    switch (msg.type) {
        case 'create-shape':
            // handle creation
            break;
        default:
            console.warn("Unknown message type:", msg.type);
    }
};

// UI - używaj try/catch
try {
    parent.postMessage({
        pluginMessage: {
            type: 'create-shape',
            data: formData
        }
    }, '*');
} catch (error) {
    console.error("Failed to send message:", error);
}
```

## 7. Advanced Setup

### 7.1 Webpack dla bardziej złożonych projektów

```bash
npm install --save-dev webpack webpack-cli html-webpack-plugin
```

```javascript
// webpack.config.js
module.exports = {
  mode: 'development',
  entry: {
    code: './src/code.ts',
    ui: './src/ui.ts'
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },
  output: {
    filename: '[name].js',
    path: __dirname + '/dist'
  }
};
```

### 7.2 React Setup

```bash
npm install react react-dom
npm install --save-dev @types/react @types/react-dom
```

```tsx
// ui.tsx
import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';

function App() {
    const [count, setCount] = useState(5);
    
    const createRectangles = () => {
        parent.postMessage({
            pluginMessage: {
                type: 'create-rectangles',
                count: count
            }
        }, '*');
    };
    
    return (
        <div style={{padding: '20px'}}>
            <label>
                Count: 
                <input 
                    type="number" 
                    value={count} 
                    onChange={(e) => setCount(Number(e.target.value))}
                />
            </label>
            <br />
            <button onClick={createRectangles}>
                Create {count} Rectangles
            </button>
        </div>
    );
}

const container = document.getElementById('app');
const root = createRoot(container);
root.render(<App />);
```

## 8. Publikacja Wtyczki

### 8.1 Przygotowanie do publikacji

1. **Test thoroughly** na różnych plikach i scenariuszach
2. **Optymalizuj performance** - unikaj długotrwałych operacji
3. **Dodaj proper error handling**
4. **Napisz dokumentację** w manifest description

### 8.2 Publikacja w Community

1. **W Figmie:** `Plugins` → `Development` → `Publish Plugin`
2. **Uzupełnij informacje:** nazwa, opis, kategoria, tagi
3. **Dodaj cover image i screenshots**
4. **Submit for review**

## 9. Przydatne Linki i Resources

### 9.1 Oficjalna dokumentacja
- [Plugin API Docs](https://www.figma.com/plugin-docs/)
- [Plugin Samples](https://github.com/figma/plugin-samples)
- [Plugin Typings](https://github.com/figma/plugin-typings)

### 9.2 Community resources
- [Figma Plugin DS](https://github.com/thomas-lowry/figma-plugin-ds) - UI komponenty
- [Create Figma Plugin](https://github.com/yuanqing/create-figma-plugin) - starter toolkit
- [Plugin Resources](https://github.com/figma/plugin-resources) - lista open source wtyczek

### 9.3 Przydatne narzędzia
- **VSCode** z rozszerzeniem TypeScript
- **Figma Desktop App** (wymagane do development)
- **Browser Dev Tools** do debugowania UI

## 10. Template Startowy

Możesz sklonować ten template i zacząć od niego:

```typescript
// code.ts - Universal template
interface PluginMessage {
    type: string;
    [key: string]: any;
}

// Pokaż UI jeśli istnieje
if (__html__) {
    figma.showUI(__html__, {
        width: 320,
        height: 240,
        title: "My Plugin"
    });
} else {
    // Wtyczka bez UI - wykonaj akcję i zamknij
    performAction();
    figma.closePlugin("Action completed!");
}

// Obsługa wiadomości z UI
figma.ui.onmessage = async (msg: PluginMessage) => {
    try {
        switch (msg.type) {
            case 'action1':
                await handleAction1(msg);
                break;
            case 'action2':
                await handleAction2(msg);
                break;
            case 'close':
                figma.closePlugin();
                break;
            default:
                console.warn('Unknown message type:', msg.type);
        }
    } catch (error) {
        console.error('Plugin error:', error);
        figma.notify('An error occurred', {error: true});
        figma.closePlugin();
    }
};

async function handleAction1(msg: PluginMessage) {
    // Twoja logika tutaj
    figma.ui.postMessage({type: 'action1-complete'});
}

async function handleAction2(msg: PluginMessage) {
    // Twoja logika tutaj  
    figma.ui.postMessage({type: 'action2-complete'});
}

function performAction() {
    // Logika dla wtyczki bez UI
    const rect = figma.createRectangle();
    rect.resize(100, 100);
    figma.currentPage.appendChild(rect);
}
```

To powinno dać ci solidny start w tworzeniu wtyczek dla Figmy! 🚀