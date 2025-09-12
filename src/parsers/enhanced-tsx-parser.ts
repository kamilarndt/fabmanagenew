// Enhanced TSX Parser for React/TypeScript Components
import {
    ReactComponentAnalysis,
    AntDesignComponent,
    JSXStructure,
    ConditionalExpression,
    DynamicProperty,
    EventHandler,
    StyleAnalysis,
    LayoutAnalysis,
    ParsedStructure,
    ParseError,
    ParseWarning
} from '@types/ast-types';

export class EnhancedTSXParser {
    private antdComponents: string[] = [
        'Card', 'Button', 'Input', 'Select', 'DatePicker', 'Table', 'Form',
        'Modal', 'Drawer', 'Tabs', 'Menu', 'Breadcrumb', 'Pagination',
        'Progress', 'Tag', 'Avatar', 'Badge', 'Tooltip', 'Popover',
        'Dropdown', 'Space', 'Divider', 'Typography', 'Layout', 'Grid',
        'Row', 'Col', 'Checkbox', 'Radio', 'Switch', 'Slider', 'Rate',
        'Upload', 'Transfer', 'Tree', 'Cascader', 'AutoComplete', 'Mention',
        'TimePicker', 'Calendar', 'Statistic', 'Empty', 'Result', 'Skeleton',
        'Affix', 'Anchor', 'BackTop', 'Breadcrumb', 'Dropdown', 'Menu',
        'Pagination', 'Steps', 'Anchor', 'Breadcrumb', 'Dropdown', 'Menu'
    ];

    parseReactComponent(code: string): ReactComponentAnalysis {
        try {
            console.log('🔍 Starting enhanced React component parsing...');

            const analysis: ReactComponentAnalysis = {
                componentName: this.extractComponentName(code),
                imports: this.extractImports(code),
                props: this.extractProps(code),
                jsx: this.parseJSXStructure(code),
                antdComponents: this.extractAntdComponents(code),
                conditionalRendering: this.extractConditionalRendering(code),
                dynamicProps: this.extractDynamicProps(code),
                eventHandlers: this.extractEventHandlers(code),
                styling: this.analyzeStyling(code),
                layout: this.analyzeLayout(code),
                hooks: this.extractHooks(code),
                state: this.extractState(code),
                effects: this.extractEffects(code)
            };

            console.log('✅ Enhanced parsing completed:', analysis);
            return analysis;
        } catch (error) {
            console.error('❌ Enhanced parsing error:', error);
            throw new Error(`Failed to parse React component: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    parseMultipleComponents(code: string): ParsedStructure {
        try {
            console.log('🔍 Starting multi-component parsing...');

            const components = this.extractAllComponents(code);
            const designTokens = this.extractDesignTokens(code);
            const imports = this.extractImports(code);
            const exports = this.extractExports(code);
            const errors: ParseError[] = [];
            const warnings: ParseWarning[] = [];

            // Parse each component
            const parsedComponents: ReactComponentAnalysis[] = [];
            for (const componentCode of components) {
                try {
                    const analysis = this.parseReactComponent(componentCode);
                    parsedComponents.push(analysis);
                } catch (error) {
                    errors.push({
                        message: `Failed to parse component: ${error instanceof Error ? error.message : 'Unknown error'}`,
                        line: 0,
                        column: 0,
                        severity: 'error',
                        code: 'PARSE_ERROR',
                        suggestion: 'Check component syntax'
                    });
                }
            }

            console.log('✅ Multi-component parsing completed');
            return {
                components: parsedComponents,
                designTokens,
                imports,
                exports,
                errors,
                warnings
            };
        } catch (error) {
            console.error('❌ Multi-component parsing error:', error);
            throw new Error(`Failed to parse multiple components: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    private extractComponentName(code: string): string {
        // Extract component name from function declaration or arrow function
        const functionMatch = code.match(/(?:function|const)\s+(\w+)\s*(?:\(|:)/);
        const arrowMatch = code.match(/const\s+(\w+)\s*=\s*(?:\([^)]*\)\s*=>|React\.FC)/);

        if (functionMatch) return functionMatch[1];
        if (arrowMatch) return arrowMatch[1];

        // Fallback: look for export default
        const exportMatch = code.match(/export\s+default\s+(\w+)/);
        if (exportMatch) return exportMatch[1];

        return 'UnknownComponent';
    }

    private extractImports(code: string): { [library: string]: string[] } {
        const imports: { [library: string]: string[] } = {};
        const importRegex = /import\s+.*?\s+from\s+['"]([^'"]+)['"]/g;
        let match;

        while ((match = importRegex.exec(code)) !== null) {
            const library = match[1];
            const importStatement = match[0];

            // Extract imported names
            const namedImports = importStatement.match(/\{([^}]+)\}/);
            if (namedImports) {
                const names = namedImports[1].split(',').map(name => name.trim());
                imports[library] = names;
            } else {
                // Default import
                const defaultMatch = importStatement.match(/import\s+(\w+)/);
                if (defaultMatch) {
                    imports[library] = [defaultMatch[1]];
                }
            }
        }

        return imports;
    }

    private extractProps(code: string): { [key: string]: any } {
        const props: { [key: string]: any } = {};

        // Extract interface props
        const interfaceMatch = code.match(/interface\s+\w+Props\s*\{([^}]+)\}/);
        if (interfaceMatch) {
            const propsText = interfaceMatch[1];
            const propRegex = /(\w+)\s*:\s*([^;]+)/g;
            let propMatch;

            while ((propMatch = propRegex.exec(propsText)) !== null) {
                const propName = propMatch[1];
                const propType = propMatch[2].trim();
                props[propName] = this.parsePropType(propType);
            }
        }

        return props;
    }

    private parsePropType(type: string): any {
        if (type.includes('string')) return 'string';
        if (type.includes('number')) return 0;
        if (type.includes('boolean')) return false;
        if (type.includes('[]')) return [];
        if (type.includes('{}')) return {};
        return 'any';
    }

    private parseJSXStructure(code: string): JSXStructure {
        const jsxMatch = code.match(/return\s*\(([\s\S]+)\)\s*;?\s*}/);
        if (!jsxMatch) {
            return {
                rootElement: null,
                depth: 0,
                components: [],
                textNodes: []
            };
        }

        const jsxContent = jsxMatch[1];
        const components = this.extractJSXComponents(jsxContent);
        const textNodes = this.extractTextNodes(jsxContent);

        return {
            rootElement: components[0] || null,
            depth: this.calculateDepth(jsxContent),
            components,
            textNodes
        };
    }

