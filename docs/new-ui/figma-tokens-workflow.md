# Figma → Tokens → Tailwind Workflow

Complete procedure for design token synchronization from Figma to code.

## Prerequisites

### Tools Setup
- Cursor IDE with TalkToFigma MCP plugin
- Figma account with design file access
- WebSocket server running (`bun socket --port 3055`)

### Figma File Structure
```
Design System
├── 🎨 Tokens
│   ├── Colors/Primary
│   ├── Colors/Semantic
│   ├── Typography/Sizes
│   ├── Spacing/Scale
│   └── Shadows/Elevation
└── 📱 Components
    ├── Atoms/Button
    ├── Molecules/FormField
    └── Organisms/DataTable
```

## MCP Commands Workflow

### 1. Initial Connection
```bash
# Connect to Figma workspace
join_channel <figma_channel_id>

# Verify connection and permissions
test_connection --verify-figma-access
```

### 2. Extract Design Tokens
```bash
# Get complete design file data
get_figma_data --file-key=<FIGMA_FILE_KEY>

# Extract all design tokens to TypeScript
extract_design_tokens --output=src/new-ui/tokens/

# Specific token extraction
get_color_styles --format=tailwind-css --output=src/new-ui/tokens/colors.ts
get_typography_styles --output=src/new-ui/tokens/typography.ts
get_spacing_tokens --output=src/new-ui/tokens/spacing.ts
get_shadow_tokens --output=src/new-ui/tokens/shadows.ts
```

### 3. Component Generation
```bash
# Generate atom components
get_component_variants --component='Button' --output=src/new-ui/atoms/Button/
extract_input_styles --output=src/new-ui/atoms/Input/
export_icon_components --path=src/new-ui/atoms/Icon/

# Generate molecule components
extract_form_patterns --output=src/new-ui/molecules/FormField/
get_dropdown_components --output=src/new-ui/molecules/Select/

# Generate organism layouts
extract_table_layouts --output=src/new-ui/organisms/DataTable/
extract_sheet_patterns --output=src/new-ui/organisms/Sheet/
```

## Token Processing Pipeline

### 1. Raw Token Extraction
```typescript
// Generated: src/new-ui/tokens/raw-tokens.ts
export const figmaTokens = {
  colors: {
    "primary/500": "#1677FF",
    "primary/600": "#0958D9",
    "semantic/success": "#52C41A",
    "semantic/error": "#FF4D4F"
  },
  typography: {
    "heading/h1": {
      fontSize: "48px",
      lineHeight: "56px",
      fontWeight: 700
    }
  },
  spacing: {
    "scale/xs": "4px",
    "scale/sm": "8px",
    "scale/md": "16px",
    "scale/lg": "24px"
  }
};
```

### 2. Token Transformation
```typescript
// Processing script: scripts/process-tokens.ts
import { figmaTokens } from '../src/new-ui/tokens/raw-tokens';

// Transform Figma tokens to design system format
export const designTokens = {
  colors: {
    primary: {
      500: figmaTokens.colors["primary/500"],
      600: figmaTokens.colors["primary/600"]
    },
    semantic: {
      success: figmaTokens.colors["semantic/success"],
      error: figmaTokens.colors["semantic/error"]
    }
  },
  // ... other transformations
};
```

### 3. CSS Variables Generation
```typescript
// Generated: src/styles/css-variables.css
:root {
  /* Colors */
  --color-primary-500: #1677FF;
  --color-primary-600: #0958D9;
  --color-semantic-success: #52C41A;
  --color-semantic-error: #FF4D4F;
  
  /* Typography */
  --font-size-h1: 48px;
  --line-height-h1: 56px;
  --font-weight-h1: 700;
  
  /* Spacing */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
}
```

### 4. Tailwind Config Integration
```typescript
// tailwind.config.js
import { designTokens } from './src/new-ui/tokens/design-tokens';

export default {
  theme: {
    extend: {
      colors: {
        primary: designTokens.colors.primary,
        success: designTokens.colors.semantic.success,
        error: designTokens.colors.semantic.error
      },
      fontSize: designTokens.typography.fontSize,
      spacing: designTokens.spacing,
      boxShadow: designTokens.shadows
    }
  }
};
```

## Automated Synchronization

