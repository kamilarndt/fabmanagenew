# 🔧 Troubleshooting Guide - FabManage Component Generator

## 🚨 Common Issues and Solutions

### **1. "SVGGElement object could not be cloned" Error**

#### **Problem:**
```
Error generating components: Failed to execute 'postMessage' on 'Window': SVGGElement object could not be cloned.
```

#### **Cause:**
The plugin was trying to send DOM objects through `postMessage`, which cannot be cloned.

#### **Solution:**
✅ **FIXED** - The plugin now serializes DOM elements before sending them through `postMessage`.

**What was changed:**
- Added `serializeElement()` function to convert DOM elements to plain objects
- Updated `parseSVGStructure()` to serialize elements before storing
- Modified `convertSVGToFigma()` to work with serialized data

### **2. Plugin Not Loading in Figma**

#### **Problem:**
Plugin doesn't appear in Figma's plugin list or fails to load.

#### **Solutions:**
1. **Check Figma Desktop App:**
   - Make sure you're using Figma Desktop App (not browser)
   - Browser version doesn't support development plugins

2. **Verify Plugin Files:**
   ```bash
   # Check if all required files exist
   ls -la figma-plugin/
   # Should show: manifest.json, code.js, ui.html
   ```

3. **Reinstall Plugin:**
   - Remove plugin from Figma
   - Rebuild: `npm run build`
   - Reinstall using the new `.zip` file

4. **Check Console for Errors:**
   - Open Figma → Plugins → Development → Open Console
   - Look for error messages

### **3. SVG Files Not Parsing**

#### **Problem:**
SVG files are not being recognized or parsed correctly.

#### **Solutions:**
1. **Check SVG Structure:**
   ```xml
   <!-- Make sure your SVG has proper structure -->
   <svg xmlns="http://www.w3.org/2000/svg">
     <g id="component-name">
       <!-- SVG content -->
     </g>
   </svg>
   ```

2. **Verify Group IDs:**
   - All groups must have `id` attributes
   - Use kebab-case naming: `project-card`, `status-badge`

3. **Check File Format:**
   - Ensure files are valid SVG
   - Check for XML syntax errors

4. **Test with Sample File:**
   - Use `examples/sample-components.svg` for testing
   - This file is guaranteed to work

### **4. Components Not Generating**

#### **Problem:**
SVG files are imported but no components are created in Figma.

#### **Solutions:**
1. **Check Component Structure:**
   - Ensure groups have proper IDs
   - Verify Atomic Design hierarchy

2. **Check Console Logs:**
   - Open browser console (F12)
   - Look for error messages during generation

3. **Verify Permissions:**
   - Make sure Figma has permission to create components
   - Check if you're in a team with proper access

4. **Test with Simple SVG:**
   ```xml
   <svg xmlns="http://www.w3.org/2000/svg">
     <g id="test-component">
       <rect x="0" y="0" width="100" height="50" fill="#1890ff"/>
     </g>
   </svg>
   ```

### **5. Components Generated But Look Wrong**

#### **Problem:**
Components are created but don't look like the original SVG.

#### **Solutions:**
1. **Check SVG Attributes:**
   - Ensure proper positioning (x, y coordinates)
   - Verify colors and styling
   - Check for missing attributes

2. **Verify Element Types:**
   - Plugin supports: `rect`, `circle`, `ellipse`, `text`, `g`
   - Complex paths might not render perfectly

3. **Check Transform Attributes:**
   - Plugin handles `translate()` transforms
   - Other transforms might not be supported

### **6. Performance Issues**

#### **Problem:**
Plugin is slow or freezes when processing large SVG files.

#### **Solutions:**
1. **Optimize SVG Files:**
   - Remove unnecessary elements
   - Simplify complex paths
   - Use smaller file sizes

2. **Process in Batches:**
   - Import fewer files at once
   - Process components one by one

3. **Check Memory Usage:**
   - Close other Figma files
   - Restart Figma if needed

