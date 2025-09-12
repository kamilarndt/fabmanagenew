// FabManage Design System Plugin - Figma Compatible Version
console.log('FabManage Design System Plugin started!');

// Design System Configuration - Based on design-system.css
const FABMANAGE_DESIGN_SYSTEM = {
    colors: {
        // Backgrounds
        bgPrimary: { r: 0.102, g: 0.114, b: 0.129 }, // #1A1D21
        bgSecondary: { r: 0.145, g: 0.157, b: 0.180 }, // #25282E
        bgCard: { r: 0.173, g: 0.188, b: 0.220 }, // #2C3038
        bgHover: { r: 0.216, g: 0.235, b: 0.267 }, // #373C44
        bgInput: { r: 0.173, g: 0.188, b: 0.220 }, // #2C3038

        // Text Colors
        textPrimary: { r: 0.922, g: 0.945, b: 0.961 }, // rgba(235, 241, 245, 0.96)
        textSecondary: { r: 0.922, g: 0.945, b: 0.961 }, // rgba(235, 241, 245, 0.72)
        textMuted: { r: 0.922, g: 0.945, b: 0.961 }, // rgba(235, 241, 245, 0.52)
        textInverse: { r: 0.102, g: 0.114, b: 0.129 }, // #1A1D21

        // Primary Accent (Green)
        primaryMain: { r: 0.086, g: 0.639, b: 0.290 }, // #16A34A
        primaryLight: { r: 0.133, g: 0.773, b: 0.369 }, // #22C55E
        primaryDark: { r: 0.082, g: 0.502, b: 0.239 }, // #15803D

        // Semantic Colors
        accentWarning: { r: 0.961, g: 0.620, b: 0.043 }, // #F59E0B
        accentError: { r: 0.937, g: 0.267, b: 0.267 }, // #EF4444
        accentInfo: { r: 0.133, g: 0.827, b: 0.933 }, // #22D3EE
        accentSuccess: { r: 0.063, g: 0.725, b: 0.506 }, // #10B981

        // Status Colors
        statusCritical: { r: 0.937, g: 0.267, b: 0.267 }, // #EF4444
        statusLow: { r: 0.961, g: 0.620, b: 0.043 }, // #F59E0B
        statusNormal: { r: 0.063, g: 0.725, b: 0.506 }, // #10B981
        statusExcess: { r: 0.133, g: 0.827, b: 0.933 }, // #22D3EE

        // Borders
        borderMain: { r: 0.922, g: 0.945, b: 0.961 }, // rgba(235, 241, 245, 0.18)
        borderLight: { r: 0.922, g: 0.945, b: 0.961 }, // rgba(235, 241, 245, 0.08)
        borderHeavy: { r: 0.922, g: 0.945, b: 0.961 } // rgba(235, 241, 245, 0.28)
    },
    typography: {
        fontFamily: 'Inter',
        sizes: {
            xs: 12, // 0.75rem
            sm: 14, // 0.875rem
            base: 16, // 1rem
            lg: 18, // 1.125rem
            xl: 20, // 1.25rem
            '2xl': 24, // 1.5rem
            '3xl': 30 // 1.875rem
        },
        weights: {
            regular: 400,
            medium: 500,
            semibold: 600,
            bold: 700
        },
        lineHeights: {
            tight: 1.25,
            normal: 1.5,
            relaxed: 1.625
        }
    },
    spacing: {
        1: 4, // 0.25rem
        2: 8, // 0.5rem
        3: 12, // 0.75rem
        4: 16, // 1rem
        5: 20, // 1.25rem
        6: 24, // 1.5rem
        8: 32, // 2rem
        10: 40, // 2.5rem
        12: 48, // 3rem
        16: 64 // 4rem
    },
    radius: {
        none: 0,
        sm: 2,
        base: 4
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
            }
        }
    }
};

// Utility Functions
function createColor(color) {
    return { type: 'SOLID', color: color };
}

function createGradient(colors, type = 'LINEAR') {
    return {
        type: type,
        gradientStops: colors.map((color, index) => ({
            position: index / (colors.length - 1),
            color: { r: color.r, g: color.g, b: color.b }
        }))
    };
}

async function createText(text, fontSize = 16, fontWeight = 400, color = FABMANAGE_DESIGN_SYSTEM.colors.textPrimary) {
    const textNode = figma.createText();

    // Try to load Inter font, fallback to system font if not available
    try {
        await figma.loadFontAsync({ family: "Inter", style: 'Regular' });
        textNode.fontName = { family: "Inter", style: 'Regular' };
    } catch (error) {
        console.warn('Inter font not available, using fallback font');
        try {
            // Try Roboto as fallback
            await figma.loadFontAsync({ family: "Roboto", style: 'Regular' });
            textNode.fontName = { family: "Roboto", style: 'Regular' };
        } catch (error2) {
            // Use Figma's default font
            textNode.fontName = { family: "Helvetica", style: 'Regular' };
        }
    }

    textNode.characters = text;
    textNode.fontSize = fontSize;
    textNode.fills = [createColor(color)];
    textNode.textAutoResize = 'WIDTH_AND_HEIGHT';
    return textNode;
}

async function createButton(text, type = 'primary', width = 120, height = 40) {
    const button = figma.createFrame();
    button.name = `Button/${type}`;
    button.resize(width, height);
    button.cornerRadius = 6;
    button.layoutMode = 'HORIZONTAL';
    button.primaryAxisAlignItems = 'CENTER';
    button.counterAxisAlignItems = 'CENTER';
    button.paddingLeft = 16;
    button.paddingRight = 16;
    button.paddingTop = 8;
    button.paddingBottom = 8;
    button.itemSpacing = 8;

    // Set button colors based on type
    switch (type) {
        case 'primary':
            button.fills = [createColor(FABMANAGE_DESIGN_SYSTEM.colors.primaryMain)];
            break;
        case 'secondary':
            button.fills = [createColor(FABMANAGE_DESIGN_SYSTEM.colors.bgCard)];
            button.strokes = [createColor(FABMANAGE_DESIGN_SYSTEM.colors.borderMain)];
            button.strokeWeight = 1;
            break;
        case 'dashed':
            button.fills = [createColor(FABMANAGE_DESIGN_SYSTEM.colors.bgCard)];
            button.strokes = [createColor(FABMANAGE_DESIGN_SYSTEM.colors.borderMain)];
            button.strokeWeight = 1;
            button.dashPattern = [4, 4];
            break;
    }

    // Add text
    const textColor = type === 'primary' ? FABMANAGE_DESIGN_SYSTEM.colors.textInverse : FABMANAGE_DESIGN_SYSTEM.colors.textPrimary;
    const buttonText = await createText(text, 14, 500, textColor);
    button.appendChild(buttonText);

    // Skip effects for now to avoid validation errors
    // button.effects = [FABMANAGE_DESIGN_SYSTEM.effects.shadows.sm];

    return button;
}

async function createCard(title, content, width = 300, height = 200) {
    const card = figma.createFrame();
    card.name = 'Card';
    card.resize(width, height);
    card.cornerRadius = 8;
    card.fills = [createColor(FABMANAGE_DESIGN_SYSTEM.colors.bgCard)];
    card.strokes = [createColor(FABMANAGE_DESIGN_SYSTEM.colors.borderMain)];
    card.strokeWeight = 1;
    card.layoutMode = 'VERTICAL';
    card.paddingLeft = 16;
    card.paddingRight = 16;
    card.paddingTop = 16;
    card.paddingBottom = 16;
    card.itemSpacing = 12;
    // Skip effects for now to avoid validation errors
    // card.effects = [FABMANAGE_DESIGN_SYSTEM.effects.shadows.md];

    // Add title
    const titleText = await createText(title, 18, 600, FABMANAGE_DESIGN_SYSTEM.colors.textPrimary);
    card.appendChild(titleText);

    // Add content
    const contentText = await createText(content, 14, 400, FABMANAGE_DESIGN_SYSTEM.colors.textSecondary);
    card.appendChild(contentText);

    return card;
}

