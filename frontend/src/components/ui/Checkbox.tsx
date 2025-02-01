import { forwardRef } from "react";

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, className = "", ...props }, ref) => {
    return (
      <label className="flex items-center space-x-2 cursor-pointer">
        <input
          type="checkbox"
          ref={ref}
          className={`
            w-4 h-4
            text-primary-600
            bg-white border-secondary-300
            rounded
            focus:ring-primary-500
            ${className}
          `}
          {...props}
        />
        <span className="text-sm font-medium text-secondary-700">{label}</span>
      </label>
    );
  }
);

Checkbox.displayName = "Checkbox";
