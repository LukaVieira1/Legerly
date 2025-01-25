import { IClient } from "@/types/client";
import { formatCurrency, formatPhone } from "@/utils/format";
import {
  EditIcon,
  UserIcon,
  PhoneIcon,
  CreditCardIcon,
} from "@/components/Icons";

interface ClientListProps {
  clients: IClient[];
  onEdit: (client: IClient) => void;
}

export function ClientList({ clients, onEdit }: ClientListProps) {
  return (
    <div className="bg-white rounded-lg border border-secondary-200 divide-y divide-secondary-200">
      {clients.map((client) => (
        <div
          key={client.id}
          className="p-4 hover:bg-secondary-50 transition-colors"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-start space-x-4">
              <div className="p-2 bg-primary-50 rounded-full">
                <UserIcon className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-secondary-900">
                  {client.name}
                </h3>
                <div className="mt-1 space-y-1">
                  <div className="flex items-center text-sm text-secondary-500">
                    <PhoneIcon className="mr-2 h-4 w-4" />
                    {formatPhone(client.phone)}
                  </div>
                  <div className="flex items-center text-sm text-secondary-500">
                    <CreditCardIcon className="mr-2 h-4 w-4" />
                    Débito: {formatCurrency(Number(client.debitBalance))}
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => onEdit(client)}
              className="p-2 text-secondary-400 hover:text-primary-600 hover:bg-primary-50 rounded-full transition-colors"
            >
              <EditIcon className="w-5 h-5" />
            </button>
          </div>

          <div className="mt-4 text-sm text-secondary-600 bg-secondary-50 p-3 rounded-lg">
            {client.observations || "Sem observações"}
          </div>
        </div>
      ))}
    </div>
  );
}
