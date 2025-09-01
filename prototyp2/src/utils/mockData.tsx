// Centralized mock data for projects
export interface MockProject {
  id: string;
  name: string;
  client: string;
  manager: string;
  status: string;
  priority: string;
  startDate: string;
  endDate: string;
  budget: number;
  spent: number;
  progress: number;
  team: string[];
  stage: string;
  overdue: boolean;
}

export const mockProjects: MockProject[] = [
  {
    id: "P-2025-001",
    name: "Automatyzacja Linii Spawalniczej Robot ABB",
    client: "Stalprodukt S.A.",
    manager: "Marek Kowalczyk",
    status: "W realizacji",
    priority: "Krytyczny",
    startDate: "2024-11-15",
    endDate: "2025-03-20",
    budget: 750000,
    spent: 485000,
    progress: 68,
    team: ["Marek Kowalczyk", "Anna Lewandowska", "Tomasz Nowak", "Katarzyna Wiśniewska"],
    stage: "Produkcja",
    overdue: false
  },
  {
    id: "P-2025-002",
    name: "Modernizacja Systemu HVAC Zakładu",
    client: "PharmaPoland Sp. z o.o.",
    manager: "Agnieszka Dąbrowska",
    status: "Projektowanie",
    priority: "Wysoki",
    startDate: "2024-12-01",
    endDate: "2025-04-15",
    budget: 420000,
    spent: 95000,
    progress: 22,
    team: ["Agnieszka Dąbrowska", "Michał Zieliński", "Paulina Krawczyk"],
    stage: "Projektowanie",
    overdue: false
  },
  {
    id: "P-2025-003",
    name: "Instalacja Centrum Obróbczego DMG MORI",
    client: "AeroComponents Kraków",
    manager: "Łukasz Wójcik",
    status: "Testowanie",
    priority: "Wysoki",
    startDate: "2024-09-10",
    endDate: "2025-01-25",
    budget: 1200000,
    spent: 1080000,
    progress: 92,
    team: ["Łukasz Wójcik", "Magdalena Piotrowska", "Robert Jankowski"],
    stage: "Montaż",
    overdue: false
  },
  {
    id: "P-2025-004",
    name: "Budowa Laboratorium Kontroli Jakości",
    client: "AutoParts Manufacturing",
    manager: "Dorota Kamińska",
    status: "Oferta",
    priority: "Średni",
    startDate: "2025-02-01",
    endDate: "2025-07-30",
    budget: 580000,
    spent: 25000,
    progress: 5,
    team: ["Dorota Kamińska", "Paweł Szymański"],
    stage: "Oferta",
    overdue: false
  },
  {
    id: "P-2024-087",
    name: "Rozbudowa Magazynu Wysokiego Składowania",
    client: "LogisticCenter Wrocław",
    manager: "Bartosz Mazurek",
    status: "Zakończony",
    priority: "Wysoki",
    startDate: "2024-06-01",
    endDate: "2024-12-15",
    budget: 950000,
    spent: 932000,
    progress: 100,
    team: ["Bartosz Mazurek", "Ewa Górska", "Artur Kaczmarek", "Monika Jasińska"],
    stage: "Zakończony",
    overdue: false
  }
];

// Find project by ID
export const findProjectById = (projectId: string): MockProject | undefined => {
  return mockProjects.find(project => project.id === projectId);
};

// Get project display data for detail view
export const getProjectDisplayData = (project: MockProject) => {
  return {
    id: project.id,
    name: project.name,
    client: project.client,
    manager: project.manager,
    status: project.status,
    priority: project.priority,
    startDate: new Date(project.startDate).toLocaleDateString('pl-PL', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    }),
    endDate: new Date(project.endDate).toLocaleDateString('pl-PL', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    }),
    progress: project.progress,
    budget: project.spent,
    maxBudget: project.budget,
    spent: project.spent,
    currency: "PLN",
    description: `Projekt ${project.name} dla klienta ${project.client}. Projekt znajduje się w fazie ${project.stage} z ${project.progress}% realizacji. Zespół składa się z ${project.team.length} osób pod kierownictwem ${project.manager}.`,
    team: project.team.map((member, index) => {
      const memberName = typeof member === 'string' ? member : member;
      const memberRole = index === 0 ? "Project Manager" : 
                        index === 1 ? "Senior Engineer" : 
                        index === 2 ? "Technician" : "Specialist";
      
      return {
        id: index + 1,
        name: memberName,
        role: memberRole,
        avatar: memberName.split(' ').map(n => n[0]).join(''),
        isOnline: Math.random() > 0.5
      };
    }),
    transactions: [
      { id: 1, name: "Materiały i komponenty", type: "Expenses", amount: Math.floor(-project.spent * 0.4), icon: "🔧" },
      { id: 2, name: "Robocizna", type: "Expenses", amount: Math.floor(-project.spent * 0.35), icon: "👷" },
      { id: 3, name: "Transport i logistyka", type: "Expenses", amount: Math.floor(-project.spent * 0.15), icon: "🚛" },
      { id: 4, name: "Usługi zewnętrzne", type: "Expenses", amount: Math.floor(-project.spent * 0.1), icon: "🏢" },
    ],
    attachments: [
      { id: 1, name: "Specyfikacja_techniczna.pdf", size: "2.1 MB", type: "pdf" },
      { id: 2, name: "Rysunki_wykonawcze.dwg", size: "5.2 MB", type: "dwg" },
      { id: 3, name: "Harmonogram_projektu.xlsx", size: "890 KB", type: "xlsx" },
      { id: 4, name: "Protokoły_testów.zip", size: "12.5 MB", type: "zip" },
    ]
  };
};