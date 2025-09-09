import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type {
    ProcessedClient,
    ProcessedProject
} from '../types/clientData.types';
import { mockClients } from '../data/mockDatabase';

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

// Helper function to process JSON data into our format (replaced to use mockClients)
async function processClientData(): Promise<{ clients: ProcessedClient[], projects: ProcessedProject[] }> {
    return { clients: mockClients, projects: [] };
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
