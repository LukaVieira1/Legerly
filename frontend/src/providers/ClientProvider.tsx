"use client";

import { ReactNode, createContext, useContext } from "react";
import { useClients } from "@/hooks/useClients";
import { IClient, IClientForm } from "@/types/client";
import { IPagination } from "@/types/pagination";

interface ClientContextData {
  clients: IClient[];
  isLoading: boolean;
  isSearching: boolean;
  createClient: (data: IClientForm) => Promise<IClient>;
  updateClient: (id: number, data: Partial<IClientForm>) => Promise<IClient>;
  deleteClient: (id: number) => Promise<void>;
  refetch: () => Promise<void>;
  filters: {
    page: number;
    search: string;
  };
  pagination: IPagination;
  handleSearch: (search: string) => void;
  handlePageChange: (page: number) => void;
}

const ClientContext = createContext({} as ClientContextData);

export function ClientProvider({ children }: { children: ReactNode }) {
  const clients = useClients();

  return (
    <ClientContext.Provider value={clients}>{children}</ClientContext.Provider>
  );
}

export const useClientContext = () => useContext(ClientContext);
