import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { devtools } from 'zustand/middleware'
import type {
    CompanyClient,
    ContactPerson,
    ClientFilters,
    ClientSort,
    ClientStats,
    ClientActivity,
    ClientDocument,
    ClientNote
} from '../types/clients.types'
import {
    generateClientId,
    generateContactId,
    generateLogoFromName,
    getTextColorForBackground,
    extractColorFromImage
} from '../lib/clientUtils'


interface ClientsStore {
    // State
    clients: CompanyClient[]
    selectedClient: CompanyClient | null
    filters: ClientFilters
    sort: ClientSort
    loading: boolean
    error: string | null

    // Actions
    addClient: (client: Omit<CompanyClient, 'id' | 'createdAt' | 'updatedAt'>) => void
    updateClient: (id: string, updates: Partial<CompanyClient>) => void
    deleteClient: (id: string) => void
    selectClient: (client: CompanyClient | null) => void

    // Contact management
    addContact: (clientId: string, contact: Omit<ContactPerson, 'id'>) => void
    updateContact: (clientId: string, contactId: string, updates: Partial<ContactPerson>) => void
    deleteContact: (clientId: string, contactId: string) => void
    setPrimaryContact: (clientId: string, contactId: string) => void

    // Logo and color management
    setClientLogo: (clientId: string, logoUrl: string) => Promise<void>
    generateClientLogo: (clientId: string) => void
    updateClientColors: (clientId: string, cardColor: string) => void

    // Filtering and sorting
    setFilters: (filters: Partial<ClientFilters>) => void
    setSort: (sort: ClientSort) => void
    clearFilters: () => void

    // Activity and notes
    addActivity: (clientId: string, activity: Omit<ClientActivity, 'id'>) => void
    addNote: (clientId: string, note: Omit<ClientNote, 'id' | 'createdAt' | 'updatedAt'>) => void
    updateNote: (clientId: string, noteId: string, updates: Partial<ClientNote>) => void
    deleteNote: (clientId: string, noteId: string) => void

    // Documents
    addDocument: (clientId: string, document: Omit<ClientDocument, 'id' | 'uploadedAt'>) => void
    deleteDocument: (clientId: string, documentId: string) => void

    // Computed values
    getFilteredClients: () => CompanyClient[]
    getClientStats: () => ClientStats
    getClientById: (id: string) => CompanyClient | undefined
    getClientsBySegment: (segment: CompanyClient['segment']) => CompanyClient[]
    getClientsByRegion: (region: string) => CompanyClient[]
    getClientsByStatus: (status: CompanyClient['status']) => CompanyClient[]

    // Utility actions
    setLoading: (loading: boolean) => void
    setError: (error: string | null) => void
    clearError: () => void

    // Reset data to new TV stations
    resetToTVStations: () => void

    // Synchronizuj wszystkie projekty z klientami
    syncAllProjectsWithClient: (clientId: string) => void
}

