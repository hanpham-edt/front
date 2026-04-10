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
  return {
    products,
    isLoading,
    error,
    meta,
    getProducts,
  };
}
