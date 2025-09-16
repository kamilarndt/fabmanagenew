# Specyfikacja Design Tokens

## Wprowadzenie
Design tokens to minimalne jednostki wartości projektowych (kolory, typografia, spacing), które pozwalają zachować spójność między designem a implementacją.

## Struktura katalogu
```
src/new-ui/tokens/
├── colors.ts
├── typography.ts
├── spacing.ts
├── shadows.ts
├── borders.ts
└── animations.ts
```

## Kolory (`colors.ts`)
```ts
export const colors = {
  primary: '#0072F5',
  foreground: '#111827',
  background: '#F9FAFB',
  muted: '#6B7280',
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  border: '#E5E7EB',
};
```

### Zasady
- Nazewnictwo semantyczne: `primary`, `foreground`, `background`, `success`, `danger`
- Kolory dodatkowe jako tokeny utility: `muted`, `border`
- Format HEX 6 znaków

## Typografia (`typography.ts`)
```ts
export const typography = {
  fontFamily: 'Inter, sans-serif',
  fontSize: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
  },
  fontWeight: {
    normal: 400,
    medium: 500,
    bold: 700,
  },
  lineHeight: {
    sm: 1.25,
    base: 1.5,
    lg: 1.75,
  },
};
```

## Spacing (`spacing.ts`)
```ts
export const spacing = {
  px: '1px',
  0: '0',
  1: '0.25rem',
  2: '0.5rem',
  3: '0.75rem',
  4: '1rem',
  6: '1.5rem',
  8: '2rem',
  12: '3rem',
  16: '4rem',
};
```

## Inne tokeny
- **Shadows** (`shadows.ts`): definicje cieni
- **Borders** (`borders.ts`): szerokości i zaokrąglenia
- **Animations** (`animations.ts`): timing functions i durations

## Mapowanie do Tailwind
```js
// tailwind.config.js
module.exports = {
  theme: {
    colors: colors,
    fontSize: typography.fontSize,
    fontFamily: {
      sans: typography.fontFamily,
    },
    spacing: spacing,
    boxShadow: shadows,
    borderRadius: borders,
    transitionTimingFunction: animations.easing,
    transitionDuration: animations.duration,
  }
};
```

---
*Dokumentacja przygotowana przez zespół UI*