// Ant Design to Figma Component Mapper
import {
    AntDesignMapping,
    ExtendedComponentProperty,
    LayoutConfig,
    ConstraintConfig,
    VariantConfig,
    AutoLayoutConfig,
    FigmaDesignTokens,
    ComponentCreationOptions,
    EnhancedComponent
} from '@types/figma-types';
import { AntDesignComponent, ReactComponentAnalysis } from '@types/ast-types';

export class AntDesignFigmaMapper {
    private designTokens: FigmaDesignTokens;
    private componentMappings: Map<string, AntDesignMapping> = new Map();

    constructor(designTokens?: FigmaDesignTokens) {
        this.designTokens = designTokens || this.getDefaultDesignTokens();
        this.initializeMappings();
    }

    private getDefaultDesignTokens(): FigmaDesignTokens {
        return {
            colors: {
                primary: { r: 0.1, g: 0.56, b: 1, a: 1 },
                success: { r: 0.32, g: 0.77, b: 0.1, a: 1 },
                warning: { r: 0.98, g: 0.68, b: 0.08, a: 1 },
                error: { r: 1, g: 0.3, b: 0.31, a: 1 },
                text: { r: 0, g: 0, b: 0, a: 0.88 },
                textSecondary: { r: 0, g: 0, b: 0, a: 0.65 },
                background: { r: 1, g: 1, b: 1, a: 1 },
                border: { r: 0.85, g: 0.85, b: 0.85, a: 1 }
            },
            typography: {
                'heading-1': {
                    fontFamily: 'Inter',
                    fontSize: 32,
                    fontWeight: 700,
                    lineHeight: 1.2
                },
                'heading-2': {
                    fontFamily: 'Inter',
                    fontSize: 24,
                    fontWeight: 600,
                    lineHeight: 1.3
                },
                'heading-3': {
                    fontFamily: 'Inter',
                    fontSize: 20,
                    fontWeight: 600,
                    lineHeight: 1.4
                },
                'body': {
                    fontFamily: 'Inter',
                    fontSize: 14,
                    fontWeight: 400,
                    lineHeight: 1.5
                },
                'caption': {
                    fontFamily: 'Inter',
                    fontSize: 12,
                    fontWeight: 400,
                    lineHeight: 1.4
                }
            },
            spacing: {
                xs: 4,
                sm: 8,
                md: 16,
                lg: 24,
                xl: 32
            },
            borderRadius: {
                none: 0,
                sm: 4,
                md: 8,
                lg: 12,
                xl: 16
            },
            shadows: {},
            breakpoints: {
                xs: 0,
                sm: 576,
                md: 768,
                lg: 992,
                xl: 1200
            }
        };
    }

