// Enhanced SVG to Components Converter - Figma Plugin
// Advanced React/TSX parsing and Figma component generation

import * as ESTree from 'estree';

interface ReactComponent {
  name: string;
  props: Record<string, any>;
  children: ReactComponent[];
  type: 'component' | 'element' | 'text';
  antdComponent?: string;
  figmaMapping?: FigmaMapping;
}

interface FigmaMapping {
  componentType: 'frame' | 'text' | 'rectangle' | 'ellipse' | 'vector';
  properties: Record<string, any>;
  variants?: Record<string, any>;
  constraints?: {
    horizontal: 'MIN' | 'CENTER' | 'MAX' | 'STRETCH' | 'SCALE';
    vertical: 'MIN' | 'CENTER' | 'MAX' | 'STRETCH' | 'SCALE';
  };
}

interface DesignTokens {
  colors: Record<string, string>;
  typography: Record<string, any>;
  spacing: Record<string, number>;
  borderRadius: Record<string, number>;
}

interface ParsedStructure {
  components: ReactComponent[];
  designTokens: DesignTokens;
  imports: string[];
  exports: string[];
}

class EnhancedSVGConverter {
  private importedNode: FrameNode | null = null;
  private createdComponents: ComponentNode[] = [];
  private createdVariants: ComponentSetNode[] = [];
  private designTokens: DesignTokens = {
    colors: {},
    typography: {},
    spacing: {},
    borderRadius: {}
  };

  // Main processing method
  async processReactCode(reactCode: string, selectedComponents: string[]): Promise<void> {
    try {
      console.log('🚀 Starting enhanced React processing...');
      
      // 1. Parse React/TSX code
      const parsed = this.parseReactCode(reactCode);
      console.log('✅ React code parsed:', parsed);

      // 2. Extract design tokens
      this.extractDesignTokens(parsed);
      console.log('🎨 Design tokens extracted:', this.designTokens);

      // 3. Create Figma components
      await this.createFigmaComponents(parsed.components, selectedComponents);
      console.log('🎯 Figma components created');

      // 4. Organize components
      this.organizeComponents();
      console.log('📁 Components organized');

      figma.notify('✅ Enhanced conversion completed successfully!', { timeout: 3000 });
    } catch (error) {
      console.error('❌ Enhanced processing error:', error);
      figma.notify(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`, { error: true });
    }
  }

  // Parse React/TSX code using ESTree
  private parseReactCode(code: string): ParsedStructure {
    try {
      // Simple AST parsing for React components
      const components = this.extractReactComponents(code);
      const imports = this.extractImports(code);
      const exports = this.extractExports(code);
      
      return {
        components,
        designTokens: this.designTokens,
        imports,
        exports
      };
    } catch (error) {
      throw new Error(`Failed to parse React code: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Extract React components from code
  private extractReactComponents(code: string): ReactComponent[] {
    const components: ReactComponent[] = [];
    
    // Find component definitions
    const componentRegex = /const\s+(\w+)\s*=\s*\([^)]*\)\s*=>\s*{([^}]+)}/g;
    let match;
    
    while ((match = componentRegex.exec(code)) !== null) {
      const componentName = match[1];
      const componentBody = match[2];
      
      const component: ReactComponent = {
        name: componentName,
        props: this.extractProps(componentBody),
        children: this.extractChildren(componentBody),
        type: 'component',
        antdComponent: this.detectAntdComponent(componentBody),
        figmaMapping: this.createFigmaMapping(componentName, componentBody)
      };
      
      components.push(component);
    }
    
    return components;
  }

  // Extract component props
  private extractProps(componentBody: string): Record<string, any> {
    const props: Record<string, any> = {};
    
    // Find prop usage patterns
    const propRegex = /(\w+)\s*:\s*([^,}]+)/g;
    let match;
    
    while ((match = propRegex.exec(componentBody)) !== null) {
      const propName = match[1];
      const propValue = match[2].trim();
      
      // Parse different prop types
      if (propValue.startsWith('"') || propValue.startsWith("'")) {
        props[propName] = propValue.slice(1, -1); // String
      } else if (propValue === 'true' || propValue === 'false') {
        props[propName] = propValue === 'true'; // Boolean
      } else if (!isNaN(Number(propValue))) {
        props[propName] = Number(propValue); // Number
      } else {
        props[propName] = propValue; // Other
      }
    }
    
    return props;
  }

