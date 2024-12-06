import React from 'react';

type BadgeVariant = 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'default';
type BadgeSize = 'sm' | 'md' | 'lg';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  rounded?: boolean;
  className?: string;
  icon?: React.ReactNode;
}

const variantStyles: Record<BadgeVariant, string> = {
  primary: 'bg-primary-100 text-primary-800 dark:bg-primary-800 dark:text-primary-100',
  success: 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100',
  warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100',
  danger: 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100',
  info: 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100',
  default: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100'
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: 'text-xs px-2 py-0.5',
  md: 'text-sm px-2.5 py-0.5',
  lg: 'text-base px-3 py-1'
};

export function Badge({
  children,
  variant = 'default',
  size = 'md',
  rounded = true,
  className = '',
  icon
}: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center font-medium
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${rounded ? 'rounded-full' : 'rounded'}
        ${className}
      `}
    >
      {icon && <span className="mr-1.5 -ml-0.5">{icon}</span>}
      {children}
    </span>
  );
}

// Preset badges for common use cases
export function StatusBadge({
  status,
  className = ''
}: {
  status: 'active' | 'inactive' | 'pending' | 'error';
  className?: string;
}) {
  const statusConfig = {
    active: { variant: 'success' as const, text: 'Active' },
    inactive: { variant: 'default' as const, text: 'Inactive' },
    pending: { variant: 'warning' as const, text: 'Pending' },
    error: { variant: 'danger' as const, text: 'Error' }
  };

  const config = statusConfig[status];

  return (
    <Badge variant={config.variant} className={className}>
      {config.text}
    </Badge>
  );
}

export function PriorityBadge({
  priority,
  className = ''
}: {
  priority: 'low' | 'medium' | 'high';
  className?: string;
}) {
  const priorityConfig = {
    low: { variant: 'info' as const, text: 'Low' },
    medium: { variant: 'warning' as const, text: 'Medium' },
    high: { variant: 'danger' as const, text: 'High' }
  };

  const config = priorityConfig[priority];

  return (
    <Badge variant={config.variant} className={className}>
      {config.text}
    </Badge>
  );
}
