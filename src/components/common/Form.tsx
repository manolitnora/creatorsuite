import React from 'react';
import { Input } from './Input';
import { Select } from './Select';

interface FormGroupProps {
  children: React.ReactNode;
  className?: string;
  error?: string;
  helpText?: string;
  label?: string;
  required?: boolean;
  labelFor?: string;
}

export function FormGroup({
  children,
  className = '',
  error,
  helpText,
  label,
  required,
  labelFor,
}: FormGroupProps) {
  return (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <label
          htmlFor={labelFor}
          className="block text-sm font-medium text-gray-700 dark:text-gray-200"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      {children}
      {helpText && !error && (
        <p className="text-sm text-gray-500 dark:text-gray-400">{helpText}</p>
      )}
      {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
    </div>
  );
}

interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  onSubmit: (e: React.FormEvent) => void;
  children: React.ReactNode;
}

export function Form({ onSubmit, children, className = '', ...props }: FormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(e);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`space-y-4 ${className}`}
      {...props}
    >
      {children}
    </form>
  );
}

interface FormRowProps {
  children: React.ReactNode;
  className?: string;
}

export function FormRow({ children, className = '' }: FormRowProps) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${className}`}>
      {children}
    </div>
  );
}

interface FormFieldProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'select';
  label?: string;
  name: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  error?: string;
  required?: boolean;
  options?: Array<{ label: string; value: string | number }>;
  placeholder?: string;
  helpText?: string;
  className?: string;
}

export function FormField({
  type = 'text',
  label,
  name,
  value,
  onChange,
  error,
  required,
  options,
  placeholder,
  helpText,
  className = '',
}: FormFieldProps) {
  return (
    <FormGroup
      label={label}
      error={error}
      required={required}
      helpText={helpText}
      labelFor={name}
      className={className}
    >
      {type === 'select' && options ? (
        <Select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          error={!!error}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      ) : (
        <Input
          type={type}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          error={!!error}
        />
      )}
    </FormGroup>
  );
}
