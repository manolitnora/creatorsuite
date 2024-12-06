import { AxiosError } from 'axios';
import { showToast } from '../components/common/Toast';

interface ApiError {
  message: string;
  code?: string;
  details?: Record<string, string[]>;
}

export function handleApiError(error: unknown): void {
  if (error instanceof AxiosError) {
    const data = error.response?.data as ApiError | undefined;
    
    // Handle validation errors
    if (error.response?.status === 422 && data?.details) {
      const messages = Object.entries(data.details)
        .map(([field, errors]) => `${field}: ${errors.join(', ')}`)
        .join('\n');
      
      showToast({
        message: 'Validation Error:\n' + messages,
        type: 'error'
      });
      return;
    }

    // Handle authentication errors
    if (error.response?.status === 401) {
      showToast({
        message: 'Please log in to continue',
        type: 'error'
      });
      return;
    }

    // Handle forbidden errors
    if (error.response?.status === 403) {
      showToast({
        message: 'You do not have permission to perform this action',
        type: 'error'
      });
      return;
    }

    // Handle not found errors
    if (error.response?.status === 404) {
      showToast({
        message: 'The requested resource was not found',
        type: 'error'
      });
      return;
    }

    // Handle rate limiting
    if (error.response?.status === 429) {
      showToast({
        message: 'Too many requests. Please try again later',
        type: 'error'
      });
      return;
    }

    // Handle server errors
    if (error.response?.status && error.response.status >= 500) {
      showToast({
        message: 'An unexpected server error occurred. Please try again later',
        type: 'error'
      });
      return;
    }

    // Handle network errors
    if (error.code === 'ERR_NETWORK') {
      showToast({
        message: 'Network error. Please check your internet connection',
        type: 'error'
      });
      return;
    }

    // Handle other errors
    showToast({
      message: data?.message || error.message || 'An unexpected error occurred',
      type: 'error'
    });
  } else if (error instanceof Error) {
    showToast({
      message: error.message,
      type: 'error'
    });
  } else {
    showToast({
      message: 'An unexpected error occurred',
      type: 'error'
    });
  }
}

export default handleApiError;
