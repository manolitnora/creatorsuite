import React, { useState } from 'react';
import { Transition } from '@headlessui/react';

interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
  maxWidth?: string;
  className?: string;
}

const positionStyles = {
  top: {
    tooltip: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    arrow: 'top-full left-1/2 -translate-x-1/2 border-t-gray-800 dark:border-t-gray-700',
  },
  bottom: {
    tooltip: 'top-full left-1/2 -translate-x-1/2 mt-2',
    arrow: 'bottom-full left-1/2 -translate-x-1/2 border-b-gray-800 dark:border-b-gray-700',
  },
  left: {
    tooltip: 'right-full top-1/2 -translate-y-1/2 mr-2',
    arrow: 'left-full top-1/2 -translate-y-1/2 border-l-gray-800 dark:border-l-gray-700',
  },
  right: {
    tooltip: 'left-full top-1/2 -translate-y-1/2 ml-2',
    arrow: 'right-full top-1/2 -translate-y-1/2 border-r-gray-800 dark:border-r-gray-700',
  },
};

export function Tooltip({
  content,
  children,
  position = 'top',
  delay = 0,
  maxWidth = '200px',
  className = '',
}: TooltipProps) {
  const [show, setShow] = useState(false);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (timeoutId) clearTimeout(timeoutId);
    const id = setTimeout(() => setShow(true), delay);
    setTimeoutId(id);
  };

  const handleMouseLeave = () => {
    if (timeoutId) clearTimeout(timeoutId);
    setShow(false);
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      <Transition
        show={show}
        enter="transition ease-out duration-200"
        enterFrom="opacity-0 scale-95"
        enterTo="opacity-100 scale-100"
        leave="transition ease-in duration-150"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-95"
      >
        <div
          className={`
            absolute z-50 px-2 py-1
            text-sm text-white
            bg-gray-800 dark:bg-gray-700
            rounded shadow-lg
            whitespace-normal
            ${positionStyles[position].tooltip}
            ${className}
          `}
          style={{ maxWidth }}
          role="tooltip"
        >
          {content}
          <div
            className={`
              absolute w-2 h-2
              border-transparent border-4
              ${positionStyles[position].arrow}
            `}
          />
        </div>
      </Transition>
    </div>
  );
}

// Helper component for info tooltips
export function InfoTooltip({
  content,
  className = '',
}: {
  content: React.ReactNode;
  className?: string;
}) {
  return (
    <Tooltip content={content}>
      <div
        className={`
          inline-flex items-center justify-center
          w-4 h-4 text-xs
          text-gray-500 dark:text-gray-400
          bg-gray-100 dark:bg-gray-800
          rounded-full
          cursor-help
          ${className}
        `}
      >
        i
      </div>
    </Tooltip>
  );
}
