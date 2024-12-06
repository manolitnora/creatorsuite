import React from 'react';
import { toast, ToastOptions } from 'react-hot-toast';
import { CheckCircle, XCircle, AlertCircle, Info } from 'react-feather';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
}

const toastIcons = {
  success: <CheckCircle className="w-5 h-5 text-green-500" />,
  error: <XCircle className="w-5 h-5 text-red-500" />,
  warning: <AlertCircle className="w-5 h-5 text-yellow-500" />,
  info: <Info className="w-5 h-5 text-blue-500" />,
};

const toastStyles = {
  success: 'border-green-500 bg-green-50 text-green-800',
  error: 'border-red-500 bg-red-50 text-red-800',
  warning: 'border-yellow-500 bg-yellow-50 text-yellow-800',
  info: 'border-blue-500 bg-blue-50 text-blue-800',
};

export const showToast = ({ message, type = 'info' }: ToastProps) => {
  const options: ToastOptions = {
    duration: 4000,
    position: 'top-right',
    className: `border-l-4 p-4 ${toastStyles[type]}`,
    icon: toastIcons[type],
  };

  switch (type) {
    case 'success':
      toast.success(message, options);
      break;
    case 'error':
      toast.error(message, options);
      break;
    case 'warning':
    case 'info':
      toast(message, options);
      break;
  }
};

// Usage example:
// showToast({ message: 'Operation successful!', type: 'success' });
// showToast({ message: 'Something went wrong!', type: 'error' });
// showToast({ message: 'Please note...', type: 'warning' });
// showToast({ message: 'Did you know?', type: 'info' });

export const ToastContainer = () => (
  <div className="toast-container" /> // react-hot-toast will automatically use this container
);

export default showToast;
