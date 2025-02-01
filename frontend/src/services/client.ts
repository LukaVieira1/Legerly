import api from "@/lib/api";
import { IClient, IClientForm, IClientResponse } from "@/types/client";

export async function getClients(filters: {
  page: number;
  search: string;
}): Promise<IClientResponse> {
  try {
    const response = await api.get("/clients", { params: { ...filters } });
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

interface GetClientMetricsParams {
  startDate?: string;
  endDate?: string;
}

export const getClientMetrics = async (
  clientId: number,
  params: GetClientMetricsParams = {}
) => {
  try {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value) queryParams.append(key, value);
    });

    const response = await api.get(
      `/clients/${clientId}/metrics?${queryParams.toString()}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
