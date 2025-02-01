import { forwardRef, useCallback } from "react";
import { Input } from "./Input";
import { maskPhone, unmaskPhone } from "@/utils/format";
import { FieldError } from "react-hook-form";

interface PhoneInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  label: string;
  icon?: React.ReactNode;
  error?: FieldError;
  containerClassName?: string;
  onChange?: (value: string) => void;
}

export const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ onChange, value, ...props }, ref) => {
    const handleChange = useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        const maskedValue = maskPhone(event.target.value);
        const unmaskedValue = unmaskPhone(maskedValue);

        event.target.value = maskedValue;

        onChange?.(unmaskedValue);
      },
      [onChange]
    );

    return (
      <Input
        ref={ref}
        value={value ? maskPhone(value.toString()) : ""}
        onChange={handleChange}
        maxLength={15}
        {...props}
      />
    );
  }
);

PhoneInput.displayName = "PhoneInput";
