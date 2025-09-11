import type { Project } from '../stores/projectsStore'
import type { GanttTask } from '../stores/calendarStore'
import type { Tile } from '../stores/tilesStore'

export function buildGanttTasks(project: Project | undefined, tiles: Tile[]): GanttTask[] {
    if (!project) return []
    const tasks: GanttTask[] = []

    // Użyj rzeczywistych dat projektu
    const projStartRaw = (project as any).data_rozpoczęcia || (project as any).data_utworzenia || new Date()
    const projStart = projStartRaw instanceof Date ? projStartRaw : new Date(projStartRaw)
    const projDeadline = project.deadline ? new Date(project.deadline) : null

    // Oblicz duration projektu w dniach
    let projDuration = 30 // domyślnie 30 dni
    if (projDeadline) {
        const diffTime = projDeadline.getTime() - projStart.getTime()
        projDuration = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)))
    }

    const ps = projStart.toISOString().slice(0, 10)

    // Dodaj główny projekt z rzeczywistymi datami
    tasks.push({
        id: project.id,
        text: project.name,
        start_date: ps,
        duration: projDuration,
        progress: project.postep || (project as any).progress || 0,
        type: 'project',
        status: project.status as any
    })

    const groups = ((project as any).groups || []) as Array<{ id?: string; name?: string; progress?: number; status?: string }>
    for (const group of groups) {
        const gid = group.id || `${project.id}-grp-${group.name}`

        // Grupy zaczynają się z projektem ale są krótsze
        const groupDuration = Math.max(1, Math.floor(projDuration * 0.8))

        tasks.push({
            id: gid,
            text: group.name || 'Moduł',
            start_date: ps,
            duration: groupDuration,
            parent: project.id,
            type: 'module',
            progress: group.progress || 0,
            status: (group as any).status
        })
    }

    const tilesForProject = tiles.filter(t => t.project === project.id)

    // Sortuj kafelki po terminie, żeby lepiej ułożyć w harmonogramie
    const sortedTiles = tilesForProject.sort((a, b) => {
        const dateA = a.termin ? new Date(a.termin).getTime() : projStart.getTime()
        const dateB = b.termin ? new Date(b.termin).getTime() : projStart.getTime()
        return dateA - dateB
    })

    for (const tile of sortedTiles) {
        const parent = (groups.find(g => g.name === (tile as any).moduł_nadrzędny) || {}).id || (groups[0]?.id || project.id)

        // Użyj rzeczywistego terminu kafelka lub data rozpoczęcia projektu
        const tileStart = tile.termin ? new Date(tile.termin) : projStart

        // Oblicz duration kafelka - domyślnie 5 dni, ale możemy to dostosować
        let tileDuration = 5

        // Jeśli kafelek ma status, dostosuj czas na podstawie priority
        if (tile.priority === 'Wysoki' || tile.priority === 'high' || tile.priority === 'Pilny' || tile.priority === 'urgent') {
            tileDuration = 3 // wysokie priorytety krócej
        } else if (tile.priority === 'Niski' || tile.priority === 'low') {
            tileDuration = 7 // niskie priorytety dłużej
        }

        // Jeśli kafelek ma estimated_cost, można dostosować czas na podstawie kosztów
        if (tile.estimated_cost && tile.estimated_cost > 1000) {
            tileDuration = Math.max(tileDuration, 10) // drogie zadania trwają dłużej
        }

        const depsArr: string[] = Array.isArray(tile.dependencies)
            ? tile.dependencies
            : tile.dependencies
                ? [tile.dependencies as any]
                : []

        tasks.push({
            id: tile.id,
            text: tile.name,
            start_date: tileStart.toISOString().slice(0, 10),
            duration: tileDuration,
            parent,
            type: 'task',
            progress: (tile as any).progress || 0,
            status: tile.status as any,
            dependencies: depsArr.join(',')
        })
    }

    return tasks
}


