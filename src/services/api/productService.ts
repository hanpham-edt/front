import { Product, ProductQueryParams, ProductResponse, CreateProduct } from "@/types/product-types";
import { apiClient } from "./axios-config";

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
    if (product.isActive !== undefined) payload.isActive = product.isActive;

    const response = await apiClient.patch<Product>(
      `${this.ENDPOINT}/${encodeURIComponent(id.trim())}`,
      payload,
    );
    return response.data;
  }

  static async deleteProduct(id: string): Promise<void> {
    await apiClient.delete(`${this.ENDPOINT}/${encodeURIComponent(id.trim())}`);
  }
}
