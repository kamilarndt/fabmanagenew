// Minimal development data stubs for clean workspace builds
// These exports satisfy dynamic imports without bundling heavy mock datasets

// Use `any[]` so callers with stricter types (e.g., ProcessedClient[]) accept the values
export const mockProjects: any[] = [];
export const mockClients: any[] = [];
export const mockTiles: any[] = [];
export const mockMaterials: any[] = [];

// Shape-compatible stubs for stores expecting typed structures
export const realAccommodationData: Record<string, any[]> = {};
export const realLogisticsData: { routePlanning: any[]; packingLists: any[] } = {
  routePlanning: [],
  packingLists: [],
};


