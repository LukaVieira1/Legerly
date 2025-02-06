"use client";
import { useState } from "react";
import { useClientContext } from "@/providers/ClientProvider";
import { IClient } from "@/types/client";
import { PlusIcon } from "@/components/Icons";
import { ClientList } from "@/components/ClientList";
import { ClientModal } from "@/components/ClientModal";
import { ClientSkeleton } from "@/components/skeletons/ClientSkeleton";

export default function Clients() {
  const {
    clients,
    pagination,
    isLoading,
    isSearching,
    filters,
    handleSearch,
    handlePageChange,
  } = useClientContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<IClient | null>(null);

  function handleOpenModal(client?: IClient) {
    if (client) {
      setSelectedClient(client);
    } else {
      setSelectedClient(null);
    }
    setIsModalOpen(true);
  }

  return (
    <div className="space-y-8">
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-secondary-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0">
          <div>
            <h1 className="text-xl sm:text-2xl font-medium text-secondary-900">
              Clientes
            </h1>
            <p className="mt-1 text-sm sm:text-base text-secondary-500">
              Gerencie os clientes da sua loja
            </p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
          >
            <PlusIcon className="sm:mr-2 h-5 w-5" />
            <span className="hidden sm:inline">Novo Cliente</span>
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <ClientSkeleton key={n} />
          ))}
        </div>
      ) : (
        <ClientList
          clients={clients}
          pagination={pagination}
          filters={filters}
          onEdit={handleOpenModal}
          onSearch={handleSearch}
          onPageChange={handlePageChange}
          isLoading={isSearching}
        />
      )}

      <ClientModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedClient(null);
        }}
        client={selectedClient}
      />
    </div>
  );
}