function createProgressBar(progress = 0.5, width = 200, height = 8) {
    const container = figma.createFrame();
    container.name = 'ProgressBar';
    container.resize(width, height);
    container.cornerRadius = 4;
    container.fills = [createColor(FABMANAGE_DESIGN_SYSTEM.colors.bgPrimary)];
    container.layoutMode = 'HORIZONTAL';

    const progressBar = figma.createFrame();
    progressBar.resize(width * progress, height);
    progressBar.cornerRadius = 4;
    progressBar.fills = [createColor(FABMANAGE_DESIGN_SYSTEM.colors.primaryMain)];
    container.appendChild(progressBar);

    return container;
}

async function createBadge(text, type = 'default') {
    const badge = figma.createFrame();
    badge.name = `Badge/${type}`;
    badge.layoutMode = 'HORIZONTAL';
    badge.primaryAxisAlignItems = 'CENTER';
    badge.counterAxisAlignItems = 'CENTER';
    badge.paddingLeft = 8;
    badge.paddingRight = 8;
    badge.paddingTop = 4;
    badge.paddingBottom = 4;
    badge.cornerRadius = 12;
    badge.itemSpacing = 4;

    // Set badge colors based on type
    switch (type) {
        case 'success':
            badge.fills = [createColor(FABMANAGE_DESIGN_SYSTEM.colors.accentSuccess)];
            break;
        case 'warning':
            badge.fills = [createColor(FABMANAGE_DESIGN_SYSTEM.colors.accentWarning)];
            break;
        case 'error':
            badge.fills = [createColor(FABMANAGE_DESIGN_SYSTEM.colors.accentError)];
            break;
        default:
            badge.fills = [createColor(FABMANAGE_DESIGN_SYSTEM.colors.bgCard)];
            badge.strokes = [createColor(FABMANAGE_DESIGN_SYSTEM.colors.borderMain)];
            badge.strokeWeight = 1;
    }

    const badgeText = await createText(text, 12, 500, FABMANAGE_DESIGN_SYSTEM.colors.textInverse);
    badge.appendChild(badgeText);

    return badge;
}

async function createProjectCard(projectData) {
    const card = figma.createFrame();
    card.name = `ProjectCard/${projectData.name}`;
    card.resize(320, 200);
    card.cornerRadius = 12;
    card.fills = [createColor(FABMANAGE_DESIGN_SYSTEM.colors.bgCard)];
    card.strokes = [createColor(FABMANAGE_DESIGN_SYSTEM.colors.borderMain)];
    card.strokeWeight = 1;
    card.layoutMode = 'VERTICAL';
    card.paddingLeft = 20;
    card.paddingRight = 20;
    card.paddingTop = 20;
    card.paddingBottom = 20;
    card.itemSpacing = 16;
    // Skip effects for now to avoid validation errors
    // card.effects = [FABMANAGE_DESIGN_SYSTEM.effects.shadows.lg];

    // Header
    const header = figma.createFrame();
    header.name = 'Header';
    header.layoutMode = 'HORIZONTAL';
    header.primaryAxisAlignItems = 'SPACE_BETWEEN';
    header.counterAxisAlignItems = 'CENTER';
    header.resize(280, 24);
    header.itemSpacing = 12;

    // Project name
    const projectName = await createText(projectData.name, 18, 600, FABMANAGE_DESIGN_SYSTEM.colors.textPrimary);
    header.appendChild(projectName);

    // Status badge
    const statusBadge = await createBadge(projectData.status, 'success');
    header.appendChild(statusBadge);

    card.appendChild(header);

    // Progress section
    const progressSection = figma.createFrame();
    progressSection.name = 'Progress';
    progressSection.layoutMode = 'VERTICAL';
    progressSection.resize(280, 40);
    progressSection.itemSpacing = 8;

    const progressLabel = await createText(`Postęp: ${Math.round(projectData.progress * 100)}%`, 14, 400, FABMANAGE_DESIGN_SYSTEM.colors.textSecondary);
    progressSection.appendChild(progressLabel);

    const progressBar = createProgressBar(projectData.progress, 280, 8);
    progressSection.appendChild(progressBar);

    card.appendChild(progressSection);

    // Footer
    const footer = figma.createFrame();
    footer.name = 'Footer';
    footer.layoutMode = 'HORIZONTAL';
    footer.primaryAxisAlignItems = 'SPACE_BETWEEN';
    footer.counterAxisAlignItems = 'CENTER';
    footer.resize(280, 24);
    footer.itemSpacing = 12;

    // Project number
    const projectNumber = await createText(`#${projectData.numer}`, 14, 400, FABMANAGE_DESIGN_SYSTEM.colors.textSecondary);
    footer.appendChild(projectNumber);

    // Actions
    const actions = figma.createFrame();
    actions.name = 'Actions';
    actions.layoutMode = 'HORIZONTAL';
    actions.itemSpacing = 8;

    const editButton = await createButton('Edytuj', 'secondary', 60, 28);
    actions.appendChild(editButton);

    const viewButton = await createButton('Zobacz', 'primary', 60, 28);
    actions.appendChild(viewButton);

    footer.appendChild(actions);
    card.appendChild(footer);

    return card;
}

// Main plugin code
figma.showUI(__html__, {
    width: 800,
    height: 600,
    title: 'FabManage Design System Generator'
});

