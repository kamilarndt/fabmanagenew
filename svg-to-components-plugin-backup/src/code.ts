// SVG to Components Converter - Figma Plugin
// Main plugin code for processing SVG and creating components

interface SVGComponentElement {
    id: string;
    name: string;
    type: 'element' | 'group' | 'variant' | 'component';
    figmaComponent?: string;
    figmaVariant?: string;
    children?: SVGComponentElement[];
    selected?: boolean;
}

interface SVGStructure {
    elements: SVGComponentElement[];
    groups: SVGComponentElement[];
    variants: SVGComponentElement[];
    component: SVGComponentElement | null;
}

class SVGComponentConverter {
    public importedNode: FrameNode | null = null;
    private createdComponents: ComponentNode[] = [];
    private createdVariants: ComponentSetNode[] = [];
    private selectedElements: SVGComponentElement[] = [];

    async processSVG(svgData: string, selectedElements: SVGComponentElement[]): Promise<void> {
        try {
            this.selectedElements = selectedElements;

            // 1. Import SVG using Figma API
            this.importedNode = figma.createNodeFromSvg(svgData) as FrameNode;
            this.importedNode.name = 'Imported SVG Structure';

            // 2. Analyze structure
            const structure = this.analyzeSVGStructure();

            // 3. Create components based on selection
            await this.createComponentsFromStructure(structure);

            // 4. Organize components in Figma
            this.organizeComponents();

            // 5. Notify UI about completion
            figma.ui.postMessage({
                type: 'complete',
                message: 'SVG successfully converted to components!',
                componentsCreated: this.createdComponents.length,
                variantsCreated: this.createdVariants.length
            });

            figma.notify(`Successfully created ${this.createdComponents.length} components and ${this.createdVariants.length} variants!`);

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            figma.ui.postMessage({
                type: 'error',
                message: `Error: ${errorMessage}`
            });
            figma.notify(`Error: ${errorMessage}`, { error: true });
        }
    }

    public analyzeSVGStructure(): SVGStructure {
        const structure: SVGStructure = {
            elements: [],
            groups: [],
            variants: [],
            component: null
        };

        if (!this.importedNode) return structure;

        // Find main structure groups
        const elementsGroup = this.findGroupById('ELEMENTS');
        const groupsGroup = this.findGroupById('GROUPS');
        const variantsGroup = this.findGroupById('VARIANTS');
        const componentGroup = this.findGroupById('COMPONENT');

        if (elementsGroup) {
            structure.elements = this.parseElementsGroup(elementsGroup);
        }

        if (groupsGroup) {
            structure.groups = this.parseGroupsGroup(groupsGroup);
        }

        if (variantsGroup) {
            structure.variants = this.parseVariantsGroup(variantsGroup);
        }

        if (componentGroup) {
            structure.component = this.parseComponentGroup(componentGroup);
        }

        return structure;
    }

    private findGroupById(id: string): BaseNode | null {
        if (!this.importedNode) return null;
        return this.importedNode.findOne(node => node.name === id) || null;
    }

    private parseElementsGroup(group: BaseNode): SVGComponentElement[] {
        const elements: SVGComponentElement[] = [];

        if ('children' in group) {
            group.children.forEach(child => {
                if (child.name && child.type === 'GROUP') {
                    const element: SVGComponentElement = {
                        id: child.name,
                        name: child.name,
                        type: 'element',
                        figmaComponent: this.getFigmaComponentType(child)
                    };
                    elements.push(element);
                }
            });
        }

        return elements;
    }

    private parseGroupsGroup(group: BaseNode): SVGComponentElement[] {
        const groups: SVGComponentElement[] = [];

        if ('children' in group) {
            group.children.forEach(child => {
                if (child.name && child.type === 'GROUP') {
                    const groupElement: SVGComponentElement = {
                        id: child.name,
                        name: child.name,
                        type: 'group',
                        figmaComponent: this.getFigmaComponentType(child)
                    };
                    groups.push(groupElement);
                }
            });
        }

        return groups;
    }

