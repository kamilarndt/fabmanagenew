// FabManage Component Importer - Main Plugin Code
figma.showUI(__html__, { width: 400, height: 600, title: 'FabManage Component Importer' });

// Design System Configuration
const FABMANAGE_DESIGN_SYSTEM = {
    colors: {
        bgPrimary: { r: 0.102, g: 0.114, b: 0.129 },
        bgSecondary: { r: 0.145, g: 0.157, b: 0.180 },
        bgCard: { r: 0.173, g: 0.188, b: 0.220 },
        textPrimary: { r: 0.922, g: 0.945, b: 0.961 },
        textSecondary: { r: 0.922, g: 0.945, b: 0.961 },
        primaryMain: { r: 0.086, g: 0.639, b: 0.290 },
        statusNormal: { r: 0.063, g: 0.725, b: 0.506 },
        statusLow: { r: 0.961, g: 0.620, b: 0.043 },
        statusCritical: { r: 0.937, g: 0.267, b: 0.267 },
        borderMain: { r: 0.922, g: 0.945, b: 0.961 },
        borderLight: { r: 0.922, g: 0.945, b: 0.961 }
    },
    typography: {
        fontFamily: 'Inter',
        sizes: { xs: 12, sm: 14, base: 16, lg: 18, xl: 20, '2xl': 24, '3xl': 30 },
        weights: { regular: 400, medium: 500, semibold: 600, bold: 700 }
    },
    spacing: { 1: 4, 2: 8, 3: 12, 4: 16, 5: 20, 6: 24, 8: 32, 10: 40, 12: 48, 16: 64 },
    radius: { none: 0, sm: 2, base: 4 }
};

// Helper function to create color
function createColor(color) {
    return { type: 'SOLID', color: color };
}

// Helper function to create text
async function createText(text, fontSize = 16, fontWeight = 400, color = FABMANAGE_DESIGN_SYSTEM.colors.textPrimary) {
    const textNode = figma.createText();
    try {
        await figma.loadFontAsync({ family: 'Inter', style: 'Regular' });
        textNode.fontName = { family: 'Inter', style: 'Regular' };
    } catch (error) {
        try {
            await figma.loadFontAsync({ family: 'Roboto', style: 'Regular' });
            textNode.fontName = { family: 'Roboto', style: 'Regular' };
        } catch (error2) {
            textNode.fontName = { family: 'Helvetica', style: 'Regular' };
        }
    }
    textNode.characters = text;
    textNode.fontSize = fontSize;
    textNode.fills = [createColor(color)];
    textNode.textAutoResize = 'WIDTH_AND_HEIGHT';
    return textNode;
}

// Create Ant Design Button
async function createAntdButton(options = {}) {
    const { type = 'primary', children = 'Button' } = options;

    const button = figma.createFrame();
    button.name = `Button-${type}`;
    button.layoutMode = 'HORIZONTAL';
    button.primaryAxisAlignItems = 'CENTER';
    button.counterAxisAlignItems = 'CENTER';
    button.itemSpacing = 8;
    button.paddingTop = 8;
    button.paddingBottom = 8;
    button.paddingLeft = 16;
    button.paddingRight = 16;
    button.cornerRadius = FABMANAGE_DESIGN_SYSTEM.radius.base;

    if (type === 'primary') {
        button.fills = [createColor(FABMANAGE_DESIGN_SYSTEM.colors.primaryMain)];
    } else {
        button.fills = [createColor(FABMANAGE_DESIGN_SYSTEM.colors.bgCard)];
        button.strokes = [createColor(FABMANAGE_DESIGN_SYSTEM.colors.borderMain)];
        button.strokeWeight = 1;
    }

    const text = await createText(children, 14, 500,
        type === 'primary' ? { r: 1, g: 1, b: 1 } : FABMANAGE_DESIGN_SYSTEM.colors.textPrimary
    );
    button.appendChild(text);
    button.resize(button.width, 32);

    return button;
}

