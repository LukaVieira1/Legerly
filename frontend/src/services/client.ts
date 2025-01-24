import api from "@/lib/api";
import { IClient, IClientForm } from "@/types/client";

export async function getClients(): Promise<IClient[]> {
  try {
    const response = await api.get("/clients");
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function createClient(
  data: Partial<IClientForm>
): Promise<IClient> {
  try {
    const response = await api.post("/clients", data);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function updateClient(
  id: number,
  data: Partial<IClientForm>
): Promise<IClient> {
  try {
    const response = await api.put(`/clients/${id}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function deleteClient(id: number): Promise<void> {
  try {
    await api.delete(`/clients/${id}`);
  } catch (error) {
    throw error;
  }
}