    private extractJSXComponents(jsx: string): any[] {
        const components: any[] = [];
        const componentRegex = /<(\w+)([^>]*)>/g;
        let match;

        while ((match = componentRegex.exec(jsx)) !== null) {
            const tagName = match[1];
            const attributes = match[2];

            if (tagName && !tagName.startsWith('/')) {
                components.push({
                    name: tagName,
                    props: this.parseJSXAttributes(attributes),
                    children: [],
                    type: 'element'
                });
            }
        }

        return components;
    }

    private parseJSXAttributes(attributes: string): { [key: string]: any } {
        const props: { [key: string]: any } = {};
        const attrRegex = /(\w+)=["']([^"']+)["']/g;
        let match;

        while ((match = attrRegex.exec(attributes)) !== null) {
            const propName = match[1];
            const propValue = match[2];
            props[propName] = this.parseAttributeValue(propValue);
        }

        return props;
    }

    private parseAttributeValue(value: string): any {
        if (value === 'true') return true;
        if (value === 'false') return false;
        if (!isNaN(Number(value))) return Number(value);
        return value;
    }

    private extractTextNodes(jsx: string): any[] {
        const textNodes: any[] = [];
        const textRegex = />([^<]+)</g;
        let match;

        while ((match = textRegex.exec(jsx)) !== null) {
            const text = match[1].trim();
            if (text) {
                textNodes.push({
                    content: text,
                    position: { x: 0, y: 0 }
                });
            }
        }

        return textNodes;
    }

    private calculateDepth(jsx: string): number {
        let depth = 0;
        let maxDepth = 0;

        for (const char of jsx) {
            if (char === '<' && !jsx[jsx.indexOf(char) + 1]?.includes('/')) {
                depth++;
                maxDepth = Math.max(maxDepth, depth);
            } else if (char === '>' && jsx[jsx.indexOf(char) - 1]?.includes('/')) {
                depth--;
            }
        }

        return maxDepth;
    }

    private extractAntdComponents(code: string): AntDesignComponent[] {
        const components: AntDesignComponent[] = [];
        const antdImports = this.extractImports(code)['antd'] || [];

        for (const componentName of antdImports) {
            if (this.antdComponents.includes(componentName)) {
                const componentRegex = new RegExp(`<${componentName}([^>]*)>`, 'g');
                let match;

                while ((match = componentRegex.exec(code)) !== null) {
                    const attributes = match[1];
                    components.push({
                        type: componentName,
                        props: this.parseJSXAttributes(attributes),
                        children: [],
                        conditionalRender: undefined,
                        dynamicProps: this.findDynamicProps(attributes),
                        position: { x: 0, y: 0 },
                        figmaMapping: this.createFigmaMapping(componentName, attributes)
                    });
                }
            }
        }

        return components;
    }

    private findDynamicProps(attributes: string): string[] {
        const dynamicProps: string[] = [];
        const propRegex = /(\w+)=\{([^}]+)\}/g;
        let match;

