import { useState } from "react";
import { IClient } from "@/types/client";
import { formatCurrency, formatPhone } from "@/utils/format";
import {
  EditIcon,
  UserIcon,
  PhoneIcon,
  CreditCardIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@/components/Icons";
import { ClientMetricsExpanded } from "./ClientMetricsExpanded";
import { getClientMetrics } from "@/services/client";

interface ClientListProps {
  clients: IClient[];
  onEdit: (client: IClient) => void;
}

export function ClientList({ clients, onEdit }: ClientListProps) {
  const [expandedClient, setExpandedClient] = useState<number | null>(null);
  const [metrics, setMetrics] = useState(null);
  const [isLoadingMetrics, setIsLoadingMetrics] = useState(false);

  const handleExpand = async (clientId: number) => {
    if (expandedClient === clientId) {
      setExpandedClient(null);
      setMetrics(null);
      return;
    }

    try {
      setIsLoadingMetrics(true);
      setExpandedClient(clientId);
      const data = await getClientMetrics(clientId);
      setMetrics(data);
    } catch (error) {
      console.error(error);
      setExpandedClient(null);
    } finally {
      setIsLoadingMetrics(false);
    }
  };

  const handleFilterChange = async (
    clientId: number,
    startDate: string,
    endDate: string
  ) => {
    try {
      setIsLoadingMetrics(true);
      const data = await getClientMetrics(clientId, { startDate, endDate });
      setMetrics(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoadingMetrics(false);
    }
  };

  return (
    <div className="space-y-4">
      {clients.map((client) => (
        <div
          key={client.id}
          className="bg-white rounded-lg border border-secondary-200"
        >
          <div
            className="p-4 flex items-center justify-between cursor-pointer hover:bg-secondary-50"
            onClick={() => handleExpand(client.id)}
          >
            <div className="flex items-center space-x-4">
              <div className="bg-primary-50 p-3 rounded-full">
                <UserIcon className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-secondary-900">
                  {client.name}
                </h3>
                <div className="mt-1 flex items-center gap-4 text-sm text-secondary-600">
                  <span className="flex items-center gap-1">
                    <PhoneIcon className="w-4 h-4" />
                    {formatPhone(client.phone)}
                  </span>
                  <span className="flex items-center gap-1">
                    <CreditCardIcon className="w-4 h-4" />
                    {formatCurrency(client.debitBalance)}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(client);
                }}
                className="p-2 hover:bg-secondary-100 rounded-full transition-colors"
              >
                <EditIcon className="w-5 h-5 text-secondary-600" />
              </button>
              {expandedClient === client.id ? (
                <ChevronUpIcon className="w-5 h-5 text-secondary-600" />
              ) : (
                <ChevronDownIcon className="w-5 h-5 text-secondary-600" />
              )}
            </div>
          </div>

          {expandedClient === client.id && (
            <div className="border-t border-secondary-200 p-4">
              {isLoadingMetrics ? (
                <div className="flex justify-center p-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
                </div>
              ) : metrics ? (
                <ClientMetricsExpanded
                  metrics={metrics}
                  onFilterChange={(startDate, endDate) =>
                    handleFilterChange(client.id, startDate, endDate)
                  }
                />
              ) : null}
            </div>
          )}

          <div className="mt-4 text-sm text-secondary-600 bg-secondary-50 p-3 rounded-lg">
            {client.observations || "Sem observações"}
          </div>
        </div>
      ))}
    </div>
  );
}
