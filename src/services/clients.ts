import { api } from "../lib/httpClient";

export interface Client {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  created_at?: string;
}

export async function listClients(): Promise<Client[]> {
  return api.get<Client[]>("/api/clients");
}

export async function createClient(
  client: Omit<Client, "id">
): Promise<Client> {
  return api.post<Client>("/api/clients", client);
}
