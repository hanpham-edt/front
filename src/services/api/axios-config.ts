import { store } from "@/store";
import axios from "axios";
import { authService } from "./authService";
import { clearAuth, setTokens } from "@/store/slices/authSlice";

const PUBLIC_AUTH_PATHS = [
  "/auth/login",
  "/auth/register",
  "/auth/forgot-password",
  "/auth/reset-password",
];

const PUBLIC_READ_PATHS = ["/heros", "/settings/public"];

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
apiClient.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const token = state.auth.accessToken;
    const url = config.url ?? "";
    // Nếu request đã tự set Authorization (vd: /auth/refresh dùng refresh token)
    // thì không ghi đè bằng access token.
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
  (error) => {
    return Promise.reject(error);
  },
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error?.response?.status;
    const url: string = originalRequest?.url ?? "";
    const isAuthEndpoint =
      url.includes("/auth/login") || url.includes("/auth/refresh");

    // Không refresh/redirect trên endpoint auth công khai hoặc login thất bại
    if (status === 401 && (isAuthEndpoint || isPublicAuthRequest(url))) {
      return Promise.reject(error);
    }

    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const state = store.getState();
      const refreshToken = state.auth.refreshToken;
      if (refreshToken) {
        try {
          const tokens = await authService.refreshToken(refreshToken);
          if (tokens) {
            store.dispatch(setTokens(tokens));
            originalRequest.headers.Authorization = `Bearer ${tokens.accessToken}`;
            return apiClient(originalRequest);
          }
        } catch {
          // refresh thất bại -> rơi xuống clearAuth + redirect
        }
      }
      store.dispatch(clearAuth());
      if (typeof window !== "undefined") {
        const path = window.location.pathname;
        const returnUrl = encodeURIComponent(path + window.location.search);
        if (path.startsWith("/admin")) {
          window.location.href = "/admin/login";
        } else {
          window.location.href = `/auth/login?returnUrl=${returnUrl}`;
        }
      }
    }
    return Promise.reject(error);
  },
);