// Create Ant Design Card
async function createAntdCard(options = {}) {
    const { title, children = 'Card content' } = options;

    const card = figma.createFrame();
    card.name = 'Card';
    card.layoutMode = 'VERTICAL';
    card.itemSpacing = 16;
    card.paddingTop = 16;
    card.paddingBottom = 16;
    card.paddingLeft = 16;
    card.paddingRight = 16;
    card.resize(300, 200);
    card.fills = [createColor(FABMANAGE_DESIGN_SYSTEM.colors.bgCard)];
    card.cornerRadius = FABMANAGE_DESIGN_SYSTEM.radius.base;
    card.strokes = [createColor(FABMANAGE_DESIGN_SYSTEM.colors.borderLight)];
    card.strokeWeight = 1;

    if (title) {
        const titleText = await createText(title, 16, 600, FABMANAGE_DESIGN_SYSTEM.colors.textPrimary);
        card.appendChild(titleText);
    }

    const contentText = await createText(children, 14, 400, FABMANAGE_DESIGN_SYSTEM.colors.textSecondary);
    card.appendChild(contentText);

    return card;
}

// Create Ant Design Progress
async function createAntdProgress(options = {}) {
    const { percent = 50 } = options;

    const progress = figma.createFrame();
    progress.name = 'Progress';
    progress.layoutMode = 'HORIZONTAL';
    progress.resize(200, 8);
    progress.fills = [createColor(FABMANAGE_DESIGN_SYSTEM.colors.bgSecondary)];
    progress.cornerRadius = 4;

    const progressBar = figma.createFrame();
    progressBar.name = 'ProgressBar';
    progressBar.resize((200 * percent) / 100, 8);
    progressBar.fills = [createColor(FABMANAGE_DESIGN_SYSTEM.colors.primaryMain)];
    progressBar.cornerRadius = 4;

    progress.appendChild(progressBar);
    return progress;
}

// Create Ant Design Tag
async function createAntdTag(options = {}) {
    const { children = 'Tag', color = 'default' } = options;

    const tag = figma.createFrame();
    tag.name = 'Tag';
    tag.layoutMode = 'HORIZONTAL';
    tag.primaryAxisAlignItems = 'CENTER';
    tag.counterAxisAlignItems = 'CENTER';
    tag.itemSpacing = 4;
    tag.paddingTop = 2;
    tag.paddingBottom = 2;
    tag.paddingLeft = 8;
    tag.paddingRight = 8;
    tag.cornerRadius = 12;

    if (color === 'success') {
        tag.fills = [createColor(FABMANAGE_DESIGN_SYSTEM.colors.statusNormal)];
    } else if (color === 'warning') {
        tag.fills = [createColor(FABMANAGE_DESIGN_SYSTEM.colors.statusLow)];
    } else if (color === 'error') {
        tag.fills = [createColor(FABMANAGE_DESIGN_SYSTEM.colors.statusCritical)];
    } else {
        tag.fills = [createColor(FABMANAGE_DESIGN_SYSTEM.colors.bgSecondary)];
        tag.strokes = [createColor(FABMANAGE_DESIGN_SYSTEM.colors.borderMain)];
        tag.strokeWeight = 1;
    }

    const text = await createText(children, 12, 500,
        color === 'default' ? FABMANAGE_DESIGN_SYSTEM.colors.textPrimary : { r: 1, g: 1, b: 1 }
    );
    tag.appendChild(text);

    return tag;
}

// Create Ant Design Avatar
async function createAntdAvatar(options = {}) {
    const { size = 'default' } = options;

    const avatar = figma.createEllipse();
    avatar.name = 'Avatar';

    switch (size) {
        case 'small':
            avatar.resize(24, 24);
            break;
        case 'large':
            avatar.resize(64, 64);
            break;
        default:
            avatar.resize(32, 32);
    }

    avatar.fills = [createColor(FABMANAGE_DESIGN_SYSTEM.colors.primaryMain)];
    return avatar;
}

// Create Ant Design Space
async function createAntdSpace() {
    const space = figma.createFrame();
    space.name = 'Space';
    space.fills = [];
    space.resize(12, 1);
    return space;
}

