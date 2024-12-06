import React from 'react';
import { ChevronDown } from 'react-feather';

interface Option {
  value: string | number;
  label: string;
}

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  options: Option[];
  label?: string;
  error?: string;
  helperText?: string;
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

const sizeStyles = {
  sm: 'py-1.5 text-sm',
  md: 'py-2 text-base',
  lg: 'py-3 text-lg',
};

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      options,
      label,
      error,
      helperText,
      size = 'md',
      fullWidth = false,
      className = '',
      ...props
    },
    ref
  ) => {
    const selectClasses = `
      block rounded-md border-gray-300 shadow-sm
      focus:border-primary-500 focus:ring-primary-500
      disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500
      ${error ? 'border-red-300 text-red-900 focus:border-red-500 focus:ring-red-500' : ''}
      ${sizeStyles[size]}
      ${fullWidth ? 'w-full' : 'w-auto'}
      ${className}
    `;

    return (
      <div className={fullWidth ? 'w-full' : 'w-auto'}>
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
        )}
        
        <div className="relative">
          <select
            ref={ref}
            className={selectClasses}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={error ? `${props.id}-error` : undefined}
            {...props}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
            <ChevronDown className="h-4 w-4 text-gray-400" aria-hidden="true" />
          </div>
        </div>

        {(error || helperText) && (
          <p 
            className={`mt-1 text-sm ${error ? 'text-red-600' : 'text-gray-500'}`}
            id={error ? `${props.id}-error` : undefined}
          >
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select;
