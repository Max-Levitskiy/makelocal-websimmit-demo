"use client";

import { create } from "zustand";

interface PhotoCacheEntry {
  url: string;
  dataUrl: string;
  loadedAt: number;
  expiresAt: number; // 1 hour from load time
}

interface PhotoCacheState {
  // Cache storage
  cache: Map<string, PhotoCacheEntry>;

  // Loading states
  loading: Set<string>;
  errors: Map<string, string>;

  // Actions
  getCachedPhoto: (url: string) => PhotoCacheEntry | null;
  isLoading: (url: string) => boolean;
  getError: (url: string) => string | null;
  setLoading: (url: string, loading: boolean) => void;
  setError: (url: string, error: string | null) => void;
  cachePhoto: (url: string, dataUrl: string) => void;
  clearExpired: () => void;
  clearCache: () => void;
}

/**
 * Photo cache for storing loaded images as data URLs
 * Prevents re-fetching and improves performance
 */
export const usePhotoCache = create<PhotoCacheState>((set, get) => ({
  // Initial state
  cache: new Map(),
  loading: new Set(),
  errors: new Map(),

  // Get cached photo if exists and not expired
  getCachedPhoto: (url: string) => {
    const { cache } = get();
    const entry = cache.get(url);

    if (!entry) return null;

    // Check if expired (1 hour)
    if (Date.now() > entry.expiresAt) {
      cache.delete(url);
      return null;
    }

    return entry;
  },

  // Check if photo is currently loading
  isLoading: (url: string) => {
    return get().loading.has(url);
  },

  // Get error for photo URL
  getError: (url: string) => {
    return get().errors.get(url) || null;
  },

  // Set loading state for photo
  setLoading: (url: string, loading: boolean) => {
    set((state) => {
      const newLoading = new Set(state.loading);
      if (loading) {
        newLoading.add(url);
      } else {
        newLoading.delete(url);
      }
      return { loading: newLoading };
    });
  },

  // Set error for photo
  setError: (url: string, error: string | null) => {
    set((state) => {
      const newErrors = new Map(state.errors);
      if (error) {
        newErrors.set(url, error);
      } else {
        newErrors.delete(url);
      }
      return { errors: newErrors };
    });
  },

  // Cache a loaded photo
  cachePhoto: (url: string, dataUrl: string) => {
    set((state) => {
      const newCache = new Map(state.cache);
      newCache.set(url, {
        url,
        dataUrl,
        loadedAt: Date.now(),
        expiresAt: Date.now() + 60 * 60 * 1000, // 1 hour
      });
      return { cache: newCache };
    });
  },

  // Clear expired cache entries
  clearExpired: () => {
    set((state) => {
      const newCache = new Map(state.cache);
      const now = Date.now();

      for (const [url, entry] of newCache) {
        if (now > entry.expiresAt) {
          newCache.delete(url);
        }
      }

      return { cache: newCache };
    });
  },

  // Clear entire cache
  clearCache: () => {
    set({
      cache: new Map(),
      loading: new Set(),
      errors: new Map(),
    });
  },
}));
