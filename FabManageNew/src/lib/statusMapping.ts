export const statusMapping: Record<string, string> = {
    'W kolejce CNC': 'W KOLEJCE',
    'W produkcji CNC': 'W TRAKCIE CIĘCIA',
    'Gotowy do montażu': 'WYCIĘTE',

    'W KOLEJCE': 'W kolejce CNC',
    'W TRAKCIE CIĘCIA': 'W produkcji CNC',
    'WYCIĘTE': 'Gotowy do montażu',
}

export function mapStatusForView(status: string, target: 'cnc' | 'project'): string {
    if (target === 'cnc') return statusMapping[status] || status
    // reverse mapping
    const reverse = Object.entries(statusMapping).reduce<Record<string, string>>((acc, [k, v]) => { acc[v] = k; return acc }, {})
    return reverse[status] || status
}


