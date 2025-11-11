// Backend response structure
export type BackendResponse<T> = {
  status: number;
  message?: string;
  data: T;
  error?: string;
};

/**
 * Check if an object looks like a User (has id and email)
 */
function isUserLike(obj: unknown): obj is { id: unknown; email: unknown } {
  if (!obj || typeof obj !== 'object') return false;

  if (!('email' in obj) || !obj.email) return false;

  const hasId = ('id' in obj && !!obj.id) || ('_id' in obj && !!obj._id);

  return hasId;
}

/**
 * Extract user from backend response
 */
export function extractUser<T>(
  responseData: BackendResponse<T> | unknown
): T | null {
  if (!responseData || typeof responseData !== 'object') {
    return null;
  }
  if (isUserLike(responseData)) {
    return responseData as T;
  }

  const backendResponse = responseData as BackendResponse<T> &
    Record<string, unknown>;

  if ('data' in backendResponse && backendResponse.data) {
    const data = backendResponse.data;

    if (isUserLike(data)) {
      return data as T;
    }

    if (
      typeof data === 'object' &&
      data !== null &&
      'data' in data &&
      isUserLike((data as { data: unknown }).data)
    ) {
      return (data as { data: T }).data;
    }

    if (
      typeof data === 'object' &&
      data !== null &&
      'user' in data &&
      isUserLike((data as { user: unknown }).user)
    ) {
      return (data as { user: T }).user;
    }
  }

  return null;
}

/**
 * Extract user-friendly error message from error response
 */
export function extractErrorMessage(error: unknown): string {
  if (!error || typeof error !== 'object') {
    return 'Сталася помилка';
  }

  // Check if error has a response property (Axios error structure)
  const axiosError = error as {
    response?: {
      data?: {
        message?: string;
        error?: string;
        response?: {
          message?: string;
          status?: number;
          data?: { message?: string };
        };
      };
    };
    message?: string;
  };

  // Try to extract message from nested response structure (Next.js API route format)
  if (axiosError.response?.data) {
    const errorData = axiosError.response.data;

    // Check for nested response (from Next.js API route)
    if (errorData.response) {
      const nestedResponse = errorData.response;
      if (nestedResponse.message) {
        return nestedResponse.message;
      }
      if (nestedResponse.data?.message) {
        return nestedResponse.data.message;
      }
    }

    // Check for direct message/error in response data
    if (errorData.message) {
      return errorData.message;
    }
    if (errorData.error) {
      return errorData.error;
    }
  }

  // Fall back to error message
  if (axiosError.message) {
    // Don't show generic axios error messages
    if (
      axiosError.message.includes('Request failed') ||
      axiosError.message.includes('Network Error') ||
      axiosError.message.includes('timeout')
    ) {
      return "Помилка з'єднання з сервером";
    }
    return axiosError.message;
  }

  return 'Сталася невідома помилка';
}