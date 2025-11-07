import { fetchWithTimeout } from "@/lib/utils/fetch-with-timeout";
import { MakeLocalAPIError } from "@/types/api";

/**
 * Base MakeLocal API client configuration
 */

const API_URL = process.env.NEXT_PUBLIC_MAKELOCAL_API_URL ?? "";
const API_TIMEOUT = Number.parseInt(
  process.env.NEXT_PUBLIC_API_TIMEOUT ?? "5000",
  10,
);

if (!API_URL) {
  console.warn("NEXT_PUBLIC_MAKELOCAL_API_URL is not configured");
}

/**
 * Make a request to the MakeLocal API
 */
export async function makeLocalRequest<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const url = `${API_URL}${endpoint}`;

  try {
    const response = await fetchWithTimeout(url, {
      ...options,
      timeout: API_TIMEOUT,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      credentials: "include", // Include cookies for session management
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new MakeLocalAPIError(
        errorData.message || `HTTP error! status: ${response.status}`,
        errorData.code || "API_ERROR",
        response.status,
        errorData.details,
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    // If already a MakeLocalAPIError, rethrow
    if (error instanceof MakeLocalAPIError) {
      throw error;
    }

    // Handle timeout and other errors
    if (error instanceof Error) {
      // Handle specific error types
      if (error.name === "TimeoutError") {
        throw new MakeLocalAPIError(
          "Request timed out. Please check your internet connection and try again.",
          "TIMEOUT",
        );
      }

      if (error.name === "AbortError") {
        throw new MakeLocalAPIError(
          "Request was cancelled. Please try again.",
          "ABORTED",
        );
      }

      if (error.name === "TypeError" && error.message.includes("fetch")) {
        throw new MakeLocalAPIError(
          "Network connection failed. Please check your internet connection.",
          "NETWORK_ERROR",
        );
      }

      throw new MakeLocalAPIError(
        error.message || "Network error occurred",
        "NETWORK_ERROR",
      );
    }

    // Handle non-Error objects
    if (typeof error === "string") {
      throw new MakeLocalAPIError(error, "NETWORK_ERROR");
    }

    throw new MakeLocalAPIError("Unknown error occurred", "UNKNOWN_ERROR");
  }
}

/**
 * Check if API is configured
 */
export function isAPIConfigured(): boolean {
  return !!API_URL;
}

/**
 * Get API configuration for debugging
 */
export function getAPIConfig() {
  return {
    url: API_URL,
    timeout: API_TIMEOUT,
    configured: isAPIConfigured(),
  };
}
