# Figma Design Tokens Export

This directory contains exported design tokens from the FabManage Design System.

## Files

- `figma-variables.json` - Color, spacing, and radius variables for Figma
- `figma-components.json` - Component definitions for Figma

## Import Instructions

1. Open Figma
2. Go to the Variables panel
3. Click the "+" button and select "Import"
4. Select `figma-variables.json`
5. The variables will be imported with Light and Dark modes

## Usage

After importing, you can use these variables in your Figma designs:
- Colors: `{Foreground/primary}`, `{Background/primary}`, etc.
- Spacing: `{Spacing/md}`, `{Spacing/lg}`, etc.
- Radius: `{Radius/md}`, `{Radius/lg}`, etc.
- Sidebar: `{Sidebar/DEFAULT}`, `{Sidebar/foreground}`, etc.

## Regeneration

To regenerate these files, run:
```bash
npm run figma:export
```