// Create Ant Design Typography
async function createAntdTypography(options = {}) {
    const { children = 'Typography', type = 'default' } = options;

    let fontSize = 14;
    let fontWeight = 400;
    let color = FABMANAGE_DESIGN_SYSTEM.colors.textPrimary;

    switch (type) {
        case 'h1':
            fontSize = 30;
            fontWeight = 700;
            break;
        case 'h2':
            fontSize = 24;
            fontWeight = 600;
            break;
        case 'h3':
            fontSize = 20;
            fontWeight = 600;
            break;
        case 'h4':
            fontSize = 18;
            fontWeight = 600;
            break;
        case 'secondary':
            color = FABMANAGE_DESIGN_SYSTEM.colors.textSecondary;
            break;
    }

    const text = await createText(children, fontSize, fontWeight, color);
    text.name = `Typography-${type}`;
    return text;
}

// Create Ant Design Input
async function createAntdInput(options = {}) {
    const { placeholder = 'Input' } = options;

    const input = figma.createFrame();
    input.name = 'Input';
    input.layoutMode = 'HORIZONTAL';
    input.primaryAxisAlignItems = 'CENTER';
    input.counterAxisAlignItems = 'CENTER';
    input.paddingTop = 8;
    input.paddingBottom = 8;
    input.paddingLeft = 12;
    input.paddingRight = 12;
    input.cornerRadius = FABMANAGE_DESIGN_SYSTEM.radius.base;
    input.fills = [createColor(FABMANAGE_DESIGN_SYSTEM.colors.bgCard)];
    input.strokes = [createColor(FABMANAGE_DESIGN_SYSTEM.colors.borderMain)];
    input.strokeWeight = 1;
    input.resize(200, 32);

    const placeholderText = await createText(placeholder, 14, 400, FABMANAGE_DESIGN_SYSTEM.colors.textSecondary);
    input.appendChild(placeholderText);

    return input;
}