    private parseVariantsGroup(group: BaseNode): SVGComponentElement[] {
        const variants: SVGComponentElement[] = [];

        if ('children' in group) {
            group.children.forEach(child => {
                if (child.name && child.type === 'GROUP') {
                    const variant: SVGComponentElement = {
                        id: child.name,
                        name: child.name,
                        type: 'variant',
                        figmaVariant: this.getFigmaVariantType(child)
                    };
                    variants.push(variant);
                }
            });
        }

        return variants;
    }

    private parseComponentGroup(group: BaseNode): SVGComponentElement | null {
        if ('children' in group) {
            const mainComponent = group.children.find(child =>
                child.name && child.type === 'GROUP'
            );

            if (mainComponent) {
                return {
                    id: mainComponent.name,
                    name: mainComponent.name,
                    type: 'component',
                    figmaComponent: 'main-component'
                };
            }
        }

        return null;
    }

    private getFigmaComponentType(node: BaseNode): string {
        // Try to get from data-figma-component attribute
        if ('getPluginData' in node) {
            const componentType = node.getPluginData('figma-component');
            if (componentType) return componentType;
        }

        // Fallback to class-based detection
        const className = node.getPluginData('class') || '';
        if (className.includes('element')) return 'atom';
        if (className.includes('group')) return 'molecule';
        if (className.includes('variant')) return 'variant';

        return 'component';
    }

    private getFigmaVariantType(node: BaseNode): string {
        if ('getPluginData' in node) {
            const variantType = node.getPluginData('figma-variant');
            if (variantType) return variantType;
        }

        // Extract variant type from name
        const name = node.name.toLowerCase();
        if (name.includes('compact')) return 'compact';
        if (name.includes('detailed')) return 'detailed';
        if (name.includes('default')) return 'default';

        return 'variant';
    }

    private async createComponentsFromStructure(structure: SVGStructure): Promise<void> {
        // Create atomic components from ELEMENTS
        for (const element of structure.elements) {
            if (this.isElementSelected(element)) {
                await this.createElement(element);
            }
        }

        // Create molecular components from GROUPS
        for (const group of structure.groups) {
            if (this.isElementSelected(group)) {
                await this.createMolecule(group);
            }
        }

        // Create variants from VARIANTS
        if (structure.variants.length > 0) {
            await this.createVariants(structure.variants);
        }

        // Create main component
        if (structure.component && this.isElementSelected(structure.component)) {
            await this.createMainComponent(structure.component);
        }
    }

    private isElementSelected(element: SVGComponentElement): boolean {
        return this.selectedElements.some(selected =>
            selected.id === element.id && selected.selected
        );
    }

    private async createElement(element: SVGComponentElement): Promise<void> {
        const node = this.findGroupById(element.id);
        if (!node || !('children' in node)) return;

        try {
            const component = figma.createComponentFromNode(node as SceneNode);
            component.name = `Atom/${element.name}`;

            // Set component properties
            this.setupComponentProperties(component, element);

            this.createdComponents.push(component);

            figma.ui.postMessage({
                type: 'progress',
                message: `Created atomic component: ${element.name}`,
                progress: (this.createdComponents.length / this.selectedElements.length) * 50
            });

        } catch (error) {
            console.error(`Error creating element ${element.name}:`, error);
        }
    }

    private async createMolecule(group: SVGComponentElement): Promise<void> {
        const node = this.findGroupById(group.id);
        if (!node || !('children' in node)) return;

        try {
            const component = figma.createComponentFromNode(node as SceneNode);
            component.name = `Molecule/${group.name}`;

            // Set component properties
            this.setupComponentProperties(component, group);

            this.createdComponents.push(component);

            figma.ui.postMessage({
                type: 'progress',
                message: `Created molecular component: ${group.name}`,
                progress: (this.createdComponents.length / this.selectedElements.length) * 75
            });

        } catch (error) {
            console.error(`Error creating molecule ${group.name}:`, error);
        }
    }

