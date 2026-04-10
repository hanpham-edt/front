import { store } from "@/store";
import axios from "axios";
import { authService } from "./authService";
import { clearAuth, setTokens } from "@/store/slices/authSlice";

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
    // Nếu request đã tự set Authorization (vd: /auth/refresh dùng refresh token)
    // thì không ghi đè bằng access token.
    const alreadyHasAuthHeader =
      typeof config.headers?.Authorization === "string" &&
      config.headers.Authorization.length > 0;
    if (token && !alreadyHasAuthHeader) {
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

    // Không auto-redirect khi login thất bại (401 là expected)
    if (status === 401 && isAuthEndpoint) {
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
        window.location.href = "/admin/login";
      }
    }
    return Promise.reject(error);
  },
);
