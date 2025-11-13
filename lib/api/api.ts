import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

export type ApiError = AxiosError<{ error: string }>;

const BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') + '/api';
if (!BASE_URL) throw new Error('NEXT_PUBLIC_API_URL is not defined');

/**
 * Client-side API instance
 */
export const api = axios.create({
  baseURL: '/api', // Next.js API routes
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

// Flag to prevent infinite refresh loops
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (error?: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

// Request interceptor - add auth token if available
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Cookies are sent automatically with withCredentials: true
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle 401 errors and refresh tokens
api.interceptors.response.use(
  response => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
      _isInitialization?: boolean;
    };

    // Don't retry refresh endpoint - avoid infinite loops
    if (originalRequest?.url?.includes('/auth/refresh')) {
      if (!originalRequest._isInitialization) {
        // Логуємо тільки якщо це не ініціалізація
      }
      return Promise.reject(error);
    }
    // Don't retry login/register endpoints
    if (
      originalRequest?.url?.includes('/auth/register') ||
      originalRequest?.url?.includes('/auth/login')
    ) {
      return Promise.reject(error);
    }

    if (typeof window !== 'undefined') {
      const isAuthPage = window.location.pathname.startsWith('/auth/');
      if (isAuthPage) {
        // On auth pages, just reject the error - don't try to refresh
        return Promise.reject(error);
      }
    }

    // If error is 401 and we haven't tried to refresh yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      const errorData = error.response?.data as
        | {
            message?: string;
            error?: string;
            response?: { message?: string; data?: { message?: string } };
          }
        | undefined;

      const errorMessage =
        errorData?.message ||
        errorData?.error ||
        errorData?.response?.message ||
        errorData?.response?.data?.message ||
        '';

      const isMissingToken =
        errorMessage.includes('Authorization token is missing') ||
        errorMessage.includes('token is missing') ||
        errorMessage.includes('Session not found');

      // If tokens are completely missing (not just expired), don't try to refresh
      if (isMissingToken) {
        return Promise.reject(error);
      }
      const isGetMeRequest = originalRequest?.url?.includes('/users/me');
      if (isGetMeRequest) {
        return Promise.reject(error);
      }

      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => {
            return api(originalRequest);
          })
          .catch(err => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await api.post('/auth/refresh', {});

        // Process queued requests
        processQueue(null, null);
        // Retry original request
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed - check if it's because tokens are missing
        const refreshErrorData = (refreshError as AxiosError)?.response
          ?.data as { message?: string; error?: string } | undefined;
        const refreshErrorMessage =
          refreshErrorData?.message || refreshErrorData?.error || '';
        const isRefreshMissingToken =
          refreshErrorMessage.includes('Refresh token or session ID missing') ||
          refreshErrorMessage.includes('token is missing');

        // Clear queue
        processQueue(refreshError, null);

        if (isRefreshMissingToken) {
          return Promise.reject(error); // Return original error, not refresh error
        }

        // For other refresh errors, also just reject
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
