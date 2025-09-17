# How to Import FabManage Design System to Figma

## Step 1: Import Variables
1. Open Figma
2. Go to Variables panel (right sidebar)
3. Click "Import" button
4. Select `figma-variables.json`
5. All variables will be imported with proper organization

## Step 2: Create Components
1. Create a new page called "Design System"
2. Create component frames for each component type
3. Apply the imported variables to component properties
4. Use the component structure from `figma-components.json`

## Step 3: Organize Your System
1. Create sections for:
   - Colors (Foreground, Background, Border, Icon)
   - Spacing (Spacing, Padding)
   - Radius
   - Components (Button, Input, Card, etc.)

## Step 4: Sync with Code
1. Use the MCP Figma integration to sync changes
2. Run `npm run tokens:process` to update code tokens
3. Use `npm run tokens:sync` for full synchronization

## Best Practices
- Use semantic naming for variables
- Group related components together
- Document component usage and variants
- Keep variables organized by category
- Use consistent naming conventions
