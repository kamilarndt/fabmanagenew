import { api } from "../lib/httpClient";
import { 
  clientSchema, 
  clientCreateSchema, 
  type ClientFormData, 
  type ClientCreateData,
  validateClientData 
} from "../schemas/client.schema";

export interface Client {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  companyName?: string;
  address?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

/**
 * Enhanced client service with validation
 */
export const clientsService = {
  /**
   * Get all clients
   */
  async list(): Promise<Client[]> {
    return api.get<Client[]>("/api/clients");
  },

  /**
   * Get client by ID
   */
  async get(id: string): Promise<Client> {
    return api.get<Client>(`/api/clients/${id}`);
  },

  /**
   * Create new client with validation
   */
  async create(data: ClientFormData): Promise<Client> {
    // Validate input data
    const validatedData = validateClientData(data);
    
    // Create payload with optional ID generation
    const createData: ClientCreateData = {
      ...validatedData,
      // Clean up empty strings to undefined
      email: validatedData.email || undefined,
      phone: validatedData.phone || undefined,
      companyName: validatedData.companyName || undefined,
      address: validatedData.address || undefined,
      notes: validatedData.notes || undefined,
    };

    return api.post<Client>("/api/clients", createData);
  },

  /**
   * Update existing client
   */
  async update(id: string, data: Partial<ClientFormData>): Promise<Client> {
    const validatedData = clientSchema.partial().parse(data);
    return api.put<Client>(`/api/clients/${id}`, validatedData);
  },

  /**
   * Delete client
   */
  async delete(id: string): Promise<void> {
    return api.delete(`/api/clients/${id}`);
  },
};

// Legacy functions for backward compatibility
export async function listClients(): Promise<Client[]> {
  return clientsService.list();
}

export async function createClient(
  client: Omit<Client, "id">
): Promise<Client> {
  return clientsService.create(client);
}
