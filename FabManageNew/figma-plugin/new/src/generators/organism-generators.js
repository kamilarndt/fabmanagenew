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
exports.OrganismGenerators = void 0;
const design_system_1 = require("../config/design-system");
const atom_generators_1 = require("./atom-generators");
const molecule_generators_1 = require("./molecule-generators");
// Organism Generators - Create complex UI components in Figma
class OrganismGenerators {
    // Generate ProjectCard component
    static createProjectCard(projectData) {
        return __awaiter(this, void 0, void 0, function* () {
            const card = figma.createFrame();
            card.name = `Project Card - ${projectData.name}`;
            card.resize(350, 400);
            card.cornerRadius = 12;
            card.fills = [{ type: 'SOLID', color: design_system_1.FABMANAGE_DESIGN_SYSTEM.colors.background.primary }];
            card.effects = [design_system_1.FABMANAGE_DESIGN_SYSTEM.effects.shadows.lg];
            // Thumbnail
            const thumbnail = yield molecule_generators_1.MoleculeGenerators.createProjectThumbnail({
                width: 350,
                height: 200,
                cornerRadius: 12
            });
            card.appendChild(thumbnail);
            // Content area
            const content = yield molecule_generators_1.MoleculeGenerators.createProjectContent({
                width: 350,
                height: 200,
                padding: { top: 16, right: 16, bottom: 16, left: 16 },
                layoutMode: 'VERTICAL',
                itemSpacing: 12
            });
            // Header with name and status
            const header = figma.createFrame();
            header.name = 'Project Header';
            header.resize(318, 40);
            header.layoutMode = 'HORIZONTAL';
            header.primaryAxisAlignItems = 'SPACE_BETWEEN';
            header.counterAxisAlignItems = 'CENTER';
            header.fills = [];
            // Title section
            const titleSection = figma.createFrame();
            titleSection.name = 'Title Section';
            titleSection.layoutMode = 'VERTICAL';
            titleSection.itemSpacing = 4;
            titleSection.fills = [];
            const title = yield atom_generators_1.AtomGenerators.createText({
                text: projectData.name,
                fontSize: 18,
                fontWeight: 'Bold',
                fontFamily: 'Inter',
                fills: [{ type: 'SOLID', color: design_system_1.FABMANAGE_DESIGN_SYSTEM.colors.text.primary }]
            });
            titleSection.appendChild(title);
            const projectNumber = yield atom_generators_1.AtomGenerators.createText({
                text: `Nr: ${projectData.numer}`,
                fontSize: 12,
                fontWeight: 'Regular',
                fontFamily: 'Inter',
                fills: [{ type: 'SOLID', color: design_system_1.FABMANAGE_DESIGN_SYSTEM.colors.text.secondary }]
            });
            titleSection.appendChild(projectNumber);
            header.appendChild(titleSection);
            // Status badge
            const statusBadge = yield atom_generators_1.AtomGenerators.createStatusBadge({
                text: projectData.status,
                width: 80,
                height: 24,
                cornerRadius: 12,
                padding: { top: 4, right: 8, bottom: 4, left: 8 }
            });
            header.appendChild(statusBadge);
            content.appendChild(header);
            // Project meta (type and location)
            const meta = figma.createFrame();
            meta.name = 'Project Meta';
            meta.layoutMode = 'HORIZONTAL';
            meta.itemSpacing = 8;
            meta.fills = [];
            const typeTag = yield atom_generators_1.AtomGenerators.createTag({
                text: projectData.typ,
                width: 60,
                height: 24,
                cornerRadius: 12,
                padding: { top: 4, right: 8, bottom: 4, left: 8 },
                fills: [{ type: 'SOLID', color: (0, design_system_1.getProjectTypeColor)(projectData.typ) }]
            });
            meta.appendChild(typeTag);
            const location = yield atom_generators_1.AtomGenerators.createText({
                text: `📍 ${projectData.lokalizacja}`,
                fontSize: 12,
                fontWeight: 'Regular',
                fontFamily: 'Inter',
                fills: [{ type: 'SOLID', color: design_system_1.FABMANAGE_DESIGN_SYSTEM.colors.text.secondary }]
            });
            meta.appendChild(location);
            content.appendChild(meta);
            // Project info (client and deadline)
            const info = figma.createFrame();
            info.name = 'Project Info';
            info.layoutMode = 'VERTICAL';
            info.itemSpacing = 4;
            info.fills = [];
            const clientInfo = figma.createFrame();
            clientInfo.name = 'Client Info';
            clientInfo.layoutMode = 'HORIZONTAL';
            clientInfo.itemSpacing = 6;
            clientInfo.fills = [];
            const userIcon = yield atom_generators_1.AtomGenerators.createIcon({
                width: 16,
                height: 16,
                fills: [{ type: 'SOLID', color: design_system_1.FABMANAGE_DESIGN_SYSTEM.colors.text.secondary }]
            });
            clientInfo.appendChild(userIcon);
            const clientText = yield atom_generators_1.AtomGenerators.createText({
                text: `Klient: ${projectData.client}`,
                fontSize: 14,
                fontWeight: 'Bold',
                fontFamily: 'Inter',
                fills: [{ type: 'SOLID', color: design_system_1.FABMANAGE_DESIGN_SYSTEM.colors.text.primary }]
            });
            clientInfo.appendChild(clientText);
            info.appendChild(clientInfo);
            const deadlineInfo = figma.createFrame();
            deadlineInfo.name = 'Deadline Info';
            deadlineInfo.layoutMode = 'HORIZONTAL';
            deadlineInfo.itemSpacing = 6;
            deadlineInfo.fills = [];
            const calendarIcon = yield atom_generators_1.AtomGenerators.createIcon({
                width: 16,
                height: 16,
                fills: [{ type: 'SOLID', color: design_system_1.FABMANAGE_DESIGN_SYSTEM.colors.text.secondary }]
            });
            deadlineInfo.appendChild(calendarIcon);
            const deadlineText = yield atom_generators_1.AtomGenerators.createText({
                text: `Deadline: ${new Date(projectData.deadline).toLocaleDateString('pl-PL')}`,
                fontSize: 14,
                fontWeight: 'Regular',
                fontFamily: 'Inter',
                fills: [{ type: 'SOLID', color: design_system_1.FABMANAGE_DESIGN_SYSTEM.colors.text.primary }]
            });
            deadlineInfo.appendChild(deadlineText);
            info.appendChild(deadlineInfo);
            content.appendChild(info);
            // Progress bar
            const progressSection = figma.createFrame();
            progressSection.name = 'Progress Section';
            progressSection.layoutMode = 'VERTICAL';
            progressSection.itemSpacing = 4;
            progressSection.fills = [];
            const progressHeader = figma.createFrame();
            progressHeader.name = 'Progress Header';
            progressHeader.layoutMode = 'HORIZONTAL';
            progressHeader.primaryAxisAlignItems = 'SPACE_BETWEEN';
            progressHeader.fills = [];
            const progressLabel = yield atom_generators_1.AtomGenerators.createText({
                text: 'Postęp',
                fontSize: 14,
                fontWeight: 'Bold',
                fontFamily: 'Inter',
                fills: [{ type: 'SOLID', color: design_system_1.FABMANAGE_DESIGN_SYSTEM.colors.text.primary }]
            });
            progressHeader.appendChild(progressLabel);
            const progressPercent = yield atom_generators_1.AtomGenerators.createText({
                text: `${projectData.progress}%`,
                fontSize: 14,
                fontWeight: 'Regular',
                fontFamily: 'Inter',
                fills: [{ type: 'SOLID', color: design_system_1.FABMANAGE_DESIGN_SYSTEM.colors.text.primary }]
            });
            progressHeader.appendChild(progressPercent);
            progressSection.appendChild(progressHeader);
            const progressBar = yield atom_generators_1.AtomGenerators.createProgressBar({
                width: 318,
                height: 8,
                cornerRadius: 4
            }, projectData.progress);
            progressSection.appendChild(progressBar);
            content.appendChild(progressSection);
            // Project modules
            const modulesSection = figma.createFrame();
            modulesSection.name = 'Modules Section';
            modulesSection.layoutMode = 'VERTICAL';
            modulesSection.itemSpacing = 8;
            modulesSection.fills = [];
            const modulesLabel = yield atom_generators_1.AtomGenerators.createText({
                text: 'MODUŁY PROJEKTU:',
                fontSize: 14,
                fontWeight: 'Bold',
                fontFamily: 'Inter',
                fills: [{ type: 'SOLID', color: design_system_1.FABMANAGE_DESIGN_SYSTEM.colors.text.primary }]
            });
            modulesSection.appendChild(modulesLabel);
            if (projectData.modules && projectData.modules.length > 0) {
                const modulesList = figma.createFrame();
                modulesList.name = 'Modules List';
                modulesList.layoutMode = 'VERTICAL';
                modulesList.itemSpacing = 2;
                modulesList.fills = [];
                for (const module of projectData.modules.slice(0, 3)) {
                    const moduleItem = yield atom_generators_1.AtomGenerators.createText({
                        text: `- ${module.replace('_', ' ')}`,
                        fontSize: 12,
                        fontWeight: 'Regular',
                        fontFamily: 'Inter',
                        fills: [{ type: 'SOLID', color: design_system_1.FABMANAGE_DESIGN_SYSTEM.colors.text.primary }]
                    });
                    modulesList.appendChild(moduleItem);
                }
                if (projectData.modules.length > 3) {
                    const moreModules = yield atom_generators_1.AtomGenerators.createText({
                        text: `+ ${projectData.modules.length - 3} więcej...`,
                        fontSize: 12,
                        fontWeight: 'Regular',
                        fontFamily: 'Inter',
                        fills: [{ type: 'SOLID', color: design_system_1.FABMANAGE_DESIGN_SYSTEM.colors.text.secondary }]
                    });
                    modulesList.appendChild(moreModules);
                }
                modulesSection.appendChild(modulesList);
            }
            else {
                const noModules = yield atom_generators_1.AtomGenerators.createText({
                    text: 'Brak zdefiniowanych modułów',
                    fontSize: 12,
                    fontWeight: 'Regular',
                    fontFamily: 'Inter',
                    fills: [{ type: 'SOLID', color: design_system_1.FABMANAGE_DESIGN_SYSTEM.colors.text.secondary }]
                });
                modulesSection.appendChild(noModules);
            }
            // Total elements count
            const elementsCount = figma.createFrame();
            elementsCount.name = 'Elements Count';
            elementsCount.layoutMode = 'HORIZONTAL';
            elementsCount.itemSpacing = 4;
            elementsCount.fills = [];
            const countLabel = yield atom_generators_1.AtomGenerators.createText({
                text: 'Łącznie elementów:',
                fontSize: 12,
                fontWeight: 'Regular',
                fontFamily: 'Inter',
                fills: [{ type: 'SOLID', color: design_system_1.FABMANAGE_DESIGN_SYSTEM.colors.text.secondary }]
            });
            elementsCount.appendChild(countLabel);
            const countValue = yield atom_generators_1.AtomGenerators.createText({
                text: projectData.tilesCount.toString(),
                fontSize: 12,
                fontWeight: 'Bold',
                fontFamily: 'Inter',
                fills: [{ type: 'SOLID', color: design_system_1.FABMANAGE_DESIGN_SYSTEM.colors.text.primary }]
            });
            elementsCount.appendChild(countValue);
            modulesSection.appendChild(elementsCount);
            content.appendChild(modulesSection);
            // Manager info
            if (projectData.manager) {
                const managerSection = figma.createFrame();
                managerSection.name = 'Manager Section';
                managerSection.layoutMode = 'HORIZONTAL';
                managerSection.itemSpacing = 8;
                managerSection.fills = [];
                const avatar = yield atom_generators_1.AtomGenerators.createAvatar({
                    width: 24,
                    height: 24,
                    fills: [{ type: 'SOLID', color: design_system_1.FABMANAGE_DESIGN_SYSTEM.colors.background.tertiary }]
                });
                managerSection.appendChild(avatar);
                const managerText = yield atom_generators_1.AtomGenerators.createText({
                    text: `Manager: ${projectData.manager}`,
                    fontSize: 12,
                    fontWeight: 'Regular',
                    fontFamily: 'Inter',
                    fills: [{ type: 'SOLID', color: design_system_1.FABMANAGE_DESIGN_SYSTEM.colors.text.secondary }]
                });
                managerSection.appendChild(managerText);
                content.appendChild(managerSection);
            }
            card.appendChild(content);
            return card;
        });
    }
    // Generate ProjectElements component
    static createProjectElements(projectElementsData) {
        return __awaiter(this, void 0, void 0, function* () {
            const container = figma.createFrame();
            container.name = 'Project Elements';
            container.resize(1200, 800);
            container.layoutMode = 'VERTICAL';
            container.itemSpacing = 16;
            container.fills = [];
            // Header
            const header = figma.createFrame();
            header.name = 'Elements Header';
            header.layoutMode = 'HORIZONTAL';
            header.primaryAxisAlignItems = 'SPACE_BETWEEN';
            header.counterAxisAlignItems = 'CENTER';
            header.fills = [];
            const title = yield atom_generators_1.AtomGenerators.createText({
                text: 'Elementy Projektu',
                fontSize: 16,
                fontWeight: 'Bold',
                fontFamily: 'Inter',
                fills: [{ type: 'SOLID', color: design_system_1.FABMANAGE_DESIGN_SYSTEM.colors.text.primary }]
            });
            header.appendChild(title);
            const subtitle = yield atom_generators_1.AtomGenerators.createText({
                text: 'Kanban na górze, grupy poniżej',
                fontSize: 12,
                fontWeight: 'Regular',
                fontFamily: 'Inter',
                fills: [{ type: 'SOLID', color: design_system_1.FABMANAGE_DESIGN_SYSTEM.colors.text.secondary }]
            });
            header.appendChild(subtitle);
            container.appendChild(header);
            // Quick Add Form
            const quickAddForm = yield molecule_generators_1.MoleculeGenerators.createCard({
                width: 1200,
                height: 80,
                padding: { top: 16, right: 16, bottom: 16, left: 16 },
                layoutMode: 'HORIZONTAL',
                itemSpacing: 8
            });
            quickAddForm.name = 'Quick Add Form';
            const input = yield molecule_generators_1.MoleculeGenerators.createFormInput({
                width: 300,
                height: 32,
                text: 'np. Panel frontowy'
            });
            quickAddForm.appendChild(input);
            const addButton = yield atom_generators_1.AtomGenerators.createButton({
                text: 'Dodaj',
                width: 100,
                height: 32,
                cornerRadius: 6
            });
            quickAddForm.appendChild(addButton);
            container.appendChild(quickAddForm);
            // Kanban Board
            const kanbanBoard = figma.createFrame();
            kanbanBoard.name = 'Kanban Board';
            kanbanBoard.layoutMode = 'HORIZONTAL';
            kanbanBoard.itemSpacing = 16;
            kanbanBoard.fills = [];
            const columns = [
                { id: 'nowy', title: 'Nowy', color: design_system_1.FABMANAGE_DESIGN_SYSTEM.colors.info },
                { id: 'projektowanie', title: 'Projektowanie', color: design_system_1.FABMANAGE_DESIGN_SYSTEM.colors.warning },
                { id: 'cnc', title: 'Wycinanie CNC', color: design_system_1.FABMANAGE_DESIGN_SYSTEM.colors.primary },
                { id: 'montaz', title: 'Składanie (Produkcja)', color: design_system_1.FABMANAGE_DESIGN_SYSTEM.colors.success }
            ];
            for (const column of columns) {
                const columnTiles = projectElementsData.tiles.filter(tile => {
                    switch (tile.status) {
                        case 'W KOLEJCE': return column.id === 'nowy';
                        case 'Projektowanie':
                        case 'W trakcie projektowania':
                        case 'Do akceptacji':
                        case 'Wymagają poprawek':
                            return column.id === 'projektowanie';
                        case 'W TRAKCIE CIĘCIA':
                        case 'WYCIĘTE':
                            return column.id === 'cnc';
                        case 'Gotowy do montażu':
                        case 'Zaakceptowane':
                            return column.id === 'montaz';
                        default: return column.id === 'nowy';
                    }
                });
                const kanbanColumn = figma.createFrame();
                kanbanColumn.name = `Column - ${column.title}`;
                kanbanColumn.resize(250, 400);
                kanbanColumn.cornerRadius = 8;
                kanbanColumn.paddingTop = 16;
                kanbanColumn.paddingRight = 16;
                kanbanColumn.paddingBottom = 16;
                kanbanColumn.paddingLeft = 16;
                kanbanColumn.layoutMode = 'VERTICAL';
                kanbanColumn.itemSpacing = 8;
                kanbanColumn.fills = [{ type: 'SOLID', color: { r: column.color.r, g: column.color.g, b: column.color.b } }];
                // Column header
                const columnHeader = figma.createFrame();
                columnHeader.name = 'Column Header';
                columnHeader.layoutMode = 'HORIZONTAL';
                columnHeader.primaryAxisAlignItems = 'SPACE_BETWEEN';
                columnHeader.counterAxisAlignItems = 'CENTER';
                columnHeader.fills = [];
                const columnTitle = yield atom_generators_1.AtomGenerators.createText({
                    text: column.title,
                    fontSize: 14,
                    fontWeight: 'Bold',
                    fontFamily: 'Inter',
                    fills: [{ type: 'SOLID', color: column.color }]
                });
                columnHeader.appendChild(columnTitle);
                const countBadge = yield atom_generators_1.AtomGenerators.createStatusBadge({
                    text: columnTiles.length.toString(),
                    width: 24,
                    height: 20,
                    cornerRadius: 10,
                    padding: { top: 2, right: 6, bottom: 2, left: 6 },
                    fills: [{ type: 'SOLID', color: column.color }]
                });
                columnHeader.appendChild(countBadge);
                kanbanColumn.appendChild(columnHeader);
                // Add tiles to column
                for (const tile of columnTiles) {
                    const tileCard = yield molecule_generators_1.MoleculeGenerators.createTileCard({
                        width: 218,
                        height: 80,
                        padding: { top: 8, right: 8, bottom: 8, left: 8 },
                        layoutMode: 'VERTICAL',
                        itemSpacing: 4
                    });
                    const tileName = yield atom_generators_1.AtomGenerators.createText({
                        text: tile.name,
                        fontSize: 14,
                        fontWeight: 'Bold',
                        fontFamily: 'Inter',
                        fills: [{ type: 'SOLID', color: design_system_1.FABMANAGE_DESIGN_SYSTEM.colors.text.primary }]
                    });
                    tileCard.appendChild(tileName);
                    const tileStatus = yield atom_generators_1.AtomGenerators.createStatusBadge({
                        text: tile.status,
                        width: 80,
                        height: 20,
                        cornerRadius: 10,
                        padding: { top: 2, right: 6, bottom: 2, left: 6 }
                    });
                    tileCard.appendChild(tileStatus);
                    kanbanColumn.appendChild(tileCard);
                }
                if (columnTiles.length === 0) {
                    const emptyState = yield atom_generators_1.AtomGenerators.createText({
                        text: 'Brak elementów',
                        fontSize: 12,
                        fontWeight: 'Regular',
                        fontFamily: 'Inter',
                        textAlign: 'CENTER',
                        fills: [{ type: 'SOLID', color: design_system_1.FABMANAGE_DESIGN_SYSTEM.colors.text.secondary }]
                    });
                    emptyState.x = (kanbanColumn.width - emptyState.width) / 2;
                    emptyState.y = 100;
                    kanbanColumn.appendChild(emptyState);
                }
                kanbanBoard.appendChild(kanbanColumn);
            }
            container.appendChild(kanbanBoard);
            // Groups section
            const groupsSection = figma.createFrame();
            groupsSection.name = 'Groups Section';
            groupsSection.layoutMode = 'VERTICAL';
            groupsSection.itemSpacing = 8;
            groupsSection.fills = [];
            const groupsHeader = figma.createFrame();
            groupsHeader.name = 'Groups Header';
            groupsHeader.layoutMode = 'HORIZONTAL';
            groupsHeader.primaryAxisAlignItems = 'SPACE_BETWEEN';
            groupsHeader.counterAxisAlignItems = 'CENTER';
            groupsHeader.fills = [];
            const groupsTitle = yield atom_generators_1.AtomGenerators.createText({
                text: 'Grupy',
                fontSize: 14,
                fontWeight: 'Bold',
                fontFamily: 'Inter',
                fills: [{ type: 'SOLID', color: design_system_1.FABMANAGE_DESIGN_SYSTEM.colors.text.primary }]
            });
            groupsHeader.appendChild(groupsTitle);
            const newGroupButton = yield atom_generators_1.AtomGenerators.createButton({
                text: 'Nowa grupa',
                width: 100,
                height: 28,
                cornerRadius: 6
            });
            groupsHeader.appendChild(newGroupButton);
            groupsSection.appendChild(groupsHeader);
            // Add groups
            for (const group of projectElementsData.groups) {
                const groupCard = yield molecule_generators_1.MoleculeGenerators.createCard({
                    width: 1200,
                    height: 60,
                    padding: { top: 12, right: 16, bottom: 12, left: 16 },
                    layoutMode: 'HORIZONTAL',
                    itemSpacing: 12
                });
                groupCard.name = `Group - ${group.name}`;
                const groupName = yield atom_generators_1.AtomGenerators.createText({
                    text: group.name,
                    fontSize: 16,
                    fontWeight: 'Bold',
                    fontFamily: 'Inter',
                    fills: [{ type: 'SOLID', color: design_system_1.FABMANAGE_DESIGN_SYSTEM.colors.text.primary }]
                });
                groupCard.appendChild(groupName);
                const groupCount = yield atom_generators_1.AtomGenerators.createText({
                    text: `${group.tiles.length} elementów`,
                    fontSize: 12,
                    fontWeight: 'Regular',
                    fontFamily: 'Inter',
                    fills: [{ type: 'SOLID', color: design_system_1.FABMANAGE_DESIGN_SYSTEM.colors.text.secondary }]
                });
                groupCard.appendChild(groupCount);
                groupsSection.appendChild(groupCard);
            }
            container.appendChild(groupsSection);
            return container;
        });
    }
    // Generate all organism variants
    static generateOrganismVariants(component) {
        return __awaiter(this, void 0, void 0, function* () {
            const variants = [];
            if (!component.variants)
                return variants;
            for (const variant of component.variants) {
                const mergedProperties = Object.assign(Object.assign({}, component.properties), variant.properties);
                let variantNode;
                switch (component.id) {
                    case 'project-card':
                        // Create sample data for variant
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
                        variantNode = yield this.createProjectCard(sampleProjectData);
                        variantNode.name = `${component.name} - ${variant.name}`;
                        break;
                    case 'project-elements':
                        // Create sample data for variant
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
                        variantNode = yield this.createProjectElements(sampleProjectElementsData);
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
exports.OrganismGenerators = OrganismGenerators;
