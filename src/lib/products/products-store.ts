"use client";

import { create } from "zustand";
import type { Product } from "@/types/product";

// Cache expiration time (10 minutes)
const CACHE_EXPIRATION_MS = 10 * 60 * 1000; // 10 minutes

interface ProductsState {
  // State
  products: Product[];
  isLoading: boolean;
  error: string | null;
  lastFetched: number | null;

  // Actions
  setProducts: (products: Product[]) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  getProductById: (id: string) => Product | undefined;
  getProductBySlug: (slug: string) => Product | undefined;
  isCacheValid: () => boolean;
  shouldFetchProducts: () => boolean;
  clearProducts: () => void;
}

/**
 * Global products store
 * Manages products fetched from MakeLocal API
 */
export const useProductsStore = create<ProductsState>((set, get) => ({
  // Initial state
  products: [],
  isLoading: false,
  error: null,
  lastFetched: null,

  // Set products (called after fetching from API)
  setProducts: (products: Product[]) => {
    set({
      products,
      lastFetched: Date.now(),
      error: null,
    });
  },

  // Set loading state
  setLoading: (isLoading: boolean) => {
    set({ isLoading });
  },

  // Set error state
  setError: (error: string | null) => {
    set({ error, isLoading: false });
  },

  // Get product by ID
  getProductById: (id: string) => {
    const { products } = get();
    return products.find((p) => p.id === id);
  },

  // Get product by slug
  getProductBySlug: (slug: string) => {
    const { products } = get();
    return products.find((p) => p.slug === slug);
  },

  // Check if cache is still valid (not expired)
  isCacheValid: () => {
    const { lastFetched } = get();
    if (!lastFetched) return false;

    const now = Date.now();
    const age = now - lastFetched;
    return age < CACHE_EXPIRATION_MS;
  },

  // Check if we should fetch products (cache expired or empty)
  shouldFetchProducts: () => {
    const { products, isCacheValid } = get();
    return products.length === 0 || !isCacheValid();
  },

  // Clear all products (useful for logout or reset)
  clearProducts: () => {
    set({
      products: [],
      isLoading: false,
      error: null,
      lastFetched: null,
    });
  },
}));
