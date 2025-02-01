import { useState } from "react";
import { formatCurrency, formatDate } from "@/utils/format";
import { Input } from "./ui/Input";
import { CalendarIcon, DollarIcon, ExclamationCircleIcon } from "./Icons";

interface ClientMetricsProps {
  metrics: {
    totalDebits: number;
    totalPayments: number;
    topSales: Array<{
      id: number;
      value: number;
      description: string;
      client: { name: string };
      saleDate: string;
    }>;
    period: {
      startDate: string | null;
      endDate: string | null;
    };
  };
  onFilterChange: (startDate: string, endDate: string) => void;
}

export function ClientMetrics({ metrics, onFilterChange }: ClientMetricsProps) {
  const [dates, setDates] = useState({
    startDate: metrics.period.startDate || "",
    endDate: metrics.period.endDate || "",
  });

  const handleDateChange = (field: "startDate" | "endDate", value: string) => {
    const newDates = { ...dates, [field]: value };
    setDates(newDates);
    onFilterChange(newDates.startDate, newDates.endDate);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-lg border border-secondary-200">
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
      </div>

      <div className="bg-white p-6 rounded-lg border border-secondary-200">
        <h3 className="text-lg font-medium text-secondary-900 mb-4">
          Maiores Vendas
        </h3>
        <div className="space-y-4">
          {metrics.topSales.map((sale) => (
            <div
              key={sale.id}
              className="flex items-center justify-between p-4 bg-secondary-50 rounded-lg"
            >
              <div>
                <p className="font-medium text-secondary-900">
                  {sale.client.name}
                </p>
                <p className="text-sm text-secondary-600">{sale.description}</p>
                <p className="text-xs text-secondary-500">
                  {formatDate(sale.saleDate)}
                </p>
              </div>
              <p className="font-medium text-primary-600">
                {formatCurrency(Number(sale.value))}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
