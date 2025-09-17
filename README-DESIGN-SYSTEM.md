# 🎨 Design System - FabManage Clean

Kompleksowy system designu z automatyczną synchronizacją tokenów z Figmy.

## 🚀 Szybki Start

### 1. Konfiguracja Figma Integration

```bash
# Uruchom setup wizard
npm run setup-figma

# Lub ręcznie skonfiguruj zmienne środowiskowe
cp .env.example .env.local
# Edytuj .env.local i dodaj swoje dane
```

### 2. Synchronizacja Tokenów

```bash
# Pobierz tokeny z Figmy
npm run fetch-tokens

# Wygeneruj CSS variables
npm run generate-css

# Wygeneruj TypeScript types
npm run generate-types

# Waliduj tokeny
npm run validate-tokens

# Lub uruchom wszystko naraz
npm run sync-tokens
```

### 3. Uruchomienie Storybook

```bash
npm run storybook
```

## 📁 Struktura Design Systemu

```
src/design-system/
├── tokens/                 # Centralne zarządzanie tokenami
│   ├── design-tokens.ts   # Tokeny z Figmy
│   ├── semantic.ts        # Tokeny semantyczne
│   ├── spacing.ts         # Tokeny spacing
│   ├── typography.ts      # Tokeny typografii
│   └── index.ts          # Eksporty
├── types/                 # TypeScript interfaces
│   └── tokens.ts         # Definicje typów
├── utils/                 # Helper functions
│   └── token-helpers.ts  # Funkcje pomocnicze
└── index.ts              # Główny eksport

src/new-ui/
├── atoms/                 # Podstawowe komponenty
│   ├── Button/           # Button z design tokens
│   ├── Input/            # Input field
│   └── Card/             # Card component
├── molecules/            # Złożone komponenty
│   ├── SearchBox/        # Search input
│   └── Navigation/       # Navigation menu
├── organisms/            # Komponenty layout
│   ├── Sidebar/          # Sidebar navigation
│   ├── Header/           # Page header
│   └── Footer/           # Page footer
└── layouts/              # Layout components
    └── ModernLayout/     # Main layout
```

## 🎯 Design Tokens

### Kolory

```typescript
import { designTokens } from "@/design-system";

// Użycie w komponencie
const primaryColor = designTokens.colors.foreground.primary;
const backgroundColor = designTokens.colors.background.default;
```

### CSS Variables

```css
/* Automatycznie generowane z tokenów */
:root {
  --color-foreground-primary: #1677ff;
  --color-background-default: #09090b;
  --color-sidebar-DEFAULT: #141414;
  --spacing-md: 1rem;
  --radius-md: 0.375rem;
}
```

### Helper Functions

```typescript
import { getColor, getBackground, getSpacing } from "@/design-system";

// Pobierz kolor
const primaryColor = getColor("primary");

// Pobierz tło
const cardBackground = getBackground("card");

// Pobierz spacing
const mediumSpacing = getSpacing("md");
```

## 🔄 CI/CD Pipeline

### Automatyczna Synchronizacja

Pipeline uruchamia się codziennie o 9:00 UTC i:

1. **Pobiera tokeny** z Figmy API
2. **Generuje CSS variables** z tokenów
3. **Tworzy TypeScript types** automatycznie
4. **Waliduje tokeny** pod kątem spójności
5. **Uruchamia testy** design systemu
6. **Tworzy Pull Request** z zmianami
7. **Powiadamia zespół** o błędach

### Konfiguracja GitHub Secrets

```bash
# Wymagane secrets w GitHub
FIGMA_API_TOKEN=your-figma-api-token
FIGMA_FILE_KEY=your-figma-file-key

# Opcjonalne
SLACK_WEBHOOK=your-slack-webhook-url
```

### Workflow Triggers

- **Scheduled**: Codziennie o 9:00 UTC
- **Manual**: `workflow_dispatch` z opcją force update
- **On Push**: Automatyczne testy przy zmianach

## 🧪 Testing

### Unit Tests

```bash
# Testy design systemu
npm run test:design-system

# Wszystkie testy
npm run test

# Testy z coverage
npm run test:coverage
```

