"use client";

import { useEffect, useState } from "react";
import { fetchProductsByCoordinator } from "@/lib/api/products-by-coordinator";
import type {
  CoordinatorProduct,
  ProductsByCoordinatorResponse,
} from "@/types/api";

interface UseCoordinatorProductsResult {
  products: CoordinatorProduct[];
  totalCount: number;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * React hook to fetch and manage coordinator products
 *
 * @param coordinatorId - UUID of the coordinator
 * @returns Products, coordinator info, loading state, and error state
 *
 * @example
 * ```tsx
 * function CoordinatorCatalog({ coordinatorId }: { coordinatorId: string }) {
 *   const { products, coordinator, loading, error } = useCoordinatorProducts(coordinatorId);
 *
 *   if (loading) return <div>Loading...</div>;
 *   if (error) return <div>Error: {error}</div>;
 *
 *   return (
 *     <div>
 *       <h1>{coordinator?.display_name}'s Products</h1>
 *       {products.map(product => (
 *         <div key={product.id}>{product.title}</div>
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 */
export function useCoordinatorProducts(
  coordinatorId: string,
  enabled: boolean = true,
): UseCoordinatorProductsResult {
  const [products, setProducts] = useState<CoordinatorProduct[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) {
      setLoading(false);
      setError(null);
      setProducts([]);
      setTotalCount(0);
      return;
    }

    if (!coordinatorId) {
      setError("Coordinator ID is required");
      setLoading(false);
      return;
    }

    const loadProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const data: ProductsByCoordinatorResponse =
          await fetchProductsByCoordinator(coordinatorId);

        setProducts(data.products);
        setTotalCount(data.total_count);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to load products";
        setError(errorMessage);
        console.error("Error loading coordinator products:", err);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [coordinatorId, enabled]);

  const refetch = async () => {
    if (!enabled) {
      return;
    }

    if (!coordinatorId) {
      setError("Coordinator ID is required");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const data: ProductsByCoordinatorResponse =
        await fetchProductsByCoordinator(coordinatorId);

      setProducts(data.products);
      setTotalCount(data.total_count);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load products";
      setError(errorMessage);
      console.error("Error loading coordinator products:", err);
    } finally {
      setLoading(false);
    }
  };

  return {
    products,
    totalCount,
    loading,
    error,
    refetch,
  };
}
