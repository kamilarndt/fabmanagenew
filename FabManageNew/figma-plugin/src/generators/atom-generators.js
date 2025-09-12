"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AtomGenerators = void 0;
const design_system_1 = require("../config/design-system");
// Atom Generators - Create basic UI elements in Figma
class AtomGenerators {
    // Generate Text component
    static createText(properties) {
        return __awaiter(this, void 0, void 0, function* () {
            yield figma.loadFontAsync({ family: properties.fontFamily || 'Inter', style: properties.fontWeight || 'Regular' });
            const textNode = figma.createText();
            textNode.characters = properties.text || 'Text';
            textNode.fontSize = properties.fontSize || 14;
            textNode.fontName = {
                family: properties.fontFamily || 'Inter',
                style: properties.fontWeight || 'Regular'
            };
            if (properties.textAlign) {
                textNode.textAlignHorizontal = properties.textAlign;
            }
            if (properties.lineHeight) {
                if (typeof properties.lineHeight === 'number') {
                    textNode.lineHeight = { unit: 'PIXELS', value: properties.lineHeight };
                }
                else {
                    textNode.lineHeight = properties.lineHeight;
                }
            }
            if (properties.fills && properties.fills.length > 0) {
                textNode.fills = properties.fills;
            }
            else {
                textNode.fills = [{ type: 'SOLID', color: design_system_1.FABMANAGE_DESIGN_SYSTEM.colors.text.primary }];
            }
            return textNode;
        });
    }
    // Generate Button component
    static createButton(properties) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const button = figma.createFrame();
            button.name = 'Button';
            button.resize(properties.width || 80, properties.height || 32);
            if (properties.cornerRadius) {
                button.cornerRadius = properties.cornerRadius;
            }
            if (properties.padding) {
                button.paddingTop = properties.padding.top;
                button.paddingRight = properties.padding.right;
                button.paddingBottom = properties.padding.bottom;
                button.paddingLeft = properties.padding.left;
            }
            if (properties.fills && properties.fills.length > 0) {
                button.fills = properties.fills;
            }
            else {
                button.fills = [{ type: 'SOLID', color: design_system_1.FABMANAGE_DESIGN_SYSTEM.colors.primary }];
            }
            if (properties.strokes && properties.strokes.length > 0) {
                button.strokes = properties.strokes;
            }
            if (properties.effects && properties.effects.length > 0) {
                button.effects = properties.effects;
            }
            // Add text to button
            if (properties.text) {
                const textNode = yield this.createText({
                    text: properties.text,
                    fontSize: properties.fontSize || 14,
                    fontWeight: properties.fontWeight || 'Medium',
                    fontFamily: properties.fontFamily || 'Inter',
                    textAlign: 'CENTER',
                    fills: [{ type: 'SOLID', color: (0, design_system_1.getTextColorForBackground)(((_a = button.fills[0]) === null || _a === void 0 ? void 0 : _a.color) || { r: 0, g: 0, b: 0 }) }]
                });
                // Center text in button
                textNode.x = (button.width - textNode.width) / 2;
                textNode.y = (button.height - textNode.height) / 2;
                button.appendChild(textNode);
            }
            return button;
        });
    }
    // Generate Status Badge component
    static createStatusBadge(properties) {
        return __awaiter(this, void 0, void 0, function* () {
            const badge = figma.createFrame();
            badge.name = 'Status Badge';
            badge.resize(properties.width || 80, properties.height || 24);
            badge.cornerRadius = properties.cornerRadius || 12;
            if (properties.padding) {
                badge.paddingTop = properties.padding.top;
                badge.paddingRight = properties.padding.right;
                badge.paddingBottom = properties.padding.bottom;
                badge.paddingLeft = properties.padding.left;
            }
            // Determine color based on status text
            let badgeColor = design_system_1.FABMANAGE_DESIGN_SYSTEM.colors.info;
            if (properties.text) {
                badgeColor = (0, design_system_1.getStatusColor)(properties.text);
            }
            badge.fills = [{ type: 'SOLID', color: badgeColor }];
            // Add text to badge
            if (properties.text) {
                const textNode = yield this.createText({
                    text: properties.text.toUpperCase(),
                    fontSize: properties.fontSize || 12,
                    fontWeight: properties.fontWeight || 'Medium',
                    fontFamily: properties.fontFamily || 'Inter',
                    textAlign: 'CENTER',
                    fills: [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }]
                });
                // Center text in badge
                textNode.x = (badge.width - textNode.width) / 2;
                textNode.y = (badge.height - textNode.height) / 2;
                badge.appendChild(textNode);
            }
            return badge;
        });
    }
    // Generate Progress Bar component
    static createProgressBar(properties_1) {
        return __awaiter(this, arguments, void 0, function* (properties, percentage = 0) {
            const container = figma.createFrame();
            container.name = 'Progress Bar Container';
            container.resize(properties.width || 200, properties.height || 8);
            container.cornerRadius = properties.cornerRadius || 4;
            container.fills = [{ type: 'SOLID', color: design_system_1.FABMANAGE_DESIGN_SYSTEM.colors.background.tertiary }];
            // Progress fill
            const fill = figma.createFrame();
            fill.name = 'Progress Fill';
            fill.resize((container.width * percentage) / 100, container.height);
            fill.cornerRadius = properties.cornerRadius || 4;
            fill.fills = [{
                    type: 'GRADIENT_LINEAR',
                    gradientStops: [
                        { color: { r: 0.06, g: 0.56, b: 0.91, a: 1 }, position: 0 },
                        { color: { r: 0.53, g: 0.82, b: 0.41, a: 1 }, position: 1 }
                    ],
                    gradientTransform: [
                        [1, 0, 0],
                        [0, 1, 0]
                    ]
                }];
            container.appendChild(fill);
            return container;
        });
    }
    // Generate Avatar component
    static createAvatar(properties) {
        return __awaiter(this, void 0, void 0, function* () {
            const avatar = figma.createEllipse();
            avatar.name = 'Avatar';
            avatar.resize(properties.width || 32, properties.height || 32);
            if (properties.fills && properties.fills.length > 0) {
                avatar.fills = properties.fills;
            }
            else {
                avatar.fills = [{ type: 'SOLID', color: design_system_1.FABMANAGE_DESIGN_SYSTEM.colors.background.tertiary }];
            }
            // Add user icon if specified
            if (properties.icon) {
                // For now, we'll create a simple circle as placeholder
                // In a real implementation, you'd load the actual icon
            }
            return avatar;
        });
    }
    // Generate Icon component
    static createIcon(properties) {
        return __awaiter(this, void 0, void 0, function* () {
            const icon = figma.createVector();
            icon.name = 'Icon';
            icon.resize(properties.width || 16, properties.height || 16);
            // Create a simple icon shape (placeholder)
            icon.vectorPaths = [{
                    windingRule: 'NONZERO',
                    data: 'M8 2L14 8L8 14L2 8Z' // Simple diamond shape
                }];
            if (properties.fills && properties.fills.length > 0) {
                icon.fills = properties.fills;
            }
            else {
                icon.fills = [{ type: 'SOLID', color: design_system_1.FABMANAGE_DESIGN_SYSTEM.colors.text.secondary }];
            }
            return icon;
        });
    }
    // Generate Tag component
    static createTag(properties) {
        return __awaiter(this, void 0, void 0, function* () {
            const tag = figma.createFrame();
            tag.name = 'Tag';
            tag.resize(properties.width || 60, properties.height || 24);
            tag.cornerRadius = properties.cornerRadius || 12;
            if (properties.padding) {
                tag.paddingTop = properties.padding.top;
                tag.paddingRight = properties.padding.right;
                tag.paddingBottom = properties.padding.bottom;
                tag.paddingLeft = properties.padding.left;
            }
            if (properties.fills && properties.fills.length > 0) {
                tag.fills = properties.fills;
            }
            else {
                tag.fills = [{ type: 'SOLID', color: design_system_1.FABMANAGE_DESIGN_SYSTEM.colors.primary }];
            }
            // Add text to tag
            if (properties.text) {
                const textNode = yield this.createText({
                    text: properties.text,
                    fontSize: properties.fontSize || 12,
                    fontWeight: properties.fontWeight || 'Medium',
                    fontFamily: properties.fontFamily || 'Inter',
                    textAlign: 'CENTER',
                    fills: [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }]
                });
                // Center text in tag
                textNode.x = (tag.width - textNode.width) / 2;
                textNode.y = (tag.height - textNode.height) / 2;
                tag.appendChild(textNode);
            }
            return tag;
        });
    }
    // Generate Space component
    static createSpace(properties) {
        const space = figma.createFrame();
        space.name = 'Space';
        space.resize(properties.width || 16, properties.height || 16);
        space.fills = []; // Transparent
        return space;
    }
    // Generate all atom variants for a component
    static generateAtomVariants(component) {
        return __awaiter(this, void 0, void 0, function* () {
            const variants = [];
            if (!component.variants)
                return variants;
            for (const variant of component.variants) {
                const mergedProperties = Object.assign(Object.assign({}, component.properties), variant.properties);
                let variantNode;
                switch (component.id) {
                    case 'text-title':
                    case 'text-body':
                        const textNode = yield this.createText(mergedProperties);
                        variantNode = figma.createFrame();
                        variantNode.name = `${component.name} - ${variant.name}`;
                        variantNode.resize(textNode.width, textNode.height);
                        variantNode.fills = [];
                        variantNode.appendChild(textNode);
                        break;
                    case 'button-primary':
                        variantNode = yield this.createButton(mergedProperties);
                        variantNode.name = `${component.name} - ${variant.name}`;
                        break;
                    case 'badge-status':
                        variantNode = yield this.createStatusBadge(mergedProperties);
                        variantNode.name = `${component.name} - ${variant.name}`;
                        break;
                    case 'progress-bar':
                        variantNode = yield this.createProgressBar(mergedProperties, 50);
                        variantNode.name = `${component.name} - ${variant.name}`;
                        break;
                    case 'avatar':
                        const avatarNode = yield this.createAvatar(mergedProperties);
                        variantNode = figma.createFrame();
                        variantNode.name = `${component.name} - ${variant.name}`;
                        variantNode.resize(avatarNode.width, avatarNode.height);
                        variantNode.fills = [];
                        variantNode.appendChild(avatarNode);
                        break;
                    case 'icon':
                        const iconNode = yield this.createIcon(mergedProperties);
                        variantNode = figma.createFrame();
                        variantNode.name = `${component.name} - ${variant.name}`;
                        variantNode.resize(iconNode.width, iconNode.height);
                        variantNode.fills = [];
                        variantNode.appendChild(iconNode);
                        break;
                    case 'tag':
                        variantNode = yield this.createTag(mergedProperties);
                        variantNode.name = `${component.name} - ${variant.name}`;
                        break;
                    case 'space':
                        variantNode = this.createSpace(mergedProperties);
                        variantNode.name = `${component.name} - ${variant.name}`;
                        break;
                    default:
                        continue;
                }
                variants.push(variantNode);
            }
            return variants;
        });
    }
}
exports.AtomGenerators = AtomGenerators;
