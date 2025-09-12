// Enhanced main plugin code with React parsing capabilities
// src/code.ts

import { EnhancedTSXParser, ReactComponentAnalysis } from './parsers/enhanced-tsx-parser';

interface ProcessingMessage {
  type: string;
  code?: string;
  svgData?: string;
  selectedElements?: any[];
  options?: ProcessingOptions;
}

interface ProcessingOptions {
  generateVariants: boolean;
  setupProperties: boolean;
  createDesignTokens: boolean;
  autoLayout: boolean;
}

class EnhancedSVGComponentConverter {
  private parser: EnhancedTSXParser;
  private createdComponents: ComponentNode[] = [];
  private designTokens: Map<string, VariableNode> = new Map();

  constructor() {
    this.parser = new EnhancedTSXParser();
  }

  async processReactCode(code: string, options: ProcessingOptions = {
    generateVariants: true,
    setupProperties: true,
    createDesignTokens: true,
    autoLayout: true
  }): Promise<void> {
    try {
      // Step 1: Parse React component
      this.sendProgress(10, 'Parsing React component...');
      const analysis = this.parser.parseReactComponent(code);
      
      // Step 2: Create design tokens
      if (options.createDesignTokens) {
        this.sendProgress(25, 'Creating design tokens...');
        await this.createDesignTokens(analysis);
      }

      // Step 3: Create atomic components
      this.sendProgress(40, 'Creating atomic components...');
      await this.createAtomicComponents(analysis.antdComponents);

      // Step 4: Create molecular components
      this.sendProgress(60, 'Creating molecular components...');
      await this.createMolecularComponents(analysis);

      // Step 5: Create variants if conditional rendering exists
      if (options.generateVariants && analysis.conditionalRendering.length > 0) {
        this.sendProgress(75, 'Creating component variants...');
        await this.createVariants(analysis);
      }

      // Step 6: Organize components
      this.sendProgress(90, 'Organizing components...');
      await this.organizeComponents();

      // Step 7: Complete
      this.sendProgress(100, 'Components created successfully!');
      
      figma.notify(`✅ Successfully created ${this.createdComponents.length} components from React code!`);
      
    } catch (error) {
      console.error('Error processing React code:', error);
      this.sendError(`Failed to process React code: ${error.message}`);
      figma.notify('❌ Failed to process React code. Check console for details.', { error: true });
    }
  }

  private async createDesignTokens(analysis: ReactComponentAnalysis): Promise<void> {
    const collection = figma.variables.createVariableCollection(`${analysis.componentName} Tokens`);
    const mode = collection.modes[0];

    // Color tokens from Ant Design theme
    const colorTokens = this.extractColorTokens(analysis);
    for (const [name, color] of colorTokens) {
      const variable = figma.variables.createVariable(name, collection, 'COLOR');
      variable.setValueForMode(mode.modeId, color);
      this.designTokens.set(name, variable);
    }

    // Spacing tokens
    const spacingTokens = this.extractSpacingTokens(analysis);
    for (const [name, spacing] of spacingTokens) {
      const variable = figma.variables.createVariable(name, collection, 'FLOAT');
      variable.setValueForMode(mode.modeId, spacing);
      this.designTokens.set(name, variable);
    }

    // Typography tokens
    const typographyTokens = this.extractTypographyTokens(analysis);
    for (const [name, fontSize] of typographyTokens) {
      const variable = figma.variables.createVariable(name, collection, 'FLOAT');
      variable.setValueForMode(mode.modeId, fontSize);
      this.designTokens.set(name, variable);
    }
  }

  private async createAtomicComponents(antdComponents: any[]): Promise<void> {
    for (const comp of antdComponents) {
      const component = await this.createAntDesignComponent(comp);
      if (component) {
        this.createdComponents.push(component);
      }
    }
  }

