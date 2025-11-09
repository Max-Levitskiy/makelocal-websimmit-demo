import { usePhotoCache } from "./photo-cache";

/**
 * Convert blob to data URL
 */
async function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/**
 * Fetch image and convert to data URL
 */
async function fetchImageAsDataUrl(url: string): Promise<string> {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      `Failed to fetch image: ${response.status} ${response.statusText}`,
    );
  }

  const blob = await response.blob();

  // Validate it's an image
  if (!blob.type.startsWith("image/")) {
    throw new Error("Fetched resource is not an image");
  }

  return blobToDataUrl(blob);
}

/**
 * Load and cache a single photo
 */
export async function loadPhoto(url: string): Promise<string> {
  const cache = usePhotoCache.getState();

  // Check if already cached
  const cached = cache.getCachedPhoto(url);
  if (cached) {
    return cached.dataUrl;
  }

  // Check if already loading
  if (cache.isLoading(url)) {
    // Wait for existing load to complete
    return new Promise((resolve, reject) => {
      const checkLoaded = () => {
        const cached = cache.getCachedPhoto(url);
        if (cached) {
          resolve(cached.dataUrl);
          return;
        }

        const error = cache.getError(url);
        if (error) {
          reject(new Error(error));
          return;
        }

        // Still loading, check again
        setTimeout(checkLoaded, 100);
      };
      checkLoaded();
    });
  }

  // Start loading
  cache.setLoading(url, true);
  cache.setError(url, null);

  try {
    const dataUrl = await fetchImageAsDataUrl(url);
    cache.cachePhoto(url, dataUrl);
    cache.setLoading(url, false);
    return dataUrl;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    cache.setError(url, errorMessage);
    cache.setLoading(url, false);
    throw new Error(`Failed to load photo: ${errorMessage}`);
  }
}

/**
 * Load multiple photos concurrently
 */
export async function loadPhotos(urls: string[]): Promise<Map<string, string>> {
  const results = new Map<string, string>();

  // Start all loads concurrently
  const promises = urls.map(async (url) => {
    try {
      const dataUrl = await loadPhoto(url);
      results.set(url, dataUrl);
    } catch (error) {
      console.warn(`Failed to load photo ${url}:`, error);
      // Keep original URL as fallback
      results.set(url, url);
    }
  });

  await Promise.all(promises);
  return results;
}

/**
 * Preload photos for a product (non-blocking)
 */
export function preloadProductPhotos(productImages: string[]): void {
  if (productImages.length === 0) return;

  // Preload first image immediately (most important)
  loadPhoto(productImages[0]).catch((error) => {
    console.warn("Failed to preload main product image:", error);
  });

  // Preload other images after a short delay
  if (productImages.length > 1) {
    setTimeout(() => {
      productImages.slice(1).forEach((url) => {
        loadPhoto(url).catch((error) => {
          console.warn(`Failed to preload product image ${url}:`, error);
        });
      });
    }, 1000); // 1 second delay to prioritize main image
  }
}

/**
 * Hook to get cached photo URL
 */
export function useCachedPhoto(url: string): {
  dataUrl: string | null;
  isLoading: boolean;
  error: string | null;
  load: () => Promise<void>;
} {
  const cache = usePhotoCache();

  const cached = cache.getCachedPhoto(url);
  const isLoading = cache.isLoading(url);
  const error = cache.getError(url);

  const load = async () => {
    try {
      await loadPhoto(url);
    } catch (_error) {
      // Error already handled in cache
    }
  };

  return {
    dataUrl: cached?.dataUrl || null,
    isLoading,
    error,
    load,
  };
}
