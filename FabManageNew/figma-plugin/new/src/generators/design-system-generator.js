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
exports.DesignSystemGenerator = void 0;
const component_analyzer_1 = require("../analyzers/component-analyzer");
const atom_generators_1 = require("./atom-generators");
const molecule_generators_1 = require("./molecule-generators");
const organism_generators_1 = require("./organism-generators");
const design_system_1 = require("../config/design-system");
// Design System Generator - Creates complete design system in Figma
class DesignSystemGenerator {
    // Generate complete design system
    static generateDesignSystem() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Create main design system page
                const designSystemPage = figma.createPage();
                designSystemPage.name = 'FabManage Design System';
                // Set current page
                figma.currentPage = designSystemPage;
                // Generate atoms
                yield this.generateAtoms(designSystemPage);
                // Generate molecules
                yield this.generateMolecules(designSystemPage);
                // Generate organisms
                yield this.generateOrganisms(designSystemPage);
                // Generate color palette
                yield this.generateColorPalette(designSystemPage);
                // Generate typography scale
                yield this.generateTypographyScale(designSystemPage);
                // Generate spacing scale
                yield this.generateSpacingScale(designSystemPage);
                figma.notify('Design system generated successfully!');
            }
            catch (error) {
                console.error('Error generating design system:', error);
                figma.notify('Error generating design system', { error: true });
            }
        });
    }
    // Generate all atoms
    static generateAtoms(page) {
        return __awaiter(this, void 0, void 0, function* () {
            const atomsSection = figma.createFrame();
            atomsSection.name = 'Atoms';
            atomsSection.resize(1200, 800);
            atomsSection.x = 0;
            atomsSection.y = 0;
            atomsSection.layoutMode = 'VERTICAL';
            atomsSection.itemSpacing = 24;
            atomsSection.fills = [];
            const atomsTitle = figma.createText();
            atomsTitle.characters = 'ATOMS';
            atomsTitle.fontSize = 24;
            atomsTitle.fontName = { family: 'Inter', style: 'Bold' };
            atomsTitle.fills = [{ type: 'SOLID', color: design_system_1.FABMANAGE_DESIGN_SYSTEM.colors.text.primary }];
            atomsSection.appendChild(atomsTitle);
            const atoms = component_analyzer_1.ComponentAnalyzer.getComponentsByType('atom');
            let currentY = 60;
            for (const atom of atoms) {
                const atomGroup = figma.createFrame();
                atomGroup.name = atom.name;
                atomGroup.resize(1200, 200);
                atomGroup.x = 0;
                atomGroup.y = currentY;
                atomGroup.layoutMode = 'VERTICAL';
                atomGroup.itemSpacing = 12;
                atomGroup.fills = [];
                const atomTitle = figma.createText();
                atomTitle.characters = atom.name;
                atomTitle.fontSize = 18;
                atomTitle.fontName = { family: 'Inter', style: 'Medium' };
                atomTitle.fills = [{ type: 'SOLID', color: design_system_1.FABMANAGE_DESIGN_SYSTEM.colors.text.primary }];
                atomGroup.appendChild(atomTitle);
                const variantsContainer = figma.createFrame();
                variantsContainer.name = 'Variants';
                variantsContainer.layoutMode = 'HORIZONTAL';
                variantsContainer.itemSpacing = 16;
                variantsContainer.fills = [];
                // Generate base component
                const baseComponent = yield this.generateAtomComponent(atom);
                if (baseComponent) {
                    baseComponent.x = 0;
                    baseComponent.y = 0;
                    variantsContainer.appendChild(baseComponent);
                }
                // Generate variants
                const variants = yield atom_generators_1.AtomGenerators.generateAtomVariants(atom);
                variants.forEach((variant, index) => {
                    variant.x = (index + 1) * 120;
                    variant.y = 0;
                    variantsContainer.appendChild(variant);
                });
                atomGroup.appendChild(variantsContainer);
                atomsSection.appendChild(atomGroup);
                currentY += 220;
            }
            page.appendChild(atomsSection);
        });
    }
    // Generate all molecules
    static generateMolecules(page) {
        return __awaiter(this, void 0, void 0, function* () {
            const moleculesSection = figma.createFrame();
            moleculesSection.name = 'Molecules';
            moleculesSection.resize(1200, 800);
            moleculesSection.x = 0;
            moleculesSection.y = 1000;
            moleculesSection.layoutMode = 'VERTICAL';
            moleculesSection.itemSpacing = 24;
            moleculesSection.fills = [];
            const moleculesTitle = figma.createText();
            moleculesTitle.characters = 'MOLECULES';
            moleculesTitle.fontSize = 24;
            moleculesTitle.fontName = { family: 'Inter', style: 'Bold' };
            moleculesTitle.fills = [{ type: 'SOLID', color: design_system_1.FABMANAGE_DESIGN_SYSTEM.colors.text.primary }];
            moleculesSection.appendChild(moleculesTitle);
            const molecules = component_analyzer_1.ComponentAnalyzer.getComponentsByType('molecule');
            let currentY = 60;
            for (const molecule of molecules) {
                const moleculeGroup = figma.createFrame();
                moleculeGroup.name = molecule.name;
                moleculeGroup.resize(1200, 200);
                moleculeGroup.x = 0;
                moleculeGroup.y = currentY;
                moleculeGroup.layoutMode = 'VERTICAL';
                moleculeGroup.itemSpacing = 12;
                moleculeGroup.fills = [];
                const moleculeTitle = figma.createText();
                moleculeTitle.characters = molecule.name;
                moleculeTitle.fontSize = 18;
                moleculeTitle.fontName = { family: 'Inter', style: 'Medium' };
                moleculeTitle.fills = [{ type: 'SOLID', color: design_system_1.FABMANAGE_DESIGN_SYSTEM.colors.text.primary }];
                moleculeGroup.appendChild(moleculeTitle);
                const variantsContainer = figma.createFrame();
                variantsContainer.name = 'Variants';
                variantsContainer.layoutMode = 'HORIZONTAL';
                variantsContainer.itemSpacing = 16;
                variantsContainer.fills = [];
                // Generate base component
                const baseComponent = yield this.generateMoleculeComponent(molecule);
                if (baseComponent) {
                    baseComponent.x = 0;
                    baseComponent.y = 0;
                    variantsContainer.appendChild(baseComponent);
                }
                // Generate variants
                const variants = yield molecule_generators_1.MoleculeGenerators.generateMoleculeVariants(molecule);
                variants.forEach((variant, index) => {
                    variant.x = (index + 1) * 120;
                    variant.y = 0;
                    variantsContainer.appendChild(variant);
                });
                moleculeGroup.appendChild(variantsContainer);
                moleculesSection.appendChild(moleculeGroup);
                currentY += 220;
            }
            page.appendChild(moleculesSection);
        });
    }
    // Generate all organisms
    static generateOrganisms(page) {
        return __awaiter(this, void 0, void 0, function* () {
            const organismsSection = figma.createFrame();
            organismsSection.name = 'Organisms';
            organismsSection.resize(1200, 800);
            organismsSection.x = 0;
            organismsSection.y = 2000;
            organismsSection.layoutMode = 'VERTICAL';
            organismsSection.itemSpacing = 24;
            organismsSection.fills = [];
            const organismsTitle = figma.createText();
            organismsTitle.characters = 'ORGANISMS';
            organismsTitle.fontSize = 24;
            organismsTitle.fontName = { family: 'Inter', style: 'Bold' };
            organismsTitle.fills = [{ type: 'SOLID', color: design_system_1.FABMANAGE_DESIGN_SYSTEM.colors.text.primary }];
            organismsSection.appendChild(organismsTitle);
            const organisms = component_analyzer_1.ComponentAnalyzer.getComponentsByType('organism');
            let currentY = 60;
            for (const organism of organisms) {
                const organismGroup = figma.createFrame();
                organismGroup.name = organism.name;
                organismGroup.resize(1200, 400);
                organismGroup.x = 0;
                organismGroup.y = currentY;
                organismGroup.layoutMode = 'VERTICAL';
                organismGroup.itemSpacing = 12;
                organismGroup.fills = [];
                const organismTitle = figma.createText();
                organismTitle.characters = organism.name;
                organismTitle.fontSize = 18;
                organismTitle.fontName = { family: 'Inter', style: 'Medium' };
                organismTitle.fills = [{ type: 'SOLID', color: design_system_1.FABMANAGE_DESIGN_SYSTEM.colors.text.primary }];
                organismGroup.appendChild(organismTitle);
                // Generate sample organism
                const sampleOrganism = yield this.generateOrganismComponent(organism);
                if (sampleOrganism) {
                    sampleOrganism.x = 0;
                    sampleOrganism.y = 0;
                    organismGroup.appendChild(sampleOrganism);
                }
                organismsSection.appendChild(organismGroup);
                currentY += 420;
            }
            page.appendChild(organismsSection);
        });
    }
    // Generate color palette
    static generateColorPalette(page) {
        return __awaiter(this, void 0, void 0, function* () {
            const colorSection = figma.createFrame();
            colorSection.name = 'Color Palette';
            colorSection.resize(1200, 400);
            colorSection.x = 0;
            colorSection.y = 3000;
            colorSection.layoutMode = 'VERTICAL';
            colorSection.itemSpacing = 24;
            colorSection.fills = [];
            const colorTitle = figma.createText();
            colorTitle.characters = 'COLOR PALETTE';
            colorTitle.fontSize = 24;
            colorTitle.fontName = { family: 'Inter', style: 'Bold' };
            colorTitle.fills = [{ type: 'SOLID', color: design_system_1.FABMANAGE_DESIGN_SYSTEM.colors.text.primary }];
            colorSection.appendChild(colorTitle);
            const colorGrid = figma.createFrame();
            colorGrid.name = 'Color Grid';
            colorGrid.layoutMode = 'HORIZONTAL';
            colorGrid.itemSpacing = 16;
            colorGrid.fills = [];
            // Primary colors
            const primaryColors = [
                { name: 'Primary', color: design_system_1.FABMANAGE_DESIGN_SYSTEM.colors.primary },
                { name: 'Secondary', color: design_system_1.FABMANAGE_DESIGN_SYSTEM.colors.secondary },
                { name: 'Success', color: design_system_1.FABMANAGE_DESIGN_SYSTEM.colors.success },
                { name: 'Warning', color: design_system_1.FABMANAGE_DESIGN_SYSTEM.colors.warning },
                { name: 'Error', color: design_system_1.FABMANAGE_DESIGN_SYSTEM.colors.error },
                { name: 'Info', color: design_system_1.FABMANAGE_DESIGN_SYSTEM.colors.info }
            ];
            primaryColors.forEach((colorData, index) => {
                const colorCard = figma.createFrame();
                colorCard.name = colorData.name;
                colorCard.resize(120, 100);
                colorCard.cornerRadius = 8;
                colorCard.fills = [{ type: 'SOLID', color: colorData.color }];
                colorCard.effects = [design_system_1.FABMANAGE_DESIGN_SYSTEM.effects.shadows.sm];
                const colorLabel = figma.createText();
                colorLabel.characters = colorData.name;
                colorLabel.fontSize = 12;
                colorLabel.fontName = { family: 'Inter', style: 'Medium' };
                colorLabel.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
                colorLabel.x = 8;
                colorLabel.y = 8;
                colorCard.appendChild(colorLabel);
                colorGrid.appendChild(colorCard);
            });
            colorSection.appendChild(colorGrid);
            page.appendChild(colorSection);
        });
    }
    // Generate typography scale
    static generateTypographyScale(page) {
        return __awaiter(this, void 0, void 0, function* () {
            const typographySection = figma.createFrame();
            typographySection.name = 'Typography Scale';
            typographySection.resize(1200, 400);
            typographySection.x = 0;
            typographySection.y = 3500;
            typographySection.layoutMode = 'VERTICAL';
            typographySection.itemSpacing = 16;
            typographySection.fills = [];
            const typographyTitle = figma.createText();
            typographyTitle.characters = 'TYPOGRAPHY SCALE';
            typographyTitle.fontSize = 24;
            typographyTitle.fontName = { family: 'Inter', style: 'Bold' };
            typographyTitle.fills = [{ type: 'SOLID', color: design_system_1.FABMANAGE_DESIGN_SYSTEM.colors.text.primary }];
            typographySection.appendChild(typographyTitle);
            const fontSizes = Object.entries(design_system_1.FABMANAGE_DESIGN_SYSTEM.typography.sizes);
            fontSizes.forEach(([name, size]) => {
                const textSample = figma.createText();
                textSample.characters = `${name.toUpperCase()} - The quick brown fox jumps over the lazy dog`;
                textSample.fontSize = size;
                textSample.fontName = { family: 'Inter', style: 'Regular' };
                textSample.fills = [{ type: 'SOLID', color: design_system_1.FABMANAGE_DESIGN_SYSTEM.colors.text.primary }];
                typographySection.appendChild(textSample);
            });
            page.appendChild(typographySection);
        });
    }
    // Generate spacing scale
    static generateSpacingScale(page) {
        return __awaiter(this, void 0, void 0, function* () {
            const spacingSection = figma.createFrame();
            spacingSection.name = 'Spacing Scale';
            spacingSection.resize(1200, 300);
            spacingSection.x = 0;
            spacingSection.y = 4000;
            spacingSection.layoutMode = 'VERTICAL';
            spacingSection.itemSpacing = 16;
            spacingSection.fills = [];
            const spacingTitle = figma.createText();
            spacingTitle.characters = 'SPACING SCALE';
            spacingTitle.fontSize = 24;
            spacingTitle.fontName = { family: 'Inter', style: 'Bold' };
            spacingTitle.fills = [{ type: 'SOLID', color: design_system_1.FABMANAGE_DESIGN_SYSTEM.colors.text.primary }];
            spacingSection.appendChild(spacingTitle);
            const spacingGrid = figma.createFrame();
            spacingGrid.name = 'Spacing Grid';
            spacingGrid.layoutMode = 'HORIZONTAL';
            spacingGrid.itemSpacing = 16;
            spacingGrid.fills = [];
            const spacingSizes = Object.entries(design_system_1.FABMANAGE_DESIGN_SYSTEM.spacing);
            spacingSizes.forEach(([name, size]) => {
                const spacingCard = figma.createFrame();
                spacingCard.name = name;
                spacingCard.resize(100, 80);
                spacingCard.cornerRadius = 4;
                spacingCard.fills = [{ type: 'SOLID', color: design_system_1.FABMANAGE_DESIGN_SYSTEM.colors.background.secondary }];
                spacingCard.strokes = [{ type: 'SOLID', color: design_system_1.FABMANAGE_DESIGN_SYSTEM.colors.border.primary }];
                const spacingLabel = figma.createText();
                spacingLabel.characters = `${name}\n${size}px`;
                spacingLabel.fontSize = 12;
                spacingLabel.fontName = { family: 'Inter', style: 'Medium' };
                spacingLabel.fills = [{ type: 'SOLID', color: design_system_1.FABMANAGE_DESIGN_SYSTEM.colors.text.primary }];
                spacingLabel.textAlignHorizontal = 'CENTER';
                spacingLabel.x = (spacingCard.width - spacingLabel.width) / 2;
                spacingLabel.y = (spacingCard.height - spacingLabel.height) / 2;
                spacingCard.appendChild(spacingLabel);
                // Visual representation of spacing
                const spacingVisual = figma.createFrame();
                spacingVisual.name = 'Spacing Visual';
                spacingVisual.resize(size, 4);
                spacingVisual.cornerRadius = 2;
                spacingVisual.fills = [{ type: 'SOLID', color: design_system_1.FABMANAGE_DESIGN_SYSTEM.colors.primary }];
                spacingVisual.x = (spacingCard.width - spacingVisual.width) / 2;
                spacingVisual.y = spacingCard.height - 8;
                spacingCard.appendChild(spacingVisual);
                spacingGrid.appendChild(spacingCard);
            });
            spacingSection.appendChild(spacingGrid);
            page.appendChild(spacingSection);
        });
    }
    // Helper methods
    static generateAtomComponent(atom) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                switch (atom.id) {
                    case 'text-title':
                    case 'text-body':
                        const textNode = yield atom_generators_1.AtomGenerators.createText(atom.properties);
                        const textFrame = figma.createFrame();
                        textFrame.name = atom.name;
                        textFrame.resize(textNode.width, textNode.height);
                        textFrame.fills = [];
                        textFrame.appendChild(textNode);
                        return textFrame;
                    case 'button-primary':
                        return yield atom_generators_1.AtomGenerators.createButton(atom.properties);
                    case 'badge-status':
                        return yield atom_generators_1.AtomGenerators.createStatusBadge(atom.properties);
                    case 'progress-bar':
                        return yield atom_generators_1.AtomGenerators.createProgressBar(atom.properties, 50);
                    case 'avatar':
                        const avatarNode = yield atom_generators_1.AtomGenerators.createAvatar(atom.properties);
                        const avatarFrame = figma.createFrame();
                        avatarFrame.name = atom.name;
                        avatarFrame.resize(avatarNode.width, avatarNode.height);
                        avatarFrame.fills = [];
                        avatarFrame.appendChild(avatarNode);
                        return avatarFrame;
                    case 'icon':
                        const iconNode = yield atom_generators_1.AtomGenerators.createIcon(atom.properties);
                        const iconFrame = figma.createFrame();
                        iconFrame.name = atom.name;
                        iconFrame.resize(iconNode.width, iconNode.height);
                        iconFrame.fills = [];
                        iconFrame.appendChild(iconNode);
                        return iconFrame;
                    case 'tag':
                        return yield atom_generators_1.AtomGenerators.createTag(atom.properties);
                    case 'space':
                        return atom_generators_1.AtomGenerators.createSpace(atom.properties);
                    default:
                        return null;
                }
            }
            catch (error) {
                console.error(`Error generating atom ${atom.name}:`, error);
                return null;
            }
        });
    }
    static generateMoleculeComponent(molecule) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                switch (molecule.id) {
                    case 'card':
                        return yield molecule_generators_1.MoleculeGenerators.createCard(molecule.properties);
                    case 'form-input':
                        return yield molecule_generators_1.MoleculeGenerators.createFormInput(molecule.properties);
                    case 'space':
                        return molecule_generators_1.MoleculeGenerators.createSpace(molecule.properties);
                    case 'project-thumbnail':
                        return yield molecule_generators_1.MoleculeGenerators.createProjectThumbnail(molecule.properties);
                    case 'project-content':
                        return yield molecule_generators_1.MoleculeGenerators.createProjectContent(molecule.properties);
                    case 'kanban-column':
                        return yield molecule_generators_1.MoleculeGenerators.createKanbanColumn(molecule.properties);
                    case 'tile-card':
                        return yield molecule_generators_1.MoleculeGenerators.createTileCard(molecule.properties);
                    default:
                        return null;
                }
            }
            catch (error) {
                console.error(`Error generating molecule ${molecule.name}:`, error);
                return null;
            }
        });
    }
    static generateOrganismComponent(organism) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                switch (organism.id) {
                    case 'project-card':
                        const sampleProjectData = {
                            name: 'Sample Project',
                            numer: 'PRJ-001',
                            status: 'nowy',
                            typ: 'Targi',
                            lokalizacja: 'Warszawa',
                            client: 'Sample Client',
                            deadline: '2024-12-31',
                            progress: 50,
                            modules: ['projektowanie', 'produkcja'],
                            tilesCount: 10,
                            manager: 'John Doe'
                        };
                        return yield organism_generators_1.OrganismGenerators.createProjectCard(sampleProjectData);
                    case 'project-elements':
                        const sampleProjectElementsData = {
                            project: {
                                name: 'Sample Project',
                                numer: 'PRJ-001',
                                status: 'nowy',
                                typ: 'Targi',
                                lokalizacja: 'Warszawa',
                                client: 'Sample Client',
                                deadline: '2024-12-31',
                                progress: 50,
                                modules: ['projektowanie', 'produkcja'],
                                tilesCount: 10,
                                manager: 'John Doe'
                            },
                            tiles: [
                                { id: '1', name: 'Panel 1', status: 'W KOLEJCE', group: 'Grupa 1', bom: [], laborCost: 100 },
                                { id: '2', name: 'Panel 2', status: 'Projektowanie', group: 'Grupa 1', bom: [], laborCost: 150 }
                            ],
                            groups: [
                                { id: '1', name: 'Grupa 1', tiles: [] },
                                { id: '2', name: 'Grupa 2', tiles: [] }
                            ]
                        };
                        return yield organism_generators_1.OrganismGenerators.createProjectElements(sampleProjectElementsData);
                    default:
                        return null;
                }
            }
            catch (error) {
                console.error(`Error generating organism ${organism.name}:`, error);
                return null;
            }
        });
    }
}
exports.DesignSystemGenerator = DesignSystemGenerator;
