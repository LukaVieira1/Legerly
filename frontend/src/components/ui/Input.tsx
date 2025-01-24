import { motion } from "framer-motion";
import { forwardRef, InputHTMLAttributes, ReactNode } from "react";
import { FieldError } from "react-hook-form";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: ReactNode;
  error?: FieldError;
  containerClassName?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    { label, icon, error, containerClassName = "", className = "", ...props },
    ref
  ) => {
    return (
      <div className={`space-y-1.5 ${containerClassName}`}>
        <label className="block text-sm font-medium text-secondary-700">
          <div className="flex items-center space-x-2">
            {icon && <span className="text-primary-500">{icon}</span>}
            <span>{label}</span>
          </div>
        </label>
        <motion.div
          whileFocus={{ scale: 1.01 }}
          transition={{ duration: 0.2 }}
          className="relative"
        >
          <input
            ref={ref}
            className={`
              block w-full px-4 py-2.5
              bg-white border border-secondary-200
              rounded-lg shadow-sm
              text-secondary-900 placeholder:text-secondary-400
              transition duration-200
              focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500
              disabled:opacity-50 disabled:cursor-not-allowed
              ${
                error
                  ? "border-danger-500 focus:ring-danger-500/20 focus:border-danger-500"
                  : ""
              }
              ${className}
            `}
            {...props}
          />
        </motion.div>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm text-danger-600"
          >
            {error.message}
          </motion.p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
