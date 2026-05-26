import { store } from "@/store";
import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import { authService } from "./authService";
import { clearAuth, setTokens } from "@/store/slices/authSlice";

const PUBLIC_AUTH_PATHS = [
  "/auth/login",
  "/auth/register",
  "/auth/forgot-password",
  "/auth/reset-password",
];

const PUBLIC_READ_PATHS = [
  "/heros",
  "/settings/public",
  "/reviews/latest",
  "/reviews/product/",
];

function isPublicAuthRequest(url?: string): boolean {
  if (!url) return false;
  return PUBLIC_AUTH_PATHS.some((path) => url.includes(path));
}

function isPublicReadRequest(url?: string): boolean {
  if (!url) return false;
  return PUBLIC_READ_PATHS.some((path) => url.includes(path));
}

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

/** Chỉ một request refresh tại một thời điểm (tránh rotate token làm các lần sau fail). */
let refreshPromise: Promise<{ accessToken: string; refreshToken: string } | null> | null =
  null;

type QueuedRequest = {
  resolve: (token: string) => void;
  reject: (reason: unknown) => void;
};

let failedQueue: QueuedRequest[] = [];

function processQueue(error: unknown | null, token: string | null) {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error || !token) {
      reject(error ?? new Error("Refresh token failed"));
    } else {
      resolve(token);
    }
  });
  failedQueue = [];
}

async function refreshAccessToken(): Promise<{
  accessToken: string;
  refreshToken: string;
} | null> {
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = (async () => {
    const refreshToken = store.getState().auth.refreshToken;
    if (!refreshToken) {
      return null;
    }
    try {
      return await authService.refreshToken(refreshToken);
    } catch {
      return null;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

function localePathPrefix(pathname: string): string {
  if (pathname === "/en" || pathname.startsWith("/en/")) {
    return "/en";
  }
  return "";
}

function redirectToLogin() {
  store.dispatch(clearAuth());
  if (typeof window === "undefined") return;
  const path = window.location.pathname;
  const returnUrl = encodeURIComponent(path + window.location.search);
  if (path.startsWith("/admin")) {
    window.location.href = "/admin/login";
  } else {
    const prefix = localePathPrefix(path);
    window.location.href = `${prefix}/auth/login?returnUrl=${returnUrl}`;
  }
}

apiClient.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const token = state.auth.accessToken;
    const url = config.url ?? "";
    const alreadyHasAuthHeader =
      typeof config.headers?.Authorization === "string" &&
      config.headers.Authorization.length > 0;
    if (
      token &&
      !alreadyHasAuthHeader &&
      !isPublicAuthRequest(url) &&
      !isPublicReadRequest(url)
    ) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };
    if (!originalRequest) {
      return Promise.reject(error);
    }

    const status = error.response?.status;
    const url = originalRequest.url ?? "";
    const isAuthEndpoint =
      url.includes("/auth/login") || url.includes("/auth/refresh");

    if (status === 401 && (isAuthEndpoint || isPublicAuthRequest(url))) {
      return Promise.reject(error);
    }

    if (status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    // Đang refresh: xếp hàng request, retry sau khi có access token mới
    if (refreshPromise) {
      return new Promise((resolve, reject) => {
        failedQueue.push({
          resolve: (token: string) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(apiClient(originalRequest));
          },
          reject,
        });
      });
    }

    originalRequest._retry = true;

    const tokens = await refreshAccessToken();
    if (!tokens) {
      processQueue(new Error("Refresh failed"), null);
      redirectToLogin();
      return Promise.reject(error);
    }

    store.dispatch(setTokens(tokens));
    processQueue(null, tokens.accessToken);

    originalRequest.headers.Authorization = `Bearer ${tokens.accessToken}`;
    return apiClient(originalRequest);
  },
);