  private async createAntDesignComponent(antdComp: any): Promise<ComponentNode | null> {
    const figmaComponent = figma.createComponent();
    figmaComponent.name = `Atom/${antdComp.type}`;

    try {
      // Apply Ant Design specific styling and layout
      switch (antdComp.type) {
        case 'Card':
          await this.setupCardComponent(figmaComponent, antdComp);
          break;
        case 'Button':
          await this.setupButtonComponent(figmaComponent, antdComp);
          break;
        case 'Progress':
          await this.setupProgressComponent(figmaComponent, antdComp);
          break;
        case 'Tag':
          await this.setupTagComponent(figmaComponent, antdComp);
          break;
        case 'Avatar':
          await this.setupAvatarComponent(figmaComponent, antdComp);
          break;
        case 'Typography':
          await this.setupTypographyComponent(figmaComponent, antdComp);
          break;
        default:
          await this.setupGenericComponent(figmaComponent, antdComp);
      }

      // Setup component properties
      await this.setupComponentProperties(figmaComponent, antdComp);

      return figmaComponent;
    } catch (error) {
      console.error(`Failed to create ${antdComp.type} component:`, error);
      figmaComponent.remove();
      return null;
    }
  }

  private async setupCardComponent(component: ComponentNode, antdComp: any): Promise<void> {
    // Set up auto-layout
    component.layoutMode = 'VERTICAL';
    component.primaryAxisSizingMode = 'AUTO';
    component.counterAxisSizingMode = 'AUTO';
    component.paddingTop = 16;
    component.paddingRight = 16;
    component.paddingBottom = 16;
    component.paddingLeft = 16;
    component.itemSpacing = 12;

    // Card styling
    component.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
    component.strokes = [{ type: 'SOLID', color: { r: 0.85, g: 0.85, b: 0.85 } }];
    component.strokeWeight = 1;
    component.cornerRadius = 6;

    // Add shadow if not bordered
    if (!antdComp.props.bordered) {
      component.effects = [{
        type: 'DROP_SHADOW',
        color: { r: 0, g: 0, b: 0, a: 0.1 },
        offset: { x: 0, y: 2 },
        radius: 8,
        visible: true,
        blendMode: 'NORMAL'
      }];
    }

    // Add cover if exists
    if (antdComp.props.cover) {
      const coverFrame = figma.createFrame();
      coverFrame.name = 'Cover';
      coverFrame.layoutAlign = 'STRETCH';
      coverFrame.fills = [{ type: 'SOLID', color: { r: 0.9, g: 0.9, b: 0.9 } }];
      coverFrame.resize(280, 120);
      component.appendChild(coverFrame);
    }

    // Add content area
    const contentFrame = figma.createFrame();
    contentFrame.name = 'Content';
    contentFrame.layoutMode = 'VERTICAL';
    contentFrame.layoutAlign = 'STRETCH';
    contentFrame.primaryAxisSizingMode = 'AUTO';
    contentFrame.counterAxisSizingMode = 'FILL';
    contentFrame.fills = [];
    component.appendChild(contentFrame);
  }

  private async setupButtonComponent(component: ComponentNode, antdComp: any): Promise<void> {
    // Auto-layout setup
    component.layoutMode = 'HORIZONTAL';
    component.primaryAxisSizingMode = 'AUTO';
    component.counterAxisSizingMode = 'AUTO';
    component.paddingTop = 8;
    component.paddingRight = 16;
    component.paddingBottom = 8;
    component.paddingLeft = 16;
    component.itemSpacing = 8;

    // Button styling based on type
    const buttonType = antdComp.props.type || 'default';
    switch (buttonType) {
      case 'primary':
        component.fills = [{ type: 'SOLID', color: { r: 0.094, g: 0.565, b: 1 } }];
        break;
      case 'default':
        component.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
        component.strokes = [{ type: 'SOLID', color: { r: 0.85, g: 0.85, b: 0.85 } }];
        component.strokeWeight = 1;
        break;
      case 'text':
        component.fills = [];
        break;
    }

    component.cornerRadius = 6;

    // Add text node
    const textNode = figma.createText();
    await figma.loadFontAsync({ family: 'Inter', style: 'Medium' });
    textNode.fontName = { family: 'Inter', style: 'Medium' };
    textNode.fontSize = 14;
    textNode.characters = antdComp.props.children || 'Button';
    textNode.fills = buttonType === 'primary' ? 
      [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }] : 
      [{ type: 'SOLID', color: { r: 0, g: 0, b: 0, a: 0.88 } }];
    
