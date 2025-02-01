import { useState, useEffect } from "react";
import { Input } from "./ui/Input";
import { Select } from "./ui/Select";
import { SearchIcon, CalendarIcon } from "./Icons";
import { ISaleFilters } from "@/types/sale";
import { ClearFiltersButton } from "./ui/ClearFilters";
interface SaleFiltersProps {
  onFilter: (filters: ISaleFilters) => void;
}

export function SaleFilters({ onFilter }: SaleFiltersProps) {
  const [filters, setFilters] = useState<ISaleFilters>({
    search: "",
    isPaid: "",
    startDate: "",
    endDate: "",
  });

  const handleFilter = (key: keyof ISaleFilters, value: string) => {
    const newFilters = { ...filters, [key]: value };

    if (key === "startDate" || key === "endDate") {
      const start = key === "startDate" ? value : filters.startDate;
      const end = key === "endDate" ? value : filters.endDate;

      if (!value) {
        newFilters.startDate = "";
        newFilters.endDate = "";
      } else {
        if (!start && end) {
          const firstDayOfMonth = new Date(end);
          firstDayOfMonth.setDate(1);
          newFilters.startDate = firstDayOfMonth.toISOString().split("T")[0];
        }

        if (start && !end) {
          newFilters.endDate = new Date().toISOString().split("T")[0];
        }
      }
    }

    setFilters(newFilters);
    onFilter(newFilters);
  };

  const clearAllFilters = () => {
    const emptyFilters = {
      search: "",
      isPaid: "",
      startDate: "",
      endDate: "",
    };
    setFilters(emptyFilters);
    onFilter(emptyFilters);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (filters.search) {
        onFilter(filters);
      }
    }, 500);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.search]);

  return (
    <div className="bg-white p-4 rounded-lg border border-secondary-200 space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-secondary-700">Filtros</h3>
        {(filters.search ||
          filters.isPaid ||
          filters.startDate ||
          filters.endDate) && <ClearFiltersButton onClick={clearAllFilters} />}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Input
          label="Buscar"
          icon={<SearchIcon className="w-4 h-4" />}
          placeholder="Cliente ou descrição..."
          value={filters.search}
          onChange={(e) => handleFilter("search", e.target.value)}
        />

        <Select
          label="Status"
          options={[
            { value: "", label: "Todos" },
            { value: "true", label: "Pago" },
            { value: "false", label: "Pendente" },
          ]}
          value={filters.isPaid}
          onChange={(value) => handleFilter("isPaid", value)}
        />

        <Input
          label="Data Inicial"
          type="date"
          icon={<CalendarIcon className="w-4 h-4" />}
          value={filters.startDate}
          onChange={(e) => handleFilter("startDate", e.target.value)}
        />

        <Input
          label="Data Final"
          type="date"
          icon={<CalendarIcon className="w-4 h-4" />}
          value={filters.endDate}
          onChange={(e) => handleFilter("endDate", e.target.value)}
        />
      </div>
    </div>
  );
}