    private async createVariants(variants: SVGComponentElement[]): Promise<void> {
        if (variants.length < 2) return;

        try {
            const variantComponents: ComponentNode[] = [];

            for (const variant of variants) {
                const node = this.findGroupById(variant.id);
                if (node && 'children' in node) {
                    const component = figma.createComponentFromNode(node as SceneNode);
                    component.name = `Variant/${variant.name}`;
                    variantComponents.push(component);
                }
            }

            if (variantComponents.length > 1) {
                // Create component set from variants
                const componentSet = figma.combineAsVariants(variantComponents, figma.currentPage);
                componentSet.name = 'ProjectCard Variants';
                this.createdVariants.push(componentSet);

                figma.ui.postMessage({
                    type: 'progress',
                    message: `Created variant set: ${componentSet.name}`,
                    progress: 90
                });
            }

        } catch (error) {
            console.error('Error creating variants:', error);
        }
    }

    private async createMainComponent(component: SVGComponentElement): Promise<void> {
        const node = this.findGroupById(component.id);
        if (!node || !('children' in node)) return;

        try {
            const mainComponent = figma.createComponentFromNode(node as SceneNode);
            mainComponent.name = `Organism/${component.name}`;

            // Set component properties
            this.setupComponentProperties(mainComponent, component);

            this.createdComponents.push(mainComponent);

            figma.ui.postMessage({
                type: 'progress',
                message: `Created main component: ${component.name}`,
                progress: 100
            });

        } catch (error) {
            console.error(`Error creating main component ${component.name}:`, error);
        }
    }

    private setupComponentProperties(_component: ComponentNode, element: SVGComponentElement): void {
        // Set up component properties based on element type
        // Note: Component properties will be added in a future version
        // For now, we'll skip this to avoid TypeScript errors
        console.log(`Setting up properties for ${element.name} (${element.figmaComponent})`);
    }

    private organizeComponents(): void {
        // Create a dedicated page for components
        const componentsPage = figma.createPage();
        componentsPage.name = 'SVG Components';

        // Move created components to the new page
        this.createdComponents.forEach(component => {
            componentsPage.appendChild(component);
        });

        this.createdVariants.forEach(variantSet => {
            componentsPage.appendChild(variantSet);
        });

        // Organize components in a grid layout
        this.layoutComponentsInGrid();
    }

    private layoutComponentsInGrid(): void {
        const componentsPerRow = 4;
        const spacing = 200;
        const startX = 100;
        const startY = 100;

        this.createdComponents.forEach((component, index) => {
            const row = Math.floor(index / componentsPerRow);
            const col = index % componentsPerRow;

            component.x = startX + col * spacing;
            component.y = startY + row * spacing;
        });

        // Layout variants below components
        const variantsStartY = startY + Math.ceil(this.createdComponents.length / componentsPerRow) * spacing + 100;

        this.createdVariants.forEach((variantSet, index) => {
            variantSet.x = startX + index * spacing;
            variantSet.y = variantsStartY;
        });
    }
}

// Initialize converter
const converter = new SVGComponentConverter();

// Handle messages from UI
figma.ui.onmessage = async (msg) => {
    console.log('Plugin: Received message:', msg);

    if (msg.type === 'process-svg') {
        console.log('Plugin: Processing SVG...');
        await converter.processSVG(msg.svgData, msg.selectedElements);
    } else if (msg.type === 'analyze-svg') {
        console.log('Plugin: Analyzing SVG structure...');
        // Analyze SVG structure without creating components
        try {
            console.log('Plugin: Creating node from SVG...');
            const tempNode = figma.createNodeFromSvg(msg.svgData) as FrameNode;
            converter.importedNode = tempNode;

            console.log('Plugin: Analyzing structure...');
            const structure = converter.analyzeSVGStructure();
            console.log('Plugin: Structure analyzed:', structure);

            console.log('Plugin: Sending analysis-complete message...');
            figma.ui.postMessage({
                type: 'analysis-complete',
                structure: structure
            });

            // Clean up temporary node
            tempNode.remove();
            console.log('Plugin: Analysis complete');
        } catch (error) {
            console.error('Plugin: Analysis error:', error);
            figma.ui.postMessage({
                type: 'analysis-error',
                message: error instanceof Error ? error.message : 'Analysis failed'
            });
        }
    } else {
        console.log('Plugin: Unknown message type:', msg.type);
    }
};

// Show UI
figma.showUI(__html__, {
    width: 500,
    height: 600,
    title: 'SVG to Components Converter'
});

// Handle plugin close
figma.on('close', () => {
    figma.ui.postMessage({ type: 'plugin-closed' });
});