// Sample data - Największe stacje telewizyjne w Polsce
const sampleClients: CompanyClient[] = [
    {
        id: 'C-001',
        companyName: 'Telewizja Polska S.A.',
        nip: '526-030-56-44',
        logoUrl: 'https://via.placeholder.com/200x80/e60012/ffffff?text=TVP',
        cardColor: '#e60012', // Czerwony TVP
        textColor: '#ffffff',
        segment: 'Duży',
        region: 'Warszawa',
        status: 'Aktywny',
        contacts: [
            {
                id: 'CP-001',
                name: 'Marek Solon-Lipiński',
                email: 'marek.solon-lipinski@tvp.pl',
                phone: '+48 22 547 50 00',
                role: 'Prezes Zarządu',
                isPrimary: true,
                lastContact: '2024-01-20'
            },
            {
                id: 'CP-002',
                name: 'Anna Karczewska',
                email: 'anna.karczewska@tvp.pl',
                phone: '+48 22 547 50 01',
                role: 'Dyrektor Programowy',
                isPrimary: false,
                lastContact: '2024-01-18'
            }
        ],
        ytd: 2500000,
        address: 'ul. Jana Pawła Woronicza 17, 00-999 Warszawa',
        website: 'www.tvp.pl',
        industry: 'Media',
        notes: 'Główna stacja publiczna, strategiczny klient',
        createdAt: '2023-01-15',
        updatedAt: '2024-01-20'
    },
    {
        id: 'C-002',
        companyName: 'Polsat',
        nip: '526-030-56-45',
        logoUrl: 'https://via.placeholder.com/200x80/ff6b35/ffffff?text=Polsat',
        cardColor: '#ff6b35', // Pomarańczowy Polsat
        textColor: '#ffffff',
        segment: 'Duży',
        region: 'Warszawa',
        status: 'Aktywny',
        contacts: [
            {
                id: 'CP-003',
                name: 'Marek Sierocki',
                email: 'marek.sierocki@polsat.pl',
                phone: '+48 22 515 50 00',
                role: 'Prezes Zarządu',
                isPrimary: true,
                lastContact: '2024-01-22'
            }
        ],
        ytd: 1800000,
        address: 'ul. Ostrobramska 77, 04-175 Warszawa',
        website: 'www.polsat.pl',
        industry: 'Media',
        notes: 'Główna stacja komercyjna, duży potencjał projektów',
        createdAt: '2023-06-10',
        updatedAt: '2024-01-22'
    },
    {
        id: 'C-003',
        companyName: 'TVN',
        nip: '526-030-56-46',
        logoUrl: 'https://via.placeholder.com/200x80/1e3a8a/ffffff?text=TVN',
        cardColor: '#1e3a8a', // Niebieski TVN
        textColor: '#ffffff',
        segment: 'Duży',
        region: 'Warszawa',
        status: 'Aktywny',
        contacts: [
            {
                id: 'CP-004',
                name: 'Katarzyna Kieli',
                email: 'katarzyna.kieli@tvn.pl',
                phone: '+48 22 515 50 01',
                role: 'Prezes Zarządu',
                isPrimary: true,
                lastContact: '2024-01-19'
            }
        ],
        ytd: 1600000,
        address: 'ul. Wiertnicza 166, 02-952 Warszawa',
        website: 'www.tvn.pl',
        industry: 'Media',
        notes: 'Stacja informacyjna, projekty newsowe',
        createdAt: '2024-01-15',
        updatedAt: '2024-01-19'
    },
    {
        id: 'C-004',
        companyName: 'TV Puls',
        nip: '526-030-56-47',
        logoUrl: 'https://via.placeholder.com/200x80/7c3aed/ffffff?text=TV+Puls',
        cardColor: '#7c3aed', // Fioletowy Puls
        textColor: '#ffffff',
        segment: 'Średni',
        region: 'Warszawa',
        status: 'Aktywny',
        contacts: [
            {
                id: 'CP-005',
                name: 'Tomasz Lis',
                email: 'tomasz.lis@tvpuls.pl',
                phone: '+48 22 515 50 02',
                role: 'Prezes Zarządu',
                isPrimary: true,
                lastContact: '2024-01-21'
            }
        ],
        ytd: 800000,
        address: 'ul. Domaniewska 37, 02-672 Warszawa',
        website: 'www.tvpuls.pl',
        industry: 'Media',
        notes: 'Stacja katolicka, projekty religijne',
        createdAt: '2023-03-15',
        updatedAt: '2024-01-21'
    },
    {
        id: 'C-005',
        companyName: 'TV4',
        nip: '526-030-56-48',
        logoUrl: 'https://via.placeholder.com/200x80/059669/ffffff?text=TV4',
        cardColor: '#059669', // Zielony TV4
        textColor: '#ffffff',
        segment: 'Średni',
        region: 'Warszawa',
        status: 'Aktywny',
        contacts: [
            {
                id: 'CP-006',
                name: 'Marek Młynarski',
                email: 'marek.mlynarski@tv4.pl',
                phone: '+48 22 515 50 03',
                role: 'Dyrektor Programowy',
                isPrimary: true,
                lastContact: '2024-01-17'
            }
        ],
        ytd: 600000,
        address: 'ul. Wiertnicza 166, 02-952 Warszawa',
        website: 'www.tv4.pl',
        industry: 'Media',
        notes: 'Stacja rozrywkowa, projekty show',
        createdAt: '2023-08-20',
        updatedAt: '2024-01-17'
    },
    {
        id: 'C-006',
        companyName: 'TVN24',
        nip: '526-030-56-49',
        logoUrl: 'https://via.placeholder.com/200x80/dc2626/ffffff?text=TVN24',
        cardColor: '#dc2626', // Czerwony TVN24
        textColor: '#ffffff',
        segment: 'Duży',
        region: 'Warszawa',
        status: 'Aktywny',
        contacts: [
            {
                id: 'CP-007',
                name: 'Agnieszka Kublik',
                email: 'agnieszka.kublik@tvn24.pl',
                phone: '+48 22 515 50 04',
                role: 'Redaktor Naczelny',
                isPrimary: true,
                lastContact: '2024-01-16'
            }
        ],
        ytd: 1200000,
        address: 'ul. Wiertnicza 166, 02-952 Warszawa',
        website: 'www.tvn24.pl',
        industry: 'Media',
        notes: 'Kanał informacyjny 24h, projekty newsowe',
        createdAt: '2023-05-10',
        updatedAt: '2024-01-16'
    },
    {
        id: 'C-007',
        companyName: 'Polsat News',
        nip: '526-030-56-50',
        logoUrl: 'https://via.placeholder.com/200x80/f59e0b/000000?text=Polsat+News',
        cardColor: '#f59e0b', // Żółty Polsat News
        textColor: '#000000',
        segment: 'Średni',
        region: 'Warszawa',
        status: 'Aktywny',
        contacts: [
            {
                id: 'CP-008',
                name: 'Marek Sierocki',
                email: 'marek.sierocki@polsatnews.pl',
                phone: '+48 22 515 50 05',
                role: 'Prezes Zarządu',
                isPrimary: true,
                lastContact: '2024-01-18'
            }
        ],
        ytd: 700000,
        address: 'ul. Ostrobramska 77, 04-175 Warszawa',
        website: 'www.polsatnews.pl',
        industry: 'Media',
        notes: 'Kanał informacyjny, projekty newsowe',
        createdAt: '2023-07-15',
        updatedAt: '2024-01-18'
    },
    {
        id: 'C-008',
        companyName: 'TV Republika',
        nip: '526-030-56-51',
        logoUrl: 'https://via.placeholder.com/200x80/1f2937/ffffff?text=TV+Republika',
        cardColor: '#1f2937', // Ciemny szary Republika
        textColor: '#ffffff',
        segment: 'Mały',
        region: 'Warszawa',
        status: 'Aktywny',
        contacts: [
            {
                id: 'CP-009',
                name: 'Tomasz Sakiewicz',
                email: 'tomasz.sakiewicz@tvrepublika.pl',
                phone: '+48 22 515 50 06',
                role: 'Prezes Zarządu',
                isPrimary: true,
                lastContact: '2024-01-15'
            }
        ],
        ytd: 400000,
        address: 'ul. Marszałkowska 111, 00-102 Warszawa',
        website: 'www.tvrepublika.pl',
        industry: 'Media',
        notes: 'Stacja prawicowa, projekty polityczne',
        createdAt: '2024-01-10',
        updatedAt: '2024-01-15'
    },
    {
        id: 'C-009',
        companyName: 'TV Trwam',
        nip: '526-030-56-52',
        logoUrl: 'https://via.placeholder.com/200x80/059669/ffffff?text=TV+Trwam',
        cardColor: '#059669', // Zielony Trwam
        textColor: '#ffffff',
        segment: 'Mały',
        region: 'Toruń',
        status: 'Aktywny',
        contacts: [
            {
                id: 'CP-010',
                name: 'Tadeusz Rydzyk',
                email: 'tadeusz.rydzik@tvtrwam.pl',
                phone: '+48 56 610 97 00',
                role: 'Prezes Zarządu',
                isPrimary: true,
                lastContact: '2024-01-14'
            }
        ],
        ytd: 300000,
        address: 'ul. Św. Józefa 23/35, 87-100 Toruń',
        website: 'www.tvtrwam.pl',
        industry: 'Media',
        notes: 'Stacja katolicka, projekty religijne',
        createdAt: '2023-12-01',
        updatedAt: '2024-01-14'
    },
    {
        id: 'C-010',
        companyName: 'TVN Turbo',
        nip: '526-030-56-53',
        logoUrl: 'https://via.placeholder.com/200x80/dc2626/ffffff?text=TVN+Turbo',
        cardColor: '#dc2626', // Czerwony Turbo
        textColor: '#ffffff',
        segment: 'Średni',
        region: 'Warszawa',
        status: 'Aktywny',
        contacts: [
            {
                id: 'CP-011',
                name: 'Marek Kacprzak',
                email: 'marek.kacprzak@tvnturbo.pl',
                phone: '+48 22 515 50 07',
                role: 'Dyrektor Programowy',
                isPrimary: true,
                lastContact: '2024-01-13'
            }
        ],
        ytd: 500000,
        address: 'ul. Wiertnicza 166, 02-952 Warszawa',
        website: 'www.tvnturbo.pl',
        industry: 'Media',
        notes: 'Kanał motoryzacyjny, projekty samochodowe',
        createdAt: '2023-09-20',
        updatedAt: '2024-01-13'
    }
]

