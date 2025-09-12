# SVG to Components Converter - Figma Plugin

A powerful Figma plugin that converts structured SVG files into Figma components using Atomic Design principles. Perfect for design systems and component libraries.

## 🚀 Features

- **Atomic Design Support**: Automatically recognizes and converts elements, groups, and variants
- **Structured SVG Import**: Works with specially formatted SVG files with semantic grouping
- **Component Properties**: Automatically adds relevant properties to components
- **Variant Creation**: Creates component sets from variant groups
- **Batch Processing**: Convert multiple components at once
- **Modern UI**: Clean, intuitive interface with real-time feedback

## 📋 Requirements

- Figma Desktop App
- Node.js 16+ (for development)
- Structured SVG files with specific naming conventions

## 🛠️ Installation

### For Users (Figma Plugin)

1. Download the latest release from [Releases](https://github.com/fabmanage/svg-to-components-plugin/releases)
2. Extract the ZIP file
3. Open Figma Desktop App
4. Go to **Plugins** → **Development** → **Import plugin from manifest**
5. Select the `manifest.json` file from the extracted folder
6. The plugin will appear in your plugins list

### For Developers

1. Clone the repository:
   ```bash
   git clone https://github.com/fabmanage/svg-to-components-plugin.git
   cd svg-to-components-plugin
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the plugin:
   ```bash
   npm run build
   ```

4. Import the built plugin into Figma using the `manifest.json` file

## 📖 Usage

### 1. Prepare Your SVG

Your SVG must follow this structure:

```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300">
  <!-- Atomic Elements -->
  <g id="ELEMENTS">
    <g id="Card" class="element" data-figma-component="container">
      <rect width="100" height="60" fill="#ffffff" stroke="#d9d9d9"/>
    </g>
    <g id="Progress" class="element" data-figma-component="progress">
      <rect width="80" height="8" fill="#f0f0f0"/>
      <rect width="40" height="8" fill="#1890ff"/>
    </g>
  </g>
  
  <!-- Molecular Groups -->
  <g id="GROUPS">
    <g id="ProjectHeader" class="group" data-figma-component="header">
      <rect width="200" height="40" fill="#ffffff"/>
      <text x="10" y="25">Project Name</text>
    </g>
  </g>
  
  <!-- Component Variants -->
  <g id="VARIANTS">
    <g id="CompactProject" class="variant" data-figma-variant="compact">
      <rect width="150" height="100" fill="#ffffff"/>
    </g>
    <g id="DetailedProject" class="variant" data-figma-variant="detailed">
      <rect width="200" height="150" fill="#ffffff"/>
    </g>
  </g>
</svg>
```

### 2. Use the Plugin

1. Open Figma and create a new file or open an existing one
2. Go to **Plugins** → **SVG to Components Converter**
3. Paste your structured SVG code or load an SVG file
4. Click **"Analyze SVG Structure"** to see detected components
5. Select which components you want to convert
6. Click **"Create Components"** to generate Figma components

### 3. Result

The plugin will create:
- **Atomic Components**: Individual UI elements (Card, Progress, Tag, etc.)
- **Molecular Components**: Groups of elements (ProjectHeader, ProjectMeta, etc.)
- **Component Variants**: Different versions of components
- **Component Sets**: Organized variant collections

## 🏗️ SVG Structure Requirements

### Required Groups

- `ELEMENTS`: Contains atomic components
- `GROUPS`: Contains molecular components  
- `VARIANTS`: Contains component variants
- `COMPONENT`: Contains main component (optional)

### Element Attributes

- `id`: Unique identifier (PascalCase recommended)
- `class`: Element type (`element`, `group`, `variant`, `component`)
- `data-figma-component`: Component type for properties
- `data-figma-variant`: Variant type for variants

### Supported Component Types

- `container`: Card-like containers
- `progress`: Progress bars and indicators
- `text`: Typography elements
- `button`: Interactive buttons
- `tag`: Badge/tag elements
- `avatar`: User avatars
- `space`: Layout spacing elements

## ⚙️ Configuration

### Component Properties

The plugin automatically adds properties based on component type:

- **Progress**: `value` (number, 0-100)
- **Text**: `text` (string)
- **Tag**: `color` (variant: blue, green, red, etc.)
- **Button**: `variant` (variant: primary, secondary, text)

### Custom Properties

You can add custom properties by modifying the `setupComponentProperties` method in `code.ts`.

## 🔧 Development

### Project Structure

```
svg-to-components-plugin/
├── src/
│   ├── code.ts          # Main plugin logic
│   ├── ui.ts            # UI controller
│   └── ui.html          # UI template
├── dist/                # Built files
├── manifest.json        # Plugin manifest
├── package.json         # Dependencies
├── tsconfig.json        # TypeScript config
├── webpack.config.js    # Build configuration
└── README.md           # This file
```

### Build Commands

```bash
# Development build with watch mode
npm run dev

# Production build
npm run build

# Clean build directory
npm run clean

# Type checking
npm run type-check
```

### Testing

1. Build the plugin: `npm run build`
2. Import `manifest.json` into Figma
3. Test with the provided sample SVG
4. Verify component creation and properties

## 🐛 Troubleshooting

### Common Issues

**"No components detected"**
- Ensure your SVG follows the required structure
- Check that groups have correct `id` attributes
- Verify `class` attributes are properly set

**"Conversion failed"**
- Check Figma console for error details
- Ensure SVG is valid and well-formed
- Try with a simpler SVG first

**"Components not organized"**
- The plugin creates a new page for components
- Check the "SVG Components" page in your Figma file

### Debug Mode

Enable debug logging by opening Figma's developer console:
1. Right-click in Figma → Inspect Element
2. Go to Console tab
3. Look for plugin messages and errors

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Figma Plugin API](https://www.figma.com/plugin-docs/)
- [Atomic Design Methodology](https://bradfrost.com/blog/post/atomic-web-design/)
- [TypeScript](https://www.typescriptlang.org/)
- [Webpack](https://webpack.js.org/)

## 📞 Support

- Create an issue for bug reports
- Start a discussion for feature requests
- Check the [Wiki](https://github.com/fabmanage/svg-to-components-plugin/wiki) for detailed guides

---

**Made with ❤️ by the FabManage Team**
