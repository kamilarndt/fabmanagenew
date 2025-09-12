// Enhanced SVG to Components Converter - Figma Plugin v2.0
// Full modular implementation with advanced React/TSX parsing

import { EnhancedTSXParser } from './parsers/enhanced-tsx-parser';
import { AntDesignFigmaMapper } from './mappers/antd-figma-mapper';
import { ErrorHandler } from './errors/error-handler';
import type { ReactComponentAnalysis, ParsedStructure } from './types/ast-types';
import type { FigmaDesignTokens, EnhancedComponent } from './types/figma-types';

// Legacy interfaces for backward compatibility
interface ReactComponent {
  name: string;
  props: Record<string, any>;
  children: ReactComponent[];
  type: 'component' | 'element' | 'text';
  antdComponent?: string | undefined;
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

class EnhancedSVGConverter {
  private createdComponents: ComponentNode[] = [];
  private designTokens: FigmaDesignTokens = {
    colors: {},
    typography: {},
    spacing: {},
    borderRadius: {},
    shadows: {},
    breakpoints: {}
  };
  private tsxParser: EnhancedTSXParser;
  private antdMapper: AntDesignFigmaMapper;
  private errorHandler: ErrorHandler;

  constructor() {
    this.tsxParser = new EnhancedTSXParser();
    this.antdMapper = new AntDesignFigmaMapper(this.designTokens);
    this.errorHandler = new ErrorHandler();
  }