export const useClientsStore = create<ClientsStore>()(
    devtools(
        persist(
            (set, get) => ({
                // Initial state
                clients: sampleClients,
                selectedClient: null,
                filters: {
                    search: '',
                    segment: '',
                    region: '',
                    status: ''
                },
                sort: {
                    field: 'companyName',
                    direction: 'asc'
                },
                loading: false,
                error: null,

                // Client actions
                addClient: (clientData) => {
                    const now = new Date().toISOString().split('T')[0]
                    const newClient: CompanyClient = {
                        ...clientData,
                        id: generateClientId(),
                        createdAt: now,
                        updatedAt: now
                    }

                    set((state) => ({
                        clients: [...state.clients, newClient]
                    }))
                },

                updateClient: (id, updates) => {
                    set((state) => ({
                        clients: state.clients.map(client =>
                            client.id === id
                                ? { ...client, ...updates, updatedAt: new Date().toISOString().split('T')[0] }
                                : client
                        )
                    }))
                },

                deleteClient: (id) => {
                    set((state) => ({
                        clients: state.clients.filter(client => client.id !== id),
                        selectedClient: state.selectedClient?.id === id ? null : state.selectedClient
                    }))
                },

                selectClient: (client) => {
                    set({ selectedClient: client })
                },

                // Contact management
                addContact: (clientId, contactData) => {
                    const newContact: ContactPerson = {
                        ...contactData,
                        id: generateContactId()
                    }

                    set((state) => ({
                        clients: state.clients.map(client =>
                            client.id === clientId
                                ? {
                                    ...client,
                                    contacts: [...client.contacts, newContact],
                                    updatedAt: new Date().toISOString().split('T')[0]
                                }
                                : client
                        )
                    }))
                },

                updateContact: (clientId, contactId, updates) => {
                    set((state) => ({
                        clients: state.clients.map(client =>
                            client.id === clientId
                                ? {
                                    ...client,
                                    contacts: client.contacts.map(contact =>
                                        contact.id === contactId
                                            ? { ...contact, ...updates }
                                            : contact
                                    ),
                                    updatedAt: new Date().toISOString().split('T')[0]
                                }
                                : client
                        )
                    }))
                },

                deleteContact: (clientId, contactId) => {
                    set((state) => ({
                        clients: state.clients.map(client =>
                            client.id === clientId
                                ? {
                                    ...client,
                                    contacts: client.contacts.filter(contact => contact.id !== contactId),
                                    updatedAt: new Date().toISOString().split('T')[0]
                                }
                                : client
                        )
                    }))
                },

                setPrimaryContact: (clientId, contactId) => {
                    set((state) => ({
                        clients: state.clients.map(client =>
                            client.id === clientId
                                ? {
                                    ...client,
                                    contacts: client.contacts.map(contact => ({
                                        ...contact,
                                        isPrimary: contact.id === contactId
                                    })),
                                    updatedAt: new Date().toISOString().split('T')[0]
                                }
                                : client
                        )
                    }))
                },

                // Logo and color management
                setClientLogo: async (clientId, logoUrl) => {
                    try {
                        set({ loading: true })

                        // Wyciągnij kolor z logo
                        const cardColor = await extractColorFromImage()
                        const textColor = getTextColorForBackground(cardColor)

                        get().updateClient(clientId, {
                            logoUrl,
                            cardColor,
                            textColor
                        })

                        set({ loading: false })
                    } catch {
                        set({
                            loading: false,
                            error: 'Błąd podczas przetwarzania logo'
                        })
                    }
                },

                generateClientLogo: (clientId) => {
                    const client = get().clients.find(c => c.id === clientId)
                    if (!client) return

                    const logo = generateLogoFromName(client.companyName)

                    get().updateClient(clientId, {
                        cardColor: logo.backgroundColor,
                        textColor: logo.textColor
                    })
                },

                // Aktualizuj kolory klienta i synchronizuj z projektami
                updateClientColors: (clientId: string, cardColor: string) => {
                    const textColor = getTextColorForBackground(cardColor)

                    set(state => ({
                        clients: state.clients.map(c =>
                            c.id === clientId
                                ? { ...c, cardColor, textColor }
                                : c
                        )
                    }))

                    // Synchronizuj kolory z projektami
                    if (typeof window !== 'undefined') {
                        // Dynamic import aby uniknąć circular dependency
                        import('../stores/projectsStore').then(({ useProjectsStore }) => {
                            useProjectsStore.getState().updateProjectColors(clientId, cardColor)
                        })
                    }
                },

                // Filtering and sorting
                setFilters: (newFilters) => {
                    set((state) => ({
                        filters: { ...state.filters, ...newFilters }
                    }))
                },

                setSort: (newSort) => {
                    set({ sort: newSort })
                },

                clearFilters: () => {
                    set({
                        filters: {
                            search: '',
                            segment: '',
                            region: '',
                            status: ''
                        }
                    })
                },

                // Activity and notes
                addActivity: (clientId, activityData) => {
                    const newActivity: ClientActivity = {
                        ...activityData,
                        id: `ACT-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`
                    }

                    // W rzeczywistości zapisz w bazie danych
                    console.log('Activity added for client:', clientId, newActivity)
                },

                addNote: (clientId, noteData) => {
                    const now = new Date().toISOString().split('T')[0]
                    const newNote: ClientNote = {
                        ...noteData,
                        id: `NOTE-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
                        createdAt: now,
                        updatedAt: now
                    }

                    // W rzeczywistości zapisz w bazie danych
                    console.log('Note added for client:', clientId, newNote)
                },

                updateNote: (clientId, noteId, updates) => {
                    // W rzeczywistości zaktualizuj w bazie danych
                    console.log('Note updated:', { clientId, noteId, updates })
                },

                deleteNote: (clientId, noteId) => {
                    // W rzeczywistości usuń z bazy danych
                    console.log('Note deleted:', { clientId, noteId })
                },

                // Documents
                addDocument: (clientId, documentData) => {
                    const newDocument: ClientDocument = {
                        ...documentData,
                        id: `DOC-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
                        uploadedAt: new Date().toISOString().split('T')[0]
                    }

                    // W rzeczywistości zapisz w bazie danych
                    console.log('Document added for client:', clientId, newDocument)
                },

                deleteDocument: (clientId, documentId) => {
                    // W rzeczywistości usuń z bazy danych
                    console.log('Document deleted:', { clientId, documentId })
                },

                // Computed values
                getFilteredClients: () => {
                    const { clients, filters, sort } = get()

                    const filtered = clients.filter(client => {
                        const matchesSearch = !filters.search ||
                            client.companyName.toLowerCase().includes(filters.search.toLowerCase()) ||
                            client.contacts.some(contact =>
                                contact.name.toLowerCase().includes(filters.search.toLowerCase()) ||
                                contact.email.toLowerCase().includes(filters.search.toLowerCase())
                            )

                        const matchesSegment = !filters.segment || client.segment === filters.segment
                        const matchesRegion = !filters.region || client.region === filters.region
                        const matchesStatus = !filters.status || client.status === filters.status

                        return matchesSearch && matchesSegment && matchesRegion && matchesStatus
                    })

                    // Sort
                    filtered.sort((a, b) => {
                        const aValue = a[sort.field]
                        const bValue = b[sort.field]

                        if (typeof aValue === 'string' && typeof bValue === 'string') {
                            return sort.direction === 'asc'
                                ? aValue.localeCompare(bValue)
                                : bValue.localeCompare(aValue)
                        }

                        if (typeof aValue === 'number' && typeof bValue === 'number') {
                            return sort.direction === 'asc' ? aValue - bValue : bValue - aValue
                        }

                        return 0
                    })

                    return filtered
                },

                getClientStats: () => {
                    const { clients } = get()

                    const total = clients.length
                    const active = clients.filter(c => c.status === 'Aktywny').length
                    const inactive = clients.filter(c => c.status === 'Nieaktywny').length
                    const leads = clients.filter(c => c.status === 'Lead').length

                    const totalRevenue = clients.reduce((sum, c) => sum + c.ytd, 0)
                    const averageRevenue = total > 0 ? totalRevenue / total : 0

                    const segmentCounts = clients.reduce((acc, c) => {
                        acc[c.segment] = (acc[c.segment] || 0) + 1
                        return acc
                    }, {} as Record<string, number>)

                    const topSegment = Object.entries(segmentCounts)
                        .sort(([, a], [, b]) => b - a)[0]?.[0] || 'Brak'

                    const regionCounts = clients.reduce((acc, c) => {
                        acc[c.region] = (acc[c.region] || 0) + 1
                        return acc
                    }, {} as Record<string, number>)

                    const topRegion = Object.entries(regionCounts)
                        .sort(([, a], [, b]) => b - a)[0]?.[0] || 'Brak'

                    return {
                        total,
                        active,
                        inactive,
                        leads,
                        totalRevenue,
                        averageRevenue: Math.round(averageRevenue),
                        topSegment,
                        topRegion,
                        projectsCount: 0, // TODO: Połączyć z projectsStore
                        averageProjectsPerClient: 0
                    }
                },

                getClientById: (id) => {
                    return get().clients.find(client => client.id === id)
                },

                getClientsBySegment: (segment) => {
                    return get().clients.filter(client => client.segment === segment)
                },

                getClientsByRegion: (region) => {
                    return get().clients.filter(client => client.region === region)
                },

                getClientsByStatus: (status) => {
                    return get().clients.filter(client => client.status === status)
                },

                // Utility actions
                setLoading: (loading) => set({ loading }),
                setError: (error) => set({ error }),
                clearError: () => set({ error: null }),

                // Reset data to new TV stations
                resetToTVStations: () => {
                    // Wyczyść localStorage
                    if (typeof window !== 'undefined') {
                        localStorage.removeItem('clients-store')
                    }

                    // Ustaw nowe dane
                    set({
                        clients: sampleClients,
                        selectedClient: null,
                        filters: {
                            search: '',
                            segment: '',
                            region: '',
                            status: ''
                        },
                        sort: {
                            field: 'companyName',
                            direction: 'asc'
                        },
                        loading: false,
                        error: null
                    })
                },

                // Synchronizuj wszystkie projekty z klientami
                syncAllProjectsWithClient: (clientId: string) => {
                    const client = get().clients.find(c => c.id === clientId)
                    if (!client) return

                    if (typeof window !== 'undefined') {
                        import('../stores/projectsStore').then(({ useProjectsStore }) => {
                            useProjectsStore.getState().syncProjectWithClient(
                                clientId,
                                client.companyName,
                                client.cardColor
                            )
                        })
                    }
                }
            }),
            {
                name: 'clients-store',
                partialize: (state) => ({
                    clients: state.clients,
                    filters: state.filters,
                    sort: state.sort
                }),
                onRehydrateStorage: () => (state) => {
                    if (state) {
                        // Automatyczna inicjalizacja przy pierwszym uruchomieniu
                        setTimeout(() => {
                            state.syncAllProjectsWithClient = (clientId: string) => {
                                const client = state.clients.find(c => c.id === clientId)
                                if (!client) return
                                if (typeof window !== 'undefined') {
                                    import('../stores/projectsStore').then(({ useProjectsStore }) => {
                                        useProjectsStore.getState().syncProjectWithClient(
                                            client.id,
                                            client.companyName,
                                            client.cardColor
                                        )
                                    })
                                }
                            }

                            // Synchronizuj projekty z klientami
                            state.clients.forEach(client => { state.syncAllProjectsWithClient(client.id) })
                        }, 100)
                    }
                }
            }
        )
    )
)
