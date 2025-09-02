// Typy dla systemu klientów - FabManage

export type ContactPerson = {
    id: string;
    name: string;
    email: string;
    phone: string;
    role?: string; // np. 'Właściciel', 'Kierownik projektu', 'Kontakt'
    isPrimary: boolean; // Oznaczenie głównego kontaktu
    notes?: string;
    lastContact?: string;
};

export type CompanyClient = {
    id: string;
    companyName: string;
    nip?: string;
    logoUrl?: string; // URL do pliku z logo
    cardColor: string; // Kolor wyciągnięty z logo lub wygenerowany
    textColor: string; // Kolor tekstu (czarny/biały) dla kontrastu
    segment: 'Mały' | 'Średni' | 'Duży';
    region: string;
    status: 'Aktywny' | 'Nieaktywny' | 'Lead';
    contacts: ContactPerson[]; // Tablica osób kontaktowych
    ytd: number; // Year to date revenue
    address?: string;
    website?: string;
    industry?: string;
    notes?: string;
    createdAt: string;
    updatedAt: string;
};

// Typ dla generowania logo z inicjałów
export type GeneratedLogo = {
    initials: string;
    backgroundColor: string;
    textColor: string;
};

// Typ dla kolorów projektu (odcienie koloru klienta)
export type ProjectColorScheme = {
    primary: string; // Główny kolor klienta
    light: string; // Jaśniejszy odcień
    dark: string; // Ciemniejszy odcień
    accent: string; // Akcentowy kolor
    textOnPrimary: string; // Kolor tekstu na głównym kolorze
    textOnLight: string; // Kolor tekstu na jasnym tle
};

// Typ dla historii projektów klienta
export type ClientProjectHistory = {
    id: string;
    name: string;
    status: string;
    startDate: string;
    endDate?: string;
    budget: number;
    revenue: number;
    progress: number;
};

// Typ dla aktywności klienta
export type ClientActivity = {
    id: string;
    type: 'call' | 'email' | 'meeting' | 'project_update' | 'payment' | 'note';
    title: string;
    description: string;
    date: string;
    contactPerson?: string;
    projectId?: string;
    amount?: number;
};

// Typ dla historii aktywności klienta (timeline)
export type ClientActivityHistory = {
    id: string;
    user: {
        name: string;
        avatar?: string;
        initials: string;
    };
    action: string;
    timestamp: string;
    type: 'status_update' | 'task_added' | 'task_assigned' | 'task_closed' | 'timeline_edited' | 'project_created' | 'payment_received';
    projectName?: string;
    taskName?: string;
    oldValue?: string;
    newValue?: string;
};

// Typ dla dokumentów klienta
export type ClientDocument = {
    id: string;
    name: string;
    type: 'contract' | 'invoice' | 'proposal' | 'other';
    url: string;
    size: number;
    uploadedAt: string;
    uploadedBy: string;
};

// Typ dla notatek o kliencie
export type ClientNote = {
    id: string;
    content: string;
    author: string;
    createdAt: string;
    updatedAt?: string;
    tags?: string[];
};

// Typ dla segmentacji klientów
export type ClientSegment = {
    name: 'Mały' | 'Średni' | 'Duży';
    minRevenue: number;
    maxRevenue: number;
    color: string;
    description: string;
};

// Typ dla regionów
export type ClientRegion = {
    name: string;
    code: string;
    color: string;
    timezone: string;
};

// Typ dla statusów klientów
export type ClientStatus = {
    name: 'Aktywny' | 'Nieaktywny' | 'Lead';
    color: string;
    description: string;
    icon: string;
};

// Typ dla filtrowania klientów
export type ClientFilters = {
    search: string;
    segment: string;
    region: string;
    status: string;
    dateRange?: {
        start: string;
        end: string;
    };
    minRevenue?: number;
    maxRevenue?: number;
    hasProjects?: boolean;
    hasLogo?: boolean;
};

// Typ dla sortowania klientów
export type ClientSort = {
    field: 'companyName' | 'ytd' | 'createdAt' | 'updatedAt' | 'status';
    direction: 'asc' | 'desc';
};

// Typ dla eksportu klientów
export type ClientExport = {
    format: 'csv' | 'xlsx' | 'pdf';
    includeContacts: boolean;
    includeProjects: boolean;
    includeNotes: boolean;
    dateRange?: {
        start: string;
        end: string;
    };
};

// Typ dla importu klientów
export type ClientImport = {
    file: File;
    mapping: Record<string, keyof CompanyClient>;
    updateExisting: boolean;
    createMissing: boolean;
};

// Typ dla statystyk klientów
export type ClientStats = {
    total: number;
    active: number;
    inactive: number;
    leads: number;
    totalRevenue: number;
    averageRevenue: number;
    topSegment: string;
    topRegion: string;
    projectsCount: number;
    averageProjectsPerClient: number;
};

// Typ dla dashboardu klientów
export type ClientDashboard = {
    stats: ClientStats;
    recentClients: CompanyClient[];
    topClients: CompanyClient[];
    recentActivities: ClientActivity[];
    upcomingMeetings: ClientActivity[];
    revenueChart: {
        labels: string[];
        data: number[];
    };
    segmentChart: {
        labels: string[];
        data: number[];
    };
    regionChart: {
        labels: string[];
        data: number[];
    };
};
