import { forwardRef, useCallback } from "react";
import { Input } from "./Input";
import { FieldError } from "react-hook-form";

interface CurrencyInputProps {
  label: string;
  icon?: React.ReactNode;
  error?: FieldError;
  containerClassName?: string;
  onChange?: (value: string) => void;
  value?: string;
  placeholder?: string;
  disabled?: boolean;
}

export const CurrencyInput = forwardRef<HTMLInputElement, CurrencyInputProps>(
  ({ onChange, value, ...props }, ref) => {
    const handleChange = useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        // Pega apenas os números e limita a 16 dígitos
        const numericValue = event.target.value.replace(/\D/g, "").slice(0, 16);

        if (!numericValue) {
          event.target.value = "";
          onChange?.("");
          return;
        }

        // Converte para centavos
        const cents = parseInt(numericValue, 10);

        // Formata o valor
        const formattedValue = new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(cents / 100);

        event.target.value = formattedValue;
        onChange?.(numericValue);
      },
      [onChange]
    );

    const formatInitialValue = (value: string) => {
      if (!value) return "";
      const cents = parseInt(value, 10);
      return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(cents / 100);
    };

    return (
      <Input
        ref={ref}
        value={formatInitialValue(value || "")}
        onChange={handleChange}
        inputMode="numeric"
        {...props}
      />
    );
  }
);

CurrencyInput.displayName = "CurrencyInput";
