import {
  Category,
  CategoryQueryParams,
  CategoryResponse,
  CreateCategory,
} from "@/types/category-types";
import { apiClient } from "./axios-config";

export class CategoryService {
  private static ENDPOINT = "/categories";
  static async getCategories(
    params?: CategoryQueryParams,
  ): Promise<CategoryResponse | null> {
    const response = await apiClient.get<CategoryResponse>(this.ENDPOINT, {
      params: params,
    });
    return response.data;
  }

  // Get Category by id
  static async getCategoryById(id: string) {
    const response = await apiClient.get<Category>(`${this.ENDPOINT}/${id}`);
    return response.data;
  }

  // Create new Category
  static async createCategory(category: CreateCategory): Promise<Category> {
    const response = await apiClient.post(this.ENDPOINT, category);
    return response.data;
  }

  // Only send fields allowed by UpdateCategoryDto (avoid id, productCount, timestamps, etc.)
  static async updateCategory(
    id: string,
    category: Partial<CreateCategory>,
  ): Promise<Category> {
    const payload: Partial<CreateCategory> = {};
    if (category.name !== undefined) payload.name = category.name;
    if (category.description !== undefined) payload.description = category.description;
    if (category.slug !== undefined) payload.slug = category.slug;
    if (category.imageUrl !== undefined) payload.imageUrl = category.imageUrl;
    if (category.isActive !== undefined) payload.isActive = category.isActive;

    const safeId = id.trim();
    const response = await apiClient.patch(
      `${this.ENDPOINT}/${encodeURIComponent(safeId)}`,
      payload,
    );
    return response.data;
  }

  static async deleteCategory(id: string): Promise<void> {
    try {
      await apiClient.delete(`${this.ENDPOINT}/${id}`);
    } catch (error) {
      console.error("Error deleting category:", error);
      throw new Error("Failed to delete category");
    }
  }
}
