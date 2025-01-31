import { useState, useEffect } from "react";
import { IClient, IClientForm } from "@/types/client";
import {
  getClients as getClientsService,
  createClient as createClientService,
  updateClient as updateClientService,
  deleteClient as deleteClientService,
} from "@/services/client";
import { toast } from "react-toastify";
import { useDebounce } from "./useDebounce";

export function useClients() {
  const [clients, setClients] = useState<IClient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [pagination, setPagination] = useState({
    total: 0,
    pages: 0,
    currentPage: 1,
    perPage: 10,
  });

  const [filters, setFilters] = useState({
    page: 1,
    search: "",
  });

  const fetchInitialClients = async () => {
    setIsLoading(true);
    try {
      const response = await getClientsService(filters);
      setClients(response.clients);
      setPagination(response.pagination);
    } catch (error) {
      console.error(error);
      toast.error("Erro ao carregar clientes");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDebouncedClients = async () => {
    setIsSearching(true);
    try {
      const response = await getClientsService(filters);
      setClients(response.clients);
      setPagination(response.pagination);
    } catch (error) {
      console.error(error);
      toast.error("Erro ao carregar clientes");
    } finally {
      setIsSearching(false);
    }
  };

  const debouncedFetch = useDebounce(fetchDebouncedClients, 500);

  useEffect(() => {
    if (filters.search) {
      debouncedFetch();
    } else {
      fetchInitialClients();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const handleSearch = (search: string) => {
    setFilters((prev) => ({ ...prev, search, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

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
    pagination,
    isLoading,
    isSearching,
    filters,
    handleSearch,
    handlePageChange,
    createClient,
    updateClient,
    deleteClient,
    refetch: fetchInitialClients,
  };
}
