import { useState, useEffect } from "react";
import { IClient, IClientForm } from "@/types/client";
import {
  getClients as getClientsService,
  createClient as createClientService,
  updateClient as updateClientService,
  deleteClient as deleteClientService,
} from "@/services/client";
import { toast } from "react-toastify";

export function useClients() {
  const [clients, setClients] = useState<IClient[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  async function fetchClients() {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const data = await getClientsService();
      setClients(data);
    } catch (error) {
      console.error(error);
      toast.error("Erro ao carregar clientes");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchClients();
  }, []);

  async function createClient(data: IClientForm) {
    setIsLoading(true);
    try {
      const newClient = await createClientService(data);
      setClients((prev) => [...prev, newClient]);
      return newClient;
    } catch (error) {
      toast.error("Erro ao criar cliente");
      throw error;
    } finally {
      setIsLoading(false);
    }
  }

  async function updateClient(id: number, data: Partial<IClientForm>) {
    setIsLoading(true);
    try {
      const updatedClient = await updateClientService(id, data);
      setClients((prev) =>
        prev.map((client) => (client.id === id ? updatedClient : client))
      );
      return updatedClient;
    } catch (error) {
      toast.error("Erro ao atualizar cliente");
      throw error;
    } finally {
      setIsLoading(false);
    }
  }

  async function deleteClient(id: number) {
    setIsLoading(true);
    try {
      await deleteClientService(id);
      setClients((prev) => prev.filter((client) => client.id !== id));
    } catch (error) {
      toast.error("Erro ao deletar cliente");
      throw error;
    } finally {
      setIsLoading(false);
    }
  }

  return {
    clients,
    isLoading,
    createClient,
    updateClient,
    deleteClient,
    refetch: fetchClients,
  };
}
