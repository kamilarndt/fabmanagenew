# 🚀 FabManage Advanced Component Generator V2 - Installation Guide

## 📋 **REQUIREMENTS:**
- Figma Desktop App (not browser version)
- Node.js 16+ (for development)
- Modern web browser

---

## 🔧 **INSTALLATION STEPS:**

### **Method 1: Direct Installation (Recommended)**

1. **Download Plugin Files:**
   ```bash
   # All required files are in this folder:
   # - code.js
   # - ui.html  
   # - manifest.json
   # - package.json
   # - README.md
   ```

2. **Install in Figma:**
   - Open **Figma Desktop App**
   - Go to **Plugins → Development → Import plugin from file**
   - Select the entire `figma-plugin-v2` folder
   - Click **"Import"**

3. **Verify Installation:**
   - Go to **Plugins → Development**
   - Look for **"FabManage Advanced Component Generator"**
   - Click to run the plugin

---

### **Method 2: Development Installation**

1. **Clone/Download Files:**
   ```bash
   git clone [repository-url]
   cd figma-plugin-v2
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Build Plugin:**
   ```bash
   npm run build
   ```

4. **Install in Figma:**
   - Import the generated files from `dist/` folder

---

## 🎯 **USAGE:**

### **1. Open Plugin:**
- In Figma, go to **Plugins → FabManage Advanced Component Generator**

### **2. Import SVG Files:**
- Drag & drop SVG files or click to select
- Plugin will analyze component structure

### **3. Configure Settings:**
- ✅ Create component variants
- ✅ Add component documentation  
- ✅ Organize in Atomic Design folders
- ✅ Generate Tokens Studio JSON
- ✅ Detect and group duplicate atoms

### **4. Generate Components:**
- Click **"Generate Advanced Components"**
- Wait for processing to complete

### **5. Use Generated Components:**
- **Atoms** → Available as Figma Components
- **Molecules/Organisms** → Available as Frames
- **Design Tokens** → Export to Tokens Studio

---

## 🛠️ **TROUBLESHOOTING:**

### **Common Issues:**

**❌ "Plugin not found"**
- Ensure you're using Figma Desktop App
- Check that all files are in the plugin folder
- Try restarting Figma

**❌ "Empty components generated"**
- This is fixed in V2! The `copyFrameContentToComponent` function now properly copies content

**❌ "SVG parsing errors"**
- Ensure SVG files have proper structure
- Check that components have `id` attributes
- Use the provided sample files as reference

**❌ "Permission errors"**
- Run Figma as administrator (if needed)
- Check file permissions in plugin folder

---

## 📁 **FILE STRUCTURE:**

```
figma-plugin-v2/
├── code.js              # Main plugin logic (FIXED VERSION)
├── ui.html              # Plugin user interface
├── manifest.json        # Plugin configuration
├── package.json         # Dependencies and scripts
├── README.md            # Documentation
├── scripts/
│   └── build.js         # Build script
└── examples/
    └── sample-components.svg  # Example SVG file
```

---

## 🔄 **UPDATES:**

### **V2 Improvements:**
- ✅ **Fixed empty components** - `copyFrameContentToComponent` now works correctly
- ✅ **Atomic Design approach** - Only atoms as components, molecules/organisms as frames
- ✅ **Duplicate detection** - Intelligent grouping of similar atoms
- ✅ **Tokens Studio integration** - Automatic design token extraction
- ✅ **Better error handling** - More robust processing
- ✅ **Enhanced UI** - Improved user experience

---

## 📞 **SUPPORT:**

- **Issues**: Check README.md for detailed documentation
- **Examples**: Use `examples/sample-components.svg` for testing
- **Documentation**: All features explained in README.md

---

**🎉 Ready to generate advanced Figma components with Atomic Design structure!**
