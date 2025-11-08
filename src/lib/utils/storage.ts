/**
 * localStorage wrapper with error handling for quota exceeded and JSON parsing
 */

export class StorageError extends Error {
  constructor(
    message: string,
    public code: "QUOTA_EXCEEDED" | "PARSE_ERROR" | "NOT_AVAILABLE" | "UNKNOWN",
  ) {
    super(message);
    this.name = "StorageError";
  }
}

/**
 * Check if localStorage is available
 */
export function isStorageAvailable(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  try {
    const testKey = "__storage_test__";
    localStorage.setItem(testKey, "test");
    localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

/**
 * Get item from localStorage with JSON parsing
 */
export function getItem<T>(key: string): T | null {
  if (!isStorageAvailable()) {
    return null;
  }

  try {
    const item = localStorage.getItem(key);
    if (item === null) {
      return null;
    }
    return JSON.parse(item) as T;
  } catch (error) {
    console.error(`Failed to parse localStorage item "${key}":`, error);
    throw new StorageError(
      `Failed to parse stored data for key "${key}"`,
      "PARSE_ERROR",
    );
  }
}

/**
 * Set item in localStorage with JSON stringification
 */
export function setItem<T>(key: string, value: T): void {
  if (!isStorageAvailable()) {
    throw new StorageError("localStorage is not available", "NOT_AVAILABLE");
  }

  try {
    const serialized = JSON.stringify(value);
    localStorage.setItem(key, serialized);
  } catch (error) {
    if (error instanceof Error && error.name === "QuotaExceededError") {
      throw new StorageError(
        "localStorage quota exceeded. Please clear some data.",
        "QUOTA_EXCEEDED",
      );
    }
    throw new StorageError(
      `Failed to store data for key "${key}": ${error}`,
      "UNKNOWN",
    );
  }
}

/**
 * Remove item from localStorage
 */
export function removeItem(key: string): void {
  if (!isStorageAvailable()) {
    return;
  }

  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Failed to remove localStorage item "${key}":`, error);
  }
}

/**
 * Clear all localStorage items
 */
export function clear(): void {
  if (!isStorageAvailable()) {
    return;
  }

  try {
    localStorage.clear();
  } catch (error) {
    console.error("Failed to clear localStorage:", error);
  }
}

/**
 * Get all keys in localStorage
 */
export function getKeys(): string[] {
  if (!isStorageAvailable()) {
    return [];
  }

  try {
    return Object.keys(localStorage);
  } catch {
    return [];
  }
}
