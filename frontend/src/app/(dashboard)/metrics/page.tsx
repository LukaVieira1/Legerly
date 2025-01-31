"use client";

import { StoreMetrics } from "@/components/StoreMetrics";
import { MetricSkeleton } from "@/components/skeletons/MetricSkeleton";
import { EmptyMetrics } from "@/components/EmptyMetrics";
import { getStoreMetrics } from "@/services/store";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Input } from "@/components/ui/Input";
import { CalendarIcon, XIcon } from "@/components/Icons";

export default function Metrics() {
  const [isLoading, setIsLoading] = useState(true);
  const [metrics, setMetrics] = useState(null);
  const [dateFilter, setDateFilter] = useState({
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    fetchMetrics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateFilter]);

  async function fetchMetrics() {
    try {
      setIsLoading(true);
      const data = await getStoreMetrics(dateFilter);
      setMetrics(data);
    } catch (error) {
      console.error(error);
      toast.error("Erro ao carregar métricas");
    } finally {
      setIsLoading(false);
    }
  }

  const handleDateChange = (field: "startDate" | "endDate", value: string) => {
    setDateFilter((prev) => ({ ...prev, [field]: value }));
  };

  const handleClear = () => {
    setDateFilter({
      startDate: "",
      endDate: "",
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-secondary-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-medium text-secondary-900">
            Métricas
          </h1>
          <p className="mt-1 text-sm sm:text-base text-secondary-500">
            Acompanhe os números da sua loja
          </p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg border border-secondary-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative">
          {(dateFilter.startDate || dateFilter.endDate) && (
            <div className="absolute right-0 top-0">
              <button
                onClick={handleClear}
                disabled={isLoading}
                className="flex items-center gap-2 text-sm text-secondary-600 hover:text-secondary-900 disabled:opacity-50"
              >
                <XIcon className="w-4 h-4" />
                Limpar filtros
              </button>
            </div>
          )}

          <Input
            label="Data Inicial"
            type="date"
            icon={<CalendarIcon className="w-4 h-4" />}
            value={dateFilter.startDate}
            onChange={(e) => handleDateChange("startDate", e.target.value)}
          />
          <Input
            label="Data Final"
            type="date"
            icon={<CalendarIcon className="w-4 h-4" />}
            value={dateFilter.endDate}
            onChange={(e) => handleDateChange("endDate", e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <MetricSkeleton />
            <MetricSkeleton />
            <MetricSkeleton />
          </div>
        </div>
      ) : metrics ? (
        <StoreMetrics metrics={metrics} />
      ) : (
        <EmptyMetrics />
      )}
    </div>
  );
}