### Storybook Testing

```bash
# Uruchom Storybook
npm run storybook

# Build Storybook
npm run build-storybook
```

## 📚 Dokumentacja

### Storybook Stories

Każdy komponent ma dedykowane stories:

```typescript
// Button.stories.tsx
export const Variants: Story = {
  render: () => (
    <div className="flex gap-4">
      <Button variant="default">Default</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="outline">Outline</Button>
    </div>
  ),
};
```

### TypeScript Support

Pełne wsparcie TypeScript z type safety:

```typescript
interface ButtonProps {
  variant: "default" | "destructive" | "outline" | "secondary";
  size: "sm" | "default" | "lg" | "icon" | "fab";
  loading?: boolean;
  disabled?: boolean;
}
```

## 🎨 Użycie w Komponentach

### Enhanced Button

```typescript
import { Button } from "@/new-ui/atoms/Button";

function MyComponent() {
  return (
    <Button
      variant="primary"
      size="lg"
      loading={isLoading}
      onClick={handleClick}
    >
      Save Changes
    </Button>
  );
}
```

### Custom Styling z Tokenami

```typescript
import { getColor, getSpacing } from "@/design-system";

const customStyles = {
  backgroundColor: getColor("primary"),
  padding: getSpacing("md"),
  borderRadius: "var(--radius-md)",
};
```

## 🔧 Konfiguracja

### Vite Config

```typescript
// vite.config.ts
export default defineConfig({
  css: {
    preprocessorOptions: {
      less: {
        modifyVars: {
          "primary-color": designTokens.colors.foreground.primary,
          "sidebar-background": designTokens.colors.sidebar.DEFAULT,
          // ... inne tokeny
        },
      },
    },
  },
});
```

### Tailwind Config

```typescript
// tailwind.config.js
export default {
  theme: {
    extend: {
      colors: {
        primary: "var(--color-foreground-primary)",
        background: "var(--color-background-default)",
        // ... inne kolory z tokenów
      },
    },
  },
};
```

## 🚨 Troubleshooting

### Problem: Tokeny nie synchronizują się

```bash
# Sprawdź połączenie z Figma
npm run setup-figma

# Sprawdź logi CI/CD
gh run list --workflow=design-tokens-sync.yml
```

### Problem: CSS Variables nie działają

```bash
# Regeneruj CSS variables
npm run generate-css

# Sprawdź import w index.css
@import "./styles/design-tokens.css";
```

### Problem: TypeScript errors

```bash
# Regeneruj types
npm run generate-types

# Sprawdź kompilację
npm run type-check
```

## 📈 Roadmap

### Krótkoterminowe (1-2 tygodnie)

- [ ] Dokończenie komponentów atoms
- [ ] Dodanie molecules (SearchBox, Navigation)
- [ ] Setup Storybook addons (a11y, controls)

### Średnioterminowe (1 miesiąc)

- [ ] Migracja istniejących komponentów
- [ ] Dodanie organisms (Header, Footer)
- [ ] Visual regression testing

### Długoterminowe (2-3 miesiące)

- [ ] Package publikacja na NPM
- [ ] Automatyczne generowanie dokumentacji
- [ ] Integration z innymi projektami

## 🤝 Contributing

### Dodawanie Nowych Komponentów

1. Stwórz komponent w odpowiedniej kategorii (atoms/molecules/organisms)
2. Dodaj Storybook stories
3. Napisz unit testy
4. Użyj design tokens zamiast hardcoded wartości
5. Dodaj dokumentację

### Dodawanie Nowych Tokenów

1. Dodaj token w Figma
2. Uruchom `npm run sync-tokens`
3. Sprawdź czy tokeny są poprawnie wygenerowane
4. Zaktualizuj komponenty używające nowych tokenów

## 📞 Wsparcie

- **Dokumentacja**: [Storybook](http://localhost:6006)
- **Issues**: GitHub Issues
- **Discussions**: GitHub Discussions
- **Slack**: #design-system

---

_Design System v1.0.0 - FabManage Clean_
