import type { AtomicComponent, ProjectCardData, ProjectElementsData } from '../types/atomic-design';
import { ComponentProperties } from '../types/atomic-design'
import { FABMANAGE_DESIGN_SYSTEM, getStatusColor, getProjectTypeColor, getTextColorForBackground } from '../config/design-system'
import { AtomGenerators } from './atom-generators'
import { MoleculeGenerators } from './molecule-generators'

// Organism Generators - Create complex UI components in Figma
export class OrganismGenerators {

    // Generate ProjectCard component
    static async createProjectCard(projectData: ProjectCardData): Promise<FrameNode> {
        const card = figma.createFrame()
        card.name = `Project Card - ${projectData.name}`
        card.resize(350, 400)
        card.cornerRadius = 12
        card.fills = [{ type: 'SOLID', color: FABMANAGE_DESIGN_SYSTEM.colors.background.primary }]
        card.effects = [FABMANAGE_DESIGN_SYSTEM.effects.shadows.lg as Effect]

        // Thumbnail
        const thumbnail = await MoleculeGenerators.createProjectThumbnail({
            width: 350,
            height: 200,
            cornerRadius: 12
        })
        card.appendChild(thumbnail)

        // Content area
        const content = await MoleculeGenerators.createProjectContent({
            width: 350,
            height: 200,
            padding: { top: 16, right: 16, bottom: 16, left: 16 },
            layoutMode: 'VERTICAL',
            itemSpacing: 12
        })

        // Header with name and status
        const header = figma.createFrame()
        header.name = 'Project Header'
        header.resize(318, 40)
        header.layoutMode = 'HORIZONTAL'
        header.primaryAxisAlignItems = 'SPACE_BETWEEN'
        header.counterAxisAlignItems = 'CENTER'
        header.fills = []

        // Title section
        const titleSection = figma.createFrame()
        titleSection.name = 'Title Section'
        titleSection.layoutMode = 'VERTICAL'
        titleSection.itemSpacing = 4
        titleSection.fills = []

        const title = await AtomGenerators.createText({
            text: projectData.name,
            fontSize: 18,
            fontWeight: 'Bold',
            fontFamily: 'Inter',
            fills: [{ type: 'SOLID', color: FABMANAGE_DESIGN_SYSTEM.colors.text.primary }]
        })
        titleSection.appendChild(title)

        const projectNumber = await AtomGenerators.createText({
            text: `Nr: ${projectData.numer}`,
            fontSize: 12,
            fontWeight: 'Regular',
            fontFamily: 'Inter',
            fills: [{ type: 'SOLID', color: FABMANAGE_DESIGN_SYSTEM.colors.text.secondary }]
        })
        titleSection.appendChild(projectNumber)

        header.appendChild(titleSection)

        // Status badge
        const statusBadge = await AtomGenerators.createStatusBadge({
            text: projectData.status,
            width: 80,
            height: 24,
            cornerRadius: 12,
            padding: { top: 4, right: 8, bottom: 4, left: 8 }
        })
        header.appendChild(statusBadge)

        content.appendChild(header)

        // Project meta (type and location)
        const meta = figma.createFrame()
        meta.name = 'Project Meta'
        meta.layoutMode = 'HORIZONTAL'
        meta.itemSpacing = 8
        meta.fills = []

        const typeTag = await AtomGenerators.createTag({
            text: projectData.typ,
            width: 60,
            height: 24,
            cornerRadius: 12,
            padding: { top: 4, right: 8, bottom: 4, left: 8 },
            fills: [{ type: 'SOLID', color: getProjectTypeColor(projectData.typ) }]
        })
        meta.appendChild(typeTag)

        const location = await AtomGenerators.createText({
            text: `📍 ${projectData.lokalizacja}`,
            fontSize: 12,
            fontWeight: 'Regular',
            fontFamily: 'Inter',
            fills: [{ type: 'SOLID', color: FABMANAGE_DESIGN_SYSTEM.colors.text.secondary }]
        })
        meta.appendChild(location)

        content.appendChild(meta)

        // Project info (client and deadline)
        const info = figma.createFrame()
        info.name = 'Project Info'
        info.layoutMode = 'VERTICAL'
        info.itemSpacing = 4
        info.fills = []

        const clientInfo = figma.createFrame()
        clientInfo.name = 'Client Info'
        clientInfo.layoutMode = 'HORIZONTAL'
        clientInfo.itemSpacing = 6
        clientInfo.fills = []

        const userIcon = await AtomGenerators.createIcon({
            width: 16,
            height: 16,
            fills: [{ type: 'SOLID', color: FABMANAGE_DESIGN_SYSTEM.colors.text.secondary }]
        })
        clientInfo.appendChild(userIcon)

        const clientText = await AtomGenerators.createText({
            text: `Klient: ${projectData.client}`,
            fontSize: 14,
            fontWeight: 'Bold',
            fontFamily: 'Inter',
            fills: [{ type: 'SOLID', color: FABMANAGE_DESIGN_SYSTEM.colors.text.primary }]
        })
        clientInfo.appendChild(clientText)

        info.appendChild(clientInfo)

        const deadlineInfo = figma.createFrame()
        deadlineInfo.name = 'Deadline Info'
        deadlineInfo.layoutMode = 'HORIZONTAL'
        deadlineInfo.itemSpacing = 6
        deadlineInfo.fills = []

        const calendarIcon = await AtomGenerators.createIcon({
            width: 16,
            height: 16,
            fills: [{ type: 'SOLID', color: FABMANAGE_DESIGN_SYSTEM.colors.text.secondary }]
        })
        deadlineInfo.appendChild(calendarIcon)

        const deadlineText = await AtomGenerators.createText({
            text: `Deadline: ${new Date(projectData.deadline).toLocaleDateString('pl-PL')}`,
            fontSize: 14,
            fontWeight: 'Regular',
            fontFamily: 'Inter',
            fills: [{ type: 'SOLID', color: FABMANAGE_DESIGN_SYSTEM.colors.text.primary }]
        })
        deadlineInfo.appendChild(deadlineText)

        info.appendChild(deadlineInfo)
        content.appendChild(info)

        // Progress bar
        const progressSection = figma.createFrame()
        progressSection.name = 'Progress Section'
        progressSection.layoutMode = 'VERTICAL'
        progressSection.itemSpacing = 4
        progressSection.fills = []

        const progressHeader = figma.createFrame()
        progressHeader.name = 'Progress Header'
        progressHeader.layoutMode = 'HORIZONTAL'
        progressHeader.primaryAxisAlignItems = 'SPACE_BETWEEN'
        progressHeader.fills = []

        const progressLabel = await AtomGenerators.createText({
            text: 'Postęp',
            fontSize: 14,
            fontWeight: 'Bold',
            fontFamily: 'Inter',
            fills: [{ type: 'SOLID', color: FABMANAGE_DESIGN_SYSTEM.colors.text.primary }]
        })
        progressHeader.appendChild(progressLabel)

        const progressPercent = await AtomGenerators.createText({
            text: `${projectData.progress}%`,
            fontSize: 14,
            fontWeight: 'Regular',
            fontFamily: 'Inter',
            fills: [{ type: 'SOLID', color: FABMANAGE_DESIGN_SYSTEM.colors.text.primary }]
        })
        progressHeader.appendChild(progressPercent)

        progressSection.appendChild(progressHeader)

        const progressBar = await AtomGenerators.createProgressBar({
            width: 318,
            height: 8,
            cornerRadius: 4
        }, projectData.progress)
        progressSection.appendChild(progressBar)

        content.appendChild(progressSection)

        // Project modules
        const modulesSection = figma.createFrame()
        modulesSection.name = 'Modules Section'
        modulesSection.layoutMode = 'VERTICAL'
        modulesSection.itemSpacing = 8
        modulesSection.fills = []

        const modulesLabel = await AtomGenerators.createText({
            text: 'MODUŁY PROJEKTU:',
            fontSize: 14,
            fontWeight: 'Bold',
            fontFamily: 'Inter',
            fills: [{ type: 'SOLID', color: FABMANAGE_DESIGN_SYSTEM.colors.text.primary }]
        })
        modulesSection.appendChild(modulesLabel)

        if (projectData.modules && projectData.modules.length > 0) {
            const modulesList = figma.createFrame()
            modulesList.name = 'Modules List'
            modulesList.layoutMode = 'VERTICAL'
            modulesList.itemSpacing = 2
            modulesList.fills = []

            for (const module of projectData.modules.slice(0, 3)) {
                const moduleItem = await AtomGenerators.createText({
                    text: `- ${module.replace('_', ' ')}`,
                    fontSize: 12,
                    fontWeight: 'Regular',
                    fontFamily: 'Inter',
                    fills: [{ type: 'SOLID', color: FABMANAGE_DESIGN_SYSTEM.colors.text.primary }]
                })
                modulesList.appendChild(moduleItem)
            }

            if (projectData.modules.length > 3) {
                const moreModules = await AtomGenerators.createText({
                    text: `+ ${projectData.modules.length - 3} więcej...`,
                    fontSize: 12,
                    fontWeight: 'Regular',
                    fontFamily: 'Inter',
                    fills: [{ type: 'SOLID', color: FABMANAGE_DESIGN_SYSTEM.colors.text.secondary }]
                })
                modulesList.appendChild(moreModules)
            }

            modulesSection.appendChild(modulesList)
        } else {
            const noModules = await AtomGenerators.createText({
                text: 'Brak zdefiniowanych modułów',
                fontSize: 12,
                fontWeight: 'Regular',
                fontFamily: 'Inter',
                fills: [{ type: 'SOLID', color: FABMANAGE_DESIGN_SYSTEM.colors.text.secondary }]
            })
            modulesSection.appendChild(noModules)
        }

        // Total elements count
        const elementsCount = figma.createFrame()
        elementsCount.name = 'Elements Count'
        elementsCount.layoutMode = 'HORIZONTAL'
        elementsCount.itemSpacing = 4
        elementsCount.fills = []

        const countLabel = await AtomGenerators.createText({
            text: 'Łącznie elementów:',
            fontSize: 12,
            fontWeight: 'Regular',
            fontFamily: 'Inter',
            fills: [{ type: 'SOLID', color: FABMANAGE_DESIGN_SYSTEM.colors.text.secondary }]
        })
        elementsCount.appendChild(countLabel)

        const countValue = await AtomGenerators.createText({
            text: projectData.tilesCount.toString(),
            fontSize: 12,
            fontWeight: 'Bold',
            fontFamily: 'Inter',
            fills: [{ type: 'SOLID', color: FABMANAGE_DESIGN_SYSTEM.colors.text.primary }]
        })
        elementsCount.appendChild(countValue)

        modulesSection.appendChild(elementsCount)
        content.appendChild(modulesSection)

        // Manager info
        if (projectData.manager) {
            const managerSection = figma.createFrame()
            managerSection.name = 'Manager Section'
            managerSection.layoutMode = 'HORIZONTAL'
            managerSection.itemSpacing = 8
            managerSection.fills = []

            const avatar = await AtomGenerators.createAvatar({
                width: 24,
                height: 24,
                fills: [{ type: 'SOLID', color: FABMANAGE_DESIGN_SYSTEM.colors.background.tertiary }]
            })
            managerSection.appendChild(avatar)

            const managerText = await AtomGenerators.createText({
                text: `Manager: ${projectData.manager}`,
                fontSize: 12,
                fontWeight: 'Regular',
                fontFamily: 'Inter',
                fills: [{ type: 'SOLID', color: FABMANAGE_DESIGN_SYSTEM.colors.text.secondary }]
            })
            managerSection.appendChild(managerText)

            content.appendChild(managerSection)
        }

        card.appendChild(content)

        return card
    }

