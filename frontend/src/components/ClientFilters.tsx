import { useState, useEffect } from "react";
import { Input } from "./ui/Input";
import { SearchIcon } from "./Icons";
import { ClearFiltersButton } from "./ui/ClearFilters";
interface ClientFiltersProps {
  search: string;
  onSearch: (search: string) => void;
  isLoading?: boolean;
}

export function ClientFilters({
  search: externalSearch,
  onSearch,
  isLoading,
}: ClientFiltersProps) {
  const [search, setSearch] = useState(externalSearch);

  useEffect(() => {
    if (externalSearch === "") {
      setSearch("");
    }
  }, [externalSearch]);

  const handleSearch = (value: string) => {
    setSearch(value);
    onSearch(value);
  };

  const handleClear = () => {
    setSearch("");
    onSearch("");
  };

  return (
    <div className="bg-white p-4 rounded-lg border border-secondary-200 relative">
      <div className="absolute right-5 top-2">
        {search && (
          <ClearFiltersButton onClick={handleClear} disabled={isLoading} />
        )}
      </div>

      <Input
        label="Buscar cliente"
        icon={<SearchIcon className="w-4 h-4" />}
        placeholder="Nome ou telefone..."
        value={search}
        onChange={(e) => handleSearch(e.target.value)}
      />
    </div>
  );
}
