import { forwardRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FieldError } from "react-hook-form";
import { ChevronDownIcon, SearchIcon } from "@/components/Icons";

interface SelectProps {
  label: string;
  icon?: React.ReactNode;
  error?: FieldError;
  containerClassName?: string;
  options: Array<{ value: string; label: string }>;
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export const Select = forwardRef<HTMLButtonElement, SelectProps>(
  (
    {
      label,
      icon,
      error,
      options,
      value,
      onChange,
      placeholder = "Selecione uma opção",
      disabled,
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState("");

    const selectedOption = options.find((option) => option.value === value);

    const filteredOptions = options.filter((option) =>
      option.label.toLowerCase().includes(search.toLowerCase())
    );

    const handleSelect = useCallback(
      (value: string) => {
        onChange?.(value);
        setIsOpen(false);
        setSearch("");
      },
      [onChange]
    );

    return (
      <div className="relative">
        <label className="block text-sm font-medium text-secondary-700 mb-1.5">
          <div className="flex items-center space-x-2">
            {icon && <span className="text-primary-500">{icon}</span>}
            <span>{label}</span>
          </div>
        </label>

        <button
          ref={ref}
          type="button"
          disabled={disabled}
          onClick={() => setIsOpen(!isOpen)}
          className={`
            relative w-full px-4 py-2.5 text-left
            bg-white border border-secondary-200
            rounded-lg shadow-sm
            text-secondary-900 
            transition duration-200
            focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500
            disabled:opacity-50 disabled:cursor-not-allowed
            ${
              error
                ? "border-danger-500 focus:ring-danger-500/20 focus:border-danger-500"
                : ""
            }
          `}
        >
          <span
            className={
              selectedOption ? "text-secondary-900" : "text-secondary-400"
            }
          >
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <span className="absolute inset-y-0 right-0 flex items-center pr-2">
            <ChevronDownIcon
              className={`w-5 h-5 text-secondary-400 transition-transform ${
                isOpen ? "transform rotate-180" : ""
              }`}
            />
          </span>
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute z-50 w-full mt-1 bg-white rounded-lg shadow-lg border border-secondary-200"
            >
              <div className="p-2">
                <div className="relative">
                  <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Pesquisar..."
                    className="w-full pl-9 pr-4 py-2 text-sm border border-secondary-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                  />
                </div>
              </div>

              <div className="max-h-60 overflow-auto">
                {filteredOptions.length === 0 ? (
                  <div className="px-4 py-3 text-sm text-secondary-500">
                    Nenhum resultado encontrado
                  </div>
                ) : (
                  <div className="py-1">
                    {filteredOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => handleSelect(option.value)}
                        className={`
                          w-full px-4 py-2 text-sm text-left
                          hover:bg-secondary-50
                          transition-colors
                          ${
                            option.value === value
                              ? "text-primary-600 bg-primary-50"
                              : "text-secondary-900"
                          }
                        `}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-1.5 text-sm text-danger-600"
          >
            {error.message}
          </motion.p>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";
