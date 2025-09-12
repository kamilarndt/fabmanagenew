// Figma Plugin Code
// FabManage Component Generator

// Component type definitions
const COMPONENT_TYPES = {
    ATOM: 'atom',
    MOLECULE: 'molecule',
    ORGANISM: 'organism'
};

// Atomic Design folder structure
const FOLDER_STRUCTURE = {
    [COMPONENT_TYPES.ATOM]: '⚛️ Atoms',
    [COMPONENT_TYPES.MOLECULE]: '🧬 Molecules',
    [COMPONENT_TYPES.ORGANISM]: '🦠 Organisms'
};

// Component generator class
class FigmaComponentGenerator {
    constructor() {
        this.folders = new Map();
        this.components = new Map();
        this.settings = {};
    }

    // Main entry point
    async generateComponents(files, settings) {
        try {
            this.settings = settings;

            // Create folder structure
            if (settings.organizeFolders) {
                await this.createFolderStructure();
            }

            // Process each file
            for (const file of files) {
                await this.processFile(file);
            }

            // Create component variants if enabled
            if (settings.createVariants) {
                await this.createVariants();
            }

            // Add documentation if enabled
            if (settings.addDocumentation) {
                await this.addDocumentation();
            }

            return {
                success: true,
                count: this.components.size,
                components: Array.from(this.components.keys())
            };

        } catch (error) {
            console.error('Error generating components:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    // Create Atomic Design folder structure
    async createFolderStructure() {
        const rootFolder = figma.currentPage;

        for (const [type, folderName] of Object.entries(FOLDER_STRUCTURE)) {
            const folder = figma.createFrame();
            folder.name = folderName;
            folder.layoutMode = 'NONE';
            folder.fills = [];
            folder.resize(100, 100);
            folder.x = 0;
            folder.y = 0;

            rootFolder.appendChild(folder);
            this.folders.set(type, folder);
        }
    }

    // Process individual SVG file
    async processFile(file) {
        console.log(`Processing file: ${file.name}`);

        for (const component of file.structure.components) {
            await this.createComponent(component, file.name);
        }
    }

    // Create individual component
    async createComponent(componentData, fileName) {
        let frame = null;
        let component = null;

        try {
            // Create main frame
            frame = figma.createFrame();

            try {
                frame.name = componentData.id;
                frame.layoutMode = 'NONE';
                frame.fills = [];
            } catch (error) {
                console.warn(`Could not set frame properties for ${componentData.id}:`, error.message);
            }

            // Set component properties
            await this.setComponentProperties(frame, componentData);

            // Convert SVG elements to Figma nodes
            await this.convertSVGToFigma(frame, componentData.element);

            // Add to appropriate folder
            try {
                if (this.settings.organizeFolders) {
                    const folder = this.folders.get(componentData.type);
                    if (folder) {
                        folder.appendChild(frame);
                    } else {
                        figma.currentPage.appendChild(frame);
                    }
                } else {
                    figma.currentPage.appendChild(frame);
                }
            } catch (error) {
                console.warn(`Could not add frame to page for ${componentData.id}:`, error.message);
            }

            // Create component instance
            try {
                component = figma.createComponent();
                component.name = componentData.id;
                component.description = this.getComponentDescription(componentData);
            } catch (error) {
                console.warn(`Could not create component for ${componentData.id}:`, error.message);
                // Continue without component creation
            }

            // Copy frame content to component if component was created
            if (component) {
                try {
                    this.copyFrameToComponent(frame, component);
                } catch (error) {
                    console.warn(`Could not copy frame to component for ${componentData.id}:`, error.message);
                }
            }

            // Store component reference
            this.components.set(componentData.id, {
                component: component,
                type: componentData.type,
                data: componentData
            });

            // Remove original frame if component was created successfully
            if (component && frame) {
                try {
                    frame.remove();
                } catch (error) {
                    console.warn(`Could not remove frame for ${componentData.id}:`, error.message);
                }
            }

            console.log(`Created component: ${componentData.id} (${componentData.type})`);

        } catch (error) {
            console.error(`Error creating component ${componentData.id}:`, error);

            // Clean up frame if it exists
            if (frame) {
                try {
                    frame.remove();
                } catch (cleanupError) {
                    console.warn(`Could not clean up frame for ${componentData.id}:`, cleanupError.message);
                }
            }

            // Don't throw error, continue with other components
            console.warn(`Skipping component ${componentData.id} due to error`);
        }
    }

    // Set component properties
    async setComponentProperties(frame, componentData) {
        try {
            // Set basic properties
            frame.name = componentData.id;

            // Add metadata safely
            try {
                frame.setPluginData('componentType', componentData.type);
                frame.setPluginData('atomicDesign', 'true');
                frame.setPluginData('sourceFile', componentData.fileName || 'unknown');
            } catch (error) {
                console.warn('Could not set plugin data:', error.message);
            }

            // Set description safely
            try {
                frame.description = this.getComponentDescription(componentData);
            } catch (error) {
                console.warn('Could not set description:', error.message);
            }

            // Set size based on content
            try {
                frame.resize(300, 200); // Default size, will be adjusted
            } catch (error) {
                console.warn('Could not resize frame:', error.message);
            }
        } catch (error) {
            console.error('Error setting component properties:', error.message);
        }
    }

    // Get component description
    getComponentDescription(componentData) {
        const type = componentData.type.toUpperCase();
        const name = componentData.id.replace(/-/g, ' ');

        return `${type}: ${name}\n\nGenerated from SVG with Atomic Design structure.\n\nType: ${componentData.type}\nChildren: ${componentData.children.length}`;
    }

    // Convert SVG elements to Figma nodes
    async convertSVGToFigma(parentFrame, serializedElement) {
        // Process the serialized element and its children
        await this.processSerializedElement(parentFrame, serializedElement);

        // Auto-resize frame to fit content
        this.autoResizeFrame(parentFrame);
    }

    // Auto-resize frame to fit content
    autoResizeFrame(frame) {
        try {
            if (frame.children && frame.children.length > 0) {
                // Calculate bounds of all children
                let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

                frame.children.forEach(child => {
                    const bounds = child.absoluteBoundingBox;
                    if (bounds) {
                        minX = Math.min(minX, bounds.x);
                        minY = Math.min(minY, bounds.y);
                        maxX = Math.max(maxX, bounds.x + bounds.width);
                        maxY = Math.max(maxY, bounds.y + bounds.height);
                    }
                });

                if (isFinite(minX) && isFinite(minY) && isFinite(maxX) && isFinite(maxY)) {
                    const width = maxX - minX;
                    const height = maxY - minY;

                    // Add padding
                    const padding = 20;
                    frame.resize(width + padding * 2, height + padding * 2);

                    // Adjust children positions relative to frame
                    frame.children.forEach(child => {
                        const bounds = child.absoluteBoundingBox;
                        if (bounds) {
                            child.x = bounds.x - minX + padding;
                            child.y = bounds.y - minY + padding;
                        }
                    });
                }
            }
        } catch (error) {
            console.warn('Could not auto-resize frame:', error.message);
        }
    }

    // Process serialized SVG element
    async processSerializedElement(parentFrame, element) {
        if (!element || !element.children) return;

        // Process all child elements
        for (const child of element.children) {
            await this.createFigmaNodeFromSerialized(parentFrame, child);
        }
    }

    // Create Figma node from serialized element
    async createFigmaNodeFromSerialized(parentFrame, element) {
        if (!element || !element.attributes) return;

        const attrs = element.attributes;

        try {
            // Handle rectangles with advanced styling
            if (element.tagName === 'rect') {
                const figmaRect = figma.createRectangle();

                // Set position safely
                try {
                    figmaRect.x = parseFloat(attrs.x || '0');
                    figmaRect.y = parseFloat(attrs.y || '0');
                } catch (error) {
                    console.warn('Could not set rectangle position:', error.message);
                }

                // Set size safely
                try {
                    figmaRect.resize(
                        parseFloat(attrs.width || '100'),
                        parseFloat(attrs.height || '50')
                    );
                } catch (error) {
                    console.warn('Could not resize rectangle:', error.message);
                }

                // Set fill color safely with advanced parsing
                if (attrs.fill && attrs.fill !== 'none') {
                    try {
                        const fill = this.parseAdvancedFill(attrs.fill, attrs);
                        if (fill) {
                            figmaRect.fills = [fill];
                        }
                    } catch (error) {
                        console.warn('Could not set rectangle fill:', error.message);
                    }
                } else if (attrs.style) {
                    // Try to parse fill from CSS style
                    const fillMatch = attrs.style.match(/fill:\s*([^;]+)/);
                    if (fillMatch && fillMatch[1] !== 'none') {
                        try {
                            const fill = this.parseAdvancedFill(fillMatch[1], attrs);
                            if (fill) {
                                figmaRect.fills = [fill];
                            }
                        } catch (error) {
                            console.warn('Could not set rectangle fill from style:', error.message);
                        }
                    }
                }

                // Set stroke safely
                if (attrs.stroke) {
                    try {
                        figmaRect.strokes = [{
                            type: 'SOLID',
                            color: this.parseColor(attrs.stroke)
                        }];
                        figmaRect.strokeWeight = parseFloat(attrs['stroke-width'] || '1');
                    } catch (error) {
                        console.warn('Could not set rectangle stroke:', error.message);
                    }
                }

                // Set border radius safely
                if (attrs.rx) {
                    try {
                        figmaRect.cornerRadius = parseFloat(attrs.rx);
                    } catch (error) {
                        console.warn('Could not set rectangle corner radius:', error.message);
                    }
                }

                try {
                    parentFrame.appendChild(figmaRect);
                } catch (error) {
                    console.warn('Could not append rectangle:', error.message);
                }
            }

            // Handle circles
            else if (element.tagName === 'circle') {
                const figmaEllipse = figma.createEllipse();
                const radius = parseFloat(attrs.r || '10');

                try {
                    figmaEllipse.x = parseFloat(attrs.cx || '0') - radius;
                    figmaEllipse.y = parseFloat(attrs.cy || '0') - radius;
                    figmaEllipse.resize(radius * 2, radius * 2);
                } catch (error) {
                    console.warn('Could not set circle position/size:', error.message);
                }

                // Set fill color safely
                if (attrs.fill && attrs.fill !== 'none') {
                    try {
                        figmaEllipse.fills = [{
                            type: 'SOLID',
                            color: this.parseColor(attrs.fill)
                        }];
                    } catch (error) {
                        console.warn('Could not set circle fill:', error.message);
                    }
                }

                try {
                    parentFrame.appendChild(figmaEllipse);
                } catch (error) {
                    console.warn('Could not append circle:', error.message);
                }
            }

            // Handle text with advanced styling
            else if (element.tagName === 'text') {
                const figmaText = figma.createText();

                try {
                    figmaText.x = parseFloat(attrs.x || '0');
                    figmaText.y = parseFloat(attrs.y || '0');
                    figmaText.characters = element.textContent || '';
                } catch (error) {
                    console.warn('Could not set text position/content:', error.message);
                }

                // Parse CSS styles if present
                const styles = this.parseCSSStyles(attrs.style || '');

                // Set font properties safely
                const fontSize = attrs['font-size'] || styles.fontSize;
                if (fontSize) {
                    try {
                        figmaText.fontSize = parseFloat(fontSize);
                    } catch (error) {
                        console.warn('Could not set font size:', error.message);
                    }
                }

                const fontWeight = attrs['font-weight'] || styles.fontWeight;
                if (fontWeight) {
                    try {
                        figmaText.fontWeight = fontWeight === 'bold' || fontWeight === '700' ? 700 :
                            fontWeight === 'light' || fontWeight === '300' ? 300 : 400;
                    } catch (error) {
                        console.warn('Could not set font weight:', error.message);
                    }
                }

                const fontFamily = attrs['font-family'] || styles.fontFamily;
                if (fontFamily) {
                    try {
                        // Map common fonts to Figma supported fonts
                        const mappedFont = this.mapFontFamily(fontFamily);
                        figmaText.fontName = { family: mappedFont, style: 'Regular' };
                    } catch (error) {
                        console.warn('Could not set font family:', error.message);
                    }
                }

                // Set text alignment
                const textAlign = attrs['text-anchor'] || styles.textAlign;
                if (textAlign) {
                    try {
                        figmaText.textAlignHorizontal = textAlign === 'middle' ? 'CENTER' :
                            textAlign === 'end' ? 'RIGHT' : 'LEFT';
                    } catch (error) {
                        console.warn('Could not set text alignment:', error.message);
                    }
                }

                // Set text color
                const fillColor = attrs.fill || styles.color;
                if (fillColor && fillColor !== 'none') {
                    try {
                        figmaText.fills = [{
                            type: 'SOLID',
                            color: this.parseColor(fillColor)
                        }];
                    } catch (error) {
                        console.warn('Could not set text fill:', error.message);
                    }
                }

                try {
                    parentFrame.appendChild(figmaText);
                } catch (error) {
                    console.warn('Could not append text:', error.message);
                }
            }

            // Handle groups - recursively process children with layout
            else if (element.tagName === 'g') {
                // Create a frame for the group
                const groupFrame = figma.createFrame();

                try {
                    groupFrame.name = element.id || 'Group';

                    // Determine layout mode based on class or attributes
                    const layoutMode = this.determineLayoutMode(element, attrs);
                    groupFrame.layoutMode = layoutMode;

                    if (layoutMode !== 'NONE') {
                        // Set layout properties
                        groupFrame.primaryAxisSizingMode = 'AUTO';
                        groupFrame.counterAxisSizingMode = 'AUTO';
                        groupFrame.itemSpacing = this.parseSpacing(attrs['data-spacing'] || '8');
                        groupFrame.paddingLeft = this.parseSpacing(attrs['data-padding-left'] || '0');
                        groupFrame.paddingRight = this.parseSpacing(attrs['data-padding-right'] || '0');
                        groupFrame.paddingTop = this.parseSpacing(attrs['data-padding-top'] || '0');
                        groupFrame.paddingBottom = this.parseSpacing(attrs['data-padding-bottom'] || '0');
                    }

                    groupFrame.fills = [];
                } catch (error) {
                    console.warn('Could not set group properties:', error.message);
                }

                // Apply transform if present
                if (attrs.transform) {
                    try {
                        const transform = this.parseTransform(attrs.transform);
                        if (transform.translate) {
                            groupFrame.x = transform.translate.x || 0;
                            groupFrame.y = transform.translate.y || 0;
                        }
                    } catch (error) {
                        console.warn('Could not apply transform:', error.message);
                    }
                }

                try {
                    parentFrame.appendChild(groupFrame);
                } catch (error) {
                    console.warn('Could not append group:', error.message);
                }

                // Process children
                if (element.children) {
                    for (const child of element.children) {
                        await this.createFigmaNodeFromSerialized(groupFrame, child);
                    }
                }
            }

            // Handle path elements (complex shapes)
            else if (element.tagName === 'path') {
                try {
                    // Create a rectangle as a placeholder for path
                    const figmaRect = figma.createRectangle();

                    // Try to extract basic dimensions from path data
                    const pathData = attrs.d || '';
                    const bounds = this.parsePathBounds(pathData);

                    if (bounds) {
                        figmaRect.x = bounds.x;
                        figmaRect.y = bounds.y;
                        figmaRect.resize(bounds.width, bounds.height);
                    } else {
                        // Default size if we can't parse bounds
                        figmaRect.resize(100, 50);
                    }

                    // Set fill color
                    if (attrs.fill && attrs.fill !== 'none') {
                        try {
                            const fill = this.parseAdvancedFill(attrs.fill, attrs);
                            if (fill) {
                                figmaRect.fills = [fill];
                            }
                        } catch (error) {
                            console.warn('Could not set path fill:', error.message);
                        }
                    }

                    // Set stroke
                    if (attrs.stroke) {
                        try {
                            figmaRect.strokes = [{
                                type: 'SOLID',
                                color: this.parseColor(attrs.stroke)
                            }];
                            figmaRect.strokeWeight = parseFloat(attrs['stroke-width'] || '1');
                        } catch (error) {
                            console.warn('Could not set path stroke:', error.message);
                        }
                    }

                    try {
                        parentFrame.appendChild(figmaRect);
                    } catch (error) {
                        console.warn('Could not append path:', error.message);
                    }
                } catch (error) {
                    console.warn('Error creating path element:', error.message);
                }
            }

            // Handle line elements
            else if (element.tagName === 'line') {
                try {
                    const figmaLine = figma.createLine();

                    figmaLine.x = parseFloat(attrs.x1 || '0');
                    figmaLine.y = parseFloat(attrs.y1 || '0');
                    figmaLine.resize(
                        parseFloat(attrs.x2 || '100') - parseFloat(attrs.x1 || '0'),
                        parseFloat(attrs.y2 || '0') - parseFloat(attrs.y1 || '0')
                    );

                    if (attrs.stroke) {
                        try {
                            figmaLine.strokes = [{
                                type: 'SOLID',
                                color: this.parseColor(attrs.stroke)
                            }];
                            figmaLine.strokeWeight = parseFloat(attrs['stroke-width'] || '1');
                        } catch (error) {
                            console.warn('Could not set line stroke:', error.message);
                        }
                    }

                    try {
                        parentFrame.appendChild(figmaLine);
                    } catch (error) {
                        console.warn('Could not append line:', error.message);
                    }
                } catch (error) {
                    console.warn('Error creating line element:', error.message);
                }
            }

            // Handle other elements (ellipse, line, path, etc.)
            else if (element.tagName === 'ellipse') {
                const figmaEllipse = figma.createEllipse();

                try {
                    figmaEllipse.x = parseFloat(attrs.cx || '0') - parseFloat(attrs.rx || '10');
                    figmaEllipse.y = parseFloat(attrs.cy || '0') - parseFloat(attrs.ry || '10');
                    figmaEllipse.resize(
                        parseFloat(attrs.rx || '10') * 2,
                        parseFloat(attrs.ry || '10') * 2
                    );
                } catch (error) {
                    console.warn('Could not set ellipse position/size:', error.message);
                }

                if (attrs.fill && attrs.fill !== 'none') {
                    try {
                        figmaEllipse.fills = [{
                            type: 'SOLID',
                            color: this.parseColor(attrs.fill)
                        }];
                    } catch (error) {
                        console.warn('Could not set ellipse fill:', error.message);
                    }
                }

                try {
                    parentFrame.appendChild(figmaEllipse);
                } catch (error) {
                    console.warn('Could not append ellipse:', error.message);
                }
            }
        } catch (error) {
            console.warn('Error creating Figma node:', error.message);
        }
    }

    // Parse transform attribute
    parseTransform(transformStr) {
        const result = {};

        // Parse translate
        const translateMatch = transformStr.match(/translate\(([^,]+),\s*([^)]+)\)/);
        if (translateMatch) {
            result.translate = {
                x: parseFloat(translateMatch[1]),
                y: parseFloat(translateMatch[2])
            };
        }

        return result;
    }

    // Parse color from SVG format
    parseColor(colorString) {
        if (!colorString) return { r: 0, g: 0, b: 0 };

        // Handle hex colors
        if (colorString.startsWith('#')) {
            const hex = colorString.slice(1);
            if (hex.length === 3) {
                // Short hex format #RGB
                const r = parseInt(hex[0] + hex[0], 16) / 255;
                const g = parseInt(hex[1] + hex[1], 16) / 255;
                const b = parseInt(hex[2] + hex[2], 16) / 255;
                return { r, g, b };
            } else if (hex.length === 6) {
                // Full hex format #RRGGBB
                const r = parseInt(hex.slice(0, 2), 16) / 255;
                const g = parseInt(hex.slice(2, 4), 16) / 255;
                const b = parseInt(hex.slice(4, 6), 16) / 255;
                return { r, g, b };
            }
        }

        // Handle rgb colors
        if (colorString.startsWith('rgb')) {
            const matches = colorString.match(/\d+/g);
            if (matches && matches.length >= 3) {
                return {
                    r: parseInt(matches[0]) / 255,
                    g: parseInt(matches[1]) / 255,
                    b: parseInt(matches[2]) / 255
                };
            }
        }

        // Handle rgba colors
        if (colorString.startsWith('rgba')) {
            const matches = colorString.match(/[\d.]+/g);
            if (matches && matches.length >= 3) {
                return {
                    r: parseFloat(matches[0]) / 255,
                    g: parseFloat(matches[1]) / 255,
                    b: parseFloat(matches[2]) / 255
                };
            }
        }

        // Handle named colors
        const namedColors = {
            'black': { r: 0, g: 0, b: 0 },
            'white': { r: 1, g: 1, b: 1 },
            'red': { r: 1, g: 0, b: 0 },
            'green': { r: 0, g: 1, b: 0 },
            'blue': { r: 0, g: 0, b: 1 },
            'yellow': { r: 1, g: 1, b: 0 },
            'cyan': { r: 0, g: 1, b: 1 },
            'magenta': { r: 1, g: 0, b: 1 },
            'gray': { r: 0.5, g: 0.5, b: 0.5 },
            'grey': { r: 0.5, g: 0.5, b: 0.5 }
        };

        if (namedColors[colorString.toLowerCase()]) {
            return namedColors[colorString.toLowerCase()];
        }

        // Default color
        return { r: 0, g: 0, b: 0 };
    }

    // Parse advanced fill (gradients, patterns, etc.)
    parseAdvancedFill(fillString, attrs) {
        if (!fillString || fillString === 'none') return null;

        // Handle gradients
        if (fillString.includes('url(#') || fillString.includes('gradient')) {
            // For now, fall back to solid color
            return {
                type: 'SOLID',
                color: this.parseColor(fillString)
            };
        }

        // Handle solid colors
        return {
            type: 'SOLID',
            color: this.parseColor(fillString)
        };
    }

    // Parse CSS styles from style attribute
    parseCSSStyles(styleString) {
        const styles = {};
        if (!styleString) return styles;

        const declarations = styleString.split(';');
        declarations.forEach(decl => {
            const [property, value] = decl.split(':').map(s => s.trim());
            if (property && value) {
                styles[property] = value;
            }
        });

        return styles;
    }

    // Map font families to Figma supported fonts
    mapFontFamily(fontFamily) {
        const fontMap = {
            'Arial': 'Arial',
            'Helvetica': 'Arial',
            'Times New Roman': 'Times New Roman',
            'Times': 'Times New Roman',
            'Courier New': 'Courier New',
            'Courier': 'Courier New',
            'Verdana': 'Arial',
            'Georgia': 'Arial',
            'Palatino': 'Arial',
            'Garamond': 'Arial',
            'Bookman': 'Arial',
            'Comic Sans MS': 'Arial',
            'Trebuchet MS': 'Arial',
            'Arial Black': 'Arial',
            'Impact': 'Arial'
        };

        // Extract first font from font stack
        const primaryFont = fontFamily.split(',')[0].replace(/['"]/g, '').trim();
        return fontMap[primaryFont] || 'Arial';
    }

    // Parse SVG path bounds to get basic dimensions
    parsePathBounds(pathData) {
        if (!pathData) return null;

        try {
            // Simple bounds calculation for basic path commands
            const commands = pathData.match(/[MmLlHhVvCcSsQqTtAaZz][^MmLlHhVvCcSsQqTtAaZz]*/g);
            if (!commands || commands.length === 0) return null;

            let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
            let currentX = 0, currentY = 0;

            commands.forEach(command => {
                const type = command[0];
                const coords = command.slice(1).trim().split(/[\s,]+/).filter(c => c).map(parseFloat);

                switch (type.toLowerCase()) {
                    case 'm': // Move to
                    case 'l': // Line to
                        if (coords.length >= 2) {
                            currentX = coords[0];
                            currentY = coords[1];
                            minX = Math.min(minX, currentX);
                            minY = Math.min(minY, currentY);
                            maxX = Math.max(maxX, currentX);
                            maxY = Math.max(maxY, currentY);
                        }
                        break;
                    case 'h': // Horizontal line
                        if (coords.length >= 1) {
                            currentX = coords[0];
                            minX = Math.min(minX, currentX);
                            maxX = Math.max(maxX, currentX);
                        }
                        break;
                    case 'v': // Vertical line
                        if (coords.length >= 1) {
                            currentY = coords[0];
                            minY = Math.min(minY, currentY);
                            maxY = Math.max(maxY, currentY);
                        }
                        break;
                    case 'c': // Cubic bezier
                        if (coords.length >= 6) {
                            // Check control points and end point
                            for (let i = 0; i < coords.length; i += 2) {
                                if (i + 1 < coords.length) {
                                    minX = Math.min(minX, coords[i]);
                                    minY = Math.min(minY, coords[i + 1]);
                                    maxX = Math.max(maxX, coords[i]);
                                    maxY = Math.max(maxY, coords[i + 1]);
                                }
                            }
                            currentX = coords[coords.length - 2];
                            currentY = coords[coords.length - 1];
                        }
                        break;
                }
            });

            if (isFinite(minX) && isFinite(minY) && isFinite(maxX) && isFinite(maxY)) {
                return {
                    x: minX,
                    y: minY,
                    width: maxX - minX,
                    height: maxY - minY
                };
            }
        } catch (error) {
            console.warn('Error parsing path bounds:', error.message);
        }

        return null;
    }

    // Determine layout mode based on element attributes
    determineLayoutMode(element, attrs) {
        // Check for explicit layout mode
        if (attrs['data-layout'] === 'flex-row') return 'HORIZONTAL';
        if (attrs['data-layout'] === 'flex-column') return 'VERTICAL';
        if (attrs['data-layout'] === 'grid') return 'NONE'; // Grid not directly supported

        // Check for CSS classes that indicate layout
        const className = attrs.class || '';
        if (className.includes('flex-row') || className.includes('horizontal')) return 'HORIZONTAL';
        if (className.includes('flex-column') || className.includes('vertical')) return 'VERTICAL';
        if (className.includes('flex') || className.includes('layout')) return 'HORIZONTAL';

        // Check element ID for layout hints
        const id = element.id || '';
        if (id.includes('row') || id.includes('horizontal')) return 'HORIZONTAL';
        if (id.includes('column') || id.includes('vertical')) return 'VERTICAL';
        if (id.includes('header') || id.includes('footer') || id.includes('nav')) return 'HORIZONTAL';

        // Default to vertical for most groups
        return 'VERTICAL';
    }

    // Parse spacing values
    parseSpacing(value) {
        if (!value) return 0;

        // Remove units and parse number
        const numValue = parseFloat(value.replace(/[^\d.-]/g, ''));
        return isNaN(numValue) ? 0 : numValue;
    }

    // Create component variants based on ProjectCard structure
    createProjectCardVariants(component) {
        try {
            // Create different states
            const states = [
                { name: 'Default', description: 'Default project card state' },
                { name: 'Hover', description: 'Hover state with subtle elevation' },
                { name: 'Selected', description: 'Selected state for active project' },
                { name: 'Loading', description: 'Loading state with skeleton' }
            ];

            states.forEach(state => {
                try {
                    const variant = component.createVariant();
                    variant.name = state.name;
                    variant.description = state.description;
                } catch (error) {
                    console.warn(`Could not create ${state.name} variant:`, error.message);
                }
            });
        } catch (error) {
            console.warn('Could not create project card variants:', error.message);
        }
    }

    // Copy frame content to component
    copyFrameToComponent(frame, component) {
        // This is a simplified implementation
        // In practice, you'd need to properly copy all child nodes
        try {
            component.resize(frame.width, frame.height);
        } catch (error) {
            console.warn('Could not resize component:', error.message);
        }
    }

    // Create component variants
    async createVariants() {
        console.log('Creating component variants...');

        for (const [id, componentData] of this.components) {
            const component = componentData.component;

            // Create different states/variants based on component type
            if (componentData.type === COMPONENT_TYPES.ATOM) {
                await this.createAtomVariants(component);
            } else if (componentData.type === COMPONENT_TYPES.MOLECULE) {
                await this.createMoleculeVariants(component);
            } else if (componentData.type === COMPONENT_TYPES.ORGANISM) {
                // Special handling for complex components like ProjectCard
                if (id.toLowerCase().includes('project') || id.toLowerCase().includes('card')) {
                    this.createProjectCardVariants(component);
                } else {
                    await this.createOrganismVariants(component);
                }
            }
        }
    }

    // Create atom variants (e.g., different states)
    async createAtomVariants(component) {
        try {
            // Create hover state
            const hoverVariant = component.createVariant();
            hoverVariant.name = 'Hover';
            hoverVariant.description = 'Hover state for the component';
        } catch (error) {
            console.warn('Could not create hover variant:', error.message);
        }

        try {
            // Create disabled state
            const disabledVariant = component.createVariant();
            disabledVariant.name = 'Disabled';
            disabledVariant.description = 'Disabled state for the component';
        } catch (error) {
            console.warn('Could not create disabled variant:', error.message);
        }
    }

    // Create molecule variants
    async createMoleculeVariants(component) {
        try {
            // Create different sizes
            const smallVariant = component.createVariant();
            smallVariant.name = 'Small';
            smallVariant.description = 'Small size variant';
        } catch (error) {
            console.warn('Could not create small variant:', error.message);
        }

        try {
            const largeVariant = component.createVariant();
            largeVariant.name = 'Large';
            largeVariant.description = 'Large size variant';
        } catch (error) {
            console.warn('Could not create large variant:', error.message);
        }
    }

    // Create organism variants (complex components)
    async createOrganismVariants(component) {
        try {
            // Create different states for complex components
            const states = [
                { name: 'Default', description: 'Default state' },
                { name: 'Hover', description: 'Hover state' },
                { name: 'Active', description: 'Active state' },
                { name: 'Disabled', description: 'Disabled state' }
            ];

            states.forEach(state => {
                try {
                    const variant = component.createVariant();
                    variant.name = state.name;
                    variant.description = state.description;
                } catch (error) {
                    console.warn(`Could not create ${state.name} variant:`, error.message);
                }
            });
        } catch (error) {
            console.warn('Could not create organism variants:', error.message);
        }
    }

    // Add component documentation
    async addDocumentation() {
        console.log('Adding component documentation...');

        for (const [id, componentData] of this.components) {
            const component = componentData.component;

            try {
                // Add detailed description
                const description = this.generateDetailedDescription(componentData);
                component.description = description;
            } catch (error) {
                console.warn(`Could not set description for ${id}:`, error.message);
            }

            try {
                // Add usage examples
                const usageExamples = this.generateUsageExamples(componentData);
                component.setPluginData('usageExamples', JSON.stringify(usageExamples));
            } catch (error) {
                console.warn(`Could not set usage examples for ${id}:`, error.message);
            }

            try {
                // Add props documentation
                const props = this.generatePropsDocumentation(componentData);
                component.setPluginData('props', JSON.stringify(props));
            } catch (error) {
                console.warn(`Could not set props for ${id}:`, error.message);
            }
        }
    }

    // Generate detailed description
    generateDetailedDescription(componentData) {
        const type = componentData.type.toUpperCase();
        const name = componentData.id.replace(/-/g, ' ');

        return `${type}: ${name}

Atomic Design Level: ${componentData.type}
Source: Generated from SVG

Description:
This component was automatically generated from an SVG file using the FabManage Component Generator. It follows Atomic Design principles and maintains the visual structure of the original design.

Usage:
- Use this component as a building block in your designs
- Maintain consistency with the established design system
- Follow Atomic Design hierarchy when composing larger components

Properties:
- Type: ${componentData.type}
- Children: ${componentData.children.length}
- Generated: ${new Date().toISOString()}`;
    }

    // Generate usage examples
    generateUsageExamples(componentData) {
        return [
            {
                title: 'Basic Usage',
                description: `Use the ${componentData.id} component in your designs`,
                code: `<${componentData.id} />`
            },
            {
                title: 'With Props',
                description: 'Example with common properties',
                code: `<${componentData.id} variant="primary" size="medium" />`
            }
        ];
    }

    // Generate props documentation
    generatePropsDocumentation(componentData) {
        const baseProps = {
            variant: {
                type: 'string',
                description: 'Visual variant of the component',
                options: ['primary', 'secondary', 'tertiary'],
                default: 'primary'
            },
            size: {
                type: 'string',
                description: 'Size of the component',
                options: ['small', 'medium', 'large'],
                default: 'medium'
            }
        };

        // Add type-specific props
        if (componentData.type === COMPONENT_TYPES.ATOM) {
            baseProps.disabled = {
                type: 'boolean',
                description: 'Whether the component is disabled',
                default: false
            };
        }

        return baseProps;
    }
}

// Message handling
figma.ui.onmessage = async (msg) => {
    try {
        if (msg.type === 'generate-components') {
            const generator = new FigmaComponentGenerator();
            const result = await generator.generateComponents(msg.files, msg.settings);

            if (result.success) {
                figma.ui.postMessage({
                    type: 'generation-complete',
                    count: result.count,
                    components: result.components
                });
            } else {
                figma.ui.postMessage({
                    type: 'generation-error',
                    error: result.error
                });
            }
        }
    } catch (error) {
        console.error('Plugin error:', error);
        figma.ui.postMessage({
            type: 'generation-error',
            error: error.message
        });
    }
};

// Show UI
figma.showUI(__html__, { width: 400, height: 600 });
