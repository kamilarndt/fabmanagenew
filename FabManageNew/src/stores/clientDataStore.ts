import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type {
    ProcessedClient,
    ProcessedProject
} from '../types/clientData.types';

// Import the JSON data (will be loaded dynamically)
// import clientsJsonData from '../../public/Data copy.json';
// import projectsJsonData from '../../public/Data Projekty.json';

interface ClientDataState {
    clients: ProcessedClient[];
    projects: ProcessedProject[];
    selectedClient: ProcessedClient | null;
    loading: boolean;
    error: string | null;

    // Actions
    loadData: () => void;
    getClientById: (id: string) => ProcessedClient | undefined;
    getProjectsByClient: (clientName: string) => ProcessedProject[];
    selectClient: (client: ProcessedClient) => void;
    clearSelection: () => void;
}

// Helper function to process JSON data into our format
async function processClientData(): Promise<{ clients: ProcessedClient[], projects: ProcessedProject[] }> {
    const clients: ProcessedClient[] = [];
    const projects: ProcessedProject[] = [];

    try {
        // Load JSON data dynamically
        const [clientsResponse, projectsResponse] = await Promise.all([
            fetch('/Data copy.json'),
            fetch('/Data Projekty.json')
        ]);

        if (!clientsResponse.ok) {
            throw new Error(`Failed to load clients data: ${clientsResponse.status}`);
        }
        if (!projectsResponse.ok) {
            throw new Error(`Failed to load projects data: ${projectsResponse.status}`);
        }

        const clientsJsonData = await clientsResponse.json();
        const projectsJsonData = await projectsResponse.json();

        // Process clients data
        const clientsData = clientsJsonData[0]["Dane Klientów"];
        if (clientsData && clientsData.modes) {
            Object.entries(clientsData.modes).forEach(([clientName, clientData]: [string, any]) => {
                const companyData = clientData.step_1_dane_firmy;
                const contactData = clientData.step_2_dane_kontaktowe;
                const additionalData = clientData.step_3_dodatkowe_informacje;

                // Generate legacy properties for backward compatibility
                const companySize = companyData.nazwa_firmy.$value.includes('S.A.') ? 'Duży' :
                    companyData.nazwa_firmy.$value.includes('Sp. z o.o.') ? 'Średni' : 'Mały';

                const processedClient: ProcessedClient = {
                    id: clientName.toLowerCase().replace(/\s+/g, '-'),
                    companyName: companyData.nazwa_firmy.$value,
                    logoUrl: `/assets/logos/${companyData.logotyp.$value}`,
                    nip: companyData.nip.$value,
                    regon: companyData.regon.$value,
                    address: {
                        street: companyData.ulica.$value,
                        houseNumber: companyData.numer_domu.$value,
                        apartmentNumber: companyData.numer_lokalu.$value || undefined,
                        postalCode: companyData.kod_pocztowy.$value,
                        city: companyData.miasto.$value,
                    },
                    website: companyData.adres_strony.$value,
                    email: companyData.mail_firmowy.$value,
                    description: companyData.opis_firmy.$value,
                    contacts: [
                        {
                            imie: contactData.osoba_1.imie.$value,
                            nazwisko: contactData.osoba_1.nazwisko.$value,
                            adres_email: contactData.osoba_1.adres_email.$value,
                            telefon_kontaktowy: contactData.osoba_1.telefon_kontaktowy.$value,
                            opis: contactData.osoba_1.opis.$value,
                        },
                        {
                            imie: contactData.osoba_2.imie.$value,
                            nazwisko: contactData.osoba_2.nazwisko.$value,
                            adres_email: contactData.osoba_2.adres_email.$value,
                            telefon_kontaktowy: contactData.osoba_2.telefon_kontaktowy.$value,
                            opis: contactData.osoba_2.opis.$value,
                        },
                    ],
                    additionalInfo: additionalData.opis.$value,
                    files: additionalData.pliki.$value ? additionalData.pliki.$value.split(', ') : [],
                    // Legacy compatibility properties
                    status: 'Active' as const,
                    segment: companySize as 'Mały' | 'Średni' | 'Duży',
                    cardColor: `#${Math.floor(Math.random() * 16777215).toString(16)}`, // Random color
                };

                clients.push(processedClient);
            });
        }

        // Process projects data
        const projectsData = projectsJsonData[0]["Dane Projektów"];
        if (projectsData && projectsData.modes) {
            Object.entries(projectsData.modes).forEach(([projectName, projectData]: [string, any]) => {
                const generalData = projectData.dane_ogolne;
                const modulesData = projectData.moduly;
                const elementsData = projectData.elementy;
                const materialsData = projectData.materialy_od_klienta;

                // Extract elements
                const elementsCount = elementsData.ilosc.$value;
                const elements: string[] = [];
                for (let i = 1; i <= elementsCount; i++) {
                    const elementKey = `element_${i}_nazwa`;
                    if (elementsData[elementKey]) {
                        elements.push(elementsData[elementKey].$value);
                    }
                }

                // Extract material files
                const materialFiles: string[] = [];
                Object.entries(materialsData).forEach(([key, value]: [string, any]) => {
                    if (key.includes('plik') && value.$value) {
                        materialFiles.push(value.$value);
                    }
                });

                const processedProject: ProcessedProject = {
                    id: projectName.toLowerCase().replace(/\s+/g, '-'),
                    clientName: generalData.klient.$value,
                    projectName: generalData.nazwa_projektu.$value,
                    location: generalData.miejsce_zlecenia.$value,
                    dateReceived: generalData.data_przyjecia.$value,
                    deadline: generalData.deadline.$value,
                    modules: {
                        wycena: modulesData.wycena.$value,
                        koncepcja: modulesData.koncepcja.$value,
                        produkcja: modulesData.produkcja.$value,
                        zamowienia: modulesData.zamowienia.$value,
                        logistyka: modulesData.logistyka.$value,
                    },
                    elementsCount,
                    elements,
                    materialFiles,
                };

                projects.push(processedProject);
            });
        }
    } catch (error) {
        console.error('Error processing JSON data:', error);
    }

    return { clients, projects };
}

export const useClientDataStore = create<ClientDataState>()(
    devtools(
        (set, get) => ({
            clients: [],
            projects: [],
            selectedClient: null,
            loading: false,
            error: null,

            loadData: async () => {
                set({ loading: true, error: null });
                try {
                    const { clients, projects } = await processClientData();
                    set({
                        clients,
                        projects,
                        loading: false
                    });
                } catch (error) {
                    set({
                        loading: false,
                        error: error instanceof Error ? error.message : 'Unknown error occurred'
                    });
                }
            },

            getClientById: (id: string) => {
                const state = get();
                return state.clients.find(client => client.id === id);
            },

            getProjectsByClient: (clientName: string) => {
                const state = get();
                return state.projects.filter(project =>
                    project.clientName === clientName
                );
            },

            selectClient: (client: ProcessedClient) => {
                set({ selectedClient: client });
            },

            clearSelection: () => {
                set({ selectedClient: null });
            },
        }),
        {
            name: 'client-data-store',
        }
    )
);