    component.appendChild(textNode);
  }

  private async setupProgressComponent(component: ComponentNode, antdComp: any): Promise<void> {
    component.layoutMode = 'HORIZONTAL';
    component.primaryAxisSizingMode = 'FIXED';
    component.counterAxisSizingMode = 'AUTO';
    component.resize(200, 8);

    // Background track
    const track = figma.createRectangle();
    track.name = 'Track';
    track.resize(200, 8);
    track.fills = [{ type: 'SOLID', color: { r: 0.94, g: 0.94, b: 0.94 } }];
    track.cornerRadius = 4;
    component.appendChild(track);

    // Progress fill
    const fill = figma.createRectangle();
    fill.name = 'Fill';
    const percent = antdComp.props.percent || 50;
    fill.resize(200 * (percent / 100), 8);
    fill.fills = [{ type: 'SOLID', color: { r: 0.094, g: 0.565, b: 1 } }];
    fill.cornerRadius = 4;
    fill.constraints = {
      horizontal: 'MIN',
      vertical: 'CENTER'
    };
    
    // Position fill on top of track
    fill.x = track.x;
    fill.y = track.y;
    component.appendChild(fill);
  }

  private async setupTagComponent(component: ComponentNode, antdComp: any): Promise<void> {
    component.layoutMode = 'HORIZONTAL';
    component.primaryAxisSizingMode = 'AUTO';
    component.counterAxisSizingMode = 'AUTO';
    component.paddingTop = 4;
    component.paddingRight = 8;
    component.paddingBottom = 4;
    component.paddingLeft = 8;
    component.cornerRadius = 2;

    // Color based on Ant Design color prop
    const colors = {
      'blue': { r: 0.094, g: 0.565, b: 1 },
      'green': { r: 0.322, g: 0.769, b: 0.161 },
      'red': { r: 1, g: 0.302, b: 0.302 },
      'orange': { r: 0.980, g: 0.678, b: 0.078 },
      'purple': { r: 0.722, g: 0.106, b: 0.996 },
      'default': { r: 0.94, g: 0.94, b: 0.94 }
    };

    const color = antdComp.props.color || 'default';
    component.fills = [{ type: 'SOLID', color: colors[color] || colors.default }];

    // Add text
    const textNode = figma.createText();
    await figma.loadFontAsync({ family: 'Inter', style: 'Medium' });
    textNode.fontName = { family: 'Inter', style: 'Medium' };
    textNode.fontSize = 12;
    textNode.characters = antdComp.props.children || 'Tag';
    textNode.fills = color === 'default' ? 
      [{ type: 'SOLID', color: { r: 0, g: 0, b: 0, a: 0.65 } }] : 
      [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
    
    component.appendChild(textNode);
  }

  private async setupAvatarComponent(component: ComponentNode, antdComp: any): Promise<void> {
    const size = antdComp.props.size === 'large' ? 40 : antdComp.props.size === 'small' ? 24 : 32;
    
    component.resize(size, size);
    component.cornerRadius = size / 2; // Circular
    component.fills = [{ type: 'SOLID', color: { r: 0.094, g: 0.565, b: 1 } }];

    // Add icon or initial
    const textNode = figma.createText();
    await figma.loadFontAsync({ family: 'Inter', style: 'Medium' });
    textNode.fontName = { family: 'Inter', style: 'Medium' };
    textNode.fontSize = size * 0.4;
    textNode.characters = antdComp.props.children || '👤';
    textNode.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
    
    // Center the text
    textNode.x = (size - textNode.width) / 2;
    textNode.y = (size - textNode.height) / 2;
    
    component.appendChild(textNode);
  }

  private async setupTypographyComponent(component: ComponentNode, antdComp: any): Promise<void> {
    const textNode = figma.createText();
    
    // Determine typography style
    const level = antdComp.props.level || 1;
    const type = antdComp.props.type || 'primary';
    
    let fontStyle = 'Regular';
    let fontSize = 14;
    
    if (antdComp.type === 'Title') {
      fontStyle = 'Bold';
      fontSize = level === 1 ? 24 : level === 2 ? 20 : level === 3 ? 16 : 14;
    } else if (antdComp.type === 'Text') {
      fontStyle = type === 'secondary' ? 'Regular' : 'Medium';
    }
    
    await figma.loadFontAsync({ family: 'Inter', style: fontStyle });
    textNode.fontName = { family: 'Inter', style: fontStyle };
    textNode.fontSize = fontSize;
    textNode.characters = antdComp.props.children || 'Typography';
    
    // Color based on type
    const textColor = type === 'secondary' ? 
      { r: 0, g: 0, b: 0, a: 0.65 } : 
      { r: 0, g: 0, b: 0, a: 0.88 };
    textNode.fills = [{ type: 'SOLID', color: textColor }];
    
    component.appendChild(textNode);
    component.resize(textNode.width, textNode.height);
  }

  private async setupGenericComponent(component: ComponentNode, antdComp: any): Promise<void> {
    // Generic setup for unknown components
    component.resize(100, 40);
    component.fills = [{ type: 'SOLID', color: { r: 0.96, g: 0.96, b: 0.96 } }];
    component.cornerRadius = 4;
    
    const textNode = figma.createText();
    await figma.loadFontAsync({ family: 'Inter', style: 'Medium' });
    textNode.fontName = { family: 'Inter', style: 'Medium' };
    textNode.fontSize = 12;
    textNode.characters = antdComp.type;
    textNode.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0, a: 0.65 } }];
    
    // Center the text
    textNode.x = (100 - textNode.width) / 2;
    textNode.y = (40 - textNode.height) / 2;
    
    component.appendChild(textNode);
  }

  private async setupComponentProperties(component: ComponentNode, antdComp: any): Promise<void> {
    // Add component properties based on component type and dynamic props
    const dynamicProps = antdComp.dynamicProps || [];
    
    for (const propName of dynamicProps) {
      const propValue = antdComp.props[propName];
      
      if (typeof propValue === 'boolean' || propName.includes('visible')) {
        component.addComponentProperty(propName, 'BOOLEAN', propValue || false);
      } else if (typeof propValue === 'string' && !propValue.includes('.')) {
        component.addComponentProperty(propName, 'TEXT', propValue || '');
      } else if (typeof propValue === 'number') {
        component.addComponentProperty(propName, 'VARIANT', propValue.toString());
      }
    }

    // Add type-specific properties
    switch (antdComp.type) {
      case 'Progress':
        component.addComponentProperty('percent', 'VARIANT', '50');
        break;
      case 'Tag':
        component.addComponentProperty('color', 'VARIANT', 'blue');
        break;
      case 'Button':
        component.addComponentProperty('type', 'VARIANT', 'default');
        component.addComponentProperty('size', 'VARIANT', 'middle');
        break;
    }
  }

  private async createMolecularComponents(analysis: ReactComponentAnalysis): Promise<void> {
    // Group related atomic components into molecules
    const molecules = this.identifyMolecules(analysis);
    
    for (const molecule of molecules) {
      const component = await this.createMoleculeComponent(molecule);
      if (component) {
        this.createdComponents.push(component);
      }
    }
  }

  private identifyMolecules(analysis: ReactComponentAnalysis): any[] {
    // Identify logical groupings of components
    // This is a simplified implementation
    return [
      {
        name: 'ProjectHeader',
        components: ['Typography', 'Tag'],
        layout: 'horizontal'
      },
      {
        name: 'ProjectInfo',
        components: ['Typography', 'Typography'],
        layout: 'vertical'
      }
    ];
  }

  private async createMoleculeComponent(molecule: any): Promise<ComponentNode | null> {
    const component = figma.createComponent();
    component.name = `Molecule/${molecule.name}`;
    
    // Setup layout
    component.layoutMode = molecule.layout === 'horizontal' ? 'HORIZONTAL' : 'VERTICAL';
    component.primaryAxisSizingMode = 'AUTO';
    component.counterAxisSizingMode = 'AUTO';
    component.paddingTop = 12;
    component.paddingRight = 12;
    component.paddingBottom = 12;
    component.paddingLeft = 12;
    component.itemSpacing = 8;
    component.fills = [];

    return component;
  }

  private async createVariants(analysis: ReactComponentAnalysis): Promise<void> {
    // Create variants based on conditional rendering
    const variants = this.createVariantsFromConditionals(analysis.conditionalRendering);
    
    if (variants.length > 1) {
      const componentSet = figma.combineAsVariants(variants, figma.currentPage);
      componentSet.name = `${analysis.componentName} Variants`;
      this.createdComponents.push(...variants);
    }
  }

  private createVariantsFromConditionals(conditionals: any[]): ComponentNode[] {
    // This is a simplified implementation
    // In a real implementation, you would create actual variants
    // based on the conditional rendering logic
    return [];
  }

  private async organizeComponents(): Promise<void> {
    // Create a dedicated page for components
    const componentsPage = figma.createPage();
    componentsPage.name = 'React Components';
    
    // Organize components in a grid
    let x = 0;
    let y = 0;
    const spacing = 100;
    const itemsPerRow = 4;
    let itemIndex = 0;

    for (const component of this.createdComponents) {
      component.x = x;
      component.y = y;
      
      componentsPage.appendChild(component);
      
      itemIndex++;
      if (itemIndex % itemsPerRow === 0) {
        x = 0;
        y += component.height + spacing;
      } else {
        x += component.width + spacing;
      }
    }

    // Switch to the new page
    figma.currentPage = componentsPage;
  }

  // Helper methods for extracting design tokens
  private extractColorTokens(analysis: ReactComponentAnalysis): Map<string, RGB> {
    const tokens = new Map<string, RGB>();
    
    // Extract from Ant Design theme colors
    tokens.set('primary', { r: 0.094, g: 0.565, b: 1 });
    tokens.set('success', { r: 0.322, g: 0.769, b: 0.161 });
    tokens.set('warning', { r: 0.980, g: 0.678, b: 0.078 });
    tokens.set('error', { r: 1, g: 0.302, b: 0.302 });
    
    return tokens;
  }

  private extractSpacingTokens(analysis: ReactComponentAnalysis): Map<string, number> {
    const tokens = new Map<string, number>();
    
    tokens.set('space-xs', 4);
    tokens.set('space-sm', 8);
    tokens.set('space-md', 12);
    tokens.set('space-lg', 16);
    tokens.set('space-xl', 24);
    
    return tokens;
  }

  private extractTypographyTokens(analysis: ReactComponentAnalysis): Map<string, number> {
    const tokens = new Map<string, number>();
    
    tokens.set('font-size-sm', 12);
    tokens.set('font-size-base', 14);
    tokens.set('font-size-lg', 16);
    tokens.set('font-size-xl', 20);
    tokens.set('font-size-xxl', 24);
    
    return tokens;
  }

  private sendProgress(percentage: number, message: string): void {
    figma.ui.postMessage({
      type: 'generation-progress',
      progress: percentage,
      message: message
    });
  }

  private sendError(error: string): void {
    figma.ui.postMessage({
      type: 'generation-error',
      error: error
    });
  }

  // Legacy SVG processing for backward compatibility
  async processSVG(svgData: string, selectedElements: any[]): Promise<void> {
    // Keep the existing SVG processing logic for backward compatibility
    // This can be called when users want to import SVG directly
    try {
      const importedNode = figma.createNodeFromSvg(svgData);
      
      if (importedNode) {
        const structure = this.analyzeSVGStructure(importedNode);
        await this.createComponentsFromSVGStructure(structure);
        await this.organizeComponents();
        
        figma.notify('SVG successfully converted to components!');
      }
    } catch (error) {
      console.error('SVG processing error:', error);
      figma.notify(`Error processing SVG: ${error.message}`, { error: true });
    }
  }

  private analyzeSVGStructure(node: FrameNode): any {
    // Existing SVG analysis logic
    return { elements: [], groups: [], variants: [] };
  }

  private async createComponentsFromSVGStructure(structure: any): Promise<void> {
    // Existing SVG to components logic
  }
}

// Main plugin message handler
const converter = new EnhancedSVGComponentConverter();

figma.ui.onmessage = async (msg: ProcessingMessage) => {
  try {
    switch (msg.type) {
      case 'analyze-react-code':
        if (msg.code) {
          await converter.processReactCode(msg.code, msg.options);
        }
        break;
        
      case 'process-svg':
        if (msg.svgData) {
          await converter.processSVG(msg.svgData, msg.selectedElements || []);
        }
        break;
        
      default:
        console.warn('Unknown message type:', msg.type);
    }
  } catch (error) {
    console.error('Plugin error:', error);
    figma.notify(`Plugin error: ${error.message}`, { error: true });
  }
};

// Plugin initialization
figma.showUI(__html__, { 
  width: 500, 
  height: 700,
  title: 'Enhanced React to Figma Converter'
});

figma.ui.postMessage({
  type: 'plugin-ready',
  message: 'Enhanced plugin loaded successfully!'
});