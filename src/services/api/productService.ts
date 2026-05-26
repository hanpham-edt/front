import {
  Product,
  ProductQueryParams,
  ProductResponse,
  CreateProduct,
  ProductImportResult,
} from "@/types/product-types";
import { apiClient } from "./axios-config";
import { serializeQueryParams } from "@/lib/query-params";

export class ProductService {
  private static readonly ENDPOINT = "/products";
  static async getProducts(
    params?: ProductQueryParams,
  ): Promise<ProductResponse | null> {
    const response = await apiClient.get<ProductResponse>(this.ENDPOINT, {
      params: params,
    });
    return response.data;
  }

  static async getProductById(id: string): Promise<Product> {
    const response = await apiClient.get<Product>(`${this.ENDPOINT}/${id}`);
    return response.data;
  }

  static async createProduct(product: CreateProduct): Promise<Product> {
    const response = await apiClient.post(this.ENDPOINT, product);
    return response.data;
  }

  static async updateProduct(
    id: string,
    product: Partial<CreateProduct>,
  ): Promise<Product> {
    const payload: Partial<CreateProduct> = {};
    if (product.name !== undefined) payload.name = product.name;
    if (product.sku !== undefined) payload.sku = product.sku;
    if (product.categoryId !== undefined) payload.categoryId = product.categoryId;
    if (product.description !== undefined) payload.description = product.description;
    if (product.price !== undefined) payload.price = product.price;
    if (product.stock !== undefined) payload.stock = product.stock;
    if (product.imageUrl !== undefined) payload.imageUrl = product.imageUrl;
    if (product.imageUrls !== undefined) payload.imageUrls = product.imageUrls;
    if (product.isActive !== undefined) payload.isActive = product.isActive;
    if (product.slug !== undefined) payload.slug = product.slug;
    if (product.metaTitle !== undefined) payload.metaTitle = product.metaTitle;
    if (product.metaDescription !== undefined) {
      payload.metaDescription = product.metaDescription;
    }
    if (product.variants !== undefined) payload.variants = product.variants;

    const response = await apiClient.patch<Product>(
      `${this.ENDPOINT}/${encodeURIComponent(id.trim())}`,
      payload,
    );
    return response.data;
  }

  static async deleteProduct(id: string): Promise<void> {
    await apiClient.delete(`${this.ENDPOINT}/${encodeURIComponent(id.trim())}`);
  }

  static async adjustStock(
    id: string,
    quantity: number,
    note?: string,
  ): Promise<Product> {
    const response = await apiClient.patch<Product>(
      `${this.ENDPOINT}/${encodeURIComponent(id)}/stock`,
      { quantity, note },
    );
    return response.data;
  }

  static async exportProductsCsv(
    params?: Pick<ProductQueryParams, "search" | "category" | "isActive">,
  ): Promise<Blob> {
    const { data } = await apiClient.get<Blob>(
      `${this.ENDPOINT}/admin/export`,
      {
        params: serializeQueryParams(params),
        responseType: "blob",
      },
    );
    return data;
  }

  static async downloadImportTemplate(): Promise<Blob> {
    const { data } = await apiClient.get<Blob>(
      `${this.ENDPOINT}/admin/import-template`,
      { responseType: "blob" },
    );
    return data;
  }

  static async importFromCsv(
    csv: string,
    options?: { skipDuplicates?: boolean },
  ): Promise<ProductImportResult> {
    const { data } = await apiClient.post<ProductImportResult>(
      `${this.ENDPOINT}/admin/import`,
      {
        csv,
        skipDuplicates: options?.skipDuplicates ?? true,
      },
    );
    return data;
  }

  static async getStockMovements(
    id: string,
    page = 1,
    limit = 20,
  ): Promise<{
    data: Array<{
      id: string;
      type: string;
      quantity: number;
      stockBefore: number;
      stockAfter: number;
      note: string | null;
      userEmail: string | null;
      createdAt: string;
    }>;
    meta: { total: number; page: number; limit: number; totalPages: number };
  }> {
    const response = await apiClient.get(
      `${this.ENDPOINT}/${encodeURIComponent(id)}/stock-movements`,
      { params: { page, limit } },
    );
    return response.data;
  }
}