    private initializeMappings(): void {
        // Card Component
        this.componentMappings.set('Card', {
            figmaType: 'COMPONENT',
            properties: {
                title: {
                    type: 'TEXT',
                    defaultValue: 'Card Title',
                    description: 'Card title text'
                },
                extra: {
                    type: 'INSTANCE_SWAP',
                    defaultValue: 'Button',
                    description: 'Extra content in card header'
                },
                bordered: {
                    type: 'BOOLEAN',
                    defaultValue: true,
                    description: 'Whether card has border'
                },
                hoverable: {
                    type: 'BOOLEAN',
                    defaultValue: false,
                    description: 'Whether card is hoverable'
                },
                size: {
                    type: 'VARIANT',
                    values: ['default', 'small'],
                    defaultValue: 'default',
                    description: 'Card size variant'
                }
            },
            layout: {
                autoLayout: true,
                direction: 'VERTICAL',
                padding: { top: 16, right: 16, bottom: 16, left: 16 },
                gap: 16
            },
            constraints: {
                horizontal: 'STRETCH',
                vertical: 'MIN'
            },
            variants: {
                size: {
                    values: ['default', 'small'],
                    defaultValue: 'default'
                }
            },
            autoLayout: {
                direction: 'VERTICAL',
                padding: { top: 16, right: 16, bottom: 16, left: 16 },
                gap: 16,
                wrap: 'NO_WRAP',
                primaryAxisAlignItems: 'MIN',
                counterAxisAlignItems: 'MIN'
            }
        });

        // Button Component
        this.componentMappings.set('Button', {
            figmaType: 'COMPONENT',
            properties: {
                type: {
                    type: 'VARIANT',
                    values: ['primary', 'default', 'dashed', 'text', 'link'],
                    defaultValue: 'primary',
                    description: 'Button type variant'
                },
                size: {
                    type: 'VARIANT',
                    values: ['large', 'middle', 'small'],
                    defaultValue: 'middle',
                    description: 'Button size variant'
                },
                shape: {
                    type: 'VARIANT',
                    values: ['default', 'circle', 'round'],
                    defaultValue: 'default',
                    description: 'Button shape variant'
                },
                disabled: {
                    type: 'BOOLEAN',
                    defaultValue: false,
                    description: 'Whether button is disabled'
                },
                loading: {
                    type: 'BOOLEAN',
                    defaultValue: false,
                    description: 'Whether button is in loading state'
                },
                block: {
                    type: 'BOOLEAN',
                    defaultValue: false,
                    description: 'Whether button takes full width'
                }
            },
            layout: {
                autoLayout: true,
                direction: 'HORIZONTAL',
                padding: { top: 8, right: 16, bottom: 8, left: 16 },
                gap: 8
            },
            constraints: {
                horizontal: 'MIN',
                vertical: 'MIN'
            },
            variants: {
                type: {
                    values: ['primary', 'default', 'dashed', 'text', 'link'],
                    defaultValue: 'primary'
                },
                size: {
                    values: ['large', 'middle', 'small'],
                    defaultValue: 'middle'
                }
            },
            autoLayout: {
                direction: 'HORIZONTAL',
                padding: { top: 8, right: 16, bottom: 8, left: 16 },
                gap: 8,
                wrap: 'NO_WRAP',
                primaryAxisAlignItems: 'CENTER',
                counterAxisAlignItems: 'CENTER'
            }
        });

        // Input Component
        this.componentMappings.set('Input', {
            figmaType: 'COMPONENT',
            properties: {
                placeholder: {
                    type: 'TEXT',
                    defaultValue: 'Please input',
                    description: 'Input placeholder text'
                },
                value: {
                    type: 'TEXT',
                    defaultValue: '',
                    description: 'Input value'
                },
                size: {
                    type: 'VARIANT',
                    values: ['large', 'middle', 'small'],
                    defaultValue: 'middle',
                    description: 'Input size variant'
                },
                disabled: {
                    type: 'BOOLEAN',
                    defaultValue: false,
                    description: 'Whether input is disabled'
                },
                allowClear: {
                    type: 'BOOLEAN',
                    defaultValue: false,
                    description: 'Whether input allows clear'
                },
                bordered: {
                    type: 'BOOLEAN',
                    defaultValue: true,
                    description: 'Whether input has border'
                }
            },
            layout: {
                autoLayout: true,
                direction: 'HORIZONTAL',
                padding: { top: 8, right: 12, bottom: 8, left: 12 },
                gap: 8
            },
            constraints: {
                horizontal: 'STRETCH',
                vertical: 'MIN'
            },
            variants: {
                size: {
                    values: ['large', 'middle', 'small'],
                    defaultValue: 'middle'
                }
            },
            autoLayout: {
                direction: 'HORIZONTAL',
                padding: { top: 8, right: 12, bottom: 8, left: 12 },
                gap: 8,
                wrap: 'NO_WRAP',
                primaryAxisAlignItems: 'MIN',
                counterAxisAlignItems: 'CENTER'
            }
        });

        // Progress Component
        this.componentMappings.set('Progress', {
            figmaType: 'COMPONENT',
            properties: {
                percent: {
                    type: 'NUMBER',
                    defaultValue: 0,
                    min: 0,
                    max: 100,
                    description: 'Progress percentage'
                },
                status: {
                    type: 'VARIANT',
                    values: ['normal', 'success', 'exception', 'active'],
                    defaultValue: 'normal',
                    description: 'Progress status'
                },
                type: {
                    type: 'VARIANT',
                    values: ['line', 'circle', 'dashboard'],
                    defaultValue: 'line',
                    description: 'Progress type'
                },
                size: {
                    type: 'VARIANT',
                    values: ['default', 'small'],
                    defaultValue: 'default',
                    description: 'Progress size'
                },
                showInfo: {
                    type: 'BOOLEAN',
                    defaultValue: true,
                    description: 'Whether to show progress info'
                }
            },
            layout: {
                autoLayout: true,
                direction: 'HORIZONTAL',
                padding: { top: 8, right: 8, bottom: 8, left: 8 },
                gap: 8
            },
            constraints: {
                horizontal: 'STRETCH',
                vertical: 'MIN'
            },
            variants: {
                status: {
                    values: ['normal', 'success', 'exception', 'active'],
                    defaultValue: 'normal'
                },
                type: {
                    values: ['line', 'circle', 'dashboard'],
                    defaultValue: 'line'
                }
            },
            autoLayout: {
                direction: 'HORIZONTAL',
                padding: { top: 8, right: 8, bottom: 8, left: 8 },
                gap: 8,
                wrap: 'NO_WRAP',
                primaryAxisAlignItems: 'MIN',
                counterAxisAlignItems: 'CENTER'
            }
        });

        // Tag Component
        this.componentMappings.set('Tag', {
            figmaType: 'COMPONENT',
            properties: {
                color: {
                    type: 'VARIANT',
                    values: ['default', 'success', 'processing', 'error', 'warning'],
                    defaultValue: 'default',
                    description: 'Tag color variant'
                },
                closable: {
                    type: 'BOOLEAN',
                    defaultValue: false,
                    description: 'Whether tag can be closed'
                },
                visible: {
                    type: 'BOOLEAN',
                    defaultValue: true,
                    description: 'Whether tag is visible'
                }
            },
            layout: {
                autoLayout: true,
                direction: 'HORIZONTAL',
                padding: { top: 4, right: 8, bottom: 4, left: 8 },
                gap: 4
            },
            constraints: {
                horizontal: 'MIN',
                vertical: 'MIN'
            },
            variants: {
                color: {
                    values: ['default', 'success', 'processing', 'error', 'warning'],
                    defaultValue: 'default'
                }
            },
            autoLayout: {
                direction: 'HORIZONTAL',
                padding: { top: 4, right: 8, bottom: 4, left: 8 },
                gap: 4,
                wrap: 'NO_WRAP',
                primaryAxisAlignItems: 'CENTER',
                counterAxisAlignItems: 'CENTER'
            }
        });

        // Avatar Component
        this.componentMappings.set('Avatar', {
            figmaType: 'COMPONENT',
            properties: {
                size: {
                    type: 'VARIANT',
                    values: ['large', 'middle', 'small'],
                    defaultValue: 'middle',
                    description: 'Avatar size variant'
                },
                shape: {
                    type: 'VARIANT',
                    values: ['circle', 'square'],
                    defaultValue: 'circle',
                    description: 'Avatar shape variant'
                },
                src: {
                    type: 'TEXT',
                    defaultValue: '',
                    description: 'Avatar image source'
                },
                icon: {
                    type: 'INSTANCE_SWAP',
                    defaultValue: 'UserOutlined',
                    description: 'Avatar icon'
                }
            },
            layout: {
                autoLayout: false,
                direction: 'HORIZONTAL'
            },
            constraints: {
                horizontal: 'MIN',
                vertical: 'MIN'
            },
            variants: {
                size: {
                    values: ['large', 'middle', 'small'],
                    defaultValue: 'middle'
                },
                shape: {
                    values: ['circle', 'square'],
                    defaultValue: 'circle'
                }
            }
        });

        // Space Component
        this.componentMappings.set('Space', {
            figmaType: 'COMPONENT',
            properties: {
                direction: {
                    type: 'VARIANT',
                    values: ['horizontal', 'vertical'],
                    defaultValue: 'horizontal',
                    description: 'Space direction'
                },
                size: {
                    type: 'VARIANT',
                    values: ['small', 'middle', 'large'],
                    defaultValue: 'middle',
                    description: 'Space size'
                },
                wrap: {
                    type: 'BOOLEAN',
                    defaultValue: false,
                    description: 'Whether space wraps'
                }
            },
            layout: {
                autoLayout: true,
                direction: 'HORIZONTAL',
                gap: 16
            },
            constraints: {
                horizontal: 'MIN',
                vertical: 'MIN'
            },
            variants: {
                direction: {
                    values: ['horizontal', 'vertical'],
                    defaultValue: 'horizontal'
                },
                size: {
                    values: ['small', 'middle', 'large'],
                    defaultValue: 'middle'
                }
            },
            autoLayout: {
                direction: 'HORIZONTAL',
                padding: { top: 0, right: 0, bottom: 0, left: 0 },
                gap: 16,
                wrap: 'NO_WRAP',
                primaryAxisAlignItems: 'MIN',
                counterAxisAlignItems: 'MIN'
            }
        });

        // Typography Component
        this.componentMappings.set('Typography', {
            figmaType: 'COMPONENT',
            properties: {
                variant: {
                    type: 'VARIANT',
                    values: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'body', 'caption'],
                    defaultValue: 'body',
                    description: 'Typography variant'
                },
                color: {
                    type: 'COLOR',
                    defaultValue: 'text',
                    description: 'Text color'
                },
                strong: {
                    type: 'BOOLEAN',
                    defaultValue: false,
                    description: 'Whether text is strong'
                },
                italic: {
                    type: 'BOOLEAN',
                    defaultValue: false,
                    description: 'Whether text is italic'
                },
                underline: {
                    type: 'BOOLEAN',
                    defaultValue: false,
                    description: 'Whether text is underlined'
                }
            },
            layout: {
                autoLayout: false,
                direction: 'HORIZONTAL'
            },
            constraints: {
                horizontal: 'MIN',
                vertical: 'MIN'
            },
            variants: {
                variant: {
                    values: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'body', 'caption'],
                    defaultValue: 'body'
                }
            }
        });
    }

    public mapAntdComponent(component: AntDesignComponent): AntDesignMapping | null {
        const mapping = this.componentMappings.get(component.type);
        if (!mapping) {
            console.warn(`No mapping found for Ant Design component: ${component.type}`);
            return null;
        }

        // Create a copy of the mapping and customize it based on component props
        const customizedMapping = this.customizeMapping(mapping, component);
        return customizedMapping;
    }

    private customizeMapping(mapping: AntDesignMapping, component: AntDesignComponent): AntDesignMapping {
        const customized = { ...mapping };

        // Customize based on component props
        if (component.props.size) {
            // Update size-related properties
            customized.variants = {
                ...customized.variants,
                size: {
                    values: ['large', 'middle', 'small'],
                    defaultValue: component.props.size as string
                }
            };
        }

        if (component.props.type) {
            // Update type-related properties
            customized.variants = {
                ...customized.variants,
                type: {
                    values: ['primary', 'default', 'dashed', 'text', 'link'],
                    defaultValue: component.props.type as string
                }
            };
        }

        return customized;
    }

    public createFigmaComponent(component: AntDesignComponent): ComponentCreationOptions {
        const mapping = this.mapAntdComponent(component);
        if (!mapping) {
            throw new Error(`Cannot create Figma component for unknown Ant Design component: ${component.type}`);
        }

        const options: ComponentCreationOptions = {
            name: component.type,
            description: `Figma component for Ant Design ${component.type}`,
            tags: ['antd', component.type.toLowerCase()],
            properties: Object.entries(mapping.properties).map(([key, prop]) => ({
                name: key,
                type: prop.type,
                defaultValue: prop.defaultValue,
                description: prop.description,
                values: prop.values,
                min: prop.min,
                max: prop.max
            })),
            variants: mapping.variants ? Object.entries(mapping.variants).map(([key, variant]) => ({
                name: key,
                properties: { [key]: variant.defaultValue },
                description: `${key} variant`
            })) : [],
            autoLayout: mapping.autoLayout,
            constraints: mapping.constraints,
            fills: this.getComponentFills(component.type),
            strokes: this.getComponentStrokes(component.type),
            cornerRadius: this.getComponentCornerRadius(component.type),
            strokeWeight: this.getComponentStrokeWeight(component.type),
            strokeAlign: 'INSIDE'
        };

        return options;
    }

    private getComponentFills(componentType: string): any[] {
        switch (componentType) {
            case 'Card':
                return [{ type: 'SOLID', color: this.designTokens.colors.background }];
            case 'Button':
                return [{ type: 'SOLID', color: this.designTokens.colors.primary }];
            case 'Input':
                return [{ type: 'SOLID', color: this.designTokens.colors.background }];
            case 'Tag':
                return [{ type: 'SOLID', color: this.designTokens.colors.primary }];
            case 'Avatar':
                return [{ type: 'SOLID', color: this.designTokens.colors.primary }];
            default:
                return [{ type: 'SOLID', color: this.designTokens.colors.background }];
        }
    }

    private getComponentStrokes(componentType: string): any[] {
        switch (componentType) {
            case 'Card':
                return [{ type: 'SOLID', color: this.designTokens.colors.border }];
            case 'Input':
                return [{ type: 'SOLID', color: this.designTokens.colors.border }];
            default:
                return [];
        }
    }

    private getComponentCornerRadius(componentType: string): number {
        switch (componentType) {
            case 'Card':
                return this.designTokens.borderRadius.md;
            case 'Button':
                return this.designTokens.borderRadius.sm;
            case 'Input':
                return this.designTokens.borderRadius.sm;
            case 'Tag':
                return this.designTokens.borderRadius.sm;
            case 'Avatar':
                return 50; // Circle
            default:
                return this.designTokens.borderRadius.sm;
        }
    }

    private getComponentStrokeWeight(componentType: string): number {
        switch (componentType) {
            case 'Card':
                return 1;
            case 'Input':
                return 1;
            default:
                return 0;
        }
    }

    public generateComponentSet(components: AntDesignComponent[]): EnhancedComponent[] {
        const figmaComponents: EnhancedComponent[] = [];

        for (const component of components) {
            try {
                const figmaComponent = this.createFigmaComponent(component);
                const enhancedComponent: EnhancedComponent = {
                    id: `component-${component.type}-${Date.now()}`,
                    name: component.type,
                    type: 'COMPONENT',
                    properties: figmaComponent.properties || [],
                    children: [],
                    figmaMapping: this.mapAntdComponent(component),
                    layout: figmaComponent.autoLayout,
                    constraints: figmaComponent.constraints,
                    variants: figmaComponent.variants,
                    documentation: {
                        description: figmaComponent.description || '',
                        usage: `Use this component to represent Ant Design ${component.type}`,
                        examples: [],
                        props: figmaComponent.properties?.map(prop => ({
                            name: prop.name,
                            type: prop.type,
                            description: prop.description || '',
                            defaultValue: prop.defaultValue,
                            required: false,
                            examples: []
                        })) || [],
                        variants: figmaComponent.variants?.map(variant => ({
                            name: variant.name,
                            description: variant.description || '',
                            properties: variant.properties,
                            usage: `Use this variant for ${variant.name} state`
                        })) || [],
                        relatedComponents: []
                    }
                };

                figmaComponents.push(enhancedComponent);
            } catch (error) {
                console.error(`Failed to create Figma component for ${component.type}:`, error);
            }
        }

        return figmaComponents;
    }

    public updateDesignTokens(tokens: FigmaDesignTokens): void {
        this.designTokens = { ...this.designTokens, ...tokens };
    }

    public getDesignTokens(): FigmaDesignTokens {
        return this.designTokens;
    }

    public getSupportedComponents(): string[] {
        return Array.from(this.componentMappings.keys());
    }

    public addCustomMapping(componentType: string, mapping: AntDesignMapping): void {
        this.componentMappings.set(componentType, mapping);
    }

    public removeMapping(componentType: string): boolean {
        return this.componentMappings.delete(componentType);
    }
}

export default AntDesignFigmaMapper;
