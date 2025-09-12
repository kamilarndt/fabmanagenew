# Debug Instructions - SVG to Components Converter

## 🔍 **Problem: "Analyze SVG Structure" button does nothing**

### **Step 1: Check Console Logs**

1. **Open Figma Desktop App**
2. **Right-click in Figma** → **Inspect Element** (or press F12)
3. **Go to Console tab**
4. **Run the plugin** and click "Analyze SVG Structure"
5. **Look for these debug messages:**

```
UI: Sending analyze-svg message...
UI: Message sent successfully
Plugin: Received message: {type: 'analyze-svg', svgData: '...'}
Plugin: Analyzing SVG structure...
Plugin: Creating node from SVG...
Plugin: Analyzing structure...
Plugin: Structure analyzed: {elements: [...], groups: [...], variants: [...]}
Plugin: Sending analysis-complete message...
UI: Received message: {pluginMessage: {type: 'analysis-complete', structure: {...}}}
UI: Processing message type: analysis-complete
UI: Handling analysis-complete
```

### **Step 2: Identify the Issue**

**If you see "UI: Sending analyze-svg message..." but no "Plugin: Received message":**
- The message is not reaching the plugin
- **Solution**: Reimport the plugin in Figma

**If you see "Plugin: Received message" but no "Plugin: Analyzing SVG structure...":**
- There's an error in the message handling
- **Solution**: Check the message structure

**If you see "Plugin: Creating node from SVG..." but no "Plugin: Structure analyzed":**
- There's an error in SVG parsing
- **Solution**: Check if the SVG is valid

**If you see "Plugin: Sending analysis-complete message..." but no "UI: Received message":**
- The response is not reaching the UI
- **Solution**: Check the message format

### **Step 3: Common Solutions**

#### **Solution 1: Reimport Plugin**
1. Go to **Plugins** → **Development** → **Import plugin from manifest**
2. Select the updated `manifest.json`
3. Try again

#### **Solution 2: Check SVG Format**
Make sure your SVG has the correct structure:
```xml
<svg xmlns="http://www.w3.org/2000/svg">
  <g id="ELEMENTS">
    <g id="Card" class="element" data-figma-component="container">
      <!-- content -->
    </g>
  </g>
  <g id="GROUPS">
    <g id="ProjectHeader" class="group" data-figma-component="header">
      <!-- content -->
    </g>
  </g>
  <g id="VARIANTS">
    <g id="CompactProject" class="variant" data-figma-variant="compact">
      <!-- content -->
    </g>
  </g>
</svg>
```

#### **Solution 3: Use Sample SVG**
1. Click "Load SVG File"
2. Select `sample-project-card.svg`
3. Try analyzing

#### **Solution 4: Check Figma Version**
- Make sure you're using Figma Desktop App (not web version)
- Update Figma to the latest version

### **Step 4: Alternative Debug Method**

If console logs don't show up, try this:

1. **Open Figma**
2. **Go to Plugins** → **Development** → **Open Console**
3. **Run the plugin**
4. **Click "Analyze SVG Structure"**
5. **Check the console for errors**

### **Step 5: Manual Test**

Try this simple test:

1. **Open the plugin**
2. **Paste this simple SVG:**
```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <g id="ELEMENTS">
    <g id="TestCard" class="element" data-figma-component="container">
      <rect width="50" height="30" fill="blue"/>
    </g>
  </g>
</svg>
```
3. **Click "Analyze SVG Structure"**
4. **Check console for messages**

### **Step 6: If Still Not Working**

If none of the above works:

1. **Check if the plugin is properly built:**
   ```bash
   cd svg-to-components-plugin
   npm run build
   ```

2. **Check if all files exist:**
   - `dist/code.js`
   - `dist/ui.html`
   - `dist/ui.js`
   - `manifest.json`

3. **Try a different approach:**
   - Create a new Figma file
   - Import the plugin again
   - Test with the sample SVG

### **Expected Behavior**

When working correctly, you should see:

1. **Button changes** to "🔍 Analyzing..."
2. **Progress section** appears
3. **Log messages** show analysis progress
4. **Structure section** appears with detected components
5. **Convert button** becomes enabled

### **Still Having Issues?**

If you're still having problems:

1. **Share the console output** with me
2. **Describe what you see** when clicking the button
3. **Let me know** which step fails

The debug version will help us identify exactly where the communication is breaking down.
