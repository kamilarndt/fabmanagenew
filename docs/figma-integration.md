# Figma Integration Guide

## Overview

FabManage design system is fully integrated with Figma through a comprehensive token system and MCP (Model Context Protocol) integration. This allows for seamless two-way synchronization between design and code.

## Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Figma File    │◄──►│  MCP Integration │◄──►│  Code Tokens    │
│                 │    │                  │    │                 │
│ • Variables     │    │ • Sync Tokens    │    │ • TypeScript    │
│ • Components    │    │ • Export/Import  │    │ • CSS Variables │
│ • Styles        │    │ • Validation     │    │ • Tailwind      │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## Quick Start

### 1. Export Design System to Figma

```bash
# Export current tokens to Figma format
npm run figma:export

# Or use the full sync
npm run figma:sync:to
```

### 2. Import to Figma

1. Open Figma
2. Go to Variables panel (right sidebar)
3. Click "Import" button
4. Select `export/figma/figma-variables.json`
5. All variables will be imported with proper organization

### 3. Create Components

1. Create a new page called "Design System"
2. Create component frames using the structure from `export/figma/figma-components.json`
3. Apply the imported variables to component properties

### 4. Sync Changes Back to Code

```bash
# Sync from Figma to code
npm run figma:sync:from

# Or full two-way sync
npm run figma:sync:full
```

## Available Commands

| Command                   | Description                           |
| ------------------------- | ------------------------------------- |
| `npm run figma:export`    | Export current tokens to Figma format |
| `npm run figma:sync:from` | Sync changes from Figma to code       |
| `npm run figma:sync:to`   | Sync changes from code to Figma       |
| `npm run figma:sync:full` | Full two-way synchronization          |
| `npm run figma:status`    | Show current sync status              |

## Token Structure

### Colors

- **Foreground**: Primary, secondary, accent, destructive, success, warning, muted, disabled
- **Background**: Primary, secondary, muted, accent, destructive, success, disabled, card, popover, input, warning
- **Border**: Primary, destructive, success, default, warning
- **Icon**: Primary, secondary, destructive, success, warning, disabled, default, muted, accent

### Spacing

- **Spacing Scale**: 8px grid system (xxs, xs, sm, md, lg, xl, xxl, 3xl, 4xl)
- **Padding Scale**: Consistent with spacing scale

### Border Radius

- **Radius Scale**: xs, sm, md, lg, xl, xxl, full

## Component Structure

### Button Component

```typescript
{
  variant: ["primary", "secondary", "destructive", "outline", "ghost", "link"],
  size: ["sm", "md", "lg"],
  state: ["default", "hover", "active", "disabled"]
}
```

### Input Component

```typescript
{
  variant: ["default", "error", "success"],
  size: ["sm", "md", "lg"],
  state: ["default", "focused", "disabled"]
}
```

### Card Component

```typescript
{
  variant: ["default", "outlined", "elevated"];
}
```

## MCP Integration

The project uses MCP (Model Context Protocol) for advanced Figma integration:

### Available MCP Commands

- `mcp_Figma_get_metadata` - Get component metadata
- `mcp_Figma_get_code` - Generate code from Figma components
- `mcp_Figma_get_screenshot` - Generate screenshots
- `mcp_Figma_get_variable_defs` - Get variable definitions
- `mcp_Figma_create_design_system_rules` - Create design system rules

### Usage in Code

```typescript
// Get code for a specific Figma component
const code = await mcp_Figma_get_code({
  nodeId: "123:456",
  clientFrameworks: "react",
  clientLanguages: "typescript",
});

// Get variable definitions
const variables = await mcp_Figma_get_variable_defs({
  nodeId: "123:456",
  clientFrameworks: "react",
  clientLanguages: "typescript",
});
```

## Best Practices

### 1. Token Naming

- Use semantic naming (e.g., `foreground.primary` instead of `color.blue.500`)
- Group related tokens (e.g., `background.card`, `background.popover`)
- Use consistent naming conventions across all token types

### 2. Component Organization

- Group components by category (Button, Input, Card, etc.)
- Use consistent variant naming
- Document component usage and examples

### 3. Sync Workflow

- Always sync before making major changes
- Use `npm run figma:status` to check sync status
- Test changes in both Figma and code

### 4. Version Control

- Commit token changes regularly
- Use descriptive commit messages for design system updates
- Tag releases with design system versions

## Troubleshooting

### Common Issues

1. **Tokens not syncing**

   - Check if `assets/design-tokens.tokens.json` exists
   - Run `npm run figma:status` to verify file status
   - Ensure MCP integration is properly configured

2. **Import errors in Figma**

   - Verify JSON file format
   - Check variable naming conventions
   - Ensure all required fields are present

3. **Code generation issues**
   - Verify MCP connection
   - Check node ID format
   - Ensure component structure matches expected format

### Debug Commands

```bash
# Check sync status
npm run figma:status

# Validate tokens
npm run tokens:validate

# Process tokens manually
npm run tokens:process
```

## Advanced Usage

### Custom Token Processing

```typescript
// Add custom token processing
import { processTokens } from "./scripts/process-figma-tokens.js";

// Process with custom options
await processTokens({
  customTransform: (tokens) => {
    // Custom transformation logic
    return tokens;
  },
});
```

### Automated Sync

```typescript
// Set up automated sync (e.g., in CI/CD)
import { fullSync } from "./scripts/sync-with-figma.mjs";

// Run sync on schedule
setInterval(async () => {
  try {
    await fullSync();
    console.log("Sync completed successfully");
  } catch (error) {
    console.error("Sync failed:", error);
  }
}, 60000); // Every minute
```

## Resources

- [Figma Variables Documentation](https://help.figma.com/hc/en-us/articles/13376087521431-Variables)
- [MCP Figma Integration](https://github.com/modelcontextprotocol/servers/tree/main/src/figma)
- [Design Tokens Specification](https://tr.designtokens.org/format/)
- [Tailwind CSS Configuration](https://tailwindcss.com/docs/configuration)

## Support

For issues with Figma integration:

1. Check the troubleshooting section above
2. Run `npm run figma:status` to verify setup
3. Check the generated files in `export/figma/`
4. Review the MCP integration logs
