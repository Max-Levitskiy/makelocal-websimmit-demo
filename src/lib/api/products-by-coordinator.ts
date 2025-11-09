import type { ProductsByCoordinatorResponse } from "@/types/api";
import { makeLocalRequest } from "./makelocal-client";

/**
 * Mock coordinator ID for development/testing
 * Reads from NEXT_PUBLIC_COORDINATOR_ID environment variable
 * Falls back to a default UUID if not set
 */
export const MOCK_COORDINATOR_ID =
  process.env.NEXT_PUBLIC_COORDINATOR_ID ??
  "123e4567-e89b-12d3-a456-426614174000";

/**
 * Fetch products by coordinator ID using GET method
 *
 * @param coordinatorId - UUID of the coordinator
 * @returns Products and coordinator info
 * @throws {MakeLocalAPIError} If the request fails
 */
export async function fetchProductsByCoordinator(
  coordinatorId: string,
): Promise<ProductsByCoordinatorResponse> {
  // Validate UUID format
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(coordinatorId)) {
    throw new Error("Invalid coordinatorId format. Must be a valid UUID.");
  }

  try {
    const response = await makeLocalRequest<ProductsByCoordinatorResponse>(
      `/products-by-coordinator?coordinatorId=${coordinatorId}`,
      {
        method: "GET",
      },
    );
    console.log("response", response);

    return response;
  } catch (error) {
    console.error("Failed to fetch products by coordinator:", error);
    throw error;
  }
}

/**
 * Fetch products using the mock coordinator ID
 * Useful for development and testing
 *
 * @returns Products and coordinator info
 */
export async function fetchMockCoordinatorProducts(): Promise<ProductsByCoordinatorResponse> {
  return fetchProductsByCoordinator(MOCK_COORDINATOR_ID);
}
