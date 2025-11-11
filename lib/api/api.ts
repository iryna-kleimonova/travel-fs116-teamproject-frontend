import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

export type ApiError = AxiosError<{ error: string }>;

/**
 * Client-side API instance
 */
export const api = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_URL ||
    'https://travel-fs116-teamproject-backend.onrender.com/api',
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

// Request interceptor
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => config,
  error => Promise.reject(error)
);

// Response interceptor - handle 401 errors and refresh tokens
api.interceptors.response.use(
  response => response,
  async (error: AxiosError) => {
    if (!error.config) return Promise.reject(error); // 🔒 безпечно перевіряємо

    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Avoid infinite loop
    if (originalRequest.url?.includes('/auth/refresh')) {
      return Promise.reject(error);
    }
    if (
      originalRequest.url?.includes('/auth/register') ||
      originalRequest.url?.includes('/auth/login')
    ) {
      return Promise.reject(error);
    }

    if (typeof window !== 'undefined') {
      const isAuthPage = window.location.pathname.startsWith('/auth/');
      if (isAuthPage) return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      const errorData = (error.response?.data || {}) as {
        message?: string;
        error?: string;
        response?: { message?: string; data?: { message?: string } };
      };

      const errorMessage =
        errorData?.message ||
        errorData?.error ||
        errorData?.response?.message ||
        errorData?.response?.data?.message ||
        '';

      const isMissingToken =
        errorMessage?.includes('Authorization token is missing') ||
        errorMessage?.includes('token is missing') ||
        errorMessage?.includes('Session not found');

      if (isMissingToken) return Promise.reject(error);

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => api(originalRequest))
          .catch(err => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await api.post('/auth/refresh', {}, { withCredentials: true }); // ✅

        processQueue(null, null);
        return api(originalRequest);
      } catch (refreshError) {
        const refreshErrorData = (refreshError as AxiosError)?.response
          ?.data as { message?: string; error?: string } | undefined;

        const refreshErrorMessage =
          refreshErrorData?.message || refreshErrorData?.error || '';

        const isRefreshMissingToken =
          refreshErrorMessage?.includes(
            'Refresh token or session ID missing'
          ) || refreshErrorMessage?.includes('token is missing');

        processQueue(refreshError, null);

        if (isRefreshMissingToken) {
          return Promise.reject(error);
        }

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);