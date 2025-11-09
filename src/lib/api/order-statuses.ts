/**
 * Product Order Statuses API
 * Fetches all product orders for the authenticated user
 */

import type { OrderStatusesResponse } from "@/types/api";
import { ensureValidSession } from "./anonymous-auth";
import { makeLocalRequest } from "./makelocal-client";

/**
 * Fetch all order statuses for the authenticated user
 *
 * @returns All orders for the authenticated user
 * @throws {MakeLocalAPIError} If the request fails
 */
export async function fetchOrderStatuses(): Promise<OrderStatusesResponse> {
  try {
    // Ensure we have a valid session token (sets/refreshes authentication)
    const sessionToken = await ensureValidSession();

    if (!sessionToken) {
      throw new Error(
        "No session token available. Unable to fetch order statuses.",
      );
    }

    console.log("[fetchOrderStatuses] Session token exists, making request");

    // Log current cookies to verify authentication
    if (typeof window !== "undefined") {
      console.log("[fetchOrderStatuses] Current cookies:", document.cookie);
    }

    const response = await makeLocalRequest<OrderStatusesResponse>(
      "/product-order-statuses",
      {
        method: "POST",
      },
    );

    console.log(
      "[fetchOrderStatuses] Received orders:",
      response.orders.length,
    );
    return response;
  } catch (error) {
    console.error(
      "[fetchOrderStatuses] Failed to fetch order statuses:",
      error,
    );
    throw error;
  }
}
