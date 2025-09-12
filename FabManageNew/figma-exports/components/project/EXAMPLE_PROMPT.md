# Przykładowy Prompt dla Cursor AI

## Konwersja TSX na SVG z Strukturą dla Wtyczki Figma

```markdown
Convert this ProjectCard TSX component to structured SVG format optimized for Figma plugins:

1. Extract atomic elements (Card, Progress, Tag, Avatar, Space, Typography, Button)
2. Create molecular groups (ProjectHeader, ProjectMeta, ProjectInfo) 
3. Build complete component variants (Compact, Detailed)
4. Add Figma plugin metadata with data-* attributes
5. Ensure proper scaling with viewBox and relative units
6. Include Atomic Design legend and documentation

Output should be ready for import via Figma plugins like SVGReactify or Convertify.

## Requirements:
- Use ELEMENTS, GROUPS, VARIANTS, COMPONENT structure
- Add data-figma-component attributes
- Include title and desc elements
- Maintain dark mode tech aesthetic
- Follow design system colors
- Add comprehensive documentation
```

## Przykład użycia w Cursor:

1. Otwórz plik TSX komponentu
2. Użyj powyższego promptu
3. Cursor wygeneruje strukturę SVG zgodną z wymaganiami
4. Plik będzie gotowy do importu przez wtyczki Figma

## Oczekiwany rezultat:
- Hierarchiczna struktura grup SVG
- Metadane dla wtyczek Figma
- Warianty komponentów
- Dokumentacja i instrukcje
- Kompatybilność z narzędziami Figma
