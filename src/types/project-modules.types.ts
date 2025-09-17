// Project modules configuration types
export interface ProjectModule {
  id: string;
  name: string;
  enabled: boolean;
  order: number;
  icon: React.ReactNode;
  component: React.ComponentType<any>;
}

export interface ProjectModulesConfig {
  projectId: string;
  modules: {
    [key: string]: boolean;
  };
  lastUpdated: string;
  updatedBy: string;
}

export interface ModuleToggleEvent {
  moduleId: string;
  enabled: boolean;
  projectId: string;
}

// Available modules configuration
export const AVAILABLE_MODULES = {
  general: {
    id: 'general',
    name: 'Ogólne',
    order: 1,
    required: true, // Always enabled
  },
  files: {
    id: 'files',
    name: 'Pliki',
    order: 2,
    required: false,
  },
  concept: {
    id: 'concept',
    name: 'Koncepcja',
    order: 3,
    required: false,
  },
  pricing: {
    id: 'pricing',
    name: 'Wycena',
    order: 4,
    required: false,
  },
  items: {
    id: 'items',
    name: 'Elementy',
    order: 5,
    required: false,
  },
  materials: {
    id: 'materials',
    name: 'Materiały',
    order: 6,
    required: false,
  },
  documents: {
    id: 'documents',
    name: 'Dokumenty',
    order: 7,
    required: false,
  },
  logistics: {
    id: 'logistics',
    name: 'Logistyka',
    order: 8,
    required: false,
  },
  accommodation: {
    id: 'accommodation',
    name: 'Zakwaterowanie',
    order: 9,
    required: false,
  },
} as const;

export type ModuleId = keyof typeof AVAILABLE_MODULES;