        while ((match = propRegex.exec(attributes)) !== null) {
            const propName = match[1];
            const propValue = match[2];

            if (propValue.includes('project.') || propValue.includes('props.') || propValue.includes('state.')) {
                dynamicProps.push(propName);
            }
        }

        return dynamicProps;
    }

    private createFigmaMapping(componentName: string, attributes: string): any {
        const mapping: any = {
            componentType: 'frame',
            properties: {},
            variants: {},
            constraints: {
                horizontal: 'STRETCH',
                vertical: 'STRETCH'
            }
        };

        switch (componentName) {
            case 'Card':
                mapping.componentType = 'frame';
                mapping.properties = {
                    fills: [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }],
                    cornerRadius: 8,
                    strokeWeight: 1,
                    strokeAlign: 'INSIDE'
                };
                break;
            case 'Button':
                mapping.componentType = 'frame';
                mapping.properties = {
                    fills: [{ type: 'SOLID', color: { r: 0.1, g: 0.56, b: 1 } }],
                    cornerRadius: 6,
                    paddingLeft: 16,
                    paddingRight: 16,
                    paddingTop: 8,
                    paddingBottom: 8
                };
                break;
            case 'Typography':
                mapping.componentType = 'text';
                mapping.properties = {
                    fontSize: 14,
                    fontFamily: 'Inter',
                    fontWeight: 400,
                    fills: [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }]
                };
                break;
        }

        return mapping;
    }

    private extractConditionalRendering(code: string): ConditionalExpression[] {
        const conditionals: ConditionalExpression[] = [];

        // Ternary operators
        const ternaryRegex = /(\w+)\s*\?\s*([^:]+)\s*:\s*([^;]+)/g;
        let match;

        while ((match = ternaryRegex.exec(code)) !== null) {
            conditionals.push({
                condition: match[1],
                trueExpression: match[2].trim(),
                falseExpression: match[3].trim(),
                type: 'ternary'
            });
        }

        // Logical operators
        const logicalRegex = /(\w+)\s*&&\s*([^;]+)/g;
        while ((match = logicalRegex.exec(code)) !== null) {
            conditionals.push({
                condition: match[1],
                trueExpression: match[2].trim(),
                falseExpression: '',
                type: 'logical'
            });
        }

        return conditionals;
    }

    private extractDynamicProps(code: string): DynamicProperty[] {
        const dynamicProps: DynamicProperty[] = [];
        const propRegex = /(\w+)=\{([^}]+)\}/g;
        let match;

        while ((match = propRegex.exec(code)) !== null) {
            const propName = match[1];
            const propValue = match[2];

            if (propValue.includes('project.') || propValue.includes('props.') || propValue.includes('state.')) {
                dynamicProps.push({
                    propertyName: propName,
                    dataType: this.inferDataType(propValue),
                    defaultValue: this.getDefaultValue(propValue),
                    sourcePath: propValue,
                    targetElement: 'component',
                    isRequired: true
                });
            }
        }

        return dynamicProps;
    }

    private inferDataType(value: string): 'string' | 'number' | 'boolean' | 'object' | 'array' {
        if (value.includes('.')) return 'object';
        if (value.includes('[')) return 'array';
        if (value.includes('true') || value.includes('false')) return 'boolean';
        if (value.includes('"') || value.includes("'")) return 'string';
        return 'string';
    }

    private getDefaultValue(value: string): any {
        if (value.includes('true')) return true;
        if (value.includes('false')) return false;
        if (value.includes('"') || value.includes("'")) return '';
        if (value.includes('[')) return [];
        if (value.includes('{')) return {};
        return '';
    }

    private extractEventHandlers(code: string): EventHandler[] {
        const handlers: EventHandler[] = [];
        const handlerRegex = /on(\w+)=\{([^}]+)\}/g;
        let match;

        while ((match = handlerRegex.exec(code)) !== null) {
            const eventType = match[1].toLowerCase();
            const handler = match[2];

            handlers.push({
                name: `on${match[1]}`,
                type: eventType as any,
                target: 'component',
                action: handler,
                preventDefault: false,
                stopPropagation: false
            });
        }

        return handlers;
    }

    private analyzeStyling(code: string): StyleAnalysis {
        const classes: string[] = [];
        const inlineStyles: { [key: string]: any } = {};
        const themeTokens: string[] = [];
        const cssVariables: { [key: string]: string } = {};

        // Extract className attributes
        const classNameRegex = /className=["']([^"']+)["']/g;
        let match;
        while ((match = classNameRegex.exec(code)) !== null) {
            classes.push(match[1]);
        }

        // Extract style attributes
        const styleRegex = /style=\{\{([^}]+)\}\}/g;
        while ((match = styleRegex.exec(code)) !== null) {
            const styleText = match[1];
            const styleProps = styleText.split(',').map(prop => prop.trim());

            for (const prop of styleProps) {
                const [key, value] = prop.split(':').map(s => s.trim());
                if (key && value) {
                    inlineStyles[key] = value.replace(/['"]/g, '');
                }
            }
        }

        // Extract theme tokens
        const themeRegex = /theme\.(\w+)/g;
        while ((match = themeRegex.exec(code)) !== null) {
            themeTokens.push(match[1]);
        }

        return {
            classes,
            inlineStyles,
            themeTokens,
            cssVariables,
            mediaQueries: []
        };
    }

    private analyzeLayout(code: string): LayoutAnalysis {
        // Analyze layout patterns
        const hasFlex = code.includes('display: flex') || code.includes('flexDirection') || code.includes('justifyContent');
        const hasGrid = code.includes('display: grid') || code.includes('gridTemplate');
        const hasSpace = code.includes('<Space') || code.includes('Space');

        return {
            type: hasGrid ? 'grid' : hasFlex ? 'flex' : 'relative',
            direction: code.includes('flexDirection: column') ? 'column' : 'row',
            spacing: hasSpace ? 16 : 0,
            alignment: 'start',
            justifyContent: 'start',
            alignItems: 'start',
            wrap: 'nowrap'
        };
    }

    private extractHooks(code: string): any[] {
        const hooks: any[] = [];
        const hookRegex = /(use\w+)\s*\([^)]*\)/g;
        let match;

        while ((match = hookRegex.exec(code)) !== null) {
            hooks.push({
                name: match[1],
                type: match[1],
                dependencies: [],
                returnType: 'any'
            });
        }

        return hooks;
    }

    private extractState(code: string): any[] {
        const state: any[] = [];
        const useStateRegex = /const\s+\[(\w+),\s*set(\w+)\]\s*=\s*useState\s*\(([^)]+)\)/g;
        let match;

        while ((match = useStateRegex.exec(code)) !== null) {
            state.push({
                name: match[1],
                type: 'any',
                initialValue: match[3],
                setter: match[2]
            });
        }

        return state;
    }

    private extractEffects(code: string): any[] {
        const effects: any[] = [];
        const useEffectRegex = /useEffect\s*\([^)]*\)/g;
        let match;

        while ((match = useEffectRegex.exec(code)) !== null) {
            effects.push({
                name: 'useEffect',
                dependencies: [],
                cleanup: undefined,
                async: false
            });
        }

        return effects;
    }

    private extractAllComponents(code: string): string[] {
        const components: string[] = [];

        // Extract function components
        const functionRegex = /(?:function|const)\s+\w+\s*(?:\([^)]*\)\s*=>\s*\{|React\.FC[^}]*\{)([\s\S]+?)\}/g;
        let match;

        while ((match = functionRegex.exec(code)) !== null) {
            components.push(match[0]);
        }

        return components;
    }

    private extractDesignTokens(code: string): any {
        const tokens: any = {
            colors: {},
            typography: {},
            spacing: {},
            borderRadius: {},
            shadows: {},
            breakpoints: {}
        };

        // Extract colors
        const colorRegex = /#[0-9a-fA-F]{6}|#[0-9a-fA-F]{3}|rgb\([^)]+\)|rgba\([^)]+\)/g;
        let match;
        let colorIndex = 0;

        while ((match = colorRegex.exec(code)) !== null) {
            tokens.colors[`color-${colorIndex}`] = match[0];
            colorIndex++;
        }

        // Default typography tokens
        tokens.typography = {
            'heading-1': { fontSize: 32, fontWeight: 700 },
            'heading-2': { fontSize: 24, fontWeight: 600 },
            'heading-3': { fontSize: 20, fontWeight: 600 },
            'body': { fontSize: 14, fontWeight: 400 },
            'caption': { fontSize: 12, fontWeight: 400 }
        };

        // Default spacing tokens
        tokens.spacing = {
            xs: 4, sm: 8, md: 16, lg: 24, xl: 32
        };

        // Default border radius tokens
        tokens.borderRadius = {
            none: 0, sm: 4, md: 8, lg: 12, xl: 16
        };

        return tokens;
    }

    private extractExports(code: string): string[] {
        const exports: string[] = [];

        // Named exports
        const namedExportRegex = /export\s+(?:const|function|class)\s+(\w+)/g;
        let match;

        while ((match = namedExportRegex.exec(code)) !== null) {
            exports.push(match[1]);
        }

        // Default export
        const defaultExportRegex = /export\s+default\s+(\w+)/;
        const defaultMatch = defaultExportRegex.exec(code);
        if (defaultMatch) {
            exports.push(defaultMatch[1]);
        }

        return exports;
    }
}

export default EnhancedTSXParser;
