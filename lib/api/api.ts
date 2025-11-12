import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

export type ApiError = AxiosError<{ error: string }>;

/**
 * Client-side API instance
 * Використовується у браузері та SSR.
 */
const baseURL =
  typeof window === 'undefined'
    ? process.env.NEXT_PUBLIC_BACKEND_URL ||
      'https://travel-fs116-teamproject-backend.onrender.com'
    : '/api'; // ✅ клієнт ходить через proxy

export const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

// ============ REFRESH LOGIC ============

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (error?: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

// Request interceptor
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => config,
  error => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  response => response,
  async (error: AxiosError) => {
    if (!error.config) return Promise.reject(error);
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Не чіпаємо реєстрацію / логін / рефреш
    if (
      originalRequest.url?.includes('/auth/refresh') ||
      originalRequest.url?.includes('/auth/register') ||
      originalRequest.url?.includes('/auth/login')
    )
      return Promise.reject(error);

    if (error.response?.status === 401 && !originalRequest._retry) {
      const msg =
        (error.response.data as any)?.message ||
        (error.response.data as any)?.error ||
        '';

      if (msg.includes('token is missing') || msg.includes('Session not found'))
        return Promise.reject(error);

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => api(originalRequest));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await api.post('/auth/refresh', {}, { withCredentials: true });
        processQueue(null, null);
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);