  // Extract child components
  private extractChildren(componentBody: string): ReactComponent[] {
    const children: ReactComponent[] = [];
    
    // Find JSX elements
    const jsxRegex = /<(\w+)([^>]*)>/g;
    let match;
    
    while ((match = jsxRegex.exec(componentBody)) !== null) {
      const tagName = match[1];
      const attributes = match[2];
      
      const child: ReactComponent = {
        name: tagName,
        props: this.parseJSXAttributes(attributes),
        children: [],
        type: 'element',
        antdComponent: this.detectAntdComponent(tagName),
        figmaMapping: this.createFigmaMapping(tagName, attributes)
      };
      
      children.push(child);
    }
    
    return children;
  }

  // Parse JSX attributes
  private parseJSXAttributes(attributes: string): Record<string, any> {
    const props: Record<string, any> = {};
    
    const attrRegex = /(\w+)=["']([^"']+)["']/g;
    let match;
    
    while ((match = attrRegex.exec(attributes)) !== null) {
      const propName = match[1];
      const propValue = match[2];
      props[propName] = propValue;
    }
    
    return props;
  }

  // Detect Ant Design components
  private detectAntdComponent(componentBody: string): string | undefined {
    const antdComponents = [
      'Card', 'Button', 'Input', 'Select', 'DatePicker', 'Table', 'Form',
      'Modal', 'Drawer', 'Tabs', 'Menu', 'Breadcrumb', 'Pagination',
      'Progress', 'Tag', 'Avatar', 'Badge', 'Tooltip', 'Popover',
      'Dropdown', 'Space', 'Divider', 'Typography', 'Layout', 'Grid'
    ];
    
    for (const component of antdComponents) {
      if (componentBody.includes(component)) {
        return component;
      }
    }
    
    return undefined;
  }

