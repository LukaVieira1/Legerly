import { formatCurrency, formatDate } from "@/utils/format";
import { DollarIcon, ExclamationCircleIcon, UsersIcon } from "./Icons";

interface StoreMetricsProps {
  metrics: {
    totalDebits: number;
    totalPayments: number;
    totalClientsWithDebit: number;
    topSales: Array<{
      id: number;
      value: number;
      description: string;
      client: { name: string };
      saleDate: string;
    }>;
  };
}

export function StoreMetrics({ metrics }: StoreMetricsProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg border border-secondary-200">
          <div className="flex items-center space-x-4">
            <ExclamationCircleIcon />
            <div>
              <p className="text-sm font-medium text-secondary-600">
                Total em Débitos
              </p>
              <p className="text-2xl font-semibold text-warning-600">
                {formatCurrency(metrics.totalDebits)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-secondary-200">
          <div className="flex items-center space-x-4">
            <DollarIcon className="w-6 h-6 text-success-600" />
            <div>
              <p className="text-sm font-medium text-secondary-600">
                Total em Pagamentos
              </p>
              <p className="text-2xl font-semibold text-success-600">
                {formatCurrency(metrics.totalPayments)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-secondary-200">
          <div className="flex items-center space-x-4">
            <UsersIcon className="w-6 h-6 text-primary-600" />
            <div>
              <p className="text-sm font-medium text-secondary-600">
                Clientes com Débito
              </p>
              <p className="text-2xl font-semibold text-primary-600">
                {metrics.totalClientsWithDebit}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg border border-secondary-200">
        <h3 className="text-lg font-medium text-secondary-900 mb-4">
          Maiores Vendas
        </h3>
        <div className="space-y-4">
          {metrics.topSales.length > 0 ? (
            metrics.topSales.map((sale) => (
              <div
                key={sale.id}
                className="flex items-center justify-between p-4 bg-secondary-50 rounded-lg"
              >
                <div>
                  <p className="font-medium text-secondary-900">
                    {sale.client.name}
                  </p>
                  <p className="text-sm text-secondary-600">
                    {sale.description}
                  </p>
                  <p className="text-xs text-secondary-500">
                    {formatDate(sale.saleDate)}
                  </p>
                </div>
                <p className="font-medium text-primary-600">
                  {formatCurrency(Number(sale.value))}
                </p>
              </div>
            ))
          ) : (
            <p className="text-secondary-600">Nenhuma venda encontrada</p>
          )}
        </div>
      </div>
    </div>
  );
}
