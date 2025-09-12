# 🔧 FabManage Component Generator

Figma plugin that automatically generates components from SVG files with Atomic Design structure.

## 🚀 Features

- **Automatic SVG Import** - Drag & drop SVG files directly into Figma
- **Atomic Design Structure** - Automatically categorizes components as Atoms, Molecules, or Organisms
- **Component Generation** - Creates Figma components with proper hierarchy
- **Documentation** - Auto-generates component documentation and usage examples
- **Variants** - Creates component variants for different states and sizes
- **Folder Organization** - Organizes components in Atomic Design folder structure

## 📦 Installation

1. **Package the plugin:**
   ```bash
   cd figma-plugin
   npm run package
   ```

2. **Install in Figma:**
   - Open Figma Desktop App
   - Go to Plugins → Development → Import plugin from file
   - Select `fabmanage-component-generator.zip`

## 🎯 Usage

### 1. **Import SVG Files**
- Open the plugin in Figma
- Drag & drop your SVG files or click to select
- The plugin will automatically parse the structure

### 2. **Configure Settings**
- ✅ Create component variants
- ✅ Add component documentation  
- ✅ Organize in Atomic Design folders

### 3. **Generate Components**
- Click "Generate Components in Figma"
- Watch as your components are created automatically!

## 🏗️ Component Structure

The plugin recognizes three types of components based on your SVG structure:

### ⚛️ **Atoms** (Basic UI Elements)
- Simple, indivisible components
- Examples: buttons, inputs, icons, badges
- No child components with IDs

### 🧬 **Molecules** (Component Groups)
- Simple groups of atoms
- Examples: search bars, form fields, navigation items
- 1-4 child components with IDs

### 🦠 **Organisms** (Complete Components)
- Complex components made of molecules and atoms
- Examples: headers, cards, forms, navigation bars
- 5+ child components with IDs

## 📁 Generated Structure

```
📁 Design System
├── ⚛️ Atoms
│   ├── image-placeholder
│   ├── status-badge
│   ├── type-tag
│   └── edit-button
├── 🧬 Molecules
│   ├── card-container
│   ├── project-header
│   ├── action-buttons
│   └── progress-section
└── 🦠 Organisms
    ├── project-card
    ├── project-header
    └── project-elements
```

## 🔧 SVG Requirements

Your SVG files should follow this structure:

```xml
<g id="project-card" data-type="organism">
  <g id="card-container" data-type="molecule">
    <g id="image-placeholder" data-type="atom">
      <!-- SVG content -->
    </g>
    <g id="status-badge" data-type="atom">
      <!-- SVG content -->
    </g>
  </g>
</g>
```

### **ID Naming Convention:**
- Use kebab-case: `project-card`, `status-badge`
- Be descriptive: `image-placeholder`, `action-buttons`
- Follow Atomic Design hierarchy

## 🎨 Generated Features

### **Component Properties:**
- **Name** - Based on SVG ID
- **Description** - Auto-generated with type and usage info
- **Type** - Atom, Molecule, or Organism
- **Metadata** - Source file, generation date, children count

### **Variants:**
- **Atoms** - Hover, Disabled states
- **Molecules** - Small, Medium, Large sizes
- **Organisms** - Different configurations

### **Documentation:**
- Usage examples
- Props documentation
- Atomic Design level
- Generation metadata

## 🚀 Advanced Usage

### **Custom Component Types:**
Add `data-type` attributes to your SVG groups:
```xml
<g id="custom-component" data-type="molecule">
  <!-- content -->
</g>
```

### **Component Metadata:**
Add descriptions and props:
```xml
<g id="button" data-description="Primary action button" data-props='{"variant":"primary","size":"medium"}'>
  <!-- content -->
</g>
```

## 🔄 Workflow Integration

### **1. Export from Code:**
```bash
# Generate SVG components from React code
npm run export:svg:components
```

### **2. Import to Figma:**
- Use the plugin to import generated SVGs
- Components are automatically created with proper structure

### **3. Design System:**
- Components are organized in Atomic Design folders
- Ready for use in your design system
- Automatically documented and versioned

## 🛠️ Development

### **Setup:**
```bash
cd figma-plugin
npm install
npm run dev
```

### **Build:**
```bash
npm run build
npm run package
```

### **Testing:**
1. Import the plugin in Figma
2. Test with sample SVG files
3. Verify component generation and structure

## 📝 Examples

### **Sample SVG Structure:**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<svg width="800" height="1000" xmlns="http://www.w3.org/2000/svg">
  <!-- Main Organism -->
  <g id="project-card">
    <!-- Card Container Molecule -->
    <g id="card-container">
      <!-- Image Placeholder Atom -->
      <g id="image-placeholder">
        <rect x="0" y="0" width="100" height="100" fill="#f0f0f0"/>
      </g>
      <!-- Status Badge Atom -->
      <g id="status-badge">
        <rect x="0" y="0" width="60" height="20" fill="#52c41a"/>
        <text x="10" y="15">Active</text>
      </g>
    </g>
  </g>
</svg>
```

### **Generated Figma Component:**
- **Name:** `project-card`
- **Type:** Organism
- **Description:** Complete project display card with all functionality
- **Children:** `card-container` (molecule)
- **Variants:** Default, Hover, Disabled

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

- **Issues:** GitHub Issues
- **Documentation:** This README
- **Examples:** Check the `examples/` folder

---

**Made with ❤️ by the FabManage Team**