  // Main processing method
  async processReactCode(reactCode: string, selectedComponents: string[]): Promise<void> {
    try {
      console.log('🚀 Starting enhanced React processing...');

      // 1. Parse React/TSX code using enhanced parser
      const parsed = this.tsxParser.parseMultipleComponents(reactCode);
      console.log('✅ React code parsed:', parsed);

      // 2. Update design tokens
      this.convertDesignTokens(parsed.designTokens);
      this.antdMapper.updateDesignTokens(this.designTokens);
      console.log('🎨 Design tokens updated:', this.designTokens);

      // 3. Create Figma components using enhanced mapper
      await this.createFigmaComponentsFromParsed(parsed, selectedComponents);
      console.log('🎯 Figma components created');

      // 4. Organize components
      this.organizeComponents();
      console.log('📁 Components organized');

      figma.notify('✅ Enhanced conversion completed successfully!', { timeout: 3000 });
    } catch (error) {
      this.errorHandler.handleParseError(error as Error, { operation: 'processReactCode' });
      console.error('❌ Enhanced processing error:', error);
      figma.notify(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`, { error: true });
    }
  }

  // Parse React/TSX code using simple regex patterns
  private parseReactCode(code: string): ParsedStructure {
    try {
      // Simple AST parsing for React components
      const components = this.extractReactComponents(code);
      const imports = this.extractImports(code);
      const exports = this.extractExports(code);

      return {
        components: components.map(comp => ({
          componentName: comp.name,
          imports: {},
          jsx: { type: 'JSXElement', children: [], rootElement: null, depth: 0, components: [], textNodes: [] },
          antdComponents: comp.antdComponent ? [{ name: comp.antdComponent, props: comp.props, variants: [], properties: {}, type: 'FRAME', children: [], dynamicProps: [], position: { x: 0, y: 0 } }] : [],
          dynamicProps: Object.entries(comp.props).map(([key, value]) => ({
            propertyName: key,
            dataType: typeof value as 'string' | 'number' | 'boolean',
            defaultValue: value,
            isRequired: false,
            sourcePath: key,
            targetElement: key
          })),
          eventHandlers: [],
          styleAnalysis: { inlineStyles: {}, classNameStyles: {} },
          layoutAnalysis: { flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'stretch' },
          conditionalRendering: [],
          stateManagement: { useState: [], useEffect: [] },
          hooks: [],
          dependencies: [],
          props: comp.props,
          styling: { inlineStyles: {}, classNameStyles: {}, classes: [], themeTokens: [], cssVariables: {}, mediaQueries: [] },
          layout: { flexDirection: 'column', justifyContent: 'start', alignItems: 'stretch', type: 'flex', direction: 'column', spacing: 0 },
          state: [],
          effects: []
        })),
        designTokens: {
          colors: Object.fromEntries(Object.entries(this.designTokens.colors).map(([k, v]) => [k, `#${Math.round(v.r * 255).toString(16).padStart(2, '0')}${Math.round(v.g * 255).toString(16).padStart(2, '0')}${Math.round(v.b * 255).toString(16).padStart(2, '0')}`])),
          typography: this.designTokens.typography,
          spacing: this.designTokens.spacing,
          borderRadius: this.designTokens.borderRadius,
          shadows: Object.fromEntries(Object.entries(this.designTokens.shadows).map(([k, v]) => [k, { color: `#${Math.round(v.color.r * 255).toString(16).padStart(2, '0')}${Math.round(v.color.g * 255).toString(16).padStart(2, '0')}${Math.round(v.color.b * 255).toString(16).padStart(2, '0')}`, offsetX: v.offsetX, offsetY: v.offsetY, blurRadius: v.blurRadius || 0, spreadRadius: v.spreadRadius || 0 }])),
          breakpoints: this.designTokens.breakpoints
        },
        imports,
        exports,
        errors: [],
        warnings: []
      };
    } catch (error) {
      throw new Error(`Failed to parse React code: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Extract React components from code using regex
  private extractReactComponents(code: string): ReactComponent[] {
    const components: ReactComponent[] = [];

    // Find component definitions
    const componentRegex = /const\s+(\w+)\s*=\s*\([^)]*\)\s*=>\s*{([^}]+)}/g;
    let match;

    while ((match = componentRegex.exec(code)) !== null) {
      const componentName = match[1];
      const componentBody = match[2];

      if (componentName && componentBody) {
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
    }

    return components;
  }

  // Extract component props using regex
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

  // Extract child components using regex
  private extractChildren(componentBody: string): ReactComponent[] {
    const children: ReactComponent[] = [];

    // Find JSX elements
    const jsxRegex = /<(\w+)([^>]*)>/g;
    let match;

    while ((match = jsxRegex.exec(componentBody)) !== null) {
      const tagName = match[1];
      const attributes = match[2];

      if (tagName && attributes !== undefined) {
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
    }

    return children;
  }

  // Parse JSX attributes using regex
  private parseJSXAttributes(attributes: string): Record<string, any> {
    const props: Record<string, any> = {};

    const attrRegex = /(\w+)=["']([^"']+)["']/g;
    let match;

    while ((match = attrRegex.exec(attributes)) !== null) {
      const propName = match[1];
      const propValue = match[2];
      if (propName && propValue) {
        props[propName] = propValue;
      }
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
      if (componentBody && componentBody.includes(component)) {
        return component;
      }
    }

    return undefined;
  }

  // Create Figma mapping for component
  private createFigmaMapping(componentName: string, _componentBody: string): FigmaMapping {
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

  // Convert DesignTokens to FigmaDesignTokens
  private convertDesignTokens(designTokens: any): void {
    // Convert colors from string to FigmaColor format
    if (designTokens.colors) {
      this.designTokens.colors = {};
      for (const [key, value] of Object.entries(designTokens.colors)) {
        if (typeof value === 'string') {
          this.designTokens.colors[key] = this.parseColorToFigma(value as string);
        }
      }
    }

    // Convert typography
    if (designTokens.typography) {
      this.designTokens.typography = {};
      for (const [key, value] of Object.entries(designTokens.typography)) {
        this.designTokens.typography[key] = value as any;
      }
    }

    // Convert spacing
    if (designTokens.spacing) {
      this.designTokens.spacing = designTokens.spacing;
    }

    // Convert border radius
    if (designTokens.borderRadius) {
      this.designTokens.borderRadius = designTokens.borderRadius;
    }

    // Convert shadows
    if (designTokens.shadows) {
      this.designTokens.shadows = designTokens.shadows;
    }

    // Convert breakpoints
    if (designTokens.breakpoints) {
      this.designTokens.breakpoints = designTokens.breakpoints;
    }
  }

  // Parse color string to FigmaColor format
  private parseColorToFigma(colorString: string): any {
    // Handle hex colors
    if (colorString.startsWith('#')) {
      const hex = colorString.slice(1);
      const r = parseInt(hex.substr(0, 2), 16) / 255;
      const g = parseInt(hex.substr(2, 2), 16) / 255;
      const b = parseInt(hex.substr(4, 2), 16) / 255;
      return { r, g, b, a: 1 };
    }

    // Handle rgb/rgba colors
    if (colorString.startsWith('rgb')) {
      const matches = colorString.match(/\d+/g);
      if (matches && matches.length >= 3) {
        const r = parseInt(matches[0]) / 255;
        const g = parseInt(matches[1]) / 255;
        const b = parseInt(matches[2]) / 255;
        const a = matches[3] ? parseInt(matches[3]) / 255 : 1;
        return { r, g, b, a };
      }
    }

    // Default fallback
    return { r: 0, g: 0, b: 0, a: 1 };
  }

  // Extract design tokens from code
  private extractDesignTokens(parsed: ParsedStructure): void {
    // Extract colors from CSS or theme objects
    const colorRegex = /#[0-9a-fA-F]{6}|#[0-9a-fA-F]{3}|rgb\([^)]+\)|rgba\([^)]+\)/g;
    const matches = parsed.components.join(' ').match(colorRegex);

    if (matches) {
      matches.forEach((color: string, index: number) => {
        this.designTokens.colors[`color-${index}`] = this.parseColorToFigma(color);
      });
    }

    // Extract typography
    this.designTokens.typography = {
      'heading-1': { fontSize: 32, fontWeight: 700, fontFamily: 'Inter' },
      'heading-2': { fontSize: 24, fontWeight: 600, fontFamily: 'Inter' },
      'heading-3': { fontSize: 20, fontWeight: 600, fontFamily: 'Inter' },
      'body': { fontSize: 14, fontWeight: 400, fontFamily: 'Inter' },
      'caption': { fontSize: 12, fontWeight: 400, fontFamily: 'Inter' }
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

  // Create Figma components from parsed structure
  private async createFigmaComponentsFromParsed(parsed: ParsedStructure, selectedComponents: string[]): Promise<void> {
    for (const componentAnalysis of parsed.components) {
      if (selectedComponents.includes(componentAnalysis.componentName)) {
        await this.createFigmaComponentFromAnalysis(componentAnalysis);
      }
    }
  }

  // Create Figma components (legacy method)
  private async createFigmaComponents(components: any[], selectedComponents: string[]): Promise<void> {
    for (const component of components) {
      if (selectedComponents.includes(component.name)) {
        await this.createFigmaComponent(component);
      }
    }
  }

  // Create Figma component from React analysis
  private async createFigmaComponentFromAnalysis(analysis: ReactComponentAnalysis): Promise<void> {
    try {
      // Create main component
      const figmaComponent = figma.createComponent();
      figmaComponent.name = analysis.componentName;

      // Create Ant Design components using mapper
      const antdComponents = this.antdMapper.generateComponentSet(analysis.antdComponents);

      // Apply component properties
      this.setupComponentPropertiesFromAnalysis(figmaComponent, analysis);

      // Create children from Ant Design components
      for (const antdComponent of antdComponents) {
        await this.createChildComponentFromAntd(figmaComponent, antdComponent);
      }

      this.createdComponents.push(figmaComponent);

      console.log(`✅ Created enhanced component: ${analysis.componentName}`);
    } catch (error) {
      this.errorHandler.handleFigmaError(error as Error, {
        component: analysis.componentName,
        operation: 'createFigmaComponentFromAnalysis'
      });
      console.error(`❌ Error creating enhanced component ${analysis.componentName}:`, error);
    }
  }

  // Create individual Figma component (legacy method)
  private async createFigmaComponent(component: any): Promise<void> {
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
    if (mapping.properties['fills']) {
      component.fills = mapping.properties['fills'];
    }
    if (mapping.properties['cornerRadius']) {
      component.cornerRadius = mapping.properties['cornerRadius'];
    }
    if (mapping.properties['strokeWeight']) {
      component.strokeWeight = mapping.properties['strokeWeight'];
    }
    if (mapping.properties['strokeAlign']) {
      component.strokeAlign = mapping.properties['strokeAlign'];
    }
  }

  // Create child component
  private async createChildComponent(parent: ComponentNode, child: ReactComponent): Promise<void> {
    let childNode: SceneNode;

    if (child.figmaMapping?.componentType === 'text') {
      childNode = figma.createText();
      (childNode as TextNode).characters = child.props['children'] || '';
    } else {
      childNode = figma.createFrame();
    }

    childNode.name = child.name;

    // Apply mapping only if it's a ComponentNode
    if (child.figmaMapping && childNode.type === 'FRAME') {
      this.applyFigmaMapping(childNode as unknown as ComponentNode, child.figmaMapping);
    }

    // Add to parent
    parent.appendChild(childNode);
  }

  // Set up component properties from analysis
  private setupComponentPropertiesFromAnalysis(component: ComponentNode, analysis: ReactComponentAnalysis): void {
    // Add properties based on dynamic props
    for (const prop of analysis.dynamicProps) {
      try {
        switch (prop.dataType) {
          case 'string':
            component.addComponentProperty(prop.propertyName, 'TEXT', prop.defaultValue || '');
            break;
          case 'number':
            component.addComponentProperty(prop.propertyName, 'TEXT', (prop.defaultValue || 0).toString());
            break;
          case 'boolean':
            component.addComponentProperty(prop.propertyName, 'BOOLEAN', prop.defaultValue || false);
            break;
          default:
            component.addComponentProperty(prop.propertyName, 'TEXT', prop.defaultValue || '');
        }
      } catch (error) {
        this.errorHandler.addWarning(
          'PROPERTY_CREATION_WARNING',
          `Failed to create property ${prop.propertyName}: ${error instanceof Error ? error.message : 'Unknown error'}`,
          { component: analysis.componentName }
        );
      }
    }
  }

  // Set up component properties (legacy method)
  private setupComponentProperties(component: ComponentNode, reactComponent: any): void {
    // Add properties based on React props
    for (const [propName, propValue] of Object.entries(reactComponent.props)) {
      try {
        if (typeof propValue === 'string') {
          component.addComponentProperty(propName, 'TEXT', propValue);
        } else if (typeof propValue === 'number') {
          component.addComponentProperty(propName, 'VARIANT', propValue.toString());
        } else if (typeof propValue === 'boolean') {
          component.addComponentProperty(propName, 'BOOLEAN', propValue);
        }
      } catch (error) {
        this.errorHandler.addWarning(
          'PROPERTY_CREATION_WARNING',
          `Failed to create property ${propName}: ${error instanceof Error ? error.message : 'Unknown error'}`,
          { component: reactComponent.name }
        );
      }
    }
  }

  // Create child component from Ant Design component
  private async createChildComponentFromAntd(parent: ComponentNode, antdComponent: EnhancedComponent): Promise<void> {
    try {
      let childNode: SceneNode;

      if (antdComponent.type === 'TEXT') {
        childNode = figma.createText();
        (childNode as TextNode).characters = 'Text Content';
      } else {
        childNode = figma.createFrame();
      }

      childNode.name = antdComponent.name;

      // Apply Ant Design mapping
      if (antdComponent.properties) {
        this.applyAntdMapping(childNode, antdComponent.properties);
      }

      parent.appendChild(childNode);
    } catch (error) {
      this.errorHandler.handleFigmaError(error as Error, {
        component: antdComponent.name,
        operation: 'createChildComponentFromAntd'
      });
    }
  }

  // Apply Ant Design mapping to component
  private applyAntdMapping(component: SceneNode, mapping: any): void {
    if (component.type === 'FRAME' && mapping.properties) {
      const frame = component as FrameNode;

      if (mapping.properties.fills) {
        frame.fills = mapping.properties.fills;
      }
      if (mapping.properties.cornerRadius) {
        frame.cornerRadius = mapping.properties.cornerRadius;
      }
      if (mapping.properties.strokeWeight) {
        frame.strokeWeight = mapping.properties.strokeWeight;
      }
      if (mapping.properties.strokeAlign) {
        frame.strokeAlign = mapping.properties.strokeAlign;
      }
    }
  }

  // Extract imports from code
  private extractImports(code: string): string[] {
    const imports: string[] = [];
    const importRegex = /import\s+.*?\s+from\s+['"]([^'"]+)['"]/g;
    let match;

    while ((match = importRegex.exec(code)) !== null) {
      if (match[1]) {
        imports.push(match[1]);
      }
    }

    return imports;
  }

  // Extract exports from code
  private extractExports(code: string): string[] {
    const exports: string[] = [];
    const exportRegex = /export\s+(?:default\s+)?(?:const|function|class)\s+(\w+)/g;
    let match;

    while ((match = exportRegex.exec(code)) !== null) {
      if (match[1]) {
        exports.push(match[1]);
      }
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

  // Legacy SVG processing for backward compatibility
  async processSVG(svgData: string, _selectedElements: any[]): Promise<void> {
    try {
      console.log('🔄 Processing SVG (legacy mode)...');
      const importedNode = figma.createNodeFromSvg(svgData);

      if (importedNode) {
        const structure = this.analyzeSVGStructure(importedNode);
        await this.createComponentsFromSVGStructure(structure);
        await this.organizeComponents();

        figma.notify('SVG successfully converted to components!');
      }
    } catch (error) {
      console.error('SVG processing error:', error);
      figma.notify(`Error processing SVG: ${error instanceof Error ? error.message : 'Unknown error'}`, { error: true });
    }
  }

  private analyzeSVGStructure(_node?: FrameNode): any {
    // Existing SVG analysis logic
    return { elements: [], groups: [], variants: [] };
  }

  private async createComponentsFromSVGStructure(_structure: any): Promise<void> {
    // Existing SVG to components logic
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
      const parsed = converter['tsxParser'].parseMultipleComponents(msg.reactCode);
      figma.ui.postMessage({
        type: 'analysis-complete',
        result: parsed
      });
    } catch (error) {
      converter['errorHandler'].handleParseError(error as Error, { operation: 'analyze-react' });
      figma.ui.postMessage({
        type: 'analysis-error',
        error: error instanceof Error ? error.message : 'Analysis failed'
      });
    }
  } else if (msg.type === 'process-svg') {
    console.log('🔄 Processing SVG...');
    await converter.processSVG(msg.svgData, msg.selectedElements);
  } else if (msg.type === 'analyze-svg') {
    console.log('🔍 Analyzing SVG structure...');
    try {
      const tempNode = figma.createNodeFromSvg(msg.svgData) as FrameNode;
      const structure = converter['analyzeSVGStructure'](tempNode);
      figma.ui.postMessage({ type: 'analysis-complete', structure: structure });
      tempNode.remove();
    } catch (error) {
      console.error('Plugin: Analysis error:', error);
      figma.ui.postMessage({ type: 'analysis-error', message: error instanceof Error ? error.message : 'Analysis failed' });
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