    // Generate ProjectElements component
    static async createProjectElements(projectElementsData: ProjectElementsData): Promise<FrameNode> {
        const container = figma.createFrame()
        container.name = 'Project Elements'
        container.resize(1200, 800)
        container.layoutMode = 'VERTICAL'
        container.itemSpacing = 16
        container.fills = []

        // Header
        const header = figma.createFrame()
        header.name = 'Elements Header'
        header.layoutMode = 'HORIZONTAL'
        header.primaryAxisAlignItems = 'SPACE_BETWEEN'
        header.counterAxisAlignItems = 'CENTER'
        header.fills = []

        const title = await AtomGenerators.createText({
            text: 'Elementy Projektu',
            fontSize: 16,
            fontWeight: 'Bold',
            fontFamily: 'Inter',
            fills: [{ type: 'SOLID', color: FABMANAGE_DESIGN_SYSTEM.colors.text.primary }]
        })
        header.appendChild(title)

        const subtitle = await AtomGenerators.createText({
            text: 'Kanban na górze, grupy poniżej',
            fontSize: 12,
            fontWeight: 'Regular',
            fontFamily: 'Inter',
            fills: [{ type: 'SOLID', color: FABMANAGE_DESIGN_SYSTEM.colors.text.secondary }]
        })
        header.appendChild(subtitle)

        container.appendChild(header)

        // Quick Add Form
        const quickAddForm = await MoleculeGenerators.createCard({
            width: 1200,
            height: 80,
            padding: { top: 16, right: 16, bottom: 16, left: 16 },
            layoutMode: 'HORIZONTAL',
            itemSpacing: 8
        })
        quickAddForm.name = 'Quick Add Form'

        const input = await MoleculeGenerators.createFormInput({
            width: 300,
            height: 32,
            text: 'np. Panel frontowy'
        })
        quickAddForm.appendChild(input)

        const addButton = await AtomGenerators.createButton({
            text: 'Dodaj',
            width: 100,
            height: 32,
            cornerRadius: 6
        })
        quickAddForm.appendChild(addButton)

        container.appendChild(quickAddForm)

        // Kanban Board
        const kanbanBoard = figma.createFrame()
        kanbanBoard.name = 'Kanban Board'
        kanbanBoard.layoutMode = 'HORIZONTAL'
        kanbanBoard.itemSpacing = 16
        kanbanBoard.fills = []

        const columns = [
            { id: 'nowy', title: 'Nowy', color: FABMANAGE_DESIGN_SYSTEM.colors.info },
            { id: 'projektowanie', title: 'Projektowanie', color: FABMANAGE_DESIGN_SYSTEM.colors.warning },
            { id: 'cnc', title: 'Wycinanie CNC', color: FABMANAGE_DESIGN_SYSTEM.colors.primary },
            { id: 'montaz', title: 'Składanie (Produkcja)', color: FABMANAGE_DESIGN_SYSTEM.colors.success }
        ]

        for (const column of columns) {
            const columnTiles = projectElementsData.tiles.filter(tile => {
                switch (tile.status) {
                    case 'W KOLEJCE': return column.id === 'nowy'
                    case 'Projektowanie':
                    case 'W trakcie projektowania':
                    case 'Do akceptacji':
                    case 'Wymagają poprawek':
                        return column.id === 'projektowanie'
                    case 'W TRAKCIE CIĘCIA':
                    case 'WYCIĘTE':
                        return column.id === 'cnc'
                    case 'Gotowy do montażu':
                    case 'Zaakceptowane':
                        return column.id === 'montaz'
                    default: return column.id === 'nowy'
                }
            })

            const kanbanColumn = figma.createFrame()
            kanbanColumn.name = `Column - ${column.title}`
            kanbanColumn.resize(250, 400)
            kanbanColumn.cornerRadius = 8
            kanbanColumn.paddingTop = 16
            kanbanColumn.paddingRight = 16
            kanbanColumn.paddingBottom = 16
            kanbanColumn.paddingLeft = 16
            kanbanColumn.layoutMode = 'VERTICAL'
            kanbanColumn.itemSpacing = 8
            kanbanColumn.fills = [{ type: 'SOLID', color: { r: column.color.r, g: column.color.g, b: column.color.b } }]

            // Column header
            const columnHeader = figma.createFrame()
            columnHeader.name = 'Column Header'
            columnHeader.layoutMode = 'HORIZONTAL'
            columnHeader.primaryAxisAlignItems = 'SPACE_BETWEEN'
            columnHeader.counterAxisAlignItems = 'CENTER'
            columnHeader.fills = []

            const columnTitle = await AtomGenerators.createText({
                text: column.title,
                fontSize: 14,
                fontWeight: 'Bold',
                fontFamily: 'Inter',
                fills: [{ type: 'SOLID', color: column.color }]
            })
            columnHeader.appendChild(columnTitle)

            const countBadge = await AtomGenerators.createStatusBadge({
                text: columnTiles.length.toString(),
                width: 24,
                height: 20,
                cornerRadius: 10,
                padding: { top: 2, right: 6, bottom: 2, left: 6 },
                fills: [{ type: 'SOLID', color: column.color }]
            })
            columnHeader.appendChild(countBadge)

            kanbanColumn.appendChild(columnHeader)

            // Add tiles to column
            for (const tile of columnTiles) {
                const tileCard = await MoleculeGenerators.createTileCard({
                    width: 218,
                    height: 80,
                    padding: { top: 8, right: 8, bottom: 8, left: 8 },
                    layoutMode: 'VERTICAL',
                    itemSpacing: 4
                })

                const tileName = await AtomGenerators.createText({
                    text: tile.name,
                    fontSize: 14,
                    fontWeight: 'Bold',
                    fontFamily: 'Inter',
                    fills: [{ type: 'SOLID', color: FABMANAGE_DESIGN_SYSTEM.colors.text.primary }]
                })
                tileCard.appendChild(tileName)

                const tileStatus = await AtomGenerators.createStatusBadge({
                    text: tile.status,
                    width: 80,
                    height: 20,
                    cornerRadius: 10,
                    padding: { top: 2, right: 6, bottom: 2, left: 6 }
                })
                tileCard.appendChild(tileStatus)

                kanbanColumn.appendChild(tileCard)
            }

            if (columnTiles.length === 0) {
                const emptyState = await AtomGenerators.createText({
                    text: 'Brak elementów',
                    fontSize: 12,
                    fontWeight: 'Regular',
                    fontFamily: 'Inter',
                    textAlign: 'CENTER',
                    fills: [{ type: 'SOLID', color: FABMANAGE_DESIGN_SYSTEM.colors.text.secondary }]
                })
                emptyState.x = (kanbanColumn.width - emptyState.width) / 2
                emptyState.y = 100
                kanbanColumn.appendChild(emptyState)
            }

            kanbanBoard.appendChild(kanbanColumn)
        }

        container.appendChild(kanbanBoard)

        // Groups section
        const groupsSection = figma.createFrame()
        groupsSection.name = 'Groups Section'
        groupsSection.layoutMode = 'VERTICAL'
        groupsSection.itemSpacing = 8
        groupsSection.fills = []

        const groupsHeader = figma.createFrame()
        groupsHeader.name = 'Groups Header'
        groupsHeader.layoutMode = 'HORIZONTAL'
        groupsHeader.primaryAxisAlignItems = 'SPACE_BETWEEN'
        groupsHeader.counterAxisAlignItems = 'CENTER'
        groupsHeader.fills = []

        const groupsTitle = await AtomGenerators.createText({
            text: 'Grupy',
            fontSize: 14,
            fontWeight: 'Bold',
            fontFamily: 'Inter',
            fills: [{ type: 'SOLID', color: FABMANAGE_DESIGN_SYSTEM.colors.text.primary }]
        })
        groupsHeader.appendChild(groupsTitle)

        const newGroupButton = await AtomGenerators.createButton({
            text: 'Nowa grupa',
            width: 100,
            height: 28,
            cornerRadius: 6
        })
        groupsHeader.appendChild(newGroupButton)

        groupsSection.appendChild(groupsHeader)

        // Add groups
        for (const group of projectElementsData.groups) {
            const groupCard = await MoleculeGenerators.createCard({
                width: 1200,
                height: 60,
                padding: { top: 12, right: 16, bottom: 12, left: 16 },
                layoutMode: 'HORIZONTAL',
                itemSpacing: 12
            })
            groupCard.name = `Group - ${group.name}`

            const groupName = await AtomGenerators.createText({
                text: group.name,
                fontSize: 16,
                fontWeight: 'Bold',
                fontFamily: 'Inter',
                fills: [{ type: 'SOLID', color: FABMANAGE_DESIGN_SYSTEM.colors.text.primary }]
            })
            groupCard.appendChild(groupName)

            const groupCount = await AtomGenerators.createText({
                text: `${group.tiles.length} elementów`,
                fontSize: 12,
                fontWeight: 'Regular',
                fontFamily: 'Inter',
                fills: [{ type: 'SOLID', color: FABMANAGE_DESIGN_SYSTEM.colors.text.secondary }]
            })
            groupCard.appendChild(groupCount)

            groupsSection.appendChild(groupCard)
        }

        container.appendChild(groupsSection)

        return container
    }

    // Generate all organism variants
    static async generateOrganismVariants(component: AtomicComponent): Promise<FrameNode[]> {
        const variants: FrameNode[] = []

        if (!component.variants) return variants

        for (const variant of component.variants) {
            const mergedProperties = { ...component.properties, ...variant.properties }
            let variantNode: FrameNode

            switch (component.id) {
                case 'project-card':
                    // Create sample data for variant
                    const sampleProjectData: ProjectCardData = {
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
                    }
                    variantNode = await this.createProjectCard(sampleProjectData)
                    variantNode.name = `${component.name} - ${variant.name}`
                    break

                case 'project-elements':
                    // Create sample data for variant
                    const sampleProjectElementsData: ProjectElementsData = {
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
                    }
                    variantNode = await this.createProjectElements(sampleProjectElementsData)
                    variantNode.name = `${component.name} - ${variant.name}`
                    break

                default:
                    continue
            }

            variants.push(variantNode)
        }

        return variants
    }
}
