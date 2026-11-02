import React from "react";
import { clsx } from "clsx";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: SelectOption[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, id, options, ...props }, ref) => {
    return (
      <div className="field">
        {label && <label htmlFor={id}>{label}</label>}
        <select
          ref={ref}
          id={id}
          className={clsx(
            "w-full bg-[#F4F3F0] border-2 border-transparent px-4 py-3.5 text-lg rounded-none transition-colors duration-200 focus:outline-none focus:border-[#111111]",
            error && "!border-[#B3261E]",
            className
          )}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && <span className="text-sm text-[#B3261E]">{error}</span>}
      </div>
    );
  }
);

Select.displayName = "Select";

