import type { ThemeConfig } from 'antd'

/**
 * FabrykaManage Dark Mode Tech Theme for Ant Design
 * Synchronized with design-system.css variables
 */

export const darkTechTheme: ThemeConfig = {
    token: {
        // === COLORS ===

        // Primary colors (Green accent)
        colorPrimary: '#16A34A',
        colorPrimaryHover: '#22C55E',
        colorPrimaryActive: '#15803D',
        colorPrimaryBg: 'rgba(22, 163, 74, 0.1)',
        colorPrimaryBgHover: 'rgba(22, 163, 74, 0.15)',
        colorPrimaryBorder: '#16A34A',
        colorPrimaryBorderHover: '#22C55E',

        // Background colors
        colorBgBase: '#1A1D21',           // --bg-primary
        colorBgContainer: '#2C3038',      // --bg-card
        colorBgElevated: '#25282E',       // --bg-secondary
        colorBgLayout: '#1A1D21',         // --bg-primary
        colorBgSpotlight: '#373C44',      // --bg-hover
        colorBgMask: 'rgba(26, 29, 33, 0.8)', // --bg-overlay

        // Text colors
        colorText: 'rgba(235, 241, 245, 0.96)',      // --text-primary
        colorTextSecondary: 'rgba(235, 241, 245, 0.72)', // --text-secondary
        colorTextTertiary: 'rgba(235, 241, 245, 0.52)',  // --text-muted
        colorTextQuaternary: 'rgba(235, 241, 245, 0.32)',
        colorTextPlaceholder: 'rgba(235, 241, 245, 0.52)', // --text-muted

        // Border colors
        colorBorder: 'rgba(235, 241, 245, 0.18)',    // --border-main
        colorBorderSecondary: 'rgba(235, 241, 245, 0.08)', // --border-light

        // Status colors
        colorSuccess: '#10B981',          // --accent-success
        colorWarning: '#F59E0B',          // --accent-warning
        colorError: '#EF4444',            // --accent-error
        colorInfo: '#22D3EE',             // --accent-info

        // Component specific
        colorFill: 'rgba(235, 241, 245, 0.08)',
        colorFillSecondary: 'rgba(235, 241, 245, 0.05)',
        colorFillTertiary: 'rgba(235, 241, 245, 0.03)',
        colorFillQuaternary: 'rgba(235, 241, 245, 0.02)',

        // === TYPOGRAPHY ===
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        fontSize: 16,
        fontSizeHeading1: 30,
        fontSizeHeading2: 24,
        fontSizeHeading3: 20,
        fontSizeHeading4: 18,
        fontSizeHeading5: 16,
        fontSizeLG: 18,
        fontSizeSM: 14,
        fontSizeXL: 20,

        fontWeightStrong: 600,

        lineHeight: 1.5,
        lineHeightHeading1: 1.25,
        lineHeightHeading2: 1.25,
        lineHeightHeading3: 1.25,
        lineHeightHeading4: 1.25,
        lineHeightHeading5: 1.25,

        // === LAYOUT ===

        // Border radius - Sharp edges for tech aesthetic
        borderRadius: 0,
        borderRadiusLG: 2,
        borderRadiusSM: 0,
        borderRadiusXS: 0,

        // Spacing
        padding: 16,
        paddingContentHorizontal: 24,
        paddingContentVertical: 16,
        paddingLG: 24,
        paddingSM: 12,
        paddingXL: 32,
        paddingXS: 8,
        paddingXXS: 4,

        margin: 16,
        marginLG: 24,
        marginSM: 12,
        marginXL: 32,
        marginXS: 8,
        marginXXS: 4,

        // === EFFECTS ===

        // Box shadows
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
        boxShadowSecondary: '0 1px 2px rgba(0, 0, 0, 0.05)',
        boxShadowTertiary: '0 4px 6px rgba(0, 0, 0, 0.07), 0 2px 4px rgba(0, 0, 0, 0.06)',

        // Motion
        motionDurationFast: '0.15s',
        motionDurationMid: '0.2s',
        motionDurationSlow: '0.3s',
        motionEaseInOut: 'ease-in-out',
        motionEaseOut: 'ease-out',

        // Control
        controlHeight: 40,
        controlHeightLG: 48,
        controlHeightSM: 32,
        controlHeightXS: 24,

        // Line width
        lineWidth: 1,
        lineWidthBold: 2,

        // Z-index
        zIndexBase: 0,
        zIndexPopupBase: 1000,
    },

    components: {
        // === LAYOUT COMPONENTS ===

        Layout: {
            bodyBg: '#1A1D21',
            headerBg: '#25282E',
            siderBg: '#25282E',
            triggerBg: '#373C44',
            triggerColor: 'rgba(235, 241, 245, 0.72)',
        },

        // === NAVIGATION ===

        Menu: {
            darkItemBg: 'transparent',
            darkItemColor: 'rgba(235, 241, 245, 0.72)',
            darkItemHoverBg: 'rgba(22, 163, 74, 0.1)',
            darkItemHoverColor: '#16A34A',
            darkItemSelectedBg: 'rgba(22, 163, 74, 0.15)',
            darkItemSelectedColor: '#16A34A',
            darkSubMenuItemBg: 'transparent',
            itemBorderRadius: 0,
        },

        Breadcrumb: {
            lastItemColor: 'rgba(235, 241, 245, 0.96)',
            linkColor: 'rgba(235, 241, 245, 0.72)',
            linkHoverColor: '#16A34A',
            separatorColor: 'rgba(235, 241, 245, 0.52)',
        },

        // === DATA DISPLAY ===

        Card: {
            headerBg: '#25282E',
            headerHeight: 56,
            paddingLG: 24,
            boxShadowTertiary: '0 1px 3px rgba(0, 0, 0, 0.1)',
        },

        Table: {
            headerBg: '#25282E',
            headerColor: 'rgba(235, 241, 245, 0.96)',
            rowHoverBg: '#373C44',
            borderColor: 'rgba(235, 241, 245, 0.18)',
            headerSplitColor: 'rgba(235, 241, 245, 0.18)',
        },

        Tag: {
            defaultBg: '#373C44',
            defaultColor: 'rgba(235, 241, 245, 0.72)',
            borderRadiusSM: 2,
        },

        Badge: {
            colorBgContainer: '#EF4444',
        },

        // === DATA ENTRY ===

        Input: {
            activeBg: '#2C3038',
            hoverBg: '#2C3038',
            activeBorderColor: '#16A34A',
            hoverBorderColor: 'rgba(235, 241, 245, 0.28)',
            activeShadow: '0 0 0 3px rgba(22, 163, 74, 0.3)',
        },

        Select: {
            selectorBg: '#2C3038',
            optionActiveBg: 'rgba(22, 163, 74, 0.1)',
            optionSelectedBg: 'rgba(22, 163, 74, 0.15)',
            optionSelectedColor: '#16A34A',
        },

        InputNumber: {
            activeBorderColor: '#16A34A',
            hoverBorderColor: 'rgba(235, 241, 245, 0.28)',
            activeShadow: '0 0 0 3px rgba(22, 163, 74, 0.3)',
        },

        DatePicker: {
            activeBorderColor: '#16A34A',
            hoverBorderColor: 'rgba(235, 241, 245, 0.28)',
            activeShadow: '0 0 0 3px rgba(22, 163, 74, 0.3)',
        },

        Upload: {
            actionsColor: 'rgba(235, 241, 245, 0.72)',
        },

        // === BUTTONS ===

        Button: {
            primaryShadow: 'none',
            dangerShadow: 'none',
            defaultShadow: 'none',
            fontWeight: 500,
            borderRadius: 0,
            paddingContentHorizontal: 16,

            // Default button
            defaultBg: 'transparent',
            defaultColor: 'rgba(235, 241, 245, 0.72)',
            defaultBorderColor: 'rgba(235, 241, 245, 0.18)',
            defaultHoverBg: '#373C44',
            defaultHoverColor: 'rgba(235, 241, 245, 0.96)',
            defaultHoverBorderColor: 'rgba(235, 241, 245, 0.28)',

            // Ghost button - removed invalid properties
        },

        // === FEEDBACK ===

        Progress: {
            defaultColor: '#16A34A',
            remainingColor: '#1A1D21',
        },

        Alert: {
            // Using standard colorBgContainer for background
        },

        Message: {
            contentBg: '#25282E',
            colorText: 'rgba(235, 241, 245, 0.96)',
        },

        Notification: {
            colorBgElevated: '#25282E',
            colorText: 'rgba(235, 241, 245, 0.96)',
            colorTextHeading: 'rgba(235, 241, 245, 0.96)',
        },

        // === OVERLAY ===

        Modal: {
            headerBg: '#25282E',
            contentBg: '#2C3038',
            footerBg: '#25282E',
        },

        Drawer: {
            colorBgElevated: '#25282E',
        },

        Dropdown: {
            colorBgElevated: '#25282E',
        },

        Popover: {
            colorBgElevated: '#25282E',
        },

        Tooltip: {
            colorBgSpotlight: '#25282E',
            colorTextLightSolid: 'rgba(235, 241, 245, 0.96)',
        },

        // === OTHER ===

        Segmented: {
            itemActiveBg: '#16A34A',
            itemHoverBg: 'rgba(22, 163, 74, 0.1)',
            itemSelectedBg: '#16A34A',
            itemSelectedColor: 'white',
            trackBg: '#373C44',
        },

        Checkbox: {
            colorPrimary: '#16A34A',
            colorPrimaryHover: '#22C55E',
        },

        Radio: {
            colorPrimary: '#16A34A',
            colorPrimaryHover: '#22C55E',
        },

        Switch: {
            colorPrimary: '#16A34A',
            colorPrimaryHover: '#22C55E',
        },

        Slider: {
            colorPrimaryBorderHover: '#22C55E',
            handleColor: '#16A34A',
            handleColorDisabled: 'rgba(235, 241, 245, 0.32)',
            railBg: '#373C44',
            railHoverBg: '#373C44',
            trackBg: '#16A34A',
            trackHoverBg: '#22C55E',
        },

        Rate: {
            colorFillContent: '#16A34A',
        },

        Tree: {
            directoryNodeSelectedBg: 'rgba(22, 163, 74, 0.15)',
            directoryNodeSelectedColor: '#16A34A',
            nodeHoverBg: 'rgba(22, 163, 74, 0.1)',
            nodeSelectedBg: 'rgba(22, 163, 74, 0.15)',
        },

        Collapse: {
            headerBg: '#25282E',
            contentBg: '#2C3038',
        },

        Tabs: {
            cardBg: '#2C3038',
            itemActiveColor: '#16A34A',
            itemHoverColor: '#22C55E',
            itemSelectedColor: '#16A34A',
            inkBarColor: '#16A34A',
            titleFontSize: 16,
        },

        Steps: {
            colorPrimary: '#16A34A',
            colorTextDescription: 'rgba(235, 241, 245, 0.52)',
        },
    },

    // === ALGORITHM ===
    algorithm: undefined, // Will be set in main.tsx
}