### **7. Folder Organization Issues**

#### **Problem:**
Components are not organized in Atomic Design folders.

#### **Solutions:**
1. **Check Settings:**
   - Ensure "Organize in Atomic Design folders" is enabled
   - Verify component types are correctly identified

2. **Manual Organization:**
   - Move components to appropriate folders manually
   - Create folders: "⚛️ Atoms", "🧬 Molecules", "🦠 Organisms"

### **8. Documentation Not Generated**

#### **Problem:**
Components are created but lack documentation.

#### **Solutions:**
1. **Check Settings:**
   - Ensure "Add component documentation" is enabled
   - Verify plugin has write permissions

2. **Manual Documentation:**
   - Add descriptions to components manually
   - Use the generated structure as a guide

## 🔍 Debugging Steps

### **Step 1: Check Plugin Status**
```bash
# Run tests
npm run test

# Check build
npm run build
```

### **Step 2: Verify SVG Structure**
```javascript
// Check if SVG has proper structure
const svg = document.querySelector('svg');
const groups = svg.querySelectorAll('g[id]');
console.log('Found groups:', groups.length);
```

### **Step 3: Check Console Logs**
1. Open Figma Desktop App
2. Go to Plugins → Development → Open Console
3. Look for error messages
4. Check network requests

### **Step 4: Test with Sample File**
1. Use `examples/sample-components.svg`
2. This file is guaranteed to work
3. Compare with your SVG files

## 📞 Getting Help

### **1. Check Logs**
- Browser Console (F12)
- Figma Console (Plugins → Development → Open Console)
- Plugin UI status messages

### **2. Common Error Messages**

| Error                                    | Cause                         | Solution                           |
| ---------------------------------------- | ----------------------------- | ---------------------------------- |
| `SVGGElement object could not be cloned` | DOM objects in postMessage    | ✅ Fixed in latest version          |
| `object is not extensible`               | Figma API object restrictions | ✅ Fixed with safe property setting |
| `Syntax error: Unexpected token {`       | Incorrect method definitions  | ✅ Fixed with proper class syntax   |
| `Invalid SVG file`                       | Malformed SVG                 | Check SVG syntax                   |
| `Missing required field`                 | Invalid manifest              | Rebuild plugin                     |
| `Permission denied`                      | Figma permissions             | Check team access                  |

### **3. File Structure Check**
```bash
# Verify plugin structure
figma-plugin/
├── manifest.json     # ✅ Required
├── code.js          # ✅ Required  
├── ui.html          # ✅ Required
├── package.json     # ✅ Required
└── examples/        # ✅ Test files
```

### **4. Version Compatibility**
- **Figma Desktop App**: Latest version recommended
- **Node.js**: Version 14 or higher
- **Browser**: Not supported (use Desktop App)

## 🚀 Quick Fixes

### **Reset Plugin:**
```bash
# 1. Rebuild plugin
npm run build

# 2. Reinstall in Figma
# 3. Test with sample file
```

### **Clear Cache:**
```bash
# Clear node modules
rm -rf node_modules
npm install

# Rebuild
npm run build
```

### **Test Environment:**
```bash
# Create test SVG
echo '<svg xmlns="http://www.w3.org/2000/svg"><g id="test"><rect x="0" y="0" width="100" height="50" fill="#1890ff"/></g></svg>' > test.svg

# Test with plugin
```

## ✅ Success Checklist

- [ ] Using Figma Desktop App (not browser)
- [ ] Plugin installed successfully
- [ ] SVG files have proper structure with group IDs
- [ ] All tests passing (`npm run test`)
- [ ] Plugin built successfully (`npm run build`)
- [ ] Sample SVG file works
- [ ] Console shows no errors
- [ ] Components generated in Figma
- [ ] Proper folder organization
- [ ] Documentation added

---

**🎯 If you're still having issues, check the console logs and try the sample SVG file first!**
