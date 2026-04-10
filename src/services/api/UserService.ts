import { apiClient } from "./axios-config";
import { UserQueryParams, UserResponse } from "@/types/user-types";
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

  static async getUserById(id: string): Promise<Users> {
    const response = await apiClient.get<Users>(`${this.ENDPOINT}/${id}`);
    return response.data;
  }

  static async createUser(user: Users): Promise<Users> {
    const response = await apiClient.post(this.ENDPOINT, user);
    return response.data;
  }

  static async updateUser(id: string, user: Users): Promise<Users> {
    const response = await apiClient.put(this.ENDPOINT, user);
    return response.data;
  }

  static async deleteUser(id: string): Promise<void> {
    await apiClient.delete(`${this.ENDPOINT}/${id}`);
  }
}
