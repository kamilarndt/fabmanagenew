export type ProjectModuleKey =
    | 'wycena'
    | 'koncepcja'
    | 'projektowanieTechniczne'
    | 'produkcja'
    | 'materialy'
    | 'logistykaMontaz'

export type ProjectModule = {
    id: ProjectModuleKey
    label: string
    description: string
}

export const PROJECT_MODULES: readonly ProjectModule[] = [
    {
        id: 'wycena',
        label: 'Wycena',
        description: 'Kalkulacja kosztów i przygotowanie oferty.'
    },
    {
        id: 'koncepcja',
        label: 'Koncepcja',
        description: 'Prace kreatywne, szkice, moodboardy, wstępne wizualizacje.'
    },
    {
        id: 'projektowanieTechniczne',
        label: 'Projektowanie Techniczne',
        description: 'Precyzyjne modelowanie 3D, przygotowanie siatek i dokumentacji.'
    },
    {
        id: 'produkcja',
        label: 'Produkcja',
        description: 'Uruchomienie procesu wytwórczego (CNC, montaż).'
    },
    {
        id: 'materialy',
        label: 'Zarządzanie Materiałami',
        description: 'Planowanie i zamawianie materiałów.'
    },
    {
        id: 'logistykaMontaz',
        label: 'Logistyka i Montaż',
        description: 'Organizacja transportu i prac u klienta.'
    }
]

export function isModuleActive(modules: ProjectModuleKey[] | undefined, key: ProjectModuleKey): boolean {
    return Boolean(modules && modules.includes(key))
}

