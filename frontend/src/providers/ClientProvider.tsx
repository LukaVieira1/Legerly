"use client";

import { ReactNode, createContext, useContext } from "react";
import { useClients } from "@/hooks/useClients";
import { IClient, IClientForm } from "@/types/client";

interface ClientContextData {
  clients: IClient[];
  isLoading: boolean;
  createClient: (data: IClientForm) => Promise<IClient>;
  updateClient: (id: number, data: Partial<IClientForm>) => Promise<IClient>;
  deleteClient: (id: number) => Promise<void>;
  refetch: () => Promise<void>;
}

const ClientContext = createContext({} as ClientContextData);

export function ClientProvider({ children }: { children: ReactNode }) {
  const clients = useClients();

  return (
    <ClientContext.Provider value={clients}>{children}</ClientContext.Provider>
  );
}

export const useClientContext = () => useContext(ClientContext);
