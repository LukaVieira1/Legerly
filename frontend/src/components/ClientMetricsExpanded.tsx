import { useState } from "react";
import { formatCurrency, formatDate } from "@/utils/format";
import { Input } from "./ui/Input";
import {
  CalendarIcon,
  DollarIcon,
  ExclamationCircleIcon,
  XIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "./Icons";

interface ClientMetricsExpandedProps {
  metrics: {
    totalPayments: number;
    debitBalance: number;
    clientName: string;
    sales: Array<{
      id: number;
      value: number;
      description: string;
      saleDate: string;
      isPaid: boolean;
      totalPaid: number;
    }>;
    period: {
      startDate: string | null;
      endDate: string | null;
    };
  };
  onFilterChange: (startDate: string, endDate: string) => void;
}

export function ClientMetricsExpanded({
  metrics,
  onFilterChange,
}: ClientMetricsExpandedProps) {
  const [dates, setDates] = useState({
    startDate: metrics.period.startDate || "",
    endDate: metrics.period.endDate || "",
  });
  const [showSales, setShowSales] = useState(false);

  const handleDateChange = (field: "startDate" | "endDate", value: string) => {
    const newDates = { ...dates, [field]: value };
    setDates(newDates);
    onFilterChange(newDates.startDate, newDates.endDate);
  };

  const handleClearFilters = () => {
    setDates({ startDate: "", endDate: "" });
    onFilterChange("", "");
  };

  const hasFilters = dates.startDate || dates.endDate;

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-lg border border-secondary-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-secondary-900">
            Filtrar por período
          </h3>
          {hasFilters && (
            <button
              onClick={handleClearFilters}
              className="flex items-center gap-1 text-sm text-secondary-600 hover:text-secondary-900"
            >
              <XIcon className="w-4 h-4" />
              Limpar filtros
            </button>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Data Inicial"
            type="date"
            icon={<CalendarIcon className="w-4 h-4" />}
            value={dates.startDate}
            onChange={(e) => handleDateChange("startDate", e.target.value)}
          />
          <Input
            label="Data Final"
            type="date"
            icon={<CalendarIcon className="w-4 h-4" />}
            value={dates.endDate}
            onChange={(e) => handleDateChange("endDate", e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg border border-secondary-200">
          <div className="flex items-center space-x-4">
            <ExclamationCircleIcon />
            <div>
              <p className="text-sm font-medium text-secondary-600">
                Total em Débitos
              </p>
              <p className="text-2xl font-semibold text-warning-600">
                {formatCurrency(metrics.debitBalance)}
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
      </div>

      <div className="bg-white rounded-lg border border-secondary-200">
        <button
          onClick={() => setShowSales(!showSales)}
          className="w-full p-4 flex items-center justify-between text-left hover:bg-secondary-50"
        >
          <h3 className="text-lg font-medium text-secondary-900">
            Histórico de Vendas
          </h3>
          {showSales ? (
            <ChevronUpIcon className="w-5 h-5 text-secondary-600" />
          ) : (
            <ChevronDownIcon className="w-5 h-5 text-secondary-600" />
          )}
        </button>

        {showSales && (
          <div className="p-4 border-t border-secondary-200">
            <div className="space-y-4">
              {metrics.sales.length > 0 ? (
                metrics.sales.map((sale) => (
                  <div
                    key={sale.id}
                    className="flex items-center justify-between p-4 bg-secondary-50 rounded-lg"
                  >
                    <div>
                      <p className="text-sm text-secondary-600">
                        {sale.description}
                      </p>
                      <p className="text-xs text-secondary-500">
                        {formatDate(sale.saleDate)}
                      </p>
                      <div className="mt-1 flex items-center gap-2">
                        <span className="text-xs font-medium text-secondary-600">
                          Pago: {formatCurrency(sale.totalPaid)}
                        </span>
                        {sale.isPaid ? (
                          <span className="text-xs font-medium text-success-600">
                            • Quitado
                          </span>
                        ) : (
                          <span className="text-xs font-medium text-warning-600">
                            • Em aberto
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="font-medium text-primary-600">
                      {formatCurrency(Number(sale.value))}
                    </p>
                  </div>
                ))
              ) : (
                <div className="flex items-center justify-center p-4 bg-secondary-50 border border-secondary-200 rounded-lg">
                  <span className="text-sm text-secondary-600">
                    Nenhuma venda encontrada
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
