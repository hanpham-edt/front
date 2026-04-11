import { apiClient } from "./axios-config";
import {
  UpdateUserDto,
  UserQueryParams,
  UserResponse,
} from "@/types/user-types";
import { Users } from "@/types/user-types";

export class UserService {
  private static ENDPOINT = "/users";

  static async getAllUsers(
    params?: UserQueryParams,
  ): Promise<UserResponse | null> {
    const response = await apiClient.get<UserResponse>(this.ENDPOINT, {
      params: params,
    });
    return response.data;
  }

  static async getUsers(
    params?: UserQueryParams,
  ): Promise<UserResponse | null> {
    const response = await apiClient.get<UserResponse>(this.ENDPOINT, {
      params: params,
    });
    return response.data;
  }

  static async getUserById(id: string) {
    const response = await apiClient.get<Users>(`${this.ENDPOINT}/${id}`);
    return response.data;
  }

  static async getCurrentProfile(): Promise<Users> {
    const response = await apiClient.get<Users>(`${this.ENDPOINT}/me`);
    return response.data;
  }

  /** Cập nhật hồ sơ của user đang đăng nhập */
  static async updateCurrentProfile(
    user: Partial<UpdateUserDto>,
  ): Promise<Users> {
    const response = await apiClient.patch<Users>(`${this.ENDPOINT}/me`, user);
    return response.data;
  }

  /** Admin cập nhật user theo id */
  static async updateUser(
    id: string,
    user: Partial<UpdateUserDto>,
  ): Promise<Users> {
    const response = await apiClient.patch<Users>(
      `${this.ENDPOINT}/${encodeURIComponent(id)}`,
      user,
    );
    return response.data;
  }

  static async changePassword(body: {
    currentPassword: string;
    newPassword: string;
  }): Promise<{ message: string }> {
    const response = await apiClient.patch<{ message: string }>(
      `${this.ENDPOINT}/me/password`,
      body,
    );
    return response.data;
  }

  static async deleteUser(id: string): Promise<void> {
    await apiClient.delete(`${this.ENDPOINT}/${id}`);
  }
}