// Handle messages from UI
figma.ui.onmessage = async (msg) => {
    try {
        switch (msg.type) {
            case 'generate-project-card':
                await handleGenerateProjectCard(msg.data);
                break;
            case 'generate-project-elements':
                await handleGenerateProjectElements(msg.data);
                break;
            case 'generate-design-system':
                await handleGenerateDesignSystem();
                break;
            case 'analyze-components':
                await handleAnalyzeComponents();
                break;
            case 'scan-folder':
                await handleScanFolder(msg.folderPath);
                break;
            case 'generate-selected-components':
                await handleGenerateSelectedComponents(msg.components);
                break;
            case 'browse-folder':
                await handleBrowseFolder();
                break;
            case 'scan-design-system':
                await handleScanDesignSystem(msg.folderPath);
                break;
            case 'scan-project-components':
                await handleScanProjectComponents(msg.folderPath);
                break;
            case 'analyze-atoms':
                await handleAnalyzeAtoms(msg.component);
                break;
            case 'generate-component':
                await handleGenerateComponent(msg.component, msg.designSystem);
                break;
            default:
                console.log('Unknown message type:', msg.type);
        }
    } catch (error) {
        console.error('Plugin error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        figma.notify('Błąd: ' + errorMessage, { error: true });
        figma.ui.postMessage({
            type: 'generation-error',
            error: errorMessage
        });
    }
};

async function handleGenerateProjectCard(data) {
    try {
        const projectData = data || {
            name: 'Przykładowy Projekt',
            numer: 'PRJ-001',
            status: 'nowy',
            progress: 0.65,
            description: 'Opis przykładowego projektu'
        };

        const projectCard = await createProjectCard(projectData);

        // Position the card
        projectCard.x = figma.viewport.center.x - projectCard.width / 2;
        projectCard.y = figma.viewport.center.y - projectCard.height / 2;

        figma.currentPage.appendChild(projectCard);
        figma.currentPage.selection = [projectCard];
        figma.viewport.scrollAndZoomIntoView([projectCard]);

        figma.notify('ProjectCard wygenerowany pomyślnie!');
        figma.ui.postMessage({
            type: 'generation-success',
            message: 'ProjectCard został wygenerowany'
        });
    } catch (error) {
        throw error;
    }
}

async function handleGenerateProjectElements(data) {
    try {
        // Create a main container
        const container = figma.createFrame();
        container.name = 'ProjectElements';
        container.resize(800, 600);
        container.layoutMode = 'VERTICAL';
        container.paddingLeft = 20;
        container.paddingRight = 20;
        container.paddingTop = 20;
        container.paddingBottom = 20;
        container.itemSpacing = 20;
        container.fills = [createColor(FABMANAGE_DESIGN_SYSTEM.colors.surface)];

        // Add title
        const title = await createText('Project Elements', 24, 700, FABMANAGE_DESIGN_SYSTEM.colors.text);
        container.appendChild(title);

        // Create a grid of project cards
        const grid = figma.createFrame();
        grid.name = 'ProjectGrid';
        grid.layoutMode = 'HORIZONTAL';
        grid.itemSpacing = 16;
        grid.resize(760, 200);

        // Generate sample project cards
        const sampleProjects = [
            { name: 'Projekt A', numer: 'PRJ-001', status: 'nowy', progress: 0.3 },
            { name: 'Projekt B', numer: 'PRJ-002', status: 'projektowanie', progress: 0.7 },
            { name: 'Projekt C', numer: 'PRJ-003', status: 'cnc', progress: 0.9 }
        ];

        for (const project of sampleProjects) {
            const projectCard = await createProjectCard(project);
            grid.appendChild(projectCard);
        }

        container.appendChild(grid);

        // Position the container
        container.x = figma.viewport.center.x - container.width / 2;
        container.y = figma.viewport.center.y - container.height / 2;

        figma.currentPage.appendChild(container);
        figma.currentPage.selection = [container];
        figma.viewport.scrollAndZoomIntoView([container]);

        figma.notify('ProjectElements wygenerowane pomyślnie!');
        figma.ui.postMessage({
            type: 'generation-success',
            message: 'ProjectElements zostały wygenerowane'
        });
    } catch (error) {
        throw error;
    }
}

async function handleGenerateDesignSystem() {
    try {
        const container = figma.createFrame();
        container.name = 'FabManage Design System';
        container.resize(1000, 800);
        container.layoutMode = 'VERTICAL';
        container.paddingLeft = 20;
        container.paddingRight = 20;
        container.paddingTop = 20;
        container.paddingBottom = 20;
        container.itemSpacing = 20;
        container.fills = [createColor(FABMANAGE_DESIGN_SYSTEM.colors.background)];

        // Add title
        const title = await createText('FabManage Design System', 32, 700, FABMANAGE_DESIGN_SYSTEM.colors.text);
        container.appendChild(title);

        // Colors section
        const colorsSection = figma.createFrame();
        colorsSection.name = 'Colors';
        colorsSection.layoutMode = 'VERTICAL';
        colorsSection.resize(960, 200);
        colorsSection.itemSpacing = 16;

        const colorsTitle = await createText('Colors', 24, 600, FABMANAGE_DESIGN_SYSTEM.colors.text);
        colorsSection.appendChild(colorsTitle);

        const colorsGrid = figma.createFrame();
        colorsGrid.name = 'ColorsGrid';
        colorsGrid.layoutMode = 'HORIZONTAL';
        colorsGrid.itemSpacing = 16;
        colorsGrid.resize(960, 120);

        // Create color swatches
        const colorNames = Object.keys(FABMANAGE_DESIGN_SYSTEM.colors);
        for (const colorName of colorNames) {
            const colorSwatch = figma.createFrame();
            colorSwatch.name = colorName;
            colorSwatch.resize(80, 80);
            colorSwatch.cornerRadius = 8;
            colorSwatch.fills = [createColor(FABMANAGE_DESIGN_SYSTEM.colors[colorName])];
            colorSwatch.strokes = [createColor(FABMANAGE_DESIGN_SYSTEM.colors.border)];
            colorSwatch.strokeWeight = 1;
            colorSwatch.effects = [FABMANAGE_DESIGN_SYSTEM.effects.shadows.sm];

            const colorLabel = await createText(colorName, 12, 400, FABMANAGE_DESIGN_SYSTEM.colors.text);
            colorLabel.x = 4;
            colorLabel.y = 60;
            colorSwatch.appendChild(colorLabel);

            colorsGrid.appendChild(colorSwatch);
        }

        colorsSection.appendChild(colorsGrid);
        container.appendChild(colorsSection);

        // Typography section
        const typographySection = figma.createFrame();
        typographySection.name = 'Typography';
        typographySection.layoutMode = 'VERTICAL';
        typographySection.resize(960, 200);
        typographySection.itemSpacing = 16;

        const typographyTitle = await createText('Typography', 24, 600, FABMANAGE_DESIGN_SYSTEM.colors.text);
        typographySection.appendChild(typographyTitle);

        const typographyGrid = figma.createFrame();
        typographyGrid.name = 'TypographyGrid';
        typographyGrid.layoutMode = 'VERTICAL';
        typographyGrid.itemSpacing = 8;
        typographyGrid.resize(960, 120);

        // Create typography examples
        const typographyExamples = [
            { text: 'Heading 1', size: 32, weight: 700 },
            { text: 'Heading 2', size: 24, weight: 600 },
            { text: 'Body Text', size: 16, weight: 400 },
            { text: 'Caption', size: 12, weight: 400 }
        ];

        for (const example of typographyExamples) {
            const textExample = await createText(example.text, example.size, example.weight, FABMANAGE_DESIGN_SYSTEM.colors.text);
            typographyGrid.appendChild(textExample);
        }

        typographySection.appendChild(typographyGrid);
        container.appendChild(typographySection);

        // Components section
        const componentsSection = figma.createFrame();
        componentsSection.name = 'Components';
        componentsSection.layoutMode = 'VERTICAL';
        componentsSection.resize(960, 200);
        componentsSection.itemSpacing = 16;

        const componentsTitle = await createText('Components', 24, 600, FABMANAGE_DESIGN_SYSTEM.colors.text);
        componentsSection.appendChild(componentsTitle);

        const componentsGrid = figma.createFrame();
        componentsGrid.name = 'ComponentsGrid';
        componentsGrid.layoutMode = 'HORIZONTAL';
        componentsGrid.itemSpacing = 16;
        componentsGrid.resize(960, 120);

        // Create component examples
        const primaryButton = await createButton('Primary', 'primary', 100, 40);
        componentsGrid.appendChild(primaryButton);

        const secondaryButton = await createButton('Secondary', 'secondary', 100, 40);
        componentsGrid.appendChild(secondaryButton);

        const successBadge = await createBadge('Success', 'success');
        componentsGrid.appendChild(successBadge);

        const progressBar = createProgressBar(0.6, 150, 20);
        componentsGrid.appendChild(progressBar);

        componentsSection.appendChild(componentsGrid);
        container.appendChild(componentsSection);

        // Position the container
        container.x = figma.viewport.center.x - container.width / 2;
        container.y = figma.viewport.center.y - container.height / 2;

        figma.currentPage.appendChild(container);
        figma.currentPage.selection = [container];
        figma.viewport.scrollAndZoomIntoView([container]);

        figma.notify('Design System wygenerowany pomyślnie!');
        figma.ui.postMessage({
            type: 'generation-success',
            message: 'Design System został wygenerowany'
        });
    } catch (error) {
        throw error;
    }
}

async function handleBrowseFolder() {
    try {
        // In Figma, we can't directly browse folders, but we can ask user to input path
        figma.ui.postMessage({
            type: 'folder-selected',
            folderPath: 'D:\\Cursor_Workspaces\\fabManage\\FabManageNew\\src'
        });
    } catch (error) {
        throw error;
    }
}

async function handleScanFolder(folderPath) {
    try {
        // Scan for design system files first
        const designSystemFiles = await scanDesignSystemFiles(folderPath);

        // Scan for React components
        const components = await scanReactComponents(folderPath);

        // Combine results
        const allComponents = [...designSystemFiles, ...components];

        figma.notify(`Znaleziono ${allComponents.length} komponentów w folderze ${folderPath}`);
        figma.ui.postMessage({
            type: 'components-scanned',
            components: allComponents
        });
    } catch (error) {
        throw error;
    }
}

async function scanDesignSystemFiles(folderPath) {
    // Look for design system files
    const designSystemFiles = [
        { name: 'DesignSystem', path: 'src/styles/design-system.css', type: 'design-system' },
        { name: 'ComponentsCSS', path: 'src/styles/components.css', type: 'design-system' },
        { name: 'AntDesignTheme', path: 'src/styles/ant-design-theme.ts', type: 'design-system' }
    ];

    return designSystemFiles;
}

async function scanReactComponents(folderPath) {
    // Scan for React components in the project
    const components = [
        // Project components
        { name: 'ProjectCard', path: 'src/components/Project/ProjectCard.tsx', type: 'organism' },
        { name: 'ProjectElements', path: 'src/components/Project/ProjectElements.tsx', type: 'organism' },
        { name: 'TileCard', path: 'src/components/Project/TileCard.tsx', type: 'molecule' },

        // UI Components
        { name: 'StatusBadge', path: 'src/components/UI/StatusBadge.tsx', type: 'atom' },
        { name: 'Button', path: 'src/components/UI/Button.tsx', type: 'atom' },
        { name: 'Input', path: 'src/components/UI/Input.tsx', type: 'atom' },
        { name: 'Card', path: 'src/components/UI/Card.tsx', type: 'molecule' },
        { name: 'Progress', path: 'src/components/UI/Progress.tsx', type: 'atom' },
        { name: 'Avatar', path: 'src/components/UI/Avatar.tsx', type: 'atom' },
        { name: 'Typography', path: 'src/components/UI/Typography.tsx', type: 'atom' },
        { name: 'Space', path: 'src/components/UI/Space.tsx', type: 'atom' },
        { name: 'Tag', path: 'src/components/UI/Tag.tsx', type: 'atom' },
        { name: 'Form', path: 'src/components/UI/Form.tsx', type: 'molecule' },
        { name: 'Modal', path: 'src/components/UI/Modal.tsx', type: 'molecule' },
        { name: 'Table', path: 'src/components/UI/Table.tsx', type: 'molecule' },

        // Ant Design components (atoms)
        { name: 'AntButton', path: 'antd/Button', type: 'atom', library: 'antd' },
        { name: 'AntInput', path: 'antd/Input', type: 'atom', library: 'antd' },
        { name: 'AntCard', path: 'antd/Card', type: 'molecule', library: 'antd' },
        { name: 'AntProgress', path: 'antd/Progress', type: 'atom', library: 'antd' },
        { name: 'AntTag', path: 'antd/Tag', type: 'atom', library: 'antd' },
        { name: 'AntAvatar', path: 'antd/Avatar', type: 'atom', library: 'antd' },
        { name: 'AntTypography', path: 'antd/Typography', type: 'atom', library: 'antd' },
        { name: 'AntSpace', path: 'antd/Space', type: 'atom', library: 'antd' },
        { name: 'AntForm', path: 'antd/Form', type: 'molecule', library: 'antd' },
        { name: 'AntModal', path: 'antd/Modal', type: 'molecule', library: 'antd' },
        { name: 'AntTable', path: 'antd/Table', type: 'molecule', library: 'antd' },

        // Organisms
        { name: 'KanbanBoard', path: 'src/components/Project/KanbanBoard.tsx', type: 'organism' },
        { name: 'ProjectList', path: 'src/components/Project/ProjectList.tsx', type: 'organism' }
    ];

    return components;
}

// Krok 1: Skanuj design system
async function handleScanDesignSystem(folderPath) {
    try {
        const designSystems = await scanDesignSystemFiles(folderPath);

        figma.notify(`Znaleziono ${designSystems.length} plików design system`);
        figma.ui.postMessage({
            type: 'design-systems-scanned',
            systems: designSystems
        });
    } catch (error) {
        throw error;
    }
}

// Krok 2: Skanuj komponenty Project*
async function handleScanProjectComponents(folderPath) {
    try {
        const projectComponents = [
            { name: 'ProjectCard', path: 'src/components/Project/ProjectCard.tsx', type: 'project' },
            { name: 'ProjectElements', path: 'src/components/Project/ProjectElements.tsx', type: 'project' },
            { name: 'ProjectMaterials', path: 'src/components/Project/ProjectMaterials.tsx', type: 'project' },
            { name: 'ProjectOverview', path: 'src/components/Project/ProjectOverview.tsx', type: 'project' },
            { name: 'ProjectTabs', path: 'src/components/Project/ProjectTabs.tsx', type: 'project' }
        ];

        figma.notify(`Znaleziono ${projectComponents.length} komponentów Project*`);
        figma.ui.postMessage({
            type: 'project-components-scanned',
            components: projectComponents
        });
    } catch (error) {
        throw error;
    }
}

// Krok 3: Analizuj atomy z komponentu
async function handleAnalyzeAtoms(component) {
    try {
        // Analizuj importy z komponentu
        const atoms = analyzeComponentImports(component);

        figma.notify(`Znaleziono ${atoms.length} atomów w komponencie ${component.name}`);
        figma.ui.postMessage({
            type: 'atoms-analyzed',
            atoms: atoms
        });
    } catch (error) {
        throw error;
    }
}

// Krok 4: Generuj komponent
async function handleGenerateComponent(component, designSystem) {
    try {
        // Najpierw stwórz design system variables
        await createDesignSystemVariables(designSystem);

        // Następnie stwórz atomy
        const atoms = analyzeComponentImports(component);
        await createAtomsFromAnalysis(atoms);

        // Na końcu stwórz komponent
        await createComponentFromAtoms(component, atoms);

        figma.notify(`Wygenerowano komponent ${component.name}`);
        figma.ui.postMessage({
            type: 'generation-success',
            message: `Komponent ${component.name} został wygenerowany w Figma`
        });
    } catch (error) {
        throw error;
    }
}

// Analizuj importy z komponentu
function analyzeComponentImports(component) {
    // Symulacja analizy importów - w rzeczywistości parsowałaby plik
    const componentImports = {
        'ProjectCard': [
            { name: 'Card', source: 'antd/Card', type: 'molecule' },
            { name: 'Progress', source: 'antd/Progress', type: 'atom' },
            { name: 'Tag', source: 'antd/Tag', type: 'atom' },
            { name: 'Avatar', source: 'antd/Avatar', type: 'atom' },
            { name: 'Space', source: 'antd/Space', type: 'atom' },
            { name: 'Typography', source: 'antd/Typography', type: 'atom' },
            { name: 'Button', source: 'antd/Button', type: 'atom' }
        ],
        'ProjectElements': [
            { name: 'Card', source: 'antd/Card', type: 'molecule' },
            { name: 'Form', source: 'antd/Form', type: 'molecule' },
            { name: 'Input', source: 'antd/Input', type: 'atom' },
            { name: 'Button', source: 'antd/Button', type: 'atom' },
            { name: 'Space', source: 'antd/Space', type: 'atom' },
            { name: 'Row', source: 'antd/Row', type: 'atom' },
            { name: 'Col', source: 'antd/Col', type: 'atom' },
            { name: 'Tabs', source: 'antd/Tabs', type: 'molecule' }
        ],
        'ProjectMaterials': [
            { name: 'Card', source: 'antd/Card', type: 'molecule' }
        ],
        'ProjectOverview': [
            { name: 'Card', source: 'antd/Card', type: 'molecule' },
            { name: 'List', source: 'antd/List', type: 'molecule' },
            { name: 'Avatar', source: 'antd/Avatar', type: 'atom' },
            { name: 'Typography', source: 'antd/Typography', type: 'atom' },
            { name: 'Input', source: 'antd/Input', type: 'atom' },
            { name: 'Button', source: 'antd/Button', type: 'atom' },
            { name: 'Row', source: 'antd/Row', type: 'atom' },
            { name: 'Col', source: 'antd/Col', type: 'atom' },
            { name: 'Tag', source: 'antd/Tag', type: 'atom' },
            { name: 'Segmented', source: 'antd/Segmented', type: 'atom' },
            { name: 'Empty', source: 'antd/Empty', type: 'atom' }
        ],
        'ProjectTabs': [
            { name: 'Tabs', source: 'antd/Tabs', type: 'molecule' },
            { name: 'Card', source: 'antd/Card', type: 'molecule' }
        ]
    };

    return componentImports[component.name] || [];
}

// Stwórz design system variables w Figma
async function createDesignSystemVariables(designSystem) {
    try {
        // Stwórz kolekcję zmiennych
        const collection = figma.variables.createVariableCollection('FabManage Design System');

        // Stwórz zmienne kolorów
        const colorMode = collection.modes[0];

        // Primary colors
        const primaryMain = figma.variables.createVariable('Primary Main', collection, 'COLOR');
        primaryMain.setValueForMode(colorMode.id, FABMANAGE_DESIGN_SYSTEM.colors.primaryMain);

        const primaryLight = figma.variables.createVariable('Primary Light', collection, 'COLOR');
        primaryLight.setValueForMode(colorMode.id, FABMANAGE_DESIGN_SYSTEM.colors.primaryLight);

        const primaryDark = figma.variables.createVariable('Primary Dark', collection, 'COLOR');
        primaryDark.setValueForMode(colorMode.id, FABMANAGE_DESIGN_SYSTEM.colors.primaryDark);

        // Background colors
        const bgPrimary = figma.variables.createVariable('Background Primary', collection, 'COLOR');
        bgPrimary.setValueForMode(colorMode.id, FABMANAGE_DESIGN_SYSTEM.colors.bgPrimary);

        const bgSecondary = figma.variables.createVariable('Background Secondary', collection, 'COLOR');
        bgSecondary.setValueForMode(colorMode.id, FABMANAGE_DESIGN_SYSTEM.colors.bgSecondary);

        const bgCard = figma.variables.createVariable('Background Card', collection, 'COLOR');
        bgCard.setValueForMode(colorMode.id, FABMANAGE_DESIGN_SYSTEM.colors.bgCard);

        // Text colors
        const textPrimary = figma.variables.createVariable('Text Primary', collection, 'COLOR');
        textPrimary.setValueForMode(colorMode.id, FABMANAGE_DESIGN_SYSTEM.colors.textPrimary);

        const textSecondary = figma.variables.createVariable('Text Secondary', collection, 'COLOR');
        textSecondary.setValueForMode(colorMode.id, FABMANAGE_DESIGN_SYSTEM.colors.textSecondary);

        // Status colors
        const statusSuccess = figma.variables.createVariable('Status Success', collection, 'COLOR');
        statusSuccess.setValueForMode(colorMode.id, FABMANAGE_DESIGN_SYSTEM.colors.statusNormal);

        const statusWarning = figma.variables.createVariable('Status Warning', collection, 'COLOR');
        statusWarning.setValueForMode(colorMode.id, FABMANAGE_DESIGN_SYSTEM.colors.statusLow);

        const statusError = figma.variables.createVariable('Status Error', collection, 'COLOR');
        statusError.setValueForMode(colorMode.id, FABMANAGE_DESIGN_SYSTEM.colors.statusCritical);

        // Spacing variables
        const spacingXs = figma.variables.createVariable('Spacing XS', collection, 'FLOAT');
        spacingXs.setValueForMode(colorMode.id, FABMANAGE_DESIGN_SYSTEM.spacing[1]);

        const spacingSm = figma.variables.createVariable('Spacing SM', collection, 'FLOAT');
        spacingSm.setValueForMode(colorMode.id, FABMANAGE_DESIGN_SYSTEM.spacing[2]);

        const spacingMd = figma.variables.createVariable('Spacing MD', collection, 'FLOAT');
        spacingMd.setValueForMode(colorMode.id, FABMANAGE_DESIGN_SYSTEM.spacing[4]);

        const spacingLg = figma.variables.createVariable('Spacing LG', collection, 'FLOAT');
        spacingLg.setValueForMode(colorMode.id, FABMANAGE_DESIGN_SYSTEM.spacing[6]);

        // Radius variables
        const radiusSm = figma.variables.createVariable('Radius SM', collection, 'FLOAT');
        radiusSm.setValueForMode(colorMode.id, FABMANAGE_DESIGN_SYSTEM.radius.sm);

        const radiusBase = figma.variables.createVariable('Radius Base', collection, 'FLOAT');
        radiusBase.setValueForMode(colorMode.id, FABMANAGE_DESIGN_SYSTEM.radius.base);

        console.log('Design system variables created successfully');
    } catch (error) {
        console.error('Error creating design system variables:', error);
    }
}

// Stwórz atomy z analizy
async function createAtomsFromAnalysis(atoms) {
    const mainContainer = figma.createFrame();
    mainContainer.name = 'Generated Atoms';
    mainContainer.layoutMode = 'HORIZONTAL';
    mainContainer.itemSpacing = 16;
    mainContainer.resize(1160, 100);

    for (const atom of atoms) {
        const atomComponent = await generateAntdAtom(atom.name);
        if (atomComponent) {
            mainContainer.appendChild(atomComponent);
        }
    }

    figma.currentPage.appendChild(mainContainer);
}

// Stwórz komponent z atomów
async function createComponentFromAtoms(component, atoms) {
    const mainContainer = figma.createFrame();
    mainContainer.name = `Generated ${component.name}`;
    mainContainer.layoutMode = 'VERTICAL';
    mainContainer.itemSpacing = 16;
    mainContainer.resize(400, 600);

    // Stwórz komponent na podstawie typu
    switch (component.name) {
        case 'ProjectCard':
            const projectCard = await createProjectCard({
                name: 'Sample Project',
                numer: 'PRJ-001',
                status: 'W trakcie',
                typ: 'Targi',
                lokalizacja: 'Warszawa',
                client: 'Sample Client',
                deadline: '2024-12-31',
                postep: 75,
                modules: ['projektowanie', 'produkcja'],
                tilesCount: 15,
                manager: 'John Doe'
            });
            mainContainer.appendChild(projectCard);
            break;

        case 'ProjectElements':
            const projectElements = await createProjectElements();
            mainContainer.appendChild(projectElements);
            break;

        default:
            const placeholder = await createText(`${component.name} Component`, 18, 600, FABMANAGE_DESIGN_SYSTEM.colors.textPrimary);
            mainContainer.appendChild(placeholder);
    }

    figma.currentPage.appendChild(mainContainer);
}

// Stwórz ProjectElements komponent
async function createProjectElements() {
    const container = figma.createFrame();
    container.name = 'ProjectElements';
    container.layoutMode = 'VERTICAL';
    container.itemSpacing = 16;
    container.resize(800, 600);
    container.fills = [createColor(FABMANAGE_DESIGN_SYSTEM.colors.bgCard)];
    container.cornerRadius = FABMANAGE_DESIGN_SYSTEM.radius.base;

    // Header
    const header = await createText('Elementy Projektu', 18, 600, FABMANAGE_DESIGN_SYSTEM.colors.textPrimary);
    container.appendChild(header);

    // Quick Add Form
    const form = figma.createFrame();
    form.name = 'Quick Add Form';
    form.layoutMode = 'HORIZONTAL';
    form.itemSpacing = 12;
    form.resize(800, 60);
    form.fills = [createColor(FABMANAGE_DESIGN_SYSTEM.colors.bgSecondary)];
    form.cornerRadius = FABMANAGE_DESIGN_SYSTEM.radius.base;

    const input = figma.createFrame();
    input.name = 'Input';
    input.resize(400, 40);
    input.fills = [createColor(FABMANAGE_DESIGN_SYSTEM.colors.bgInput)];
    input.strokes = [createColor(FABMANAGE_DESIGN_SYSTEM.colors.borderMain)];
    input.strokeWeight = 1;
    input.cornerRadius = FABMANAGE_DESIGN_SYSTEM.radius.base;

    const button = await createButton('Dodaj', 'primary', 100, 40);
    button.name = 'Add Button';

    form.appendChild(input);
    form.appendChild(button);
    container.appendChild(form);

    // Kanban Board
    const kanban = figma.createFrame();
    kanban.name = 'Kanban Board';
    kanban.layoutMode = 'HORIZONTAL';
    kanban.itemSpacing = 16;
    kanban.resize(800, 400);

    const columns = ['Nowy', 'Projektowanie', 'CNC', 'Montaż'];
    for (const columnName of columns) {
        const column = figma.createFrame();
        column.name = columnName;
        column.layoutMode = 'VERTICAL';
        column.itemSpacing = 8;
        column.resize(180, 400);
        column.fills = [createColor(FABMANAGE_DESIGN_SYSTEM.colors.bgSecondary)];
        column.cornerRadius = FABMANAGE_DESIGN_SYSTEM.radius.base;

        const columnTitle = await createText(columnName, 14, 600, FABMANAGE_DESIGN_SYSTEM.colors.textPrimary);
        column.appendChild(columnTitle);

        // Sample tile
        const tile = figma.createFrame();
        tile.name = 'Sample Tile';
        tile.resize(160, 80);
        tile.fills = [createColor(FABMANAGE_DESIGN_SYSTEM.colors.bgCard)];
        tile.cornerRadius = FABMANAGE_DESIGN_SYSTEM.radius.sm;
        tile.strokes = [createColor(FABMANAGE_DESIGN_SYSTEM.colors.borderLight)];
        tile.strokeWeight = 1;

        const tileTitle = await createText('Sample Element', 12, 500, FABMANAGE_DESIGN_SYSTEM.colors.textPrimary);
        tile.appendChild(tileTitle);

        column.appendChild(tile);
        kanban.appendChild(column);
    }

    container.appendChild(kanban);

    return container;
}

async function handleGenerateSelectedComponents(selectedComponents) {
    try {
        const analysis = analyzeComponentsForGeneration(selectedComponents);

        // Create a main container for all components
        const mainContainer = figma.createFrame();
        mainContainer.name = 'FabManage Components';
        mainContainer.resize(1200, 800);
        mainContainer.fills = [createColor(FABMANAGE_DESIGN_SYSTEM.colors.bgPrimary)];
        mainContainer.layoutMode = 'VERTICAL';
        mainContainer.paddingLeft = 20;
        mainContainer.paddingRight = 20;
        mainContainer.paddingTop = 20;
        mainContainer.paddingBottom = 20;
        mainContainer.itemSpacing = 20;

        // Position container
        mainContainer.x = figma.viewport.center.x - mainContainer.width / 2;
        mainContainer.y = figma.viewport.center.y - mainContainer.height / 2;

        // Add title
        const title = await createText('FabManage Components', 24, 700, FABMANAGE_DESIGN_SYSTEM.colors.textPrimary);
        mainContainer.appendChild(title);

        // Generate Ant Design atoms first
        if (analysis.antdAtoms.length > 0) {
            const antdAtomsSection = figma.createFrame();
            antdAtomsSection.name = 'Ant Design Atoms';
            antdAtomsSection.layoutMode = 'HORIZONTAL';
            antdAtomsSection.itemSpacing = 16;
            antdAtomsSection.resize(1160, 100);

            const antdAtomsTitle = await createText('Ant Design Atoms', 18, 600, FABMANAGE_DESIGN_SYSTEM.colors.textPrimary);
            antdAtomsSection.appendChild(antdAtomsTitle);

            for (const atom of analysis.antdAtoms) {
                const atomComponent = await generateAntdAtom(atom);
                if (atomComponent) {
                    antdAtomsSection.appendChild(atomComponent);
                }
            }

            mainContainer.appendChild(antdAtomsSection);
        }

        // Generate custom atoms
        if (analysis.atoms.length > 0) {
            const atomsSection = figma.createFrame();
            atomsSection.name = 'Custom Atoms';
            atomsSection.layoutMode = 'HORIZONTAL';
            atomsSection.itemSpacing = 16;
            atomsSection.resize(1160, 100);

            const atomsTitle = await createText('Custom Atoms', 18, 600, FABMANAGE_DESIGN_SYSTEM.colors.textPrimary);
            atomsSection.appendChild(atomsTitle);

            for (const atom of analysis.atoms) {
                const atomComponent = await generateAtom(atom);
                if (atomComponent) {
                    atomsSection.appendChild(atomComponent);
                }
            }

            mainContainer.appendChild(atomsSection);
        }

        // Generate molecules
        if (analysis.molecules.length > 0) {
            const moleculesSection = figma.createFrame();
            moleculesSection.name = 'Molecules';
            moleculesSection.layoutMode = 'HORIZONTAL';
            moleculesSection.itemSpacing = 16;
            moleculesSection.resize(1160, 200);

            const moleculesTitle = await createText('Molecules', 18, 600, FABMANAGE_DESIGN_SYSTEM.colors.textPrimary);
            moleculesSection.appendChild(moleculesTitle);

            for (const molecule of analysis.molecules) {
                const moleculeComponent = await generateMolecule(molecule);
                if (moleculeComponent) {
                    moleculesSection.appendChild(moleculeComponent);
                }
            }

            mainContainer.appendChild(moleculesSection);
        }

        // Generate organisms
        if (analysis.organisms.length > 0) {
            const organismsSection = figma.createFrame();
            organismsSection.name = 'Organisms';
            organismsSection.layoutMode = 'HORIZONTAL';
            organismsSection.itemSpacing = 16;
            organismsSection.resize(1160, 300);

            const organismsTitle = await createText('Organisms', 18, 600, FABMANAGE_DESIGN_SYSTEM.colors.textPrimary);
            organismsSection.appendChild(organismsTitle);

            for (const organism of analysis.organisms) {
                const organismComponent = await generateOrganism(organism);
                if (organismComponent) {
                    organismsSection.appendChild(organismComponent);
                }
            }

            mainContainer.appendChild(organismsSection);
        }

        // Add to canvas
        figma.currentPage.appendChild(mainContainer);
        figma.currentPage.selection = [mainContainer];
        figma.viewport.scrollAndZoomIntoView([mainContainer]);

        figma.notify(`Wygenerowano ${selectedComponents.length} komponentów!`);
        figma.ui.postMessage({
            type: 'generation-success',
            message: `Wygenerowano ${selectedComponents.length} komponentów jako komponenty Figma`
        });
    } catch (error) {
        throw error;
    }
}

function analyzeComponentsForGeneration(selectedComponents) {
    const atoms = new Set();
    const molecules = new Set();
    const organisms = new Set();
    const antdAtoms = new Set();
    const antdMolecules = new Set();

    // Analyze each selected component
    selectedComponents.forEach(componentName => {
        switch (componentName) {
            case 'ProjectCard':
                organisms.add('ProjectCard');
                antdAtoms.add('AntButton');
                antdAtoms.add('AntTag');
                antdAtoms.add('AntProgress');
                antdAtoms.add('AntTypography');
                antdAtoms.add('AntAvatar');
                antdMolecules.add('AntCard');
                break;
            case 'ProjectElements':
                organisms.add('ProjectElements');
                molecules.add('ProjectCard');
                antdMolecules.add('AntForm');
                antdAtoms.add('AntButton');
                antdAtoms.add('AntInput');
                break;
            case 'TileCard':
                molecules.add('TileCard');
                antdAtoms.add('AntButton');
                antdAtoms.add('AntTag');
                antdAtoms.add('AntTypography');
                break;
            case 'StatusBadge':
                atoms.add('StatusBadge');
                break;
            case 'Button':
                antdAtoms.add('AntButton');
                break;
            case 'Input':
                antdAtoms.add('AntInput');
                break;
            case 'Card':
                antdMolecules.add('AntCard');
                break;
            case 'Progress':
                antdAtoms.add('AntProgress');
                break;
            case 'Avatar':
                antdAtoms.add('AntAvatar');
                break;
            case 'Typography':
                antdAtoms.add('AntTypography');
                break;
            case 'Tag':
                antdAtoms.add('AntTag');
                break;
            case 'Space':
                antdAtoms.add('AntSpace');
                break;
            case 'Form':
                antdMolecules.add('AntForm');
                break;
            case 'Modal':
                antdMolecules.add('AntModal');
                break;
            case 'Table':
                antdMolecules.add('AntTable');
                break;
            // Ant Design components
            case 'AntButton':
                antdAtoms.add('AntButton');
                break;
            case 'AntInput':
                antdAtoms.add('AntInput');
                break;
            case 'AntCard':
                antdMolecules.add('AntCard');
                break;
            case 'AntProgress':
                antdAtoms.add('AntProgress');
                break;
            case 'AntTag':
                antdAtoms.add('AntTag');
                break;
            case 'AntAvatar':
                antdAtoms.add('AntAvatar');
                break;
            case 'AntTypography':
                antdAtoms.add('AntTypography');
                break;
            case 'AntSpace':
                antdAtoms.add('AntSpace');
                break;
            case 'AntForm':
                antdMolecules.add('AntForm');
                break;
            case 'AntModal':
                antdMolecules.add('AntModal');
                break;
            case 'AntTable':
                antdMolecules.add('AntTable');
                break;
        }
    });

    return {
        atoms: Array.from(atoms),
        molecules: Array.from(molecules),
        organisms: Array.from(organisms),
        antdAtoms: Array.from(antdAtoms),
        antdMolecules: Array.from(antdMolecules)
    };
}

async function generateAntdAtom(atomName) {
    // Generate Ant Design atom based on name
    switch (atomName) {
        case 'AntButton':
            const button = await createButton('Ant Button', 'primary', 120, 40);
            button.name = 'AntD/Button';
            return button;
        case 'AntInput':
            const input = figma.createFrame();
            input.name = 'AntD/Input';
            input.resize(200, 40);
            input.fills = [createColor(FABMANAGE_DESIGN_SYSTEM.colors.bgInput)];
            input.strokes = [createColor(FABMANAGE_DESIGN_SYSTEM.colors.borderMain)];
            input.strokeWeight = 1;
            input.cornerRadius = FABMANAGE_DESIGN_SYSTEM.radius.base;
            return input;
        case 'AntProgress':
            const progress = createProgressBar(0.5, 200, 8);
            progress.name = 'AntD/Progress';
            return progress;
        case 'AntTag':
            const tag = await createBadge('Ant Tag', 'success');
            tag.name = 'AntD/Tag';
            return tag;
        case 'AntAvatar':
            const avatar = figma.createEllipse();
            avatar.name = 'AntD/Avatar';
            avatar.resize(40, 40);
            avatar.fills = [createColor(FABMANAGE_DESIGN_SYSTEM.colors.primaryMain)];
            return avatar;
        case 'AntTypography':
            const typography = await createText('Ant Typography', 16, 400, FABMANAGE_DESIGN_SYSTEM.colors.textPrimary);
            typography.name = 'AntD/Typography';
            return typography;
        case 'AntSpace':
            const space = figma.createFrame();
            space.name = 'AntD/Space';
            space.resize(20, 20);
            space.fills = [];
            return space;
    }
}

async function generateAtom(atomName) {
    // Generate custom atom based on name
    switch (atomName) {
        case 'Button':
            const button = await createButton('Button', 'primary', 120, 40);
            button.name = 'Atom/Button';
            return button;
        case 'Badge':
            const badge = await createBadge('Badge', 'success');
            badge.name = 'Atom/Badge';
            return badge;
        case 'Progress':
            const progress = createProgressBar(0.5, 200, 8);
            progress.name = 'Atom/Progress';
            return progress;
        case 'Text':
            const text = await createText('Text', 16, 400, FABMANAGE_DESIGN_SYSTEM.colors.textPrimary);
            text.name = 'Atom/Text';
            return text;
        case 'Input':
            // Create input component
            const input = figma.createFrame();
            input.name = 'Atom/Input';
            input.resize(200, 40);
            input.fills = [createColor(FABMANAGE_DESIGN_SYSTEM.colors.bgInput)];
            input.strokes = [createColor(FABMANAGE_DESIGN_SYSTEM.colors.borderMain)];
            input.strokeWeight = 1;
            input.cornerRadius = FABMANAGE_DESIGN_SYSTEM.radius.base;
            return input;
        case 'Avatar':
            // Create avatar component
            const avatar = figma.createEllipse();
            avatar.name = 'Atom/Avatar';
            avatar.resize(40, 40);
            avatar.fills = [createColor(FABMANAGE_DESIGN_SYSTEM.colors.primaryMain)];
            return avatar;
        case 'StatusBadge':
            const statusBadge = await createBadge('Status', 'success');
            statusBadge.name = 'Atom/StatusBadge';
            return statusBadge;
        case 'Typography':
            const typography = await createText('Typography', 16, 400, FABMANAGE_DESIGN_SYSTEM.colors.textPrimary);
            typography.name = 'Atom/Typography';
            return typography;
        case 'Space':
            const space = figma.createFrame();
            space.name = 'Atom/Space';
            space.resize(20, 20);
            space.fills = [];
            return space;
        case 'Tag':
            const tag = await createBadge('Tag', 'default');
            tag.name = 'Atom/Tag';
            return tag;
    }
}

async function generateMolecule(moleculeName) {
    // Generate molecule based on name
    switch (moleculeName) {
        case 'Card':
            const card = await createCard('Card Title', 'Card content description', 300, 200);
            card.name = 'Molecule/Card';
            return card;
        case 'Form':
            // Create form component
            const form = figma.createFrame();
            form.name = 'Molecule/Form';
            form.resize(300, 200);
            form.fills = [createColor(FABMANAGE_DESIGN_SYSTEM.colors.bgCard)];
            form.strokes = [createColor(FABMANAGE_DESIGN_SYSTEM.colors.borderMain)];
            form.strokeWeight = 1;
            form.layoutMode = 'VERTICAL';
            form.paddingLeft = 16;
            form.paddingRight = 16;
            form.paddingTop = 16;
            form.paddingBottom = 16;
            form.itemSpacing = 12;

            const formTitle = await createText('Form Title', 18, 600, FABMANAGE_DESIGN_SYSTEM.colors.textPrimary);
            form.appendChild(formTitle);

            const input = await generateAtom('Input');
            form.appendChild(input);

            const button = await generateAtom('Button');
            form.appendChild(button);

            return form;
        case 'TileCard':
            const tileCard = await createCard('Tile Card', 'Tile card content', 250, 150);
            tileCard.name = 'Molecule/TileCard';
            return tileCard;
        case 'Modal':
            const modal = figma.createFrame();
            modal.name = 'Molecule/Modal';
            modal.resize(400, 300);
            modal.fills = [createColor(FABMANAGE_DESIGN_SYSTEM.colors.bgCard)];
            modal.strokes = [createColor(FABMANAGE_DESIGN_SYSTEM.colors.borderMain)];
            modal.strokeWeight = 1;
            modal.cornerRadius = 8;
            // Skip effects for now to avoid validation errors
            // modal.effects = [FABMANAGE_DESIGN_SYSTEM.effects.shadows.lg];
            return modal;
        case 'Table':
            const table = figma.createFrame();
            table.name = 'Molecule/Table';
            table.resize(500, 200);
            table.fills = [createColor(FABMANAGE_DESIGN_SYSTEM.colors.bgCard)];
            table.strokes = [createColor(FABMANAGE_DESIGN_SYSTEM.colors.borderMain)];
            table.strokeWeight = 1;
            return table;
    }
}

async function generateOrganism(organismName) {
    // Generate organism based on name
    switch (organismName) {
        case 'ProjectCard':
            const projectCard = await createProjectCard({
                name: 'Przykładowy Projekt',
                numer: 'PRJ-001',
                status: 'nowy',
                progress: 0.65
            });
            projectCard.name = 'Organism/ProjectCard';
            return projectCard;
        case 'ProjectElements':
            const projectElements = await createProjectElements();
            projectElements.name = 'Organism/ProjectElements';
            return projectElements;
        case 'KanbanBoard':
            const kanbanBoard = figma.createFrame();
            kanbanBoard.name = 'Organism/KanbanBoard';
            kanbanBoard.resize(800, 600);
            kanbanBoard.fills = [createColor(FABMANAGE_DESIGN_SYSTEM.colors.bgCard)];
            kanbanBoard.strokes = [createColor(FABMANAGE_DESIGN_SYSTEM.colors.borderMain)];
            kanbanBoard.strokeWeight = 1;
            kanbanBoard.layoutMode = 'HORIZONTAL';
            kanbanBoard.paddingLeft = 20;
            kanbanBoard.paddingRight = 20;
            kanbanBoard.paddingTop = 20;
            kanbanBoard.paddingBottom = 20;
            kanbanBoard.itemSpacing = 20;
            return kanbanBoard;
        case 'ProjectList':
            const projectList = figma.createFrame();
            projectList.name = 'Organism/ProjectList';
            projectList.resize(1000, 400);
            projectList.fills = [createColor(FABMANAGE_DESIGN_SYSTEM.colors.bgCard)];
            projectList.strokes = [createColor(FABMANAGE_DESIGN_SYSTEM.colors.borderMain)];
            projectList.strokeWeight = 1;
            projectList.layoutMode = 'VERTICAL';
            projectList.paddingLeft = 20;
            projectList.paddingRight = 20;
            projectList.paddingTop = 20;
            projectList.paddingBottom = 20;
            projectList.itemSpacing = 16;
            return projectList;
    }
}

async function createProjectElements() {
    const container = figma.createFrame();
    container.name = 'ProjectElements';
    container.resize(800, 600);
    container.layoutMode = 'VERTICAL';
    container.paddingLeft = 20;
    container.paddingRight = 20;
    container.paddingTop = 20;
    container.paddingBottom = 20;
    container.itemSpacing = 20;
    container.fills = [createColor(FABMANAGE_DESIGN_SYSTEM.colors.bgCard)];

    const title = await createText('Project Elements', 24, 700, FABMANAGE_DESIGN_SYSTEM.colors.textPrimary);
    container.appendChild(title);

    const grid = figma.createFrame();
    grid.name = 'ProjectGrid';
    grid.layoutMode = 'HORIZONTAL';
    grid.itemSpacing = 16;
    grid.resize(760, 200);

    const sampleProjects = [
        { name: 'Projekt A', numer: 'PRJ-001', status: 'nowy', progress: 0.3 },
        { name: 'Projekt B', numer: 'PRJ-002', status: 'projektowanie', progress: 0.7 },
        { name: 'Projekt C', numer: 'PRJ-003', status: 'cnc', progress: 0.9 }
    ];

    for (const project of sampleProjects) {
        const projectCard = await createProjectCard(project);
        grid.appendChild(projectCard);
    }

    container.appendChild(grid);
    return container;
}

async function handleAnalyzeComponents() {
    try {
        const analysis = {
            atoms: [
                { name: 'Button', variants: ['primary', 'secondary', 'dashed'] },
                { name: 'Text', variants: ['heading', 'body', 'caption'] },
                { name: 'Badge', variants: ['default', 'success', 'warning', 'error'] },
                { name: 'Progress', variants: ['default'] },
                { name: 'Avatar', variants: ['default'] }
            ],
            molecules: [
                { name: 'Card', components: ['Text', 'Button'] },
                { name: 'Form', components: ['Input', 'Button'] },
                { name: 'Input', components: ['Text'] },
                { name: 'Space', components: ['Text', 'Button'] }
            ],
            organisms: [
                { name: 'ProjectCard', components: ['Card', 'Progress', 'Badge', 'Button'] },
                { name: 'ProjectElements', components: ['ProjectCard', 'Form', 'Space'] }
            ]
        };

        figma.notify('Analiza komponentów zakończona!');
        figma.ui.postMessage({
            type: 'analysis-complete',
            analysis: analysis
        });
    } catch (error) {
        throw error;
    }
}

console.log('FabManage Design System Plugin loaded successfully!');
