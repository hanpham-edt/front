import { useCallback, useState } from "react";
import {
  CategoryQueryParams,
  CategoryResponse,
  Category,
} from "@/types/category-types";
import { CategoryService } from "@/services/api/CategoryService";

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [meta, setMeta] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  });

  // Get All Category
  const getCategories = useCallback(
    async (params?: CategoryQueryParams): Promise<CategoryResponse | null> => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await CategoryService.getCategories(params);
        if (response == null) {
          setError("Empty response");
          return null;
        }
        setCategories(response.data);
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
    categories,
    isLoading,
    error,
    meta,
    getCategories,
  };
}
