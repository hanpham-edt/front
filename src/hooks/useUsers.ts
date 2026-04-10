import { UserService } from "@/services/api/UserService";
import { Users, UserQueryParams, UserResponse } from "@/types/user-types";
import { useState, useCallback } from "react";

export function useUsers() {
  const [users, setUsers] = useState<Users[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [meta, setMeta] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  });

  // Get All Category
  const getUsers = useCallback(
    async (params?: UserQueryParams): Promise<UserResponse | null> => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await UserService.getAllUsers(params);
        if (response == null) {
          setError("Empty response");
          return null;
        }
        setUsers(response.data);
        setMeta(response.meta);
        return response;
      } catch (error) {
        console.error("Error getting products:", error);
        setError((error as Error).message);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );
  return {
    users,
    isLoading,
    error,
    meta,
    getUsers,
  };
}
