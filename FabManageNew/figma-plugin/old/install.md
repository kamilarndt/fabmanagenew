# 🚀 Installation Guide - FabManage Component Generator

## 📋 Prerequisites

- **Figma Desktop App** (required for plugin development)
- **Node.js** (version 14 or higher)
- **npm** or **yarn**

## 🔧 Installation Steps

### 1. **Clone and Setup**
```bash
# Navigate to the plugin directory
cd FabManageNew/figma-plugin

# Install dependencies
npm install

# Build the plugin
npm run build
```

### 2. **Package the Plugin**
```bash
# Create the plugin package
npm run package
```

This creates `fabmanage-component-generator.zip` in the current directory.

### 3. **Install in Figma**

#### **Method 1: Development Mode (Recommended)**
1. Open **Figma Desktop App**
2. Go to **Plugins** → **Development** → **Import plugin from file**
3. Select `fabmanage-component-generator.zip`
4. The plugin will appear in your plugins list

#### **Method 2: Manual Installation**
1. Open **Figma Desktop App**
2. Go to **Plugins** → **Browse all plugins**
3. Click **"Import plugin"**
4. Select the `fabmanage-component-generator.zip` file

### 4. **Verify Installation**
1. In Figma, go to **Plugins** → **Development**
2. You should see **"FabManage Component Generator"** in the list
3. Click on it to open the plugin UI

## 🎯 Quick Start

### **Step 1: Prepare Your SVG Files**
Make sure your SVG files follow the Atomic Design structure:

```xml
<g id="component-name" data-type="organism|molecule|atom">
  <!-- SVG content -->
</g>
```

### **Step 2: Import SVG Files**
1. Open the plugin in Figma
2. Drag & drop your SVG files or click to select
3. The plugin will parse the structure automatically

### **Step 3: Generate Components**
1. Configure your settings:
   - ✅ Create component variants
   - ✅ Add component documentation
   - ✅ Organize in Atomic Design folders
2. Click **"Generate Components in Figma"**
3. Watch as your components are created!

## 🧪 Testing with Sample Files

### **Use the Sample SVG:**
1. Open `examples/sample-components.svg`
2. Import it into the plugin
3. Generate components to see the plugin in action

### **Expected Results:**
- **Organisms:** `project-card`
- **Molecules:** `card-container`, `cover-section`, `card-content`, etc.
- **Atoms:** `image-placeholder`, `status-badge`, `type-tag`, etc.

## 🔄 Development Workflow

### **For Plugin Development:**
```bash
# Start development mode
npm run dev

# Make changes to code.js or ui.html
# The plugin will automatically reload in Figma
```

### **For Testing:**
1. Make changes to the plugin code
2. Reload the plugin in Figma (Plugins → Development → Reload)
3. Test with your SVG files
4. Repeat as needed

## 🐛 Troubleshooting

### **Common Issues:**

#### **Plugin Not Loading:**
- Make sure you're using Figma Desktop App (not browser)
- Check that the manifest.json is valid
- Verify the plugin files are in the correct location

#### **SVG Not Parsing:**
- Ensure your SVG has proper `<g>` elements with `id` attributes
- Check that the SVG is valid XML
- Verify the structure follows Atomic Design principles

#### **Components Not Generating:**
- Check the browser console for errors
- Ensure you have proper permissions in Figma
- Verify the SVG structure is correct

### **Debug Mode:**
1. Open Figma Desktop App
2. Go to **Plugins** → **Development** → **Open Console**
3. Check for error messages
4. Use `console.log()` in the plugin code for debugging

## 📁 File Structure

```
figma-plugin/
├── manifest.json          # Plugin configuration
├── code.js               # Main plugin logic
├── ui.html               # Plugin UI
├── package.json          # Dependencies and scripts
├── README.md             # Documentation
├── install.md            # This file
└── examples/
    └── sample-components.svg  # Test SVG file
```

## 🔧 Configuration

### **Plugin Settings:**
- **Create Variants:** Generates different states/sizes
- **Add Documentation:** Auto-generates component docs
- **Organize Folders:** Creates Atomic Design folder structure

### **SVG Requirements:**
- Use `id` attributes on `<g>` elements
- Follow kebab-case naming: `project-card`, `status-badge`
- Structure components hierarchically
- Include proper SVG structure

## 🚀 Next Steps

1. **Test the Plugin:** Use the sample SVG file
2. **Import Your SVGs:** Use your own component SVGs
3. **Customize:** Modify the plugin code for your needs
4. **Share:** Package and share with your team

## 📞 Support

- **Issues:** Create a GitHub issue
- **Documentation:** Check the README.md
- **Examples:** Use the sample SVG files

---

**Happy Component Generating! 🎉**
