# Installation Guide - SVG to Components Converter

## Quick Start

### 1. Build the Plugin

```bash
# Navigate to plugin directory
cd svg-to-components-plugin

# Install dependencies
npm install

# Build the plugin
npm run build
```

### 2. Install in Figma

1. Open **Figma Desktop App**
2. Go to **Plugins** → **Development** → **Import plugin from manifest**
3. Select the `manifest.json` file from the plugin directory
4. The plugin will appear in your plugins list

### 3. Test the Plugin

1. Create a new Figma file or open an existing one
2. Go to **Plugins** → **SVG to Components Converter**
3. The plugin UI will open
4. Use the sample SVG provided or paste your own structured SVG
5. Click **"Analyze SVG Structure"** to see detected components
6. Select components and click **"Create Components"**

## Development Setup

### Prerequisites

- Node.js 16 or higher
- Figma Desktop App
- Git (for cloning)

### Setup Steps

1. **Clone the repository:**
   ```bash
   git clone https://github.com/fabmanage/svg-to-components-plugin.git
   cd svg-to-components-plugin
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Build the plugin:**
   ```bash
   npm run build
   ```

4. **Import into Figma:**
   - Open Figma Desktop App
   - Go to Plugins → Development → Import plugin from manifest
   - Select `manifest.json` from the project root

5. **Start development:**
   ```bash
   npm run dev
   ```
   This will watch for changes and rebuild automatically.

### File Structure

```
svg-to-components-plugin/
├── src/
│   ├── code.ts          # Main plugin logic
│   ├── ui.ts            # UI controller
│   └── ui.html          # UI template
├── dist/                # Built files (generated)
├── manifest.json        # Plugin manifest
├── package.json         # Dependencies
├── tsconfig.json        # TypeScript config
├── webpack.config.js    # Build configuration
├── sample-project-card.svg  # Test SVG
└── README.md           # Documentation
```

## Testing

### 1. Use Sample SVG

The plugin includes a sample SVG file (`sample-project-card.svg`) that demonstrates the required structure:

- **ELEMENTS**: Atomic components (Card, Progress, Tag, etc.)
- **GROUPS**: Molecular components (ProjectHeader, ProjectMeta, etc.)
- **VARIANTS**: Component variants (Compact, Detailed)
- **COMPONENT**: Main component (ProjectCard)

### 2. Test Workflow

1. **Load Sample SVG:**
   - Click "Load SVG File" and select `sample-project-card.svg`
   - Or copy the content and paste it into the textarea

2. **Analyze Structure:**
   - Click "Analyze SVG Structure"
   - Verify that all components are detected
   - Check the structure breakdown

3. **Create Components:**
   - Select which components to convert
   - Click "Create Components"
   - Check the "SVG Components" page in Figma

### 3. Verify Results

After conversion, you should see:

- **New Page**: "SVG Components" page created
- **Atomic Components**: Individual UI elements
- **Molecular Components**: Grouped elements
- **Component Variants**: Different versions
- **Component Sets**: Organized variant collections

## Troubleshooting

### Common Issues

**"Plugin not loading"**
- Ensure you're using Figma Desktop App (not web version)
- Check that `manifest.json` is valid
- Verify the plugin was built successfully

**"No components detected"**
- Ensure SVG follows the required structure
- Check that groups have correct `id` attributes
- Verify `class` attributes are properly set

**"Build errors"**
- Run `npm install` to ensure all dependencies are installed
- Check Node.js version (requires 16+)
- Clear `node_modules` and reinstall if needed

**"Conversion failed"**
- Check Figma console for error details
- Ensure SVG is valid and well-formed
- Try with the sample SVG first

### Debug Mode

1. **Open Figma Console:**
   - Right-click in Figma → Inspect Element
   - Go to Console tab

2. **Check Plugin Messages:**
   - Look for plugin-related messages
   - Check for error details

3. **Verify SVG Structure:**
   - Ensure all required groups exist
   - Check attribute formatting

## Advanced Configuration

### Custom Component Properties

Edit `src/code.ts` and modify the `setupComponentProperties` method:

```typescript
private setupComponentProperties(component: ComponentNode, element: SVGElement): void {
  if (element.figmaComponent === 'progress') {
    component.addComponentProperty('value', 'NUMBER', 50);
  } else if (element.figmaComponent === 'text') {
    component.addComponentProperty('text', 'TEXT', 'Sample Text');
  }
  // Add your custom properties here
}
```

### Custom UI Styling

Edit `src/ui.html` and `src/ui.ts` to customize the interface:

- Modify CSS styles in the `<style>` section
- Update UI logic in `ui.ts`
- Add new UI elements as needed

### Build Configuration

Modify `webpack.config.js` for custom build settings:

- Add new loaders
- Configure optimization settings
- Set up custom plugins

## Support

- **Issues**: Create an issue on GitHub
- **Discussions**: Start a discussion for questions
- **Documentation**: Check the README.md for detailed guides

## License

This project is licensed under the MIT License - see the LICENSE file for details.
