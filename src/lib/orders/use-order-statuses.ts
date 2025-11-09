"use client";

import { useCallback, useEffect, useState } from "react";
import { fetchOrderStatuses } from "@/lib/api/order-statuses";
import type { OrderStatus } from "@/types/api";

interface UseOrderStatusesResult {
  orders: OrderStatus[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook to fetch and auto-refresh all order statuses for the authenticated user
 * @param refreshInterval - Refresh interval in milliseconds (default: 60000 = 1 minute)
 */
export function useOrderStatuses(
  refreshInterval = 60000,
): UseOrderStatusesResult {
  const [orders, setOrders] = useState<OrderStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStatuses = useCallback(async () => {
    try {
      console.log(
        "[useOrderStatuses] Fetching all orders for authenticated user",
      );

      const result = await fetchOrderStatuses();
      console.log("[useOrderStatuses] Received response:", result);

      setOrders(result.orders);
      setError(null);
    } catch (err) {
      console.error("[useOrderStatuses] Error fetching statuses:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch statuses");
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchStatuses();
  }, [fetchStatuses]);

  // Set up interval for auto-refresh
  useEffect(() => {
    if (refreshInterval <= 0) {
      return;
    }

    const interval = setInterval(() => {
      fetchStatuses();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [refreshInterval, fetchStatuses]);

  return {
    orders,
    loading,
    error,
    refetch: fetchStatuses,
  };
}
