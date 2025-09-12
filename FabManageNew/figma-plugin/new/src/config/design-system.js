"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PROJECT_TYPE_COLORS = exports.STATUS_COLORS = exports.FABMANAGE_DESIGN_SYSTEM = void 0;
exports.getStatusColor = getStatusColor;
exports.getProjectTypeColor = getProjectTypeColor;
exports.getTextColorForBackground = getTextColorForBackground;
// FabManage Design System Configuration
exports.FABMANAGE_DESIGN_SYSTEM = {
    colors: {
        primary: { r: 0.2, g: 0.6, b: 1 }, // #3399ff
        secondary: { r: 0.6, g: 0.6, b: 0.6 }, // #999999
        success: { r: 0.2, g: 0.8, b: 0.3 }, // #33cc4d
        warning: { r: 1, g: 0.7, b: 0.2 }, // #ffb333
        error: { r: 0.9, g: 0.2, b: 0.2 }, // #e63333
        info: { r: 0.2, g: 0.6, b: 1 }, // #3399ff
        text: {
            primary: { r: 0.1, g: 0.1, b: 0.1 }, // #1a1a1a
            secondary: { r: 0.4, g: 0.4, b: 0.4 }, // #666666
            disabled: { r: 0.6, g: 0.6, b: 0.6 } // #999999
        },
        background: {
            primary: { r: 1, g: 1, b: 1 }, // #ffffff
            secondary: { r: 0.98, g: 0.98, b: 0.98 }, // #fafafa
            tertiary: { r: 0.95, g: 0.95, b: 0.95 } // #f2f2f2
        },
        border: {
            primary: { r: 0.9, g: 0.9, b: 0.9 }, // #e6e6e6
            secondary: { r: 0.8, g: 0.8, b: 0.8 } // #cccccc
        }
    },
    typography: {
        fontFamily: 'Inter',
        sizes: {
            xs: 10,
            sm: 12,
            base: 14,
            lg: 16,
            xl: 18,
            '2xl': 24,
            '3xl': 28,
            '4xl': 36
        },
        weights: {
            regular: 'Regular',
            medium: 'Medium',
            bold: 'Bold'
        },
        lineHeights: {
            xs: 14,
            sm: 16,
            base: 20,
            lg: 24,
            xl: 28,
            '2xl': 32,
            '3xl': 36,
            '4xl': 44
        }
    },
    spacing: {
        xs: 4,
        sm: 8,
        md: 12,
        lg: 16,
        xl: 24,
        xxl: 32
    },
    effects: {
        shadows: {
            sm: {
                type: 'DROP_SHADOW',
                visible: true,
                color: { r: 0, g: 0, b: 0, a: 0.1 },
                offset: { x: 0, y: 1 },
                radius: 2,
                spread: 0,
                blendMode: 'NORMAL'
            },
            md: {
                type: 'DROP_SHADOW',
                visible: true,
                color: { r: 0, g: 0, b: 0, a: 0.1 },
                offset: { x: 0, y: 2 },
                radius: 4,
                spread: 0,
                blendMode: 'NORMAL'
            },
            lg: {
                type: 'DROP_SHADOW',
                visible: true,
                color: { r: 0, g: 0, b: 0, a: 0.1 },
                offset: { x: 0, y: 4 },
                radius: 8,
                spread: 0,
                blendMode: 'NORMAL'
            },
            xl: {
                type: 'DROP_SHADOW',
                visible: true,
                color: { r: 0, g: 0, b: 0, a: 0.15 },
                offset: { x: 0, y: 8 },
                radius: 16,
                spread: 0,
                blendMode: 'NORMAL'
            }
        },
        borderRadius: {
            sm: 4,
            md: 8,
            lg: 12,
            xl: 16
        }
    }
};
// Status colors mapping
exports.STATUS_COLORS = {
    'nowy': exports.FABMANAGE_DESIGN_SYSTEM.colors.info,
    'projektowanie': exports.FABMANAGE_DESIGN_SYSTEM.colors.warning,
    'cnc': exports.FABMANAGE_DESIGN_SYSTEM.colors.primary,
    'montaz': exports.FABMANAGE_DESIGN_SYSTEM.colors.success,
    'W KOLEJCE': exports.FABMANAGE_DESIGN_SYSTEM.colors.info,
    'Projektowanie': exports.FABMANAGE_DESIGN_SYSTEM.colors.warning,
    'W trakcie projektowania': exports.FABMANAGE_DESIGN_SYSTEM.colors.warning,
    'Do akceptacji': exports.FABMANAGE_DESIGN_SYSTEM.colors.warning,
    'Wymagają poprawek': exports.FABMANAGE_DESIGN_SYSTEM.colors.error,
    'W TRAKCIE CIĘCIA': exports.FABMANAGE_DESIGN_SYSTEM.colors.primary,
    'WYCIĘTE': exports.FABMANAGE_DESIGN_SYSTEM.colors.primary,
    'Gotowy do montażu': exports.FABMANAGE_DESIGN_SYSTEM.colors.success,
    'Zaakceptowane': exports.FABMANAGE_DESIGN_SYSTEM.colors.success
};
// Project type colors
exports.PROJECT_TYPE_COLORS = {
    'Targi': { r: 0.2, g: 0.6, b: 1 }, // blue
    'Scenografia TV': { r: 0.6, g: 0.2, b: 0.8 }, // purple
    'Muzeum': { r: 0.2, g: 0.8, b: 0.3 }, // green
    'Wystawa': { r: 1, g: 0.6, b: 0.2 }, // orange
    'Event': { r: 0.9, g: 0.2, b: 0.2 }, // red
    'Inne': { r: 0.6, g: 0.6, b: 0.6 } // default
};
// Helper functions
function getStatusColor(status) {
    return exports.STATUS_COLORS[status] || exports.FABMANAGE_DESIGN_SYSTEM.colors.info;
}
function getProjectTypeColor(typ) {
    return exports.PROJECT_TYPE_COLORS[typ] || exports.PROJECT_TYPE_COLORS['Inne'];
}
function getTextColorForBackground(backgroundColor) {
    // Calculate luminance
    const luminance = 0.299 * backgroundColor.r + 0.587 * backgroundColor.g + 0.114 * backgroundColor.b;
    return luminance > 0.5 ? exports.FABMANAGE_DESIGN_SYSTEM.colors.text.primary : exports.FABMANAGE_DESIGN_SYSTEM.colors.background.primary;
}
