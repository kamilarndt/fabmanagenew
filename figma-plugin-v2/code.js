// Component types for Atomic Design
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
const FOLDER_NAMES = {
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
            console.log('🚀 Starting advanced component generation...');

            // Step 1: Import SVG files and let Figma handle natural grouping
            const importedNodes = await this.importSVGFiles(files);

            // Step 2: Process imported nodes and convert to Atomic Design structure
            await this.processImportedNodes(importedNodes);

            // Step 3: Create folder structure
            await this.createFolderStructure();

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
                nodesProcessed: importedNodes.length,
                tokensExtracted: this.designTokens.size
            };

        } catch (error) {
            console.error('Error in advanced generation:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    // Import SVG files and let Figma handle natural grouping
    async importSVGFiles(files) {
        console.log('📥 Importing SVG files...');
        const importedNodes = [];

        for (const file of files) {
            try {
                // Create a temporary frame to hold the imported SVG
                const container = figma.createFrame();
                container.name = `temp-${file.name}`;
                container.layoutMode = 'NONE';

                // Import SVG content
                const svgContent = file.content || (file.structure && file.structure.content);
                if (svgContent) {
                    // Parse SVG and create nodes
                    const parser = new DOMParser();
                    const svgDoc = parser.parseFromString(svgContent, 'image/svg+xml');
                    const svgElement = svgDoc.documentElement;

                    // Process SVG elements and create Figma nodes
                    await this.processSVGElement(container, svgElement);
                }

                importedNodes.push(container);
                console.log(`✅ Imported: ${file.name}`);

            } catch (error) {
                console.error(`❌ Error importing ${file.name}:`, error);
            }
        }

        return importedNodes;
    }

    // Process SVG element and create Figma nodes
    async processSVGElement(parent, element) {
        if (element.tagName === 'g' && element.getAttribute('id')) {
            // This is a group with ID - create a frame
            const frame = figma.createFrame();
            frame.name = element.getAttribute('id');

            // Check if it's an atom, molecule, or organism based on class
            const className = element.getAttribute('class') || '';
            if (className.includes('atom')) {
                // Process atom - create component
                const component = await this.processAtomGroup(frame, element);
                if (component) {
                    parent.appendChild(component);
                    return; // Skip adding frame since we added component
                }
            } else if (className.includes('molecule')) {
                // Process molecule - create frame with horizontal layout
                frame.layoutMode = 'HORIZONTAL';
                frame.primaryAxisAlignItems = 'MIN';
                frame.counterAxisAlignItems = 'MIN';
                frame.itemSpacing = 10;
                frame.paddingLeft = 10;
                frame.paddingRight = 10;
                frame.paddingTop = 10;
                frame.paddingBottom = 10;
            } else if (className.includes('organism')) {
                // Process organism - create frame with vertical layout
                frame.layoutMode = 'VERTICAL';
                frame.primaryAxisAlignItems = 'MIN';
                frame.counterAxisAlignItems = 'MIN';
                frame.itemSpacing = 20;
                frame.paddingLeft = 20;
                frame.paddingRight = 20;
                frame.paddingTop = 20;
                frame.paddingBottom = 20;
            }

            // Process children
            for (const child of element.children) {
                await this.processSVGElement(frame, child);
            }

            parent.appendChild(frame);
        } else if (element.tagName === 'rect') {
            // Create rectangle
            const rect = figma.createRectangle();
            rect.x = parseFloat(element.getAttribute('x') || '0');
            rect.y = parseFloat(element.getAttribute('y') || '0');
            rect.resize(
                parseFloat(element.getAttribute('width') || '100'),
                parseFloat(element.getAttribute('height') || '100')
            );

            if (element.getAttribute('fill')) {
                rect.fills = [{ type: 'SOLID', color: this.parseColor(element.getAttribute('fill')) }];
            }

            if (element.getAttribute('rx')) {
                rect.cornerRadius = parseFloat(element.getAttribute('rx'));
            }

            parent.appendChild(rect);
        } else if (element.tagName === 'text') {
            // Create text
            const text = figma.createText();
            text.characters = element.textContent || '';
            text.x = parseFloat(element.getAttribute('x') || '0');
            text.y = parseFloat(element.getAttribute('y') || '0');

            if (element.getAttribute('font-size')) {
                text.fontSize = parseFloat(element.getAttribute('font-size'));
            }

            if (element.getAttribute('fill')) {
                text.fills = [{ type: 'SOLID', color: this.parseColor(element.getAttribute('fill')) }];
            }

            parent.appendChild(text);
        }
    }

    // Process atom group - create component with vector properties
    async processAtomGroup(frame, element) {
        // Extract vector properties from child elements
        let vectorProps = {};
        let textContent = '';
        let textProps = {};

        for (const child of element.children) {
            if (child.tagName === 'rect') {
                vectorProps = {
                    x: parseFloat(child.getAttribute('x') || '0'),
                    y: parseFloat(child.getAttribute('y') || '0'),
                    width: parseFloat(child.getAttribute('width') || '100'),
                    height: parseFloat(child.getAttribute('height') || '100'),
                    fill: child.getAttribute('fill') || '#000000',
                    stroke: child.getAttribute('stroke') || null,
                    strokeWidth: parseFloat(child.getAttribute('stroke-width') || '0'),
                    borderRadius: parseFloat(child.getAttribute('rx') || '0')
                };
            } else if (child.tagName === 'text') {
                textContent = child.textContent || '';
                textProps = {
                    x: parseFloat(child.getAttribute('x') || '0'),
                    y: parseFloat(child.getAttribute('y') || '0'),
                    fontSize: parseFloat(child.getAttribute('font-size') || '12'),
                    fontFamily: child.getAttribute('font-family') || 'Arial',
                    fontWeight: child.getAttribute('font-weight') || 'normal',
                    fill: child.getAttribute('fill') || '#000000'
                };
            }
        }

        // Apply vector properties to frame
        if (vectorProps.fill) {
            frame.fills = [{ type: 'SOLID', color: this.parseColor(vectorProps.fill) }];
        }
        if (vectorProps.stroke) {
            frame.strokes = [{ type: 'SOLID', color: this.parseColor(vectorProps.stroke) }];
        }
        if (vectorProps.strokeWidth) {
            frame.strokeWeight = vectorProps.strokeWidth;
        }
        if (vectorProps.borderRadius) {
            frame.cornerRadius = vectorProps.borderRadius;
        }

        // Set frame size
        frame.resize(vectorProps.width || 100, vectorProps.height || 100);

        // Add text if present
        if (textContent) {
            const text = figma.createText();
            text.characters = textContent;
            text.fontSize = textProps.fontSize || 12;
            text.fills = [{ type: 'SOLID', color: this.parseColor(textProps.fill || '#000000') }];

            // Position text relative to frame
            text.x = (textProps.x || 0) - (vectorProps.x || 0);
            text.y = (textProps.y || 0) - (vectorProps.y || 0) - textProps.fontSize;

            frame.appendChild(text);
        }

        // Convert frame to component
        const component = figma.createComponent();
        component.name = frame.name;

        // Copy content from frame to component
        await this.copyFrameContentToComponent(frame, component);

        // Remove temporary frame
        frame.remove();

        // Return component instead of frame
        return component;
    }

    // Process imported nodes and convert to Atomic Design structure
    async processImportedNodes(importedNodes) {
        console.log('🔄 Processing imported nodes...');

        for (const node of importedNodes) {
            // Process the node and its children
            await this.processNode(node);
        }
    }

    // Process a single node and its children
    async processNode(node) {
        if (node.children) {
            for (const child of node.children) {
                await this.processNode(child);
            }
        }
    }

    // Parse SVG files and extract structure
    async parseSVGFiles(files) {
        console.log('📋 Parsing SVG files...');

        for (const file of files) {
            try {
                // Validate file structure
                if (!file.structure) {
                    console.warn(`File ${file.name} has no structure data`);
                    continue;
                }

                if (!file.structure.components || !Array.isArray(file.structure.components)) {
                    console.warn(`File ${file.name} has no components array`);
                    continue;
                }

                for (const component of file.structure.components) {
                    try {
                        // Validate component structure
                        if (!component.id) {
                            console.warn('Component missing ID, skipping');
                            continue;
                        }

                        if (!component.element) {
                            console.warn(`Component ${component.id} missing element, skipping`);
                            continue;
                        }

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
                                    children: component.children || [],
                                    fileName: file.name
                                });
                                break;

                            case COMPONENT_TYPES.ORGANISM:
                                this.organisms.set(component.id, {
                                    id: component.id,
                                    type: type,
                                    element: element,
                                    children: component.children || [],
                                    fileName: file.name
                                });
                                break;
                        }

                    } catch (error) {
                        console.error(`Error processing component ${component.id || 'unknown'}:`, error);
                    }
                }
            } catch (error) {
                console.error(`Error processing file ${file.name}:`, error);
            }
        }

        console.log(`✅ Parsed: ${this.atoms.size} atoms, ${this.molecules.size} molecules, ${this.organisms.size} organisms`);

        // Debug: List all components
        console.log('🔍 ATOMS:', Array.from(this.atoms.keys()));
        console.log('🔍 MOLECULES:', Array.from(this.molecules.keys()));
        console.log('🔍 ORGANISMS:', Array.from(this.organisms.keys()));
    }

    // Classify component type based on structure
    classifyComponent(element, children) {
        // Check class first - this is the primary indicator
        if (element.className) {
            if (element.className.includes('atom')) {
                return COMPONENT_TYPES.ATOM;
            } else if (element.className.includes('molecule')) {
                return COMPONENT_TYPES.MOLECULE;
            } else if (element.className.includes('organism')) {
                return COMPONENT_TYPES.ORGANISM;
            }
        }

        // Fallback: Count all children recursively (including those without IDs)
        const totalChildren = this.countAllChildren(element);
        const childrenWithIds = children ? children.length : 0;

        console.log(`🔍 Classifying component: ${element.id || 'unnamed'}, total children: ${totalChildren}, with IDs: ${childrenWithIds}`);

        // If no children at all, it's an atom
        if (totalChildren === 0) {
            return COMPONENT_TYPES.ATOM;
        }

        // If 1-3 children with IDs, it's a molecule
        if (childrenWithIds >= 1 && childrenWithIds <= 3) {
            return COMPONENT_TYPES.MOLECULE;
        }

        // If 4+ children with IDs, it's an organism
        return COMPONENT_TYPES.ORGANISM;
    }

    // Count all children recursively
    countAllChildren(element) {
        if (!element.children || !Array.isArray(element.children)) {
            return 0;
        }

        let count = element.children.length;

        // Count children of children recursively
        for (const child of element.children) {
            count += this.countAllChildren(child);
        }

        return count;
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
            shape: 'unknown',
            textContent: ''
        };

        // Extract from element attributes
        if (element.attributes) {
            const attrs = element.attributes;

            // Size
            properties.width = parseFloat(attrs.width || '0');
            properties.height = parseFloat(attrs.height || '0');

            // Colors
            properties.fill = attrs.fill || (attrs.style && attrs.style.match(/fill:\s*([^;]+)/) ? attrs.style.match(/fill:\s*([^;]+)/)[1] : null);
            properties.stroke = attrs.stroke || (attrs.style && attrs.style.match(/stroke:\s*([^;]+)/) ? attrs.style.match(/stroke:\s*([^;]+)/)[1] : null);
            properties.strokeWidth = parseFloat(attrs['stroke-width'] || '0');

            // Border radius
            properties.borderRadius = parseFloat(attrs.rx || attrs.ry || '0');

            // Typography
            properties.fontSize = parseFloat(attrs['font-size'] || attrs.fontSize || '12');
            properties.fontFamily = attrs['font-family'] || attrs.fontFamily || 'Arial';
            properties.fontWeight = attrs['font-weight'] || attrs.fontWeight || 'normal';
            properties.textAlign = attrs['text-anchor'] || attrs.textAnchor || 'left';
        }

        // Extract text content
        if (element.textContent) {
            properties.textContent = element.textContent.trim();
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

        // Extract from atoms
        for (const [id, atom] of this.atoms) {
            const props = atom.properties;

            // Colors
            if (props.fill) colors.add(props.fill);
            if (props.stroke) colors.add(props.stroke);

            // Typography
            if (props.fontSize) typography.add(props.fontSize);
            if (props.fontFamily) typography.add(props.fontFamily);
            if (props.fontWeight) typography.add(props.fontWeight);

            // Spacing
            if (props.width) spacing.add(props.width);
            if (props.height) spacing.add(props.height);

            // Border radius
            if (props.borderRadius) borderRadius.add(props.borderRadius);
        }

        // Store tokens
        this.designTokens.set('colors', Array.from(colors));
        this.designTokens.set('typography', Array.from(typography));
        this.designTokens.set('spacing', Array.from(spacing));
        this.designTokens.set('borderRadius', Array.from(borderRadius));

        console.log(`✅ Extracted tokens: ${colors.size} colors, ${typography.size} typography, ${spacing.size} spacing, ${borderRadius.size} border radius`);
    }

    // Identify duplicate atoms for grouping
    async identifyDuplicateAtoms() {
        console.log('🔍 Identifying duplicate atoms...');

        const atomGroups = new Map();

        for (const [id, atom] of this.atoms) {
            const signature = this.createAtomSignature(atom.properties);

            if (!atomGroups.has(signature)) {
                atomGroups.set(signature, []);
            }

            atomGroups.get(signature).push(atom);
        }

        // Store groups with more than one atom
        for (const [signature, atoms] of atomGroups) {
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

        for (const [type, name] of Object.entries(FOLDER_NAMES)) {
            const folder = figma.createFrame();
            folder.name = name;
            folder.layoutMode = 'VERTICAL';
            folder.primaryAxisAlignItems = 'MIN';
            folder.counterAxisAlignItems = 'MIN';
            folder.itemSpacing = 20;
            folder.paddingLeft = 20;
            folder.paddingRight = 20;
            folder.paddingTop = 20;
            folder.paddingBottom = 20;
            folder.x = 0;
            folder.y = 0;

            rootFolder.appendChild(folder);
            this.folders.set(type, folder);
        }
    }

    // Create atom components (ONLY atoms as components)
    async createAtomFrames() {
        console.log('⚛️ Creating atom frames...');

        // Group atoms by class
        const atomsByClass = new Map();

        for (const [id, atom] of this.atoms) {
            const className = (atom.element && atom.element.className) ? atom.element.className : 'unknown';
            if (!atomsByClass.has(className)) {
                atomsByClass.set(className, []);
            }
            atomsByClass.get(className).push(atom);
        }

        let createdCount = 0;

        // Create frames for each class group
        for (const [className, atoms] of atomsByClass) {
            console.log(`📦 Creating frames for class: ${className} (${atoms.length} atoms)`);

            // Create container frame for this class
            const classFrame = figma.createFrame();
            classFrame.name = `${className}-atoms`;
            classFrame.layoutMode = 'HORIZONTAL';
            classFrame.primaryAxisAlignItems = 'MIN';
            classFrame.counterAxisAlignItems = 'MIN';
            classFrame.itemSpacing = 10;
            classFrame.paddingLeft = 10;
            classFrame.paddingRight = 10;
            classFrame.paddingTop = 10;
            classFrame.paddingBottom = 10;

            // Create individual atom frames
            for (const atom of atoms) {
                const frame = await this.createAtomFrame(atom);
                if (frame) {
                    classFrame.appendChild(frame);
                    createdCount++;
                }
            }

            // Add to appropriate folder
            const folder = this.folders.get(COMPONENT_TYPES.ATOM);
            if (folder) {
                folder.appendChild(classFrame);
            }
        }

        console.log(`✅ Created ${createdCount} atom frames`);
    }

    // Create individual atom frame
    async createAtomFrame(atom) {
        try {
            console.log(`Creating atom frame: ${atom.id}`);

            // Create frame
            const frame = figma.createFrame();
            frame.name = atom.id;

            // If atom has element, create it using the new logic
            if (atom.element) {
                await this.createAtomFrameFromElement(frame, atom.element);
            } else {
                // Fallback: apply atom properties
                this.applyAtomProperties(frame, atom.properties);
            }

            return frame;

        } catch (error) {
            console.error(`Error creating atom frame ${atom.id}:`, error);
            return null;
        }
    }

    // Create atom frame from SVG element
    async createAtomFrameFromElement(frame, element) {
        // Extract vector properties from child elements
        let vectorProps = {};
        let textContent = '';
        let textProps = {};

        if (element.children) {
            for (const child of element.children) {
                if (child.tagName === 'rect') {
                    // Extract rectangle properties
                    vectorProps = {
                        x: parseFloat(child.attributes.x || '0'),
                        y: parseFloat(child.attributes.y || '0'),
                        width: parseFloat(child.attributes.width || '100'),
                        height: parseFloat(child.attributes.height || '100'),
                        fill: child.attributes.fill || '#000000',
                        stroke: child.attributes.stroke || null,
                        strokeWidth: parseFloat(child.attributes['stroke-width'] || '0'),
                        borderRadius: parseFloat(child.attributes.rx || '0')
                    };
                } else if (child.tagName === 'text') {
                    // Extract text properties
                    textContent = child.textContent || '';
                    textProps = {
                        x: parseFloat(child.attributes.x || '0'),
                        y: parseFloat(child.attributes.y || '0'),
                        fontSize: parseFloat(child.attributes['font-size'] || '12'),
                        fontFamily: child.attributes['font-family'] || 'Arial',
                        fontWeight: child.attributes['font-weight'] || 'normal',
                        fill: child.attributes.fill || '#000000',
                        textAnchor: child.attributes['text-anchor'] || 'start'
                    };
                }
            }
        }

        // Apply vector properties to frame
        if (vectorProps.fill) {
            frame.fills = [{ type: 'SOLID', color: this.parseColor(vectorProps.fill) }];
        }
        if (vectorProps.stroke) {
            frame.strokes = [{ type: 'SOLID', color: this.parseColor(vectorProps.stroke) }];
        }
        if (vectorProps.strokeWidth) {
            frame.strokeWeight = vectorProps.strokeWidth;
        }
        if (vectorProps.borderRadius) {
            frame.cornerRadius = vectorProps.borderRadius;
        }

        // Set frame size
        frame.resize(vectorProps.width || 100, vectorProps.height || 100);

        // Add text if present
        if (textContent) {
            const text = figma.createText();
            text.characters = textContent;
            text.fontSize = textProps.fontSize || 12;
            text.fills = [{ type: 'SOLID', color: this.parseColor(textProps.fill || '#000000') }];

            // Position text relative to frame
            text.x = (textProps.x || 0) - (vectorProps.x || 0);
            text.y = (textProps.y || 0) - (vectorProps.y || 0) - textProps.fontSize;

            // Load font if specified
            if (textProps.fontFamily) {
                try {
                    await figma.loadFontAsync({ family: textProps.fontFamily, style: 'Regular' });
                    text.fontName = { family: textProps.fontFamily, style: 'Regular' };
                } catch (error) {
                    console.warn(`Could not load font ${textProps.fontFamily}:`, error.message);
                }
            }

            frame.appendChild(text);
        }
    }

    // Create individual atom component
    async createAtomComponent(atom, variants) {
        try {
            console.log(`Creating atom component: ${atom.id}`);

            // Create component
            const component = figma.createComponent();
            component.name = atom.id;

            // If atom has element, create it using the new logic
            if (atom.element) {
                await this.createAtomComponentFromElement(component, atom.element);
            } else {
                // Fallback: create frame and apply properties
                const frame = figma.createFrame();
                frame.name = `temp-${atom.id}`;
                frame.resize(atom.properties.width || 100, atom.properties.height || 100);
                this.applyAtomProperties(frame, atom.properties);
                await this.copyFrameContentToComponent(frame, component);
                frame.remove();
            }

            // Add to appropriate folder
            const folder = this.folders.get(COMPONENT_TYPES.ATOM);
            if (folder) {
                folder.appendChild(component);
            }

            // Store component reference
            atom.component = component;

            return component;

        } catch (error) {
            console.error(`Error creating atom component ${atom.id}:`, error);
            return null;
        }
    }

    // Create atom component from SVG element
    async createAtomComponentFromElement(component, element) {
        // Extract vector properties from child elements
        let vectorProps = {};
        let textContent = '';
        let textProps = {};

        if (element.children) {
            for (const child of element.children) {
                if (child.tagName === 'rect') {
                    // Extract rectangle properties
                    vectorProps = {
                        x: parseFloat(child.attributes.x || '0'),
                        y: parseFloat(child.attributes.y || '0'),
                        width: parseFloat(child.attributes.width || '100'),
                        height: parseFloat(child.attributes.height || '100'),
                        fill: child.attributes.fill || '#000000',
                        stroke: child.attributes.stroke || null,
                        strokeWidth: parseFloat(child.attributes['stroke-width'] || '0'),
                        borderRadius: parseFloat(child.attributes.rx || '0')
                    };
                } else if (child.tagName === 'text') {
                    // Extract text properties
                    textContent = child.textContent || '';
                    textProps = {
                        x: parseFloat(child.attributes.x || '0'),
                        y: parseFloat(child.attributes.y || '0'),
                        fontSize: parseFloat(child.attributes['font-size'] || '12'),
                        fontFamily: child.attributes['font-family'] || 'Arial',
                        fontWeight: child.attributes['font-weight'] || 'normal',
                        fill: child.attributes.fill || '#000000',
                        textAnchor: child.attributes['text-anchor'] || 'start'
                    };
                }
            }
        }

        // Apply vector properties to component
        if (vectorProps.fill) {
            component.fills = [{ type: 'SOLID', color: this.parseColor(vectorProps.fill) }];
        }
        if (vectorProps.stroke) {
            component.strokes = [{ type: 'SOLID', color: this.parseColor(vectorProps.stroke) }];
        }
        if (vectorProps.strokeWidth) {
            component.strokeWeight = vectorProps.strokeWidth;
        }
        if (vectorProps.borderRadius) {
            component.cornerRadius = vectorProps.borderRadius;
        }

        // Set component size
        component.resize(vectorProps.width || 100, vectorProps.height || 100);

        // Add text if present
        if (textContent) {
            const text = figma.createText();
            text.characters = textContent;
            text.fontSize = textProps.fontSize || 12;
            text.fills = [{ type: 'SOLID', color: this.parseColor(textProps.fill || '#000000') }];

            // Position text relative to component
            text.x = (textProps.x || 0) - (vectorProps.x || 0);
            text.y = (textProps.y || 0) - (vectorProps.y || 0) - textProps.fontSize;

            // Load font if specified
            if (textProps.fontFamily) {
                try {
                    await figma.loadFontAsync({ family: textProps.fontFamily, style: 'Regular' });
                    text.fontName = { family: textProps.fontFamily, style: 'Regular' };
                } catch (error) {
                    console.warn(`Could not load font ${textProps.fontFamily}:`, error.message);
                }
            }

            component.appendChild(text);
        }
    }

    // Create additional individual atom components
    createAdditionalAtomFrames() {
        console.log('⚛️ Creating additional atom frames...');

        // Create common UI atoms that might be missing
        const commonAtoms = [
            {
                id: 'button-primary',
                type: 'button',
                width: 120,
                height: 40,
                properties: {
                    shape: 'text',
                    textContent: 'Button',
                    fill: '#007AFF',
                    textColor: '#FFFFFF',
                    borderRadius: 8,
                    fontSize: 16,
                    fontWeight: 'bold'
                }
            },
            {
                id: 'button-secondary',
                type: 'button',
                width: 120,
                height: 40,
                properties: {
                    shape: 'text',
                    textContent: 'Button',
                    fill: '#F2F2F7',
                    textColor: '#007AFF',
                    borderRadius: 8,
                    fontSize: 16,
                    fontWeight: 'normal'
                }
            },
            {
                id: 'icon-small',
                type: 'icon',
                width: 16,
                height: 16,
                properties: {
                    fill: '#8E8E93',
                    shape: 'path'
                }
            },
            {
                id: 'icon-medium',
                type: 'icon',
                width: 24,
                height: 24,
                properties: {
                    fill: '#8E8E93',
                    shape: 'path'
                }
            },
            {
                id: 'text-heading',
                type: 'text',
                width: 200,
                height: 24,
                properties: {
                    shape: 'text',
                    textContent: 'Heading Text',
                    fontSize: 18,
                    fontWeight: 'bold',
                    textColor: '#000000'
                }
            },
            {
                id: 'text-body',
                type: 'text',
                width: 200,
                height: 16,
                properties: {
                    shape: 'text',
                    textContent: 'Body text content',
                    fontSize: 14,
                    fontWeight: 'normal',
                    textColor: '#666666'
                }
            },
            {
                id: 'text-caption',
                type: 'text',
                width: 150,
                height: 12,
                properties: {
                    shape: 'text',
                    textContent: 'Caption text',
                    fontSize: 12,
                    fontWeight: 'normal',
                    textColor: '#999999'
                }
            },
            {
                id: 'tag',
                type: 'tag',
                width: 80,
                height: 24,
                properties: {
                    shape: 'text',
                    textContent: 'Tag',
                    fill: '#E3F2FD',
                    textColor: '#1976D2',
                    borderRadius: 12,
                    fontSize: 12,
                    fontWeight: 'normal'
                }
            },
            {
                id: 'progress-bar',
                type: 'progress',
                width: 200,
                height: 8,
                properties: {
                    fill: '#E0E0E0',
                    progressFill: '#4CAF50',
                    borderRadius: 4
                }
            },
            {
                id: 'input-field',
                type: 'input',
                width: 200,
                height: 40,
                properties: {
                    fill: '#FFFFFF',
                    stroke: '#E0E0E0',
                    strokeWidth: 1,
                    borderRadius: 8,
                    fontSize: 14
                }
            }
        ];

        for (const atom of commonAtoms) {
            try {
                const component = figma.createComponent();
                component.name = atom.id;
                component.resize(atom.width, atom.height);

                // Apply properties
                this.applyAtomProperties(component, atom.properties);

                // Add to appropriate folder
                const folder = this.folders.get(COMPONENT_TYPES.ATOM);
                if (folder) {
                    folder.appendChild(component);
                }

                console.log(`✅ Created additional atom: ${atom.id}`);
            } catch (error) {
                console.error(`❌ Error creating additional atom ${atom.id}:`, error);
            }
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

    // Copy frame content to component
    async copyFrameContentToComponent(frame, component) {
        component.resize(frame.width, frame.height);
        const children = frame.children.slice();
        for (const child of children) {
            const clonedChild = child.clone();
            component.appendChild(clonedChild);
        }
    }

    // Apply atom properties to frame/component
    applyAtomProperties(target, properties) {
        if (properties.fill) {
            target.fills = [{ type: 'SOLID', color: this.parseColor(properties.fill) }];
        }
        if (properties.stroke) {
            target.strokes = [{ type: 'SOLID', color: this.parseColor(properties.stroke) }];
        }
        if (properties.strokeWidth) {
            target.strokeWeight = properties.strokeWidth;
        }
        if (properties.borderRadius) {
            target.cornerRadius = properties.borderRadius;
        }

        // Add text if it's a text atom or has text content
        if ((properties.shape === 'text' || properties.textContent) && properties.textContent) {
            const text = figma.createText();
            text.characters = properties.textContent;
            text.fontSize = properties.fontSize || 12;
            text.fills = [{ type: 'SOLID', color: this.parseColor(properties.textColor || properties.fill || '#000000') }];
            target.appendChild(text);
        }
    }

    // Parse color string to Figma color object
    parseColor(colorStr) {
        if (!colorStr) return { r: 0, g: 0, b: 0 };

        // Handle hex colors
        if (colorStr.startsWith('#')) {
            const hex = colorStr.replace('#', '');
            const r = parseInt(hex.substr(0, 2), 16) / 255;
            const g = parseInt(hex.substr(2, 2), 16) / 255;
            const b = parseInt(hex.substr(4, 2), 16) / 255;
            return { r, g, b };
        }

        // Handle rgb colors
        if (colorStr.startsWith('rgb')) {
            const matches = colorStr.match(/\d+/g);
            if (matches && matches.length >= 3) {
                return {
                    r: parseInt(matches[0]) / 255,
                    g: parseInt(matches[1]) / 255,
                    b: parseInt(matches[2]) / 255
                };
            }
        }

        return { r: 0, g: 0, b: 0 };
    }

    // Create molecule frames (NOT components)
    async createMoleculeFrames() {
        console.log('🧬 Creating molecule frames...');

        for (const [id, molecule] of this.molecules) {
            try {
                const frame = figma.createFrame();
                frame.name = `${id}-molecule`;
                frame.layoutMode = 'VERTICAL';
                frame.primaryAxisAlignItems = 'MIN';
                frame.counterAxisAlignItems = 'MIN';
                frame.itemSpacing = 10;
                frame.paddingLeft = 10;
                frame.paddingRight = 10;
                frame.paddingTop = 10;
                frame.paddingBottom = 10;

                // Add atoms to molecule frame
                if (molecule.children && molecule.children.length > 0) {
                    for (const childId of molecule.children) {
                        const atom = this.atoms.get(childId);
                        if (atom && atom.component) {
                            // Create instance of atom component
                            const instance = atom.component.createInstance();
                            instance.name = `${childId}-instance`;
                            frame.appendChild(instance);
                        }
                    }
                }

                // Add to appropriate folder
                const folder = this.folders.get(COMPONENT_TYPES.MOLECULE);
                if (folder) {
                    folder.appendChild(frame);
                }

                console.log(`✅ Created molecule frame: ${id}`);
            } catch (error) {
                console.error(`❌ Error creating molecule frame ${id}:`, error);
            }
        }
    }

    // Create organism frames (NOT components)
    async createOrganismFrames() {
        console.log('🦠 Creating organism frames...');

        for (const [id, organism] of this.organisms) {
            try {
                const frame = figma.createFrame();
                frame.name = `${id}-organism`;
                frame.layoutMode = 'VERTICAL';
                frame.primaryAxisAlignItems = 'MIN';
                frame.counterAxisAlignItems = 'MIN';
                frame.itemSpacing = 20;
                frame.paddingLeft = 20;
                frame.paddingRight = 20;
                frame.paddingTop = 20;
                frame.paddingBottom = 20;

                // Add molecules and atoms to organism frame
                if (organism.children && organism.children.length > 0) {
                    for (const childId of organism.children) {
                        // Check if it's a molecule
                        const molecule = this.molecules.get(childId);
                        if (molecule) {
                            // Create molecule frame
                            const moleculeFrame = figma.createFrame();
                            moleculeFrame.name = `${childId}-molecule`;
                            moleculeFrame.layoutMode = 'HORIZONTAL';
                            moleculeFrame.primaryAxisAlignItems = 'MIN';
                            moleculeFrame.counterAxisAlignItems = 'MIN';
                            moleculeFrame.itemSpacing = 10;
                            moleculeFrame.paddingLeft = 10;
                            moleculeFrame.paddingRight = 10;
                            moleculeFrame.paddingTop = 10;
                            moleculeFrame.paddingBottom = 10;

                            // Add atoms to molecule
                            if (molecule.children && molecule.children.length > 0) {
                                for (const atomId of molecule.children) {
                                    const atom = this.atoms.get(atomId);
                                    if (atom && atom.component) {
                                        const instance = atom.component.createInstance();
                                        instance.name = `${atomId}-instance`;
                                        moleculeFrame.appendChild(instance);
                                    }
                                }
                            }

                            frame.appendChild(moleculeFrame);
                        } else {
                            // Check if it's an atom
                            const atom = this.atoms.get(childId);
                            if (atom && atom.component) {
                                const instance = atom.component.createInstance();
                                instance.name = `${childId}-instance`;
                                frame.appendChild(instance);
                            }
                        }
                    }
                }

                // Add to appropriate folder
                const folder = this.folders.get(COMPONENT_TYPES.ORGANISM);
                if (folder) {
                    folder.appendChild(frame);
                }

                console.log(`✅ Created organism frame: ${id}`);
            } catch (error) {
                console.error(`❌ Error creating organism frame ${id}:`, error);
            }
        }
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

        // Try to fetch schema for validation, but don't fail if it doesn't work
        try {
            const schemaResponse = await fetch('https://schemas.tokens.studio/latest/tokens-schema.json');
            if (schemaResponse.ok) {
                const schema = await schemaResponse.json();
                console.log('✅ Tokens Studio schema loaded for validation');
            }
        } catch (error) {
            console.warn('⚠️ Could not load Tokens Studio schema, using fallback validation:', error.message);
        }

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
            const fontName = this.generateTypographyName(font, index);
            tokens.typography[fontName] = {
                value: font,
                type: 'typography'
            };
        });

        // Process spacing
        const spacing = this.designTokens.get('spacing') || [];
        spacing.forEach((space, index) => {
            const spaceName = this.generateSpacingName(space, index);
            tokens.spacing[spaceName] = {
                value: space,
                type: 'spacing'
            };
        });

        // Process border radius
        const borderRadius = this.designTokens.get('borderRadius') || [];
        borderRadius.forEach((radius, index) => {
            const radiusName = this.generateBorderRadiusName(radius, index);
            tokens.borderRadius[radiusName] = {
                value: radius,
                type: 'borderRadius'
            };
        });

        // Store tokens for export
        this.tokensStudioJSON = tokens;

        console.log('✅ Tokens Studio JSON generated');
    }

    // Generate color name
    generateColorName(color, index) {
        if (color.includes('#')) {
            return `color-${index + 1}`;
        }
        return `color-${color.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}`;
    }

    // Generate typography name
    generateTypographyName(font, index) {
        if (typeof font === 'number') {
            return `font-size-${font}`;
        }
        return `font-${font.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}`;
    }

    // Generate spacing name
    generateSpacingName(space, index) {
        return `spacing-${space}`;
    }

    // Generate border radius name
    generateBorderRadiusName(radius, index) {
        return `radius-${radius}`;
    }

    // Add advanced documentation
    async addAdvancedDocumentation() {
        console.log('📚 Adding advanced documentation...');

        // Create documentation frame
        const docFrame = figma.createFrame();
        docFrame.name = '📚 Design System Documentation';
        docFrame.layoutMode = 'VERTICAL';
        docFrame.primaryAxisAlignItems = 'MIN';
        docFrame.counterAxisAlignItems = 'MIN';
        docFrame.itemSpacing = 20;
        docFrame.paddingLeft = 20;
        docFrame.paddingRight = 20;
        docFrame.paddingTop = 20;
        docFrame.paddingBottom = 20;
        docFrame.x = 0;
        docFrame.y = 0;

        // Add to current page
        figma.currentPage.appendChild(docFrame);

        // Add documentation text
        const docText = figma.createText();
        docText.characters = `# Design System Documentation

## Atomic Design Structure

### Atoms (${this.atoms.size})
Basic building blocks of the design system.

### Molecules (${this.molecules.size})
Groups of atoms functioning together.

### Organisms (${this.organisms.size})
Complex UI components composed of molecules and atoms.

## Design Tokens

### Colors (${this.designTokens.get('colors') ? this.designTokens.get('colors').length : 0})
- Primary colors
- Secondary colors
- Neutral colors

### Typography (${this.designTokens.get('typography') ? this.designTokens.get('typography').length : 0})
- Font families
- Font sizes
- Font weights

### Spacing (${this.designTokens.get('spacing') ? this.designTokens.get('spacing').length : 0})
- Consistent spacing values
- Margin and padding scales

### Border Radius (${this.designTokens.get('borderRadius') ? this.designTokens.get('borderRadius').length : 0})
- Corner radius values
- Consistent border styling

## Usage Guidelines

1. Use atoms as building blocks
2. Compose molecules from atoms
3. Create organisms from molecules
4. Maintain consistency across components
5. Follow design token values

## Tokens Studio Integration

This design system is compatible with Tokens Studio for Figma.
Import the generated tokens to maintain consistency across your design system.

Generated on: ${new Date().toLocaleString()}`;

        docFrame.appendChild(docText);

        console.log('✅ Documentation added');
    }

    // Create rectangle element
    async createRectangle(parentFrame, attrs) {
        const rect = figma.createRectangle();

        rect.x = parseFloat(attrs.x || '0');
        rect.y = parseFloat(attrs.y || '0');
        rect.resize(
            parseFloat(attrs.width || '100'),
            parseFloat(attrs.height || '100')
        );

        if (attrs.fill) {
            rect.fills = [{ type: 'SOLID', color: this.parseColor(attrs.fill) }];
        }

        if (attrs.rx) {
            rect.cornerRadius = parseFloat(attrs.rx);
        }

        parentFrame.appendChild(rect);
        return rect;
    }

    // Create circle element
    async createCircle(parentFrame, attrs) {
        const circle = figma.createEllipse();
        const radius = parseFloat(attrs.r || '50');

        circle.x = parseFloat(attrs.cx || '0') - radius;
        circle.y = parseFloat(attrs.cy || '0') - radius;
        circle.resize(radius * 2, radius * 2);

        if (attrs.fill) {
            circle.fills = [{ type: 'SOLID', color: this.parseColor(attrs.fill) }];
        }

        parentFrame.appendChild(circle);
        return circle;
    }

    // Create ellipse element
    async createEllipse(parentFrame, attrs) {
        const ellipse = figma.createEllipse();

        ellipse.x = parseFloat(attrs.cx || '0') - parseFloat(attrs.rx || '50');
        ellipse.y = parseFloat(attrs.cy || '0') - parseFloat(attrs.ry || '50');
        ellipse.resize(
            parseFloat(attrs.rx || '50') * 2,
            parseFloat(attrs.ry || '50') * 2
        );

        if (attrs.fill) {
            ellipse.fills = [{ type: 'SOLID', color: this.parseColor(attrs.fill) }];
        }

        parentFrame.appendChild(ellipse);
        return ellipse;
    }

    // Create text element
    async createText(parentFrame, attrs, textContent) {
        const text = figma.createText();

        text.x = parseFloat(attrs.x || '0');
        text.y = parseFloat(attrs.y || '0');
        text.characters = textContent || attrs.textContent || 'Text';

        // Use fontSize from attributes or serialized properties
        const fontSize = attrs['font-size'] || attrs.fontSize;
        if (fontSize) {
            text.fontSize = parseFloat(fontSize);
        }

        // Use fill from attributes or serialized properties
        const fillColor = attrs.fill || attrs.fill;
        if (fillColor) {
            text.fills = [{ type: 'SOLID', color: this.parseColor(fillColor) }];
        }

        // Use font family from attributes or serialized properties
        const fontFamily = attrs['font-family'] || attrs.fontFamily;
        if (fontFamily) {
            try {
                await figma.loadFontAsync({ family: fontFamily, style: 'Regular' });
                text.fontName = { family: fontFamily, style: 'Regular' };
            } catch (error) {
                console.warn(`Could not load font ${fontFamily}:`, error.message);
            }
        }

        // Use font weight from attributes or serialized properties
        const fontWeight = attrs['font-weight'] || attrs.fontWeight;
        if (fontWeight === 'bold') {
            try {
                await figma.loadFontAsync({ family: fontFamily || 'Arial', style: 'Bold' });
                text.fontName = { family: fontFamily || 'Arial', style: 'Bold' };
            } catch (error) {
                console.warn(`Could not load bold font:`, error.message);
            }
        }

        parentFrame.appendChild(text);
        return text;
    }

    // Create path element
    async createPath(parentFrame, attrs) {
        const path = figma.createVector();

        path.x = parseFloat(attrs.x || '0');
        path.y = parseFloat(attrs.y || '0');

        if (attrs.d) {
            // Parse SVG path data and convert to Figma vector
            // This is a simplified implementation
            path.vectorPaths = [{
                windingRule: "NONZERO",
                data: attrs.d
            }];
        }

        if (attrs.fill) {
            path.fills = [{ type: 'SOLID', color: this.parseColor(attrs.fill) }];
        }

        if (attrs.stroke) {
            path.strokes = [{ type: 'SOLID', color: this.parseColor(attrs.stroke) }];
        }

        if (attrs['stroke-width']) {
            path.strokeWeight = parseFloat(attrs['stroke-width']);
        }

        parentFrame.appendChild(path);
        return path;
    }

    // Create line element
    async createLine(parentFrame, attrs) {
        const line = figma.createLine();

        line.x = parseFloat(attrs.x1 || '0');
        line.y = parseFloat(attrs.y1 || '0');
        line.resize(
            parseFloat(attrs.x2 || '100') - parseFloat(attrs.x1 || '0'),
            parseFloat(attrs.y2 || '100') - parseFloat(attrs.y1 || '0')
        );

        if (attrs.stroke) {
            line.strokes = [{ type: 'SOLID', color: this.parseColor(attrs.stroke) }];
        }

        if (attrs['stroke-width']) {
            line.strokeWeight = parseFloat(attrs['stroke-width']);
        }

        parentFrame.appendChild(line);
        return line;
    }

    // Convert SVG element to Figma node
    async createFigmaNodeFromElement(parentFrame, element) {
        try {
            // Check if this is an atom group - create component with vector properties
            if (element.tagName === 'g' && element.className && element.className.includes('atom')) {
                return await this.createAtomComponent(parentFrame, element);
            }

            // Check if this is a molecule or organism group
            if (element.tagName === 'g' && element.className && (element.className.includes('molecule') || element.className.includes('organism'))) {
                return await this.createGroup(parentFrame, element);
            }

            // Handle individual elements
            switch (element.tagName) {
                case 'rect':
                    return await this.createRectangle(parentFrame, element.attributes);
                case 'circle':
                    return await this.createCircle(parentFrame, element.attributes);
                case 'ellipse':
                    return await this.createEllipse(parentFrame, element.attributes);
                case 'text':
                    return await this.createText(parentFrame, element.attributes, element.textContent);
                case 'path':
                    return await this.createPath(parentFrame, element.attributes);
                case 'line':
                    return await this.createLine(parentFrame, element.attributes);
                case 'g':
                    return await this.createGroup(parentFrame, element);
                default:
                    console.warn(`Unsupported element: ${element.tagName}`);
                    return null;
            }
        } catch (error) {
            console.error(`Error creating Figma node for ${element.tagName}:`, error);
            return null;
        }
    }

    // Create atom component with vector properties and text
    async createAtomComponent(parentFrame, element) {
        const frame = figma.createFrame();
        frame.name = element.id || 'atom';
        frame.layoutMode = 'NONE';

        // Extract vector properties from child elements
        let vectorProps = {};
        let textContent = '';
        let textProps = {};

        if (element.children) {
            for (const child of element.children) {
                if (child.tagName === 'rect') {
                    // Extract rectangle properties
                    vectorProps = {
                        x: parseFloat(child.attributes.x || '0'),
                        y: parseFloat(child.attributes.y || '0'),
                        width: parseFloat(child.attributes.width || '100'),
                        height: parseFloat(child.attributes.height || '100'),
                        fill: child.attributes.fill || '#000000',
                        stroke: child.attributes.stroke || null,
                        strokeWidth: parseFloat(child.attributes['stroke-width'] || '0'),
                        borderRadius: parseFloat(child.attributes.rx || '0')
                    };
                } else if (child.tagName === 'text') {
                    // Extract text properties
                    textContent = child.textContent || '';
                    textProps = {
                        x: parseFloat(child.attributes.x || '0'),
                        y: parseFloat(child.attributes.y || '0'),
                        fontSize: parseFloat(child.attributes['font-size'] || '12'),
                        fontFamily: child.attributes['font-family'] || 'Arial',
                        fontWeight: child.attributes['font-weight'] || 'normal',
                        fill: child.attributes.fill || '#000000',
                        textAnchor: child.attributes['text-anchor'] || 'start'
                    };
                }
            }
        }

        // Apply vector properties to frame
        if (vectorProps.fill) {
            frame.fills = [{ type: 'SOLID', color: this.parseColor(vectorProps.fill) }];
        }
        if (vectorProps.stroke) {
            frame.strokes = [{ type: 'SOLID', color: this.parseColor(vectorProps.stroke) }];
        }
        if (vectorProps.strokeWidth) {
            frame.strokeWeight = vectorProps.strokeWidth;
        }
        if (vectorProps.borderRadius) {
            frame.cornerRadius = vectorProps.borderRadius;
        }

        // Set frame size
        frame.resize(vectorProps.width || 100, vectorProps.height || 100);
        frame.x = vectorProps.x || 0;
        frame.y = vectorProps.y || 0;

        // Add text if present
        if (textContent) {
            const text = figma.createText();
            text.characters = textContent;
            text.fontSize = textProps.fontSize || 12;
            text.fills = [{ type: 'SOLID', color: this.parseColor(textProps.fill || '#000000') }];

            // Position text relative to frame
            text.x = (textProps.x || 0) - (vectorProps.x || 0);
            text.y = (textProps.y || 0) - (vectorProps.y || 0) - textProps.fontSize;

            // Load font if specified
            if (textProps.fontFamily) {
                try {
                    await figma.loadFontAsync({ family: textProps.fontFamily, style: 'Regular' });
                    text.fontName = { family: textProps.fontFamily, style: 'Regular' };
                } catch (error) {
                    console.warn(`Could not load font ${textProps.fontFamily}:`, error.message);
                }
            }

            frame.appendChild(text);
        }

        parentFrame.appendChild(frame);
        return frame;
    }

    // Create group element
    async createGroup(parentFrame, element) {
        const group = figma.createFrame();

        group.name = element.id || 'group';
        group.layoutMode = 'NONE';

        if (element.children) {
            for (const child of element.children) {
                await this.createFigmaNodeFromElement(group, child);
            }
        }

        parentFrame.appendChild(group);
        return group;
    }
}

// Message handling
figma.ui.onmessage = async (msg) => {
    try {
        console.log('Plugin received message:', msg);
        if (msg.type === 'generate-advanced-components') {
            console.log('Starting component generation...');
            // Validate input data
            if (!msg.files || !Array.isArray(msg.files) || msg.files.length === 0) {
                figma.ui.postMessage({
                    type: 'advanced-generation-error',
                    error: 'No SVG files provided for processing'
                });
                return;
            }
            if (!msg.settings) {
                msg.settings = { /* default settings */ };
            }
            const generator = new AdvancedFigmaGenerator();
            const result = await generator.generateAdvancedComponents(msg.files, msg.settings);
            // ... postMessage success/error ...
        }
    } catch (error) {
        console.error('Plugin error:', error);
        console.error('Error stack:', error.stack);
        figma.ui.postMessage({
            type: 'advanced-generation-error',
            error: `Plugin error: ${error.message}`
        });
    }
};

// Show UI
figma.showUI(__html__, { width: 400, height: 600 });
figma.showUI(__html__, { width: 400, height: 600 });