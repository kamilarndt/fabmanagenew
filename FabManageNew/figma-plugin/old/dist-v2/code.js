// Figma Plugin Code V2 - Advanced Component Generator
// FabManage Component Generator with Tokens Studio Integration

// Component type definitions
const COMPONENT_TYPES = {
    ATOM: 'atom',
    MOLECULE: 'molecule', 
    ORGANISM: 'organism'
};

// Design token types
const TOKEN_TYPES = {
    COLOR: 'color',
    TYPOGRAPHY: 'typography',
    SPACING: 'spacing',
    BORDER_RADIUS: 'borderRadius',
    SHADOW: 'shadow'
};

// Atomic Design folder structure
const FOLDER_STRUCTURE = {
    [COMPONENT_TYPES.ATOM]: '⚛️ Atoms',
    [COMPONENT_TYPES.MOLECULE]: '🧬 Molecules', 
    [COMPONENT_TYPES.ORGANISM]: '🦠 Organisms'
};

// Advanced component generator with tokens integration
class AdvancedFigmaGenerator {
    constructor() {
        this.atoms = new Map();
        this.molecules = new Map();
        this.organisms = new Map();
        this.designTokens = new Map();
        this.folders = new Map();
        this.settings = {};
        this.duplicateGroups = new Map();
    }