### GitHub Action Workflow
```yaml
# .github/workflows/sync-design-tokens.yml
name: Sync Design Tokens

on:
  schedule:
    - cron: '0 9 * * 1'  # Every Monday at 9 AM
  workflow_dispatch:

jobs:
  sync-tokens:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Extract Figma Tokens
        env:
          FIGMA_TOKEN: ${{ secrets.FIGMA_TOKEN }}
          FIGMA_FILE_KEY: ${{ secrets.FIGMA_FILE_KEY }}
        run: |
          npm run tokens:extract
          npm run tokens:process
          npm run tokens:validate
          
      - name: Create Pull Request
        if: github.event_name == 'schedule'
        uses: peter-evans/create-pull-request@v4
        with:
          title: 'chore: sync design tokens from Figma'
          body: 'Automated design token synchronization'
          branch: 'chore/sync-design-tokens'
```

### Manual Sync Script
```typescript
// scripts/sync-tokens.ts
import { execSync } from 'child_process';

async function syncTokens() {
  console.log('🎨 Syncing design tokens from Figma...');
  
  try {
    // 1. Extract tokens
    execSync('npm run mcp:extract-tokens', { stdio: 'inherit' });
    
    // 2. Process tokens
    execSync('npm run tokens:process', { stdio: 'inherit' });
    
    // 3. Generate CSS variables
    execSync('npm run tokens:css-vars', { stdio: 'inherit' });
    
    // 4. Update Tailwind config
    execSync('npm run tokens:tailwind', { stdio: 'inherit' });
    
    // 5. Validate tokens
    execSync('npm run tokens:validate', { stdio: 'inherit' });
    
    console.log('✅ Design tokens synchronized successfully');
  } catch (error) {
    console.error('❌ Token synchronization failed:', error);
    process.exit(1);
  }
}

syncTokens();
```

## Version Control Strategy

### Token Versioning
```typescript
// src/new-ui/tokens/version.ts
export const TOKEN_VERSION = '1.2.0';
export const FIGMA_FILE_VERSION = 'abc123def456';
export const LAST_SYNC = '2025-09-16T10:30:00Z';

// Changelog tracking
export const CHANGELOG = [
  {
    version: '1.2.0',
    date: '2025-09-16',
    changes: [
      'Added new semantic colors for status indicators',
      'Updated spacing scale to 8px grid',
      'Modified button variants for better contrast'
    ]
  }
];
```

### Breaking Changes Detection
```typescript
// scripts/validate-token-changes.ts
import { previousTokens } from './previous-tokens.json';
import { currentTokens } from '../src/new-ui/tokens/design-tokens';

function detectBreakingChanges(prev: any, current: any) {
  const breaking = [];
  
  // Check for removed tokens
  for (const key in prev) {
    if (!(key in current)) {
      breaking.push(`Removed token: ${key}`);
    }
  }
  
  // Check for type changes
  for (const key in current) {
    if (prev[key] && typeof prev[key] !== typeof current[key]) {
      breaking.push(`Type changed for token: ${key}`);
    }
  }
  
  return breaking;
}
```

## Quality Assurance

### Token Validation
```typescript
// tests/tokens.test.ts
import { designTokens } from '../src/new-ui/tokens/design-tokens';

describe('Design Tokens', () => {
  test('all color tokens are valid hex codes', () => {
    const colorTokens = getAllColorTokens(designTokens);
    colorTokens.forEach(([name, value]) => {
      expect(value).toMatch(/^#[0-9A-Fa-f]{6}$/);
    });
  });
  
  test('spacing tokens follow 8px grid', () => {
    const spacingTokens = Object.values(designTokens.spacing);
    spacingTokens.forEach(value => {
      const numValue = parseInt(value);
      expect(numValue % 8).toBe(0);
    });
  });
  
  test('typography tokens have consistent line heights', () => {
    // Validate typography relationships
  });
});
```

### Visual Regression Tests
```typescript
// tests/visual-regression.test.ts
import { test, expect } from '@playwright/test';

test('design tokens render correctly', async ({ page }) => {
  await page.goto('/storybook?path=/story/tokens--all-colors');
  
  // Take screenshot of color palette
  await expect(page.locator('[data-testid="color-palette"]'))
    .toHaveScreenshot('color-palette.png');
    
  // Test typography scale
  await page.goto('/storybook?path=/story/tokens--typography-scale');
  await expect(page.locator('[data-testid="typography-scale"]'))
    .toHaveScreenshot('typography-scale.png');
});
```

## Team Workflow

### Designer → Developer Handoff
1. Designer updates tokens in Figma
2. Designer notifies team via Slack integration
3. Developer runs sync script or waits for automated sync
4. Developer reviews token changes in PR
5. Team validates changes in Storybook
6. Merge after approval

### Conflict Resolution
- **Color conflicts**: Designer has final say
- **Spacing conflicts**: Validate against 8px grid
- **Typography conflicts**: Check accessibility standards

This workflow ensures design consistency while maintaining developer productivity and code quality.
