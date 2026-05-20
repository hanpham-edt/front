import {
  ForgotPasswordDto,
  LoginDto,
  MessageResponse,
  RegisterDto,
  ResetPasswordDto,
} from "@/types/auth-types";
import { apiClient } from "./axios-config";
import { LoginResponse } from "@/types/auth-types";
import axios from "axios";

type RefreshResponse = Pick<LoginResponse, "accessToken" | "refreshToken">;

export const authService = {
  logout: async (): Promise<void> => {
    try {
      await apiClient.post("/auth/logout");
    } catch (error) {
      console.error("Error logging out:", error);
      // Nếu access token đã hết hạn / đã bị clear ở client thì backend sẽ trả 401.
      // Về mặt UX, logout vẫn nên được coi là thành công (client đã clear auth).
      return;
    }
  },
  refreshToken: async (
    refreshToken: string,
  ): Promise<RefreshResponse | null> => {
    if (!refreshToken) {
      return null;
    }
    try {
      // Backend RefreshTokenGuard lấy refresh token từ Authorization: Bearer <token>
      const response = await apiClient.post("/auth/refresh", undefined, {
        headers: { Authorization: `Bearer ${refreshToken}` },
      });
      const accessToken = response.data?.accessToken;
      const newRefreshToken = response.data?.refreshToken;
      if (!accessToken || !newRefreshToken) return null;
      return { accessToken, refreshToken: newRefreshToken };
    } catch (error) {
      console.error("Error refreshing token:", error);
      throw new Error("Failed to refresh token");
    }
  },
  login: async (loginDto: LoginDto): Promise<LoginResponse> => {
    try {
      const response = await apiClient.post("/auth/login", loginDto);
      return response.data;
    } catch (error) {
      console.error("Error logging in:", error);
      throw new Error("Failed to login");
    }
  },
  register: async (registerDto: RegisterDto): Promise<LoginResponse> => {
    try {
      const response = await apiClient.post("/auth/register", registerDto);
      return response.data;
    } catch (error) {
      console.error("Error registering:", error);
      throw new Error("Email đã đăng ký");
    }
  },
  forgotPassword: async (dto: ForgotPasswordDto): Promise<MessageResponse> => {
    const response = await apiClient.post<MessageResponse>(
      "/auth/forgot-password",
      dto,
      { timeout: 30000 },
    );
    return response.data;
  },
  resetPassword: async (dto: ResetPasswordDto): Promise<MessageResponse> => {
    const response = await apiClient.post<MessageResponse>(
      "/auth/reset-password",
      dto,
      { timeout: 30000 },
    );
    return response.data;
  },
};

function getApiErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    if (error.code === "ECONNABORTED") {
      return "Kết nối quá lâu. Nếu đã nhận email, hãy kiểm tra hộp thư.";
    }
    const data = error.response?.data as { message?: string | string[] };
    if (Array.isArray(data?.message)) return data.message.join(", ");
    if (typeof data?.message === "string") return data.message;
  }
  return fallback;
}

export { getApiErrorMessage };