    // Main entry point
    async generateAdvancedComponents(files, settings) {
        try {
            this.settings = settings;
            console.log('🚀 Starting Advanced Component Generation...');

            // Step 1: Parse all SVG files and extract structure
            await this.parseSVGFiles(files);

            // Step 2: Extract design tokens
            await this.extractDesignTokens();

            // Step 3: Create folder structure
            if (settings.organizeFolders) {
                await this.createFolderStructure();
            }

            // Step 4: Identify and group duplicate atoms
            await this.identifyDuplicateAtoms();

            // Step 5: Create atom components (only atoms as components)
            await this.createAtomComponents();

            // Step 6: Create frames for molecules and organisms
            await this.createMoleculeFrames();
            await this.createOrganismFrames();

            // Step 7: Generate Tokens Studio JSON
            if (settings.generateTokens) {
                await this.generateTokensStudioJSON();
            }

            // Step 8: Add documentation if enabled
            if (settings.addDocumentation) {
                await this.addAdvancedDocumentation();
            }

            return {
                success: true,
                atomsCreated: this.atoms.size,
                moleculesCreated: this.molecules.size,
                organismsCreated: this.organisms.size,
                tokensExtracted: this.designTokens.size,
                duplicateGroups: this.duplicateGroups.size
            };

        } catch (error) {
            console.error('Error in advanced generation:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    // Parse SVG files and extract structure
    async parseSVGFiles(files) {
        console.log('📋 Parsing SVG files...');
        
        for (const file of files) {
            console.log(`Processing: ${file.name}`);
            
            for (const component of file.structure.components) {
                const element = component.element;
                
                // Classify component type
                const type = this.classifyComponent(element, component.children);
                
                // Store in appropriate collection
                switch (type) {
                    case COMPONENT_TYPES.ATOM:
                        this.atoms.set(component.id, {
                            id: component.id,
                            type: type,
                            element: element,
                            properties: this.extractAtomProperties(element),
                            fileName: file.name
                        });
                        break;
                        
                    case COMPONENT_TYPES.MOLECULE:
                        this.molecules.set(component.id, {
                            id: component.id,
                            type: type,
                            element: element,
                            children: component.children,
                            fileName: file.name
                        });
                        break;
                        
                    case COMPONENT_TYPES.ORGANISM:
                        this.organisms.set(component.id, {
                            id: component.id,
                            type: type,
                            element: element,
                            children: component.children,
                            fileName: file.name
                        });
                        break;
                }
            }
        }
        
        console.log(`✅ Parsed: ${this.atoms.size} atoms, ${this.molecules.size} molecules, ${this.organisms.size} organisms`);
    }

    // Classify component type based on structure
    classifyComponent(element, children) {
        const childCount = children ? children.length : 0;
        
        // If no children with IDs, it's an atom
        if (childCount === 0) {
            return COMPONENT_TYPES.ATOM;
        }
        
        // If 1-4 children, it's a molecule
        if (childCount >= 1 && childCount <= 4) {
            return COMPONENT_TYPES.MOLECULE;
        }
        
        // If 5+ children, it's an organism
        return COMPONENT_TYPES.ORGANISM;
    }

    // Extract properties from atom element
    extractAtomProperties(element) {
        const properties = {
            width: 0,
            height: 0,
            fill: null,
            stroke: null,
            strokeWidth: 0,
            borderRadius: 0,
            fontSize: 12,
            fontFamily: 'Arial',
            fontWeight: 'normal',
            textAlign: 'left',
            shape: 'unknown'
        };

        // Extract from element attributes
        if (element.attributes) {
            const attrs = element.attributes;
            
            // Size
            properties.width = parseFloat(attrs.width || '0');
            properties.height = parseFloat(attrs.height || '0');
            
            // Colors
            properties.fill = attrs.fill || attrs.style?.match(/fill:\s*([^;]+)/)?.[1];
            properties.stroke = attrs.stroke || attrs.style?.match(/stroke:\s*([^;]+)/)?.[1];
            properties.strokeWidth = parseFloat(attrs['stroke-width'] || '0');
            
            // Border radius
            properties.borderRadius = parseFloat(attrs.rx || attrs.ry || '0');
            
            // Typography
            properties.fontSize = parseFloat(attrs['font-size'] || '12');
            properties.fontFamily = attrs['font-family'] || 'Arial';
            properties.fontWeight = attrs['font-weight'] || 'normal';
            properties.textAlign = attrs['text-anchor'] || 'left';
        }

        // Determine shape type
        properties.shape = this.determineShapeType(element);

        return properties;
    }

    // Determine shape type from element
    determineShapeType(element) {
        if (element.tagName === 'rect') return 'rectangle';
        if (element.tagName === 'circle') return 'circle';
        if (element.tagName === 'ellipse') return 'ellipse';
        if (element.tagName === 'text') return 'text';
        if (element.tagName === 'path') return 'path';
        return 'unknown';
    }

    // Extract design tokens from all atoms
    async extractDesignTokens() {
        console.log('🎨 Extracting design tokens...');
        
        const colors = new Set();
        const typography = new Set();
        const spacing = new Set();
        const borderRadius = new Set();
        
        // Extract tokens from atoms
        for (const [id, atom] of this.atoms) {
            const props = atom.properties;
            
            // Colors
            if (props.fill && props.fill !== 'none') {
                colors.add(props.fill);
            }
            if (props.stroke && props.stroke !== 'none') {
                colors.add(props.stroke);
            }
            
            // Typography
            if (props.shape === 'text') {
                typography.add(`${props.fontFamily}-${props.fontSize}-${props.fontWeight}`);
            }
            
            // Spacing (from sizes)
            if (props.width > 0) spacing.add(props.width);
            if (props.height > 0) spacing.add(props.height);
            
            // Border radius
            if (props.borderRadius > 0) {
                borderRadius.add(props.borderRadius);
            }
        }
        
        // Store extracted tokens
        this.designTokens.set('colors', Array.from(colors));
        this.designTokens.set('typography', Array.from(typography));
        this.designTokens.set('spacing', Array.from(spacing));
        this.designTokens.set('borderRadius', Array.from(borderRadius));
        
        console.log(`✅ Extracted tokens: ${colors.size} colors, ${typography.size} typography, ${spacing.size} spacing, ${borderRadius.size} border radius`);
    }

    // Identify duplicate atoms for grouping
    async identifyDuplicateAtoms() {
        console.log('🔍 Identifying duplicate atoms...');
        
        const groups = new Map();
        
        for (const [id, atom] of this.atoms) {
            const props = atom.properties;
            
            // Create a signature for grouping similar atoms
            const signature = this.createAtomSignature(props);
            
            if (!groups.has(signature)) {
                groups.set(signature, []);
            }
            groups.get(signature).push(atom);
        }
        
        // Store duplicate groups
        for (const [signature, atoms] of groups) {
            if (atoms.length > 1) {
                this.duplicateGroups.set(signature, atoms);
            }
        }
        
        console.log(`✅ Found ${this.duplicateGroups.size} duplicate groups`);
    }

    // Create signature for atom grouping
    createAtomSignature(props) {
        return `${props.shape}-${props.width}-${props.height}-${props.fill}-${props.stroke}-${props.borderRadius}-${props.fontSize}`;
    }

    // Create folder structure
    async createFolderStructure() {
        console.log('📁 Creating folder structure...');
        
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

    // Create atom components (ONLY atoms as components)
    async createAtomComponents() {
        console.log('⚛️ Creating atom components...');
        
        let createdCount = 0;
        
        // Process duplicate groups first
        for (const [signature, atoms] of this.duplicateGroups) {
            if (atoms.length > 0) {
                const baseAtom = atoms[0];
                const component = await this.createAtomComponent(baseAtom, atoms);
                
                if (component) {
                    // Create variants for duplicates
                    for (let i = 1; i < atoms.length; i++) {
                        await this.createAtomVariant(component, atoms[i]);
                    }
                    createdCount++;
                }
            }
        }
        
        // Process remaining unique atoms
        for (const [id, atom] of this.atoms) {
            // Skip if already processed as part of duplicate group
            let alreadyProcessed = false;
            for (const [signature, atoms] of this.duplicateGroups) {
                if (atoms.some(a => a.id === id)) {
                    alreadyProcessed = true;
                    break;
                }
            }
            
            if (!alreadyProcessed) {
                const component = await this.createAtomComponent(atom, [atom]);
                if (component) {
                    createdCount++;
                }
            }
        }
        
        console.log(`✅ Created ${createdCount} atom components`);
    }

    // Create individual atom component
    async createAtomComponent(atom, variants) {
        try {
            console.log(`Creating atom component: ${atom.id}`);
            
            // Create frame
            const frame = figma.createFrame();
            frame.name = atom.id;
            frame.layoutMode = 'NONE';
            frame.fills = [];
            
            // Set size
            frame.resize(atom.properties.width || 100, atom.properties.height || 50);
            
            // Convert SVG element to Figma nodes
            await this.convertElementToFigma(frame, atom.element);
            
            // Create component from frame
            const component = figma.createComponent();
            component.name = atom.id;
            component.description = this.generateAtomDescription(atom);
            
            // Copy frame content to component
            await this.copyFrameContentToComponent(frame, component);
            
            // Add to folder
            if (this.settings.organizeFolders) {
                const folder = this.folders.get(COMPONENT_TYPES.ATOM);
                if (folder) {
                    folder.appendChild(component);
                } else {
                    figma.currentPage.appendChild(component);
                }
            } else {
                figma.currentPage.appendChild(component);
            }
            
            // Remove original frame
            frame.remove();
            
            // Store component reference
            atom.component = component;
            
            return component;
            
        } catch (error) {
            console.error(`Error creating atom component ${atom.id}:`, error);
            return null;
        }
    }

    // Create variant for atom component
    async createAtomVariant(component, variantAtom) {
        try {
            const variant = component.createVariant();
            variant.name = variantAtom.id;
            variant.description = `Variant: ${variantAtom.id}`;
            
            // Apply variant properties
            // This would need more sophisticated implementation
            // to properly apply the variant styling
            
        } catch (error) {
            console.warn(`Could not create variant for ${variantAtom.id}:`, error.message);
        }
    }

    // Convert SVG element to Figma nodes
    async convertElementToFigma(parentFrame, element) {
        if (!element || !element.children) return;
        
        for (const child of element.children) {
            await this.createFigmaNodeFromElement(parentFrame, child);
        }
    }

    // Create Figma node from SVG element
    async createFigmaNodeFromElement(parentFrame, element) {
        if (!element || !element.attributes) return;
        
        const attrs = element.attributes;
        
        try {
            switch (element.tagName) {
                case 'rect':
                    await this.createRectangle(parentFrame, attrs);
                    break;
                case 'circle':
                    await this.createCircle(parentFrame, attrs);
                    break;
                case 'ellipse':
                    await this.createEllipse(parentFrame, attrs);
                    break;
                case 'text':
                    await this.createText(parentFrame, attrs, element.textContent);
                    break;
                case 'path':
                    await this.createPath(parentFrame, attrs);
                    break;
                case 'line':
                    await this.createLine(parentFrame, attrs);
                    break;
                case 'g':
                    await this.createGroup(parentFrame, element);
                    break;
            }
        } catch (error) {
            console.warn(`Error creating ${element.tagName}:`, error.message);
        }
    }

    // Create rectangle
    async createRectangle(parentFrame, attrs) {
        const rect = figma.createRectangle();
        
        rect.x = parseFloat(attrs.x || '0');
        rect.y = parseFloat(attrs.y || '0');
        rect.resize(
            parseFloat(attrs.width || '100'),
            parseFloat(attrs.height || '50')
        );
        
        // Set fill
        if (attrs.fill && attrs.fill !== 'none') {
            rect.fills = [{
                type: 'SOLID',
                color: this.parseColor(attrs.fill)
            }];
        }
        
        // Set stroke
        if (attrs.stroke) {
            rect.strokes = [{
                type: 'SOLID',
                color: this.parseColor(attrs.stroke)
            }];
            rect.strokeWeight = parseFloat(attrs['stroke-width'] || '1');
        }
        
        // Set corner radius
        if (attrs.rx) {
            rect.cornerRadius = parseFloat(attrs.rx);
        }
        
        parentFrame.appendChild(rect);
    }

    // Create circle
    async createCircle(parentFrame, attrs) {
        const circle = figma.createEllipse();
        const radius = parseFloat(attrs.r || '10');
        
        circle.x = parseFloat(attrs.cx || '0') - radius;
        circle.y = parseFloat(attrs.cy || '0') - radius;
        circle.resize(radius * 2, radius * 2);
        
        if (attrs.fill && attrs.fill !== 'none') {
            circle.fills = [{
                type: 'SOLID',
                color: this.parseColor(attrs.fill)
            }];
        }
        
        parentFrame.appendChild(circle);
    }

    // Create ellipse
    async createEllipse(parentFrame, attrs) {
        const ellipse = figma.createEllipse();
        
        const rx = parseFloat(attrs.rx || '10');
        const ry = parseFloat(attrs.ry || '10');
        
        ellipse.x = parseFloat(attrs.cx || '0') - rx;
        ellipse.y = parseFloat(attrs.cy || '0') - ry;
        ellipse.resize(rx * 2, ry * 2);
        
        if (attrs.fill && attrs.fill !== 'none') {
            ellipse.fills = [{
                type: 'SOLID',
                color: this.parseColor(attrs.fill)
            }];
        }
        
        parentFrame.appendChild(ellipse);
    }

    // Create text
    async createText(parentFrame, attrs, textContent) {
        const text = figma.createText();
        
        text.x = parseFloat(attrs.x || '0');
        text.y = parseFloat(attrs.y || '0');
        text.characters = textContent || '';
        
        // Set font properties
        const fontSize = parseFloat(attrs['font-size'] || '12');
        text.fontSize = fontSize;
        
        // Set font family
        const fontFamily = attrs['font-family'] || 'Arial';
        text.fontName = { family: fontFamily, style: 'Regular' };
        
        // Set font weight
        const fontWeight = attrs['font-weight'] || 'normal';
        if (fontWeight === 'bold') {
            text.fontName = { family: fontFamily, style: 'Bold' };
        }
        
        // Set text alignment
        const textAlign = attrs['text-anchor'] || 'start';
        text.textAlignHorizontal = textAlign === 'middle' ? 'CENTER' : 
                                  textAlign === 'end' ? 'RIGHT' : 'LEFT';
        
        // Set fill color
        if (attrs.fill && attrs.fill !== 'none') {
            text.fills = [{
                type: 'SOLID',
                color: this.parseColor(attrs.fill)
            }];
        }
        
        parentFrame.appendChild(text);
    }

    // Create path (simplified as rectangle)
    async createPath(parentFrame, attrs) {
        // For now, create a simple rectangle as placeholder
        const rect = figma.createRectangle();
        rect.resize(100, 50);
        
        if (attrs.fill && attrs.fill !== 'none') {
            rect.fills = [{
                type: 'SOLID',
                color: this.parseColor(attrs.fill)
            }];
        }
        
        parentFrame.appendChild(rect);
    }

    // Create line
    async createLine(parentFrame, attrs) {
        const line = figma.createLine();
        
        line.x = parseFloat(attrs.x1 || '0');
        line.y = parseFloat(attrs.y1 || '0');
        line.resize(
            parseFloat(attrs.x2 || '100') - parseFloat(attrs.x1 || '0'),
            parseFloat(attrs.y2 || '0') - parseFloat(attrs.y1 || '0')
        );
        
        if (attrs.stroke) {
            line.strokes = [{
                type: 'SOLID',
                color: this.parseColor(attrs.stroke)
            }];
            line.strokeWeight = parseFloat(attrs['stroke-width'] || '1');
        }
        
        parentFrame.appendChild(line);
    }

    // Create group (recursive)
    async createGroup(parentFrame, element) {
        const group = figma.createFrame();
        group.name = element.id || 'Group';
        group.layoutMode = 'NONE';
        group.fills = [];
        
        parentFrame.appendChild(group);
        
        // Process children
        if (element.children) {
            for (const child of element.children) {
                await this.createFigmaNodeFromElement(group, child);
            }
        }
    }

    // Copy frame content to component (FIXED VERSION)
    async copyFrameContentToComponent(frame, component) {
        try {
            // Set component size
            component.resize(frame.width, frame.height);
            
            // Copy all child nodes from frame to component
            const children = frame.children.slice(); // Create copy to avoid mutation issues
            
            for (const child of children) {
                // Clone the child and append to component
                const clonedChild = child.clone();
                component.appendChild(clonedChild);
            }
            
            console.log(`✅ Successfully copied ${children.length} elements to component`);
            
        } catch (error) {
            console.error('Error copying frame content to component:', error);
            throw error;
        }
    }

    // Parse color from various formats
    parseColor(colorString) {
        if (!colorString) return { r: 0, g: 0, b: 0 };
        
        // Handle hex colors
        if (colorString.startsWith('#')) {
            const hex = colorString.slice(1);
            if (hex.length === 3) {
                const r = parseInt(hex[0] + hex[0], 16) / 255;
                const g = parseInt(hex[1] + hex[1], 16) / 255;
                const b = parseInt(hex[2] + hex[2], 16) / 255;
                return { r, g, b };
            } else if (hex.length === 6) {
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
        
        // Handle named colors
        const namedColors = {
            'black': { r: 0, g: 0, b: 0 },
            'white': { r: 1, g: 1, b: 1 },
            'red': { r: 1, g: 0, b: 0 },
            'green': { r: 0, g: 1, b: 0 },
            'blue': { r: 0, g: 0, b: 1 }
        };
        
        if (namedColors[colorString.toLowerCase()]) {
            return namedColors[colorString.toLowerCase()];
        }
        
        return { r: 0, g: 0, b: 0 };
    }

    // Generate atom description
    generateAtomDescription(atom) {
        const props = atom.properties;
        return `ATOM: ${atom.id}

Type: ${props.shape}
Size: ${props.width}x${props.height}
Color: ${props.fill || 'none'}
Border: ${props.stroke || 'none'}

Generated from: ${atom.fileName}
Created: ${new Date().toISOString()}`;
    }

    // Create frames for molecules (using atom components)
    async createMoleculeFrames() {
        console.log('🧬 Creating molecule frames...');
        
        for (const [id, molecule] of this.molecules) {
            await this.createMoleculeFrame(molecule);
        }
        
        console.log(`✅ Created ${this.molecules.size} molecule frames`);
    }

    // Create individual molecule frame
    async createMoleculeFrame(molecule) {
        try {
            console.log(`Creating molecule frame: ${molecule.id}`);
            
            const frame = figma.createFrame();
            frame.name = molecule.id;
            frame.layoutMode = 'VERTICAL';
            frame.fills = [];
            
            // Set size based on content
            frame.resize(300, 200);
            
            // Add atom components as instances
            for (const child of molecule.children) {
                const atomComponent = this.findAtomComponent(child.id);
                if (atomComponent) {
                    const instance = atomComponent.createInstance();
                    frame.appendChild(instance);
                }
            }
            
            // Add to folder
            if (this.settings.organizeFolders) {
                const folder = this.folders.get(COMPONENT_TYPES.MOLECULE);
                if (folder) {
                    folder.appendChild(frame);
                } else {
                    figma.currentPage.appendChild(frame);
                }
            } else {
                figma.currentPage.appendChild(frame);
            }
            
        } catch (error) {
            console.error(`Error creating molecule frame ${molecule.id}:`, error);
        }
    }

    // Create frames for organisms (using atom components)
    async createOrganismFrames() {
        console.log('🦠 Creating organism frames...');
        
        for (const [id, organism] of this.organisms) {
            await this.createOrganismFrame(organism);
        }
        
        console.log(`✅ Created ${this.organisms.size} organism frames`);
    }

    // Create individual organism frame
    async createOrganismFrame(organism) {
        try {
            console.log(`Creating organism frame: ${organism.id}`);
            
            const frame = figma.createFrame();
            frame.name = organism.id;
            frame.layoutMode = 'VERTICAL';
            frame.fills = [];
            
            // Set size based on content
            frame.resize(400, 300);
            
            // Add atom components as instances
            for (const child of organism.children) {
                const atomComponent = this.findAtomComponent(child.id);
                if (atomComponent) {
                    const instance = atomComponent.createInstance();
                    frame.appendChild(instance);
                }
            }
            
            // Add to folder
            if (this.settings.organizeFolders) {
                const folder = this.folders.get(COMPONENT_TYPES.ORGANISM);
                if (folder) {
                    folder.appendChild(frame);
                } else {
                    figma.currentPage.appendChild(frame);
                }
            } else {
                figma.currentPage.appendChild(frame);
            }
            
        } catch (error) {
            console.error(`Error creating organism frame ${organism.id}:`, error);
        }
    }

    // Find atom component by ID
    findAtomComponent(atomId) {
        for (const [id, atom] of this.atoms) {
            if (id === atomId && atom.component) {
                return atom.component;
            }
        }
        return null;
    }

    // Generate Tokens Studio JSON
    async generateTokensStudioJSON() {
        console.log('🎨 Generating Tokens Studio JSON...');
        
        const tokens = {
            colors: {},
            typography: {},
            spacing: {},
            borderRadius: {}
        };
        
        // Process colors
        const colors = this.designTokens.get('colors') || [];
        colors.forEach((color, index) => {
            const colorName = this.generateColorName(color, index);
            tokens.colors[colorName] = {
                value: color,
                type: 'color'
            };
        });
        
        // Process typography
        const typography = this.designTokens.get('typography') || [];
        typography.forEach((font, index) => {
            const fontName = `font-${index + 1}`;
            const [family, size, weight] = font.split('-');
            tokens.typography[fontName] = {
                value: {
                    fontFamily: family,
                    fontSize: size + 'px',
                    fontWeight: weight
                },
                type: 'typography'
            };
        });
        
        // Process spacing
        const spacing = this.designTokens.get('spacing') || [];
        spacing.forEach((value, index) => {
            const spacingName = `spacing-${index + 1}`;
            tokens.spacing[spacingName] = {
                value: value + 'px',
                type: 'spacing'
            };
        });
        
        // Process border radius
        const borderRadius = this.designTokens.get('borderRadius') || [];
        borderRadius.forEach((value, index) => {
            const radiusName = `radius-${index + 1}`;
            tokens.borderRadius[radiusName] = {
                value: value + 'px',
                type: 'borderRadius'
            };
        });
        
        // Store tokens for export
        this.tokensStudioJSON = tokens;
        
        console.log(`✅ Generated Tokens Studio JSON with ${Object.keys(tokens.colors).length} colors, ${Object.keys(tokens.typography).length} typography, ${Object.keys(tokens.spacing).length} spacing, ${Object.keys(tokens.borderRadius).length} border radius`);
    }

    // Generate color name from hex value
    generateColorName(color, index) {
        // Try to match common colors
        const colorMap = {
            '#000000': 'black',
            '#ffffff': 'white',
            '#1890ff': 'primary',
            '#52c41a': 'success',
            '#ff4d4f': 'error',
            '#faad14': 'warning',
            '#f0f0f0': 'gray-100',
            '#d9d9d9': 'gray-200',
            '#8c8c8c': 'gray-500'
        };
        
        return colorMap[color.toLowerCase()] || `color-${index + 1}`;
    }

    // Add advanced documentation
    async addAdvancedDocumentation() {
        console.log('📚 Adding advanced documentation...');
        
        // Add documentation to atom components
        for (const [id, atom] of this.atoms) {
            if (atom.component) {
                const description = this.generateAdvancedAtomDescription(atom);
                atom.component.description = description;
                
                // Add usage examples
                atom.component.setPluginData('usageExamples', JSON.stringify([
                    {
                        title: 'Basic Usage',
                        description: `Use the ${id} component in your designs`,
                        code: `<${id} />`
                    }
                ]));
            }
        }
        
        console.log('✅ Added advanced documentation');
    }

    // Generate advanced atom description
    generateAdvancedAtomDescription(atom) {
        const props = atom.properties;
        const variants = this.duplicateGroups.get(this.createAtomSignature(props));
        
        return `ATOM: ${atom.id}

Atomic Design Level: Atom
Shape: ${props.shape}
Size: ${props.width}×${props.height}px
Color: ${props.fill || 'transparent'}
Border: ${props.stroke || 'none'}

Variants: ${variants ? variants.length : 1}
Source: ${atom.fileName}
Generated: ${new Date().toISOString()}

Usage:
This is an atomic component that can be used as a building block
in molecules and organisms. It follows Atomic Design principles
and maintains consistency across the design system.`;
    }
}

// Message handling
figma.ui.onmessage = async (msg) => {
    try {
        if (msg.type === 'generate-advanced-components') {
            const generator = new AdvancedFigmaGenerator();
            const result = await generator.generateAdvancedComponents(msg.files, msg.settings);
            
            if (result.success) {
                figma.ui.postMessage({
                    type: 'advanced-generation-complete',
                    atomsCreated: result.atomsCreated,
                    moleculesCreated: result.moleculesCreated,
                    organismsCreated: result.organismsCreated,
                    tokensExtracted: result.tokensExtracted,
                    duplicateGroups: result.duplicateGroups,
                    tokensJSON: generator.tokensStudioJSON
                });
            } else {
                figma.ui.postMessage({
                    type: 'advanced-generation-error',
                    error: result.error
                });
            }
        }
    } catch (error) {
        console.error('Plugin error:', error);
        figma.ui.postMessage({
            type: 'advanced-generation-error',
            error: error.message
        });
    }
};

// Show UI
figma.showUI(__html__, { width: 400, height: 600 });
