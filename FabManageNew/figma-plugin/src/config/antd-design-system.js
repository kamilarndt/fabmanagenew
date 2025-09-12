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
exports.AntdDesignSystem = void 0;
const design_system_1 = require("./design-system");
// Ant Design Variables for Figma - dokładne odwzorowanie systemu z aplikacji
class AntdDesignSystem {
    // Tworzenie zmiennych kolorów w Figmie
    static createColorVariables() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Główna kolekcja zmiennych
                const colorCollection = figma.variables.createVariableCollection("FabManage Colors");
                const modeId = colorCollection.modes[0].modeId;
                // Kolory podstawowe
                const primaryColor = figma.variables.createVariable("primary", colorCollection, "COLOR");
                primaryColor.setValueForMode(modeId, design_system_1.FABMANAGE_DESIGN_SYSTEM.colors.primary);
                const secondaryColor = figma.variables.createVariable("secondary", colorCollection, "COLOR");
                secondaryColor.setValueForMode(modeId, design_system_1.FABMANAGE_DESIGN_SYSTEM.colors.secondary);
                // Kolory statusów (zgodne z aplikacją)
                const successColor = figma.variables.createVariable("success", colorCollection, "COLOR");
                successColor.setValueForMode(modeId, design_system_1.FABMANAGE_DESIGN_SYSTEM.colors.success);
                const warningColor = figma.variables.createVariable("warning", colorCollection, "COLOR");
                warningColor.setValueForMode(modeId, design_system_1.FABMANAGE_DESIGN_SYSTEM.colors.warning);
                const errorColor = figma.variables.createVariable("error", colorCollection, "COLOR");
                errorColor.setValueForMode(modeId, design_system_1.FABMANAGE_DESIGN_SYSTEM.colors.error);
                const infoColor = figma.variables.createVariable("info", colorCollection, "COLOR");
                infoColor.setValueForMode(modeId, design_system_1.FABMANAGE_DESIGN_SYSTEM.colors.info);
                // Kolory tekstu
                const textPrimary = figma.variables.createVariable("text-primary", colorCollection, "COLOR");
                textPrimary.setValueForMode(modeId, design_system_1.FABMANAGE_DESIGN_SYSTEM.colors.text.primary);
                const textSecondary = figma.variables.createVariable("text-secondary", colorCollection, "COLOR");
                textSecondary.setValueForMode(modeId, design_system_1.FABMANAGE_DESIGN_SYSTEM.colors.text.secondary);
                const textDisabled = figma.variables.createVariable("text-disabled", colorCollection, "COLOR");
                textDisabled.setValueForMode(modeId, design_system_1.FABMANAGE_DESIGN_SYSTEM.colors.text.disabled);
                // Kolory tła
                const backgroundPrimary = figma.variables.createVariable("background-primary", colorCollection, "COLOR");
                backgroundPrimary.setValueForMode(modeId, design_system_1.FABMANAGE_DESIGN_SYSTEM.colors.background.primary);
                const backgroundSecondary = figma.variables.createVariable("background-secondary", colorCollection, "COLOR");
                backgroundSecondary.setValueForMode(modeId, design_system_1.FABMANAGE_DESIGN_SYSTEM.colors.background.secondary);
                const backgroundTertiary = figma.variables.createVariable("background-tertiary", colorCollection, "COLOR");
                backgroundTertiary.setValueForMode(modeId, design_system_1.FABMANAGE_DESIGN_SYSTEM.colors.background.tertiary);
                // Kolory obramowań
                const borderPrimary = figma.variables.createVariable("border-primary", colorCollection, "COLOR");
                borderPrimary.setValueForMode(modeId, design_system_1.FABMANAGE_DESIGN_SYSTEM.colors.border.primary);
                const borderSecondary = figma.variables.createVariable("border-secondary", colorCollection, "COLOR");
                borderSecondary.setValueForMode(modeId, design_system_1.FABMANAGE_DESIGN_SYSTEM.colors.border.secondary);
                // Kolory statusów projektów (zgodne z getProjectTypeColor)
                const projectTypeTargi = figma.variables.createVariable("project-type-targi", colorCollection, "COLOR");
                projectTypeTargi.setValueForMode(modeId, { r: 0.2, g: 0.6, b: 1 });
                const projectTypeScenografia = figma.variables.createVariable("project-type-scenografia", colorCollection, "COLOR");
                projectTypeScenografia.setValueForMode(modeId, { r: 0.6, g: 0.2, b: 0.8 });
                const projectTypeMuzeum = figma.variables.createVariable("project-type-muzeum", colorCollection, "COLOR");
                projectTypeMuzeum.setValueForMode(modeId, { r: 0.2, g: 0.8, b: 0.3 });
                const projectTypeWystawa = figma.variables.createVariable("project-type-wystawa", colorCollection, "COLOR");
                projectTypeWystawa.setValueForMode(modeId, { r: 1, g: 0.6, b: 0.2 });
                const projectTypeEvent = figma.variables.createVariable("project-type-event", colorCollection, "COLOR");
                projectTypeEvent.setValueForMode(modeId, { r: 0.9, g: 0.2, b: 0.2 });
                const projectTypeInne = figma.variables.createVariable("project-type-inne", colorCollection, "COLOR");
                projectTypeInne.setValueForMode(modeId, { r: 0.6, g: 0.6, b: 0.6 });
                console.log('Color variables created successfully');
            }
            catch (error) {
                console.error('Error creating color variables:', error);
            }
        });
    }
    // Tworzenie zmiennych typografii
    static createTypographyVariables() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const typographyCollection = figma.variables.createVariableCollection("FabManage Typography");
                const modeId = typographyCollection.modes[0].modeId;
                // Rozmiary czcionek
                const fontSizeXs = figma.variables.createVariable("font-size-xs", typographyCollection, "FLOAT");
                fontSizeXs.setValueForMode(modeId, design_system_1.FABMANAGE_DESIGN_SYSTEM.typography.sizes.xs);
                const fontSizeSm = figma.variables.createVariable("font-size-sm", typographyCollection, "FLOAT");
                fontSizeSm.setValueForMode(modeId, design_system_1.FABMANAGE_DESIGN_SYSTEM.typography.sizes.sm);
                const fontSizeBase = figma.variables.createVariable("font-size-base", typographyCollection, "FLOAT");
                fontSizeBase.setValueForMode(modeId, design_system_1.FABMANAGE_DESIGN_SYSTEM.typography.sizes.base);
                const fontSizeLg = figma.variables.createVariable("font-size-lg", typographyCollection, "FLOAT");
                fontSizeLg.setValueForMode(modeId, design_system_1.FABMANAGE_DESIGN_SYSTEM.typography.sizes.lg);
                const fontSizeXl = figma.variables.createVariable("font-size-xl", typographyCollection, "FLOAT");
                fontSizeXl.setValueForMode(modeId, design_system_1.FABMANAGE_DESIGN_SYSTEM.typography.sizes.xl);
                const fontSize2xl = figma.variables.createVariable("font-size-2xl", typographyCollection, "FLOAT");
                fontSize2xl.setValueForMode(modeId, design_system_1.FABMANAGE_DESIGN_SYSTEM.typography.sizes['2xl']);
                const fontSize3xl = figma.variables.createVariable("font-size-3xl", typographyCollection, "FLOAT");
                fontSize3xl.setValueForMode(modeId, design_system_1.FABMANAGE_DESIGN_SYSTEM.typography.sizes['3xl']);
                const fontSize4xl = figma.variables.createVariable("font-size-4xl", typographyCollection, "FLOAT");
                fontSize4xl.setValueForMode(modeId, design_system_1.FABMANAGE_DESIGN_SYSTEM.typography.sizes['4xl']);
                // Wysokości linii
                const lineHeightXs = figma.variables.createVariable("line-height-xs", typographyCollection, "FLOAT");
                lineHeightXs.setValueForMode(modeId, design_system_1.FABMANAGE_DESIGN_SYSTEM.typography.lineHeights.xs);
                const lineHeightSm = figma.variables.createVariable("line-height-sm", typographyCollection, "FLOAT");
                lineHeightSm.setValueForMode(modeId, design_system_1.FABMANAGE_DESIGN_SYSTEM.typography.lineHeights.sm);
                const lineHeightBase = figma.variables.createVariable("line-height-base", typographyCollection, "FLOAT");
                lineHeightBase.setValueForMode(modeId, design_system_1.FABMANAGE_DESIGN_SYSTEM.typography.lineHeights.base);
                const lineHeightLg = figma.variables.createVariable("line-height-lg", typographyCollection, "FLOAT");
                lineHeightLg.setValueForMode(modeId, design_system_1.FABMANAGE_DESIGN_SYSTEM.typography.lineHeights.lg);
                const lineHeightXl = figma.variables.createVariable("line-height-xl", typographyCollection, "FLOAT");
                lineHeightXl.setValueForMode(modeId, design_system_1.FABMANAGE_DESIGN_SYSTEM.typography.lineHeights.xl);
                const lineHeight2xl = figma.variables.createVariable("line-height-2xl", typographyCollection, "FLOAT");
                lineHeight2xl.setValueForMode(modeId, design_system_1.FABMANAGE_DESIGN_SYSTEM.typography.lineHeights['2xl']);
                const lineHeight3xl = figma.variables.createVariable("line-height-3xl", typographyCollection, "FLOAT");
                lineHeight3xl.setValueForMode(modeId, design_system_1.FABMANAGE_DESIGN_SYSTEM.typography.lineHeights['3xl']);
                const lineHeight4xl = figma.variables.createVariable("line-height-4xl", typographyCollection, "FLOAT");
                lineHeight4xl.setValueForMode(modeId, design_system_1.FABMANAGE_DESIGN_SYSTEM.typography.lineHeights['4xl']);
                console.log('Typography variables created successfully');
            }
            catch (error) {
                console.error('Error creating typography variables:', error);
            }
        });
    }
    // Tworzenie zmiennych spacing
    static createSpacingVariables() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const spacingCollection = figma.variables.createVariableCollection("FabManage Spacing");
                const modeId = spacingCollection.modes[0].modeId;
                const spacingXs = figma.variables.createVariable("spacing-xs", spacingCollection, "FLOAT");
                spacingXs.setValueForMode(modeId, design_system_1.FABMANAGE_DESIGN_SYSTEM.spacing.xs);
                const spacingSm = figma.variables.createVariable("spacing-sm", spacingCollection, "FLOAT");
                spacingSm.setValueForMode(modeId, design_system_1.FABMANAGE_DESIGN_SYSTEM.spacing.sm);
                const spacingMd = figma.variables.createVariable("spacing-md", spacingCollection, "FLOAT");
                spacingMd.setValueForMode(modeId, design_system_1.FABMANAGE_DESIGN_SYSTEM.spacing.md);
                const spacingLg = figma.variables.createVariable("spacing-lg", spacingCollection, "FLOAT");
                spacingLg.setValueForMode(modeId, design_system_1.FABMANAGE_DESIGN_SYSTEM.spacing.lg);
                const spacingXl = figma.variables.createVariable("spacing-xl", spacingCollection, "FLOAT");
                spacingXl.setValueForMode(modeId, design_system_1.FABMANAGE_DESIGN_SYSTEM.spacing.xl);
                const spacingXxl = figma.variables.createVariable("spacing-xxl", spacingCollection, "FLOAT");
                spacingXxl.setValueForMode(modeId, design_system_1.FABMANAGE_DESIGN_SYSTEM.spacing.xxl);
                console.log('Spacing variables created successfully');
            }
            catch (error) {
                console.error('Error creating spacing variables:', error);
            }
        });
    }
    // Tworzenie zmiennych border radius
    static createBorderRadiusVariables() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const borderRadiusCollection = figma.variables.createVariableCollection("FabManage Border Radius");
                const modeId = borderRadiusCollection.modes[0].modeId;
                const borderRadiusSm = figma.variables.createVariable("border-radius-sm", borderRadiusCollection, "FLOAT");
                borderRadiusSm.setValueForMode(modeId, design_system_1.FABMANAGE_DESIGN_SYSTEM.effects.borderRadius.sm);
                const borderRadiusMd = figma.variables.createVariable("border-radius-md", borderRadiusCollection, "FLOAT");
                borderRadiusMd.setValueForMode(modeId, design_system_1.FABMANAGE_DESIGN_SYSTEM.effects.borderRadius.md);
                const borderRadiusLg = figma.variables.createVariable("border-radius-lg", borderRadiusCollection, "FLOAT");
                borderRadiusLg.setValueForMode(modeId, design_system_1.FABMANAGE_DESIGN_SYSTEM.effects.borderRadius.lg);
                const borderRadiusXl = figma.variables.createVariable("border-radius-xl", borderRadiusCollection, "FLOAT");
                borderRadiusXl.setValueForMode(modeId, design_system_1.FABMANAGE_DESIGN_SYSTEM.effects.borderRadius.xl);
                console.log('Border radius variables created successfully');
            }
            catch (error) {
                console.error('Error creating border radius variables:', error);
            }
        });
    }
    // Tworzenie wszystkich zmiennych design systemu
    static createAllVariables() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.createColorVariables();
            yield this.createTypographyVariables();
            yield this.createSpacingVariables();
            yield this.createBorderRadiusVariables();
        });
    }
    // Pobieranie zmiennych z Figmy
    static getVariableByName(name) {
        const collections = figma.variables.getLocalVariableCollections();
        for (const collection of collections) {
            const variables = collection.variableIds.map(id => figma.variables.getVariableById(id));
            const variable = variables.find(v => (v === null || v === void 0 ? void 0 : v.name) === name);
            if (variable)
                return variable;
        }
        return null;
    }
    // Pobieranie wartości zmiennej
    static getVariableValue(name) {
        const variable = this.getVariableByName(name);
        if (!variable)
            return null;
        const collection = variable.variableCollectionId ?
            figma.variables.getVariableCollectionById(variable.variableCollectionId) :
            null;
        const modeId = collection ? collection.modes[0].modeId : null;
        if (!modeId)
            return null;
        return variable.valuesByMode[modeId];
    }
    // Tworzenie stylu wypełnienia z zmiennej
    static createFillFromVariable(variableName) {
        const color = this.getVariableValue(variableName);
        if (!color) {
            console.warn(`Variable ${variableName} not found, using fallback color`);
            return { type: 'SOLID', color: { r: 0, g: 0, b: 0 } };
        }
        return { type: 'SOLID', color: color };
    }
    // Tworzenie stylu obramowania z zmiennej
    static createStrokeFromVariable(variableName, weight = 1) {
        const color = this.getVariableValue(variableName);
        if (!color) {
            console.warn(`Variable ${variableName} not found, using fallback color`);
            return { type: 'SOLID', color: { r: 0, g: 0, b: 0 } };
        }
        return { type: 'SOLID', color: color };
    }
    // Pobieranie rozmiaru czcionki z zmiennej
    static getFontSizeFromVariable(variableName) {
        const size = this.getVariableValue(variableName);
        return size || 14;
    }
    // Pobieranie spacing z zmiennej
    static getSpacingFromVariable(variableName) {
        const spacing = this.getVariableValue(variableName);
        return spacing || 8;
    }
    // Pobieranie border radius z zmiennej
    static getBorderRadiusFromVariable(variableName) {
        const radius = this.getVariableValue(variableName);
        return radius || 4;
    }
}
exports.AntdDesignSystem = AntdDesignSystem;
