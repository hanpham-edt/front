//import {  } from "@/types/product-types";
import { useCallback, useState } from "react";
import {
  ProductQueryParams,
  ProductResponse,
  Product,
} from "@/types/product-types";
import { ProductService } from "@/services/api/productService";

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [meta, setMeta] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  });
  const [product, setProduct] = useState<Product | null>(null);
  const getProducts = useCallback(
    async (params?: ProductQueryParams): Promise<ProductResponse | null> => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await ProductService.getProducts(params);
        if (response == null) {
          setError("Empty response");
          return null;
        }
        setProducts(response.data);
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
  const getProduct = useCallback(
    async (id: string): Promise<Product | null> => {
      if (!id) return null;
      setIsLoading(true);
      setError(null);
      try {
        const response = await ProductService.getProductById(id);
        if (response) {
          setProduct(response);
          return response;
        }
        throw new Error(" Product no found ");
      } catch (error) {
        const message = " Failed to load product " + error;
        setError(message);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );
  return {
    products,
    isLoading,
    error,
    meta,
    getProducts,
    product,
    getProduct,
  };
}
