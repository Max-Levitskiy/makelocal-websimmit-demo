/**
 * Fetch with timeout and abort controller support
 */

export class TimeoutError extends Error {
  constructor(message: string = "Request timed out") {
    super(message);
    this.name = "TimeoutError";
  }
}

export interface FetchWithTimeoutOptions extends RequestInit {
  timeout?: number; // Timeout in milliseconds
}

/**
 * Fetch with timeout support using AbortController
 * @param url - URL to fetch
 * @param options - Fetch options with optional timeout
 * @returns Promise that resolves to Response
 * @throws TimeoutError if request exceeds timeout
 */
export async function fetchWithTimeout(
  url: string,
  options: FetchWithTimeoutOptions = {},
): Promise<Response> {
  const { timeout = 5000, signal, ...fetchOptions } = options;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  // Combine the provided signal with our timeout signal if needed
  const combinedSignal = signal || controller.signal;

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      signal: combinedSignal,
    });

    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof Error && error.name === "AbortError") {
      throw new TimeoutError(`Request to ${url} timed out after ${timeout}ms`);
    }

    throw error;
  }
}

/**
 * Fetch JSON with timeout
 * @param url - URL to fetch
 * @param options - Fetch options with optional timeout
 * @returns Promise that resolves to parsed JSON
 */
export async function fetchJSON<T>(
  url: string,
  options: FetchWithTimeoutOptions = {},
): Promise<T> {
  const response = await fetchWithTimeout(url, options);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return await response.json();
}

/**
 * Fetch with retry logic
 * @param url - URL to fetch
 * @param options - Fetch options with optional timeout
 * @param maxRetries - Maximum number of retries (default: 1)
 * @param retryDelay - Delay between retries in milliseconds (default: 1000)
 * @returns Promise that resolves to Response
 */
export async function fetchWithRetry(
  url: string,
  options: FetchWithTimeoutOptions = {},
  maxRetries: number = 1,
  retryDelay: number = 1000,
): Promise<Response> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fetchWithTimeout(url, options);
    } catch (error) {
      lastError = error as Error;

      // Don't retry on non-timeout errors
      if (!(error instanceof TimeoutError)) {
        throw error;
      }

      // Don't delay after last attempt
      if (attempt < maxRetries) {
        await new Promise((resolve) => setTimeout(resolve, retryDelay));
      }
    }
  }

  throw lastError || new Error("Fetch failed after retries");
}