// Main message handler
figma.ui.onmessage = async (msg) => {
    try {
        if (msg.type === 'analyze-file') {
            const { fileContent, componentName } = msg;

            // 1. Create Design System variables
            figma.ui.postMessage({ type: 'creating-variables' });
            await createDesignSystemVariables();
            figma.notify('Zmienne Design Systemu gotowe.', { timeout: 1000 });

            // 2. Analyze dependencies from 'antd'
            const dependencies = analyzeDependencies(fileContent);
            if (dependencies.length === 0) {
                figma.notify(`Nie znaleziono zależności 'antd' w komponencie ${componentName}.`, { error: true });
                figma.ui.postMessage({ type: 'analysis-error', error: 'Brak zależności antd' });
                return;
            }

            figma.ui.postMessage({ type: 'atoms-found', atoms: dependencies });
            figma.notify(`Znaleziono atomy: ${dependencies.join(', ')}`);

            // 3. Create atom components in Figma
            figma.ui.postMessage({ type: 'creating-atoms' });
            const atomNodes = await createAtomComponents(dependencies);

            // 4. Create main component from atoms
            figma.ui.postMessage({ type: 'creating-component' });
            await createMainComponent(componentName, atomNodes, fileContent);

            figma.notify(`Komponent '${componentName}' został pomyślnie wygenerowany!`);
            figma.ui.postMessage({ type: 'analysis-success', message: `Komponent ${componentName} został wygenerowany w Figma` });
        }
    } catch (error) {
        console.error('Plugin error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        figma.notify('Błąd: ' + errorMessage, { error: true });
        figma.ui.postMessage({ type: 'analysis-error', error: errorMessage });
    }
};

// Analyze dependencies from file content
function analyzeDependencies(content) {
    const dependencies = new Set();
    const importRegex = /import\s+{([^}]+)}\s+from\s+['"]antd['"]/g;
    let match;

    while ((match = importRegex.exec(content)) !== null) {
        const importedItems = match[1].split(',').map(item => item.trim());
        importedItems.forEach(item => dependencies.add(item));
    }
    return Array.from(dependencies);
}

// Create Design System variables
async function createDesignSystemVariables() {
    try {
        const collection = figma.variables.createVariableCollection('FabManage Design System');
        const colorMode = collection.modes[0];

        // Primary colors
        const primaryMain = figma.variables.createVariable('Primary Main', collection, 'COLOR');
        primaryMain.setValueForMode(colorMode.id, FABMANAGE_DESIGN_SYSTEM.colors.primaryMain);

        const bgCard = figma.variables.createVariable('Background Card', collection, 'COLOR');
        bgCard.setValueForMode(colorMode.id, FABMANAGE_DESIGN_SYSTEM.colors.bgCard);

        const textPrimary = figma.variables.createVariable('Text Primary', collection, 'COLOR');
        textPrimary.setValueForMode(colorMode.id, FABMANAGE_DESIGN_SYSTEM.colors.textPrimary);

        console.log('Design system variables created successfully');
    } catch (error) {
        console.error('Error creating design system variables:', error);
    }
}

// Create atom components
async function createAtomComponents(dependencies) {
    const nodes = {};
    const atomsFrame = figma.createFrame();
    atomsFrame.name = 'Wygenerowane Atomy';
    atomsFrame.layoutMode = 'HORIZONTAL';
    atomsFrame.itemSpacing = 24;
    atomsFrame.paddingTop = 20;
    atomsFrame.paddingBottom = 20;
    atomsFrame.paddingLeft = 20;
    atomsFrame.paddingRight = 20;
    atomsFrame.primaryAxisSizingMode = 'AUTO';
    atomsFrame.counterAxisSizingMode = 'AUTO';

    for (const dep of dependencies) {
        let node = null;
        switch (dep) {
            case 'Button':
                node = await createAntdButton({ type: 'primary', children: dep });
                break;
            case 'Card':
                node = await createAntdCard({ title: dep });
                break;
            case 'Progress':
                node = await createAntdProgress({ percent: 50 });
                break;
            case 'Tag':
                node = await createAntdTag({ children: dep });
                break;
            case 'Avatar':
                node = await createAntdAvatar({ icon: true });
                break;
            case 'Space':
                node = await createAntdSpace();
                break;
            case 'Typography':
                node = await createAntdTypography({ children: dep });
                break;
            case 'Text':
                node = await createAntdTypography({ children: dep, type: 'default' });
                break;
            case 'Title':
                node = await createAntdTypography({ children: dep, type: 'h4' });
                break;
            case 'Input':
                node = await createAntdInput({ placeholder: dep });
                break;
        }

        if (node) {
            const component = figma.createComponent();
            component.name = `antd/${dep}`;
            component.appendChild(node);
            nodes[dep] = component;
            atomsFrame.appendChild(component);
        }
    }

    figma.currentPage.appendChild(atomsFrame);
    atomsFrame.x = -1000; // Move off-screen
    return nodes;
}

// Create main component
async function createMainComponent(name, atoms, fileContent) {
    const mainComponentFrame = figma.createFrame();
    mainComponentFrame.name = name;
    mainComponentFrame.layoutMode = 'VERTICAL';
    mainComponentFrame.itemSpacing = 16;
    mainComponentFrame.paddingTop = 24;
    mainComponentFrame.paddingBottom = 24;
    mainComponentFrame.paddingLeft = 24;
    mainComponentFrame.paddingRight = 24;
    mainComponentFrame.primaryAxisSizingMode = 'AUTO';
    mainComponentFrame.counterAxisSizingMode = 'AUTO';
    mainComponentFrame.fills = [createColor(FABMANAGE_DESIGN_SYSTEM.colors.bgCard)];
    mainComponentFrame.cornerRadius = 8;
    mainComponentFrame.strokes = [createColor(FABMANAGE_DESIGN_SYSTEM.colors.borderLight)];
    mainComponentFrame.strokeWeight = 1;

    // Add atoms to main component
    if (atoms['Card']) {
        const cardInstance = atoms['Card'].createInstance();
        cardInstance.name = 'Main Card';
        mainComponentFrame.appendChild(cardInstance);
    }

    if (atoms['Button']) {
        const buttonInstance = atoms['Button'].createInstance();
        buttonInstance.name = 'Action Button';
        mainComponentFrame.appendChild(buttonInstance);
    }

    if (atoms['Progress']) {
        const progressInstance = atoms['Progress'].createInstance();
        progressInstance.name = 'Progress Bar';
        mainComponentFrame.appendChild(progressInstance);
    }

    if (atoms['Tag']) {
        const tagInstance = atoms['Tag'].createInstance();
        tagInstance.name = 'Status Tag';
        mainComponentFrame.appendChild(tagInstance);
    }

    figma.currentPage.appendChild(mainComponentFrame);
    figma.viewport.scrollAndZoomIntoView([mainComponentFrame]);
}