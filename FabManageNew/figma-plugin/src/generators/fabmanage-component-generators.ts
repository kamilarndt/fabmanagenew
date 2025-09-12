import { AntdComponentGenerators } from './antd-component-generators'
import { AntdDesignSystem } from '../config/antd-design-system'
import { FABMANAGE_DESIGN_SYSTEM, getStatusColor, getProjectTypeColor } from '../config/design-system'

// Generatory komponentów FabManage - dokładne odwzorowanie z aplikacji
export class FabManageComponentGenerators {

    // Generowanie StatusBadge (z aplikacji)
    static async createStatusBadge(status: string): Promise<FrameNode> {
        const badge = figma.createFrame()
        badge.name = `StatusBadge - ${status}`
        badge.resize(80, 24)
        badge.cornerRadius = AntdDesignSystem.getBorderRadiusFromVariable('border-radius-sm')
        badge.paddingTop = 4
        badge.paddingRight = 8
        badge.paddingBottom = 4
        badge.paddingLeft = 8

        // Kolor na podstawie statusu (zgodnie z aplikacją)
        const statusColor = getStatusColor(status)
        badge.fills = [{ type: 'SOLID', color: statusColor }]

        // Tekst statusu
        await figma.loadFontAsync({ family: 'Inter', style: 'Medium' })
        const text = figma.createText()
        text.characters = status.toUpperCase()
        text.fontSize = AntdDesignSystem.getFontSizeFromVariable('font-size-sm')
        text.fontName = { family: 'Inter', style: 'Medium' }
        text.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }]
        text.x = (badge.width - text.width) / 2
        text.y = (badge.height - text.height) / 2
        badge.appendChild(text)

        return badge
    }

    // Generowanie ProjectCard (z aplikacji)
    static async createProjectCard(projectData: {
        name: string
        numer: string
        status: string
        typ: string
        lokalizacja: string
        client: string
        deadline: string
        progress: number
        modules: string[]
        tilesCount: number
        manager?: string
        miniatura?: string
    }): Promise<FrameNode> {
        const card = await AntdComponentGenerators.createAntdCard({
            hoverable: true,
            size: 'default',
            bordered: true
        })
        card.name = `ProjectCard - ${projectData.name}`
        card.resize(350, 400)

        // Thumbnail
        const thumbnail = figma.createFrame()
        thumbnail.name = 'Project Thumbnail'
        thumbnail.resize(350, 200)
        thumbnail.cornerRadius = AntdDesignSystem.getBorderRadiusFromVariable('border-radius-md')
        thumbnail.x = 0
        thumbnail.y = 0

        if (projectData.miniatura) {
            // Placeholder for image
            thumbnail.fills = [{
                type: 'GRADIENT_LINEAR',
                gradientStops: [
                    { color: { r: 0.4, g: 0.5, b: 0.9, a: 1 }, position: 0 },
                    { color: { r: 0.5, g: 0.3, b: 0.6, a: 1 }, position: 1 }
                ],
                gradientTransform: [[1, 0, 0], [0, 1, 0]]
            }]
        } else {
            // Default gradient
            thumbnail.fills = [{
                type: 'GRADIENT_LINEAR',
                gradientStops: [
                    { color: { r: 0.4, g: 0.5, b: 0.9, a: 1 }, position: 0 },
                    { color: { r: 0.5, g: 0.3, b: 0.6, a: 1 }, position: 1 }
                ],
                gradientTransform: [[1, 0, 0], [0, 1, 0]]
            }]
        }

        // Placeholder icon
        await figma.loadFontAsync({ family: 'Inter', style: 'Regular' })
        const icon = figma.createText()
        icon.characters = '🖼️'
        icon.fontSize = 32
        icon.fontName = { family: 'Inter', style: 'Regular' }
        icon.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }]
        icon.x = (thumbnail.width - icon.width) / 2
        icon.y = (thumbnail.height - icon.height) / 2
        thumbnail.appendChild(icon)

        card.appendChild(thumbnail)

        // Content area
        const content = figma.createFrame()
        content.name = 'Project Content'
        content.resize(350, 200)
        content.x = 0
        content.y = 200
        content.paddingTop = 16
        content.paddingRight = 16
        content.paddingBottom = 16
        content.paddingLeft = 16
        content.layoutMode = 'VERTICAL'
        content.itemSpacing = 12
        content.fills = []

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

        const title = await AntdComponentGenerators.createAntdTypography({
            level: 4,
            children: projectData.name
        })
        titleSection.appendChild(title)

        const projectNumber = await AntdComponentGenerators.createAntdTypography({
            type: 'secondary',
            children: `Nr: ${projectData.numer}`
        })
        projectNumber.fontSize = AntdDesignSystem.getFontSizeFromVariable('font-size-sm')
        titleSection.appendChild(projectNumber)

        header.appendChild(titleSection)

        // Status badge
        const statusBadge = await this.createStatusBadge(projectData.status)
        header.appendChild(statusBadge)

        content.appendChild(header)

        // Project meta (type and location)
        const meta = figma.createFrame()
        meta.name = 'Project Meta'
        meta.layoutMode = 'HORIZONTAL'
        meta.itemSpacing = 8
        meta.fills = []

        const typeTag = await AntdComponentGenerators.createAntdTag({
            color: projectData.typ.toLowerCase().replace(' ', '-'),
            children: projectData.typ
        })
        meta.appendChild(typeTag)

        const location = await AntdComponentGenerators.createAntdTypography({
            type: 'secondary',
            children: `📍 ${projectData.lokalizacja}`
        })
        location.fontSize = AntdDesignSystem.getFontSizeFromVariable('font-size-sm')
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

        const userIcon = figma.createText()
        userIcon.characters = '👤'
        userIcon.fontSize = 16
        userIcon.fills = [AntdDesignSystem.createFillFromVariable('text-secondary')]
        clientInfo.appendChild(userIcon)

        const clientText = await AntdComponentGenerators.createAntdTypography({
            children: `Klient: ${projectData.client}`
        })
        clientText.fontSize = AntdDesignSystem.getFontSizeFromVariable('font-size-base')
        clientInfo.appendChild(clientText)

        info.appendChild(clientInfo)

        const deadlineInfo = figma.createFrame()
        deadlineInfo.name = 'Deadline Info'
        deadlineInfo.layoutMode = 'HORIZONTAL'
        deadlineInfo.itemSpacing = 6
        deadlineInfo.fills = []

        const calendarIcon = figma.createText()
        calendarIcon.characters = '📅'
        calendarIcon.fontSize = 16
        calendarIcon.fills = [AntdDesignSystem.createFillFromVariable('text-secondary')]
        deadlineInfo.appendChild(calendarIcon)

        const deadlineText = await AntdComponentGenerators.createAntdTypography({
            children: `Deadline: ${new Date(projectData.deadline).toLocaleDateString('pl-PL')}`
        })
        deadlineText.fontSize = AntdDesignSystem.getFontSizeFromVariable('font-size-base')
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

        const progressLabel = await AntdComponentGenerators.createAntdTypography({
            children: 'Postęp'
        })
        progressLabel.fontSize = AntdDesignSystem.getFontSizeFromVariable('font-size-base')
        progressHeader.appendChild(progressLabel)

        const progressPercent = await AntdComponentGenerators.createAntdTypography({
            children: `${projectData.progress}%`
        })
        progressPercent.fontSize = AntdDesignSystem.getFontSizeFromVariable('font-size-base')
        progressHeader.appendChild(progressPercent)

        progressSection.appendChild(progressHeader)

        const progressBar = await AntdComponentGenerators.createAntdProgress({
            percent: projectData.progress,
            size: 'small',
            showInfo: false
        })
        progressSection.appendChild(progressBar)

        content.appendChild(progressSection)

        // Project modules
        const modulesSection = figma.createFrame()
        modulesSection.name = 'Modules Section'
        modulesSection.layoutMode = 'VERTICAL'
        modulesSection.itemSpacing = 8
        modulesSection.fills = []

        const modulesLabel = await AntdComponentGenerators.createAntdTypography({
            children: 'MODUŁY PROJEKTU:'
        })
        modulesLabel.fontSize = AntdDesignSystem.getFontSizeFromVariable('font-size-sm')
        modulesSection.appendChild(modulesLabel)

        if (projectData.modules && projectData.modules.length > 0) {
            const modulesList = figma.createFrame()
            modulesList.name = 'Modules List'
            modulesList.layoutMode = 'VERTICAL'
            modulesList.itemSpacing = 2
            modulesList.fills = []

            for (const module of projectData.modules.slice(0, 3)) {
                const moduleItem = await AntdComponentGenerators.createAntdTypography({
                    children: `- ${module.replace('_', ' ')}`
                })
                moduleItem.fontSize = AntdDesignSystem.getFontSizeFromVariable('font-size-sm')
                modulesList.appendChild(moduleItem)
            }

            if (projectData.modules.length > 3) {
                const moreModules = await AntdComponentGenerators.createAntdTypography({
                    type: 'secondary',
                    children: `+ ${projectData.modules.length - 3} więcej...`
                })
                moreModules.fontSize = AntdDesignSystem.getFontSizeFromVariable('font-size-xs')
                modulesList.appendChild(moreModules)
            }

            modulesSection.appendChild(modulesList)
        } else {
            const noModules = await AntdComponentGenerators.createAntdTypography({
                type: 'secondary',
                children: 'Brak zdefiniowanych modułów'
            })
            noModules.fontSize = AntdDesignSystem.getFontSizeFromVariable('font-size-sm')
            modulesSection.appendChild(noModules)
        }

        // Total elements count
        const elementsCount = figma.createFrame()
        elementsCount.name = 'Elements Count'
        elementsCount.layoutMode = 'HORIZONTAL'
        elementsCount.itemSpacing = 4
        elementsCount.fills = []

        const countLabel = await AntdComponentGenerators.createAntdTypography({
            type: 'secondary',
            children: 'Łącznie elementów:'
        })
        countLabel.fontSize = AntdDesignSystem.getFontSizeFromVariable('font-size-xs')
        elementsCount.appendChild(countLabel)

        const countValue = await AntdComponentGenerators.createAntdTypography({
            children: projectData.tilesCount.toString()
        })
        countValue.fontSize = AntdDesignSystem.getFontSizeFromVariable('font-size-xs')
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

            const avatar = await AntdComponentGenerators.createAntdAvatar({
                size: 'small',
                children: projectData.manager
            })
            managerSection.appendChild(avatar)

            const managerText = await AntdComponentGenerators.createAntdTypography({
                type: 'secondary',
                children: `Manager: ${projectData.manager}`
            })
            managerText.fontSize = AntdDesignSystem.getFontSizeFromVariable('font-size-sm')
            managerSection.appendChild(managerText)

            content.appendChild(managerSection)
        }

        card.appendChild(content)

        return card
    }

    // Generowanie TileCard (z aplikacji)
    static async createTileCard(tileData: {
        id: string
        name: string
        status: string
        group?: string
        bom: any[]
        laborCost: number
    }): Promise<FrameNode> {
        const card = await AntdComponentGenerators.createAntdCard({
            size: 'small',
            bordered: true
        })
        card.name = `TileCard - ${tileData.name}`
        card.resize(200, 120)
        card.paddingTop = 12
        card.paddingRight = 12
        card.paddingBottom = 12
        card.paddingLeft = 12
        card.layoutMode = 'VERTICAL'
        card.itemSpacing = 8

        // Tile name
        const tileName = await AntdComponentGenerators.createAntdTypography({
            children: tileData.name
        })
        tileName.fontSize = AntdDesignSystem.getFontSizeFromVariable('font-size-base')
        card.appendChild(tileName)

        // Status badge
        const statusBadge = await this.createStatusBadge(tileData.status)
        card.appendChild(statusBadge)

        // Group info
        if (tileData.group) {
            const groupInfo = await AntdComponentGenerators.createAntdTypography({
                type: 'secondary',
                children: `Grupa: ${tileData.group}`
            })
            groupInfo.fontSize = AntdDesignSystem.getFontSizeFromVariable('font-size-sm')
            card.appendChild(groupInfo)
        }

        // Cost info
        const costInfo = await AntdComponentGenerators.createAntdTypography({
            type: 'secondary',
            children: `Koszt: ${tileData.laborCost} zł`
        })
        costInfo.fontSize = AntdDesignSystem.getFontSizeFromVariable('font-size-sm')
        card.appendChild(costInfo)

        return card
    }

    // Generowanie Kanban Column (z aplikacji)
    static async createKanbanColumn(columnData: {
        id: string
        title: string
        color: string
        tiles: any[]
    }): Promise<FrameNode> {
        const column = await AntdComponentGenerators.createAntdCard({
            size: 'default',
            bordered: true
        })
        column.name = `Kanban Column - ${columnData.title}`
        column.resize(250, 400)
        column.paddingTop = 16
        column.paddingRight = 16
        column.paddingBottom = 16
        column.paddingLeft = 16
        column.layoutMode = 'VERTICAL'
        column.itemSpacing = 8

        // Column header
        const header = figma.createFrame()
        header.name = 'Column Header'
        header.layoutMode = 'HORIZONTAL'
        header.primaryAxisAlignItems = 'SPACE_BETWEEN'
        header.counterAxisAlignItems = 'CENTER'
        header.fills = []

        const title = await AntdComponentGenerators.createAntdTypography({
            children: columnData.title
        })
        title.fontSize = AntdDesignSystem.getFontSizeFromVariable('font-size-base')
        header.appendChild(title)

        const countBadge = await AntdComponentGenerators.createAntdTag({
            color: 'blue',
            children: columnData.tiles.length.toString()
        })
        header.appendChild(countBadge)

        column.appendChild(header)

        // Add tiles
        for (const tile of columnData.tiles) {
            const tileCard = await this.createTileCard(tile)
            column.appendChild(tileCard)
        }

        // Empty state
        if (columnData.tiles.length === 0) {
            const emptyState = await AntdComponentGenerators.createAntdTypography({
                type: 'secondary',
                children: 'Brak elementów'
            })
            emptyState.fontSize = AntdDesignSystem.getFontSizeFromVariable('font-size-sm')
            emptyState.x = (column.width - emptyState.width) / 2
            emptyState.y = 100
            column.appendChild(emptyState)
        }

        return column
    }

    // Generowanie ProjectElements (z aplikacji)
    static async createProjectElements(projectElementsData: {
        project: any
        tiles: any[]
        groups: any[]
    }): Promise<FrameNode> {
        const container = figma.createFrame()
        container.name = 'ProjectElements'
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

        const title = await AntdComponentGenerators.createAntdTypography({
            level: 3,
            children: 'Elementy Projektu'
        })
        header.appendChild(title)

        const subtitle = await AntdComponentGenerators.createAntdTypography({
            type: 'secondary',
            children: 'Kanban na górze, grupy poniżej'
        })
        subtitle.fontSize = AntdDesignSystem.getFontSizeFromVariable('font-size-sm')
        header.appendChild(subtitle)

        container.appendChild(header)

        // Quick Add Form
        const quickAddForm = await AntdComponentGenerators.createAntdCard({
            size: 'default',
            bordered: true
        })
        quickAddForm.name = 'Quick Add Form'
        quickAddForm.resize(1200, 80)
        quickAddForm.paddingTop = 16
        quickAddForm.paddingRight = 16
        quickAddForm.paddingBottom = 16
        quickAddForm.paddingLeft = 16
        quickAddForm.layoutMode = 'HORIZONTAL'
        quickAddForm.itemSpacing = 8

        const input = await AntdComponentGenerators.createAntdInput({
            placeholder: 'np. Panel frontowy',
            size: 'middle'
        })
        input.resize(300, 32)
        quickAddForm.appendChild(input)

        const addButton = await AntdComponentGenerators.createAntdButton({
            type: 'primary',
            size: 'middle',
            children: 'Dodaj'
        })
        addButton.resize(100, 32)
        quickAddForm.appendChild(addButton)

        container.appendChild(quickAddForm)

        // Kanban Board
        const kanbanBoard = figma.createFrame()
        kanbanBoard.name = 'Kanban Board'
        kanbanBoard.layoutMode = 'HORIZONTAL'
        kanbanBoard.itemSpacing = 16
        kanbanBoard.fills = []

        const columns = [
            { id: 'nowy', title: 'Nowy', color: 'blue' },
            { id: 'projektowanie', title: 'Projektowanie', color: 'orange' },
            { id: 'cnc', title: 'Wycinanie CNC', color: 'blue' },
            { id: 'montaz', title: 'Składanie (Produkcja)', color: 'green' }
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

            const kanbanColumn = await this.createKanbanColumn({
                id: column.id,
                title: column.title,
                color: column.color,
                tiles: columnTiles
            })
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

        const groupsTitle = await AntdComponentGenerators.createAntdTypography({
            children: 'Grupy'
        })
        groupsTitle.fontSize = AntdDesignSystem.getFontSizeFromVariable('font-size-base')
        groupsHeader.appendChild(groupsTitle)

        const newGroupButton = await AntdComponentGenerators.createAntdButton({
            type: 'default',
            size: 'small',
            children: 'Nowa grupa'
        })
        newGroupButton.resize(100, 28)
        groupsHeader.appendChild(newGroupButton)

        groupsSection.appendChild(groupsHeader)

        // Add groups
        for (const group of projectElementsData.groups) {
            const groupCard = await AntdComponentGenerators.createAntdCard({
                size: 'small',
                bordered: true
            })
            groupCard.name = `Group - ${group.name}`
            groupCard.resize(1200, 60)
            groupCard.paddingTop = 12
            groupCard.paddingRight = 16
            groupCard.paddingBottom = 12
            groupCard.paddingLeft = 16
            groupCard.layoutMode = 'HORIZONTAL'
            groupCard.itemSpacing = 12

            const groupName = await AntdComponentGenerators.createAntdTypography({
                children: group.name
            })
            groupName.fontSize = AntdDesignSystem.getFontSizeFromVariable('font-size-base')
            groupCard.appendChild(groupName)

            const groupCount = await AntdComponentGenerators.createAntdTypography({
                type: 'secondary',
                children: `${group.tiles.length} elementów`
            })
            groupCount.fontSize = AntdDesignSystem.getFontSizeFromVariable('font-size-sm')
            groupCard.appendChild(groupCount)

            groupsSection.appendChild(groupCard)
        }

        container.appendChild(groupsSection)

        return container
    }
}