  // Create Figma mapping for component
  private createFigmaMapping(componentName: string, componentBody: string): FigmaMapping {
    const mapping: FigmaMapping = {
      componentType: 'frame',
      properties: {},
      variants: {},
      constraints: {
        horizontal: 'STRETCH',
        vertical: 'STRETCH'
      }
    };

    // Map Ant Design components to Figma types
    if (componentName === 'Card') {
      mapping.componentType = 'frame';
      mapping.properties = {
        fills: [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }],
        cornerRadius: 8,
        strokeWeight: 1,
        strokeAlign: 'INSIDE'
      };
    } else if (componentName === 'Button') {
      mapping.componentType = 'frame';
      mapping.properties = {
        fills: [{ type: 'SOLID', color: { r: 0.1, g: 0.56, b: 1 } }],
        cornerRadius: 6,
        paddingLeft: 16,
        paddingRight: 16,
        paddingTop: 8,
        paddingBottom: 8
      };
    } else if (componentName === 'Text') {
      mapping.componentType = 'text';
      mapping.properties = {
        fontSize: 14,
        fontFamily: 'Inter',
        fontWeight: 400,
        fills: [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }]
      };
    }

    return mapping;
  }

  // Extract design tokens from code
  private extractDesignTokens(parsed: ParsedStructure): void {
    // Extract colors from CSS or theme objects
    const colorRegex = /#[0-9a-fA-F]{6}|#[0-9a-fA-F]{3}|rgb\([^)]+\)|rgba\([^)]+\)/g;
    const matches = parsed.components.join(' ').match(colorRegex);
    
    if (matches) {
      matches.forEach((color, index) => {
        this.designTokens.colors[`color-${index}`] = color;
      });
    }

    // Extract typography
    this.designTokens.typography = {
      'heading-1': { fontSize: 32, fontWeight: 700 },
      'heading-2': { fontSize: 24, fontWeight: 600 },
      'heading-3': { fontSize: 20, fontWeight: 600 },
      'body': { fontSize: 14, fontWeight: 400 },
      'caption': { fontSize: 12, fontWeight: 400 }
    };

    // Extract spacing
    this.designTokens.spacing = {
      'xs': 4,
      'sm': 8,
      'md': 16,
      'lg': 24,
      'xl': 32
    };

    // Extract border radius
    this.designTokens.borderRadius = {
      'none': 0,
      'sm': 4,
      'md': 8,
      'lg': 12,
      'xl': 16
    };
  }

  // Create Figma components
  private async createFigmaComponents(components: ReactComponent[], selectedComponents: string[]): Promise<void> {
    for (const component of components) {
      if (selectedComponents.includes(component.name)) {
        await this.createFigmaComponent(component);
      }
    }
  }

  // Create individual Figma component
  private async createFigmaComponent(component: ReactComponent): Promise<void> {
    try {
      // Create main component
      const figmaComponent = figma.createComponent();
      figmaComponent.name = component.name;
      
      // Apply Figma mapping
      if (component.figmaMapping) {
        this.applyFigmaMapping(figmaComponent, component.figmaMapping);
      }
      
      // Create children
      for (const child of component.children) {
        await this.createChildComponent(figmaComponent, child);
      }
      
      // Set up component properties
      this.setupComponentProperties(figmaComponent, component);
      
      this.createdComponents.push(figmaComponent);
      
      console.log(`✅ Created component: ${component.name}`);
    } catch (error) {
      console.error(`❌ Error creating component ${component.name}:`, error);
    }
  }

  // Apply Figma mapping to component
  private applyFigmaMapping(component: ComponentNode, mapping: FigmaMapping): void {
    if (mapping.properties.fills) {
      component.fills = mapping.properties.fills;
    }
    if (mapping.properties.cornerRadius) {
      component.cornerRadius = mapping.properties.cornerRadius;
    }
    if (mapping.properties.strokeWeight) {
      component.strokeWeight = mapping.properties.strokeWeight;
    }
    if (mapping.properties.strokeAlign) {
      component.strokeAlign = mapping.properties.strokeAlign;
    }
  }

  // Create child component
  private async createChildComponent(parent: ComponentNode, child: ReactComponent): Promise<void> {
    let childNode: SceneNode;
    
    if (child.figmaMapping?.componentType === 'text') {
      childNode = figma.createText();
      (childNode as TextNode).characters = child.props.children || '';
    } else {
      childNode = figma.createFrame();
    }
    
    childNode.name = child.name;
    
    // Apply mapping
    if (child.figmaMapping) {
      this.applyFigmaMapping(childNode as ComponentNode, child.figmaMapping);
    }
    
    // Add to parent
    parent.appendChild(childNode);
  }

  // Set up component properties
  private setupComponentProperties(component: ComponentNode, reactComponent: ReactComponent): void {
    // Add properties based on React props
    for (const [propName, propValue] of Object.entries(reactComponent.props)) {
      if (typeof propValue === 'string') {
        component.addComponentProperty(propName, 'TEXT', propValue);
      } else if (typeof propValue === 'number') {
        component.addComponentProperty(propName, 'NUMBER', propValue);
      } else if (typeof propValue === 'boolean') {
        component.addComponentProperty(propName, 'BOOLEAN', propValue);
      }
    }
  }

  // Extract imports from code
  private extractImports(code: string): string[] {
    const imports: string[] = [];
    const importRegex = /import\s+.*?\s+from\s+['"]([^'"]+)['"]/g;
    let match;
    
    while ((match = importRegex.exec(code)) !== null) {
      imports.push(match[1]);
    }
    
    return imports;
  }

  // Extract exports from code
  private extractExports(code: string): string[] {
    const exports: string[] = [];
    const exportRegex = /export\s+(?:default\s+)?(?:const|function|class)\s+(\w+)/g;
    let match;
    
    while ((match = exportRegex.exec(code)) !== null) {
      exports.push(match[1]);
    }
    
    return exports;
  }

  // Organize components in Figma
  private organizeComponents(): void {
    const componentsPage = figma.createPage();
    componentsPage.name = 'Enhanced React Components';
    
    // Move components to new page
    this.createdComponents.forEach(component => {
      componentsPage.appendChild(component);
    });
    
    // Layout components in grid
    this.layoutComponentsInGrid();
  }

  // Layout components in grid
  private layoutComponentsInGrid(): void {
    const componentsPerRow = 3;
    const spacing = 200;
    const startX = 100;
    const startY = 100;
    
    this.createdComponents.forEach((component, index) => {
      const row = Math.floor(index / componentsPerRow);
      const col = index % componentsPerRow;
      
      component.x = startX + col * spacing;
      component.y = startY + row * spacing;
    });
  }
}

// Initialize converter
const converter = new EnhancedSVGConverter();

// Handle messages from UI
figma.ui.onmessage = async (msg) => {
  console.log('📨 Received message:', msg);
  
  if (msg.type === 'process-react') {
    console.log('🚀 Processing React code...');
    await converter.processReactCode(msg.reactCode, msg.selectedComponents);
  } else if (msg.type === 'analyze-react') {
    console.log('🔍 Analyzing React code...');
    try {
      const parsed = converter['parseReactCode'](msg.reactCode);
      figma.ui.postMessage({
        type: 'analysis-complete',
        structure: parsed
      });
    } catch (error) {
      figma.ui.postMessage({
        type: 'analysis-error',
        message: error instanceof Error ? error.message : 'Analysis failed'
      });
    }
  }
};

// Show UI
figma.showUI(__html__, { 
  width: 600, 
  height: 700,
  title: 'Enhanced React to Figma Converter'
});

// Handle plugin close
figma.on('close', () => {
  console.log('👋 Plugin closed');
});
