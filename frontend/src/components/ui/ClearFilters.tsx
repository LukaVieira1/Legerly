import { ButtonHTMLAttributes } from "react";
import { XIcon } from "../Icons";

interface ClearFiltersButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode;
}

export function ClearFiltersButton({
  className = "",
  ...props
}: ClearFiltersButtonProps) {
  return (
    <button
      className={`flex items-center gap-2 text-sm text-secondary-600 hover:text-secondary-900 disabled:opacity-50 ${className}`}
      {...props}
    >
      <XIcon className="w-4 h-4" />
      Limpar filtros
    </button>
  );
}
