import React from 'react';

interface CardProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  noPadding?: boolean;
  hoverable?: boolean;
}

export function Card({
  children,
  title,
  subtitle,
  actions,
  footer,
  className = '',
  noPadding = false,
  hoverable = false,
}: CardProps) {
  return (
    <div
      className={`
        bg-white dark:bg-gray-800 rounded-lg shadow-sm
        ${hoverable ? 'transition-shadow hover:shadow-md' : ''}
        ${className}
      `}
    >
      {/* Header */}
      {(title || actions) && (
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              {title && (
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {subtitle}
                </p>
              )}
            </div>
            {actions && <div className="flex items-center space-x-2">{actions}</div>}
          </div>
        </div>
      )}

      {/* Content */}
      <div className={noPadding ? '' : 'p-6'}>{children}</div>

      {/* Footer */}
      {footer && (
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
          {footer}
        </div>
      )}
    </div>
  );
}

// Example usage:
export function StatsCard({
  title,
  value,
  change,
  icon,
}: {
  title: string;
  value: string | number;
  change?: {
    value: number;
    type: 'increase' | 'decrease';
  };
  icon?: React.ReactNode;
}) {
  return (
    <Card>
      <div className="flex items-center">
        {icon && (
          <div className="flex-shrink-0 p-3 bg-primary-100 dark:bg-primary-900 rounded-lg">
            {icon}
          </div>
        )}
        <div className={icon ? 'ml-5' : ''}>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {title}
          </p>
          <p className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">
            {value}
          </p>
          {change && (
            <p className={`mt-1 text-sm ${
              change.type === 'increase'
                ? 'text-green-600 dark:text-green-400'
                : 'text-red-600 dark:text-red-400'
            }`}>
              <span>
                {change.type === 'increase' ? '↑' : '↓'} {Math.abs(change.value)}%
              </span>
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}

export default Card;
