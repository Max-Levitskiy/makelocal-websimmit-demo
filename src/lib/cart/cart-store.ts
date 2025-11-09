"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ensureValidSession } from "@/lib/api/anonymous-auth";
import type { Cart, CartItem, CartSummary } from "@/types/cart";
import {
  clearCart as clearPersistedCart,
  createEmptyCart,
  loadCart,
  saveCart,
} from "./cart-persistence";
import {
  canAddToCart,
  findDuplicateItem,
  getTotalQuantity,
  validateQuantity,
} from "./cart-validation";

interface CartStore extends Cart {
  // Computed properties
  summary: CartSummary;

  // Actions
  addItem: (item: Omit<CartItem, "id" | "addedAt">) => Promise<void>;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  loadPersistedCart: () => void;

  // Private helpers
  _recalculateSummary: () => void;
}

const calculateSummary = (items: CartItem[]): CartSummary => {
  if (!items || !Array.isArray(items)) {
    return {
      totalItems: 0,
      totalPrice: 0,
      itemCount: 0,
    };
  }

  const totalItems = getTotalQuantity({ items } as Cart);
  const totalPrice = items.reduce(
    (sum, item) => sum + item.basePrice * item.quantity,
    0,
  );

  return {
    totalItems,
    totalPrice,
    itemCount: items.length,
  };
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      ...createEmptyCart(),
      summary: {
        totalItems: 0,
        totalPrice: 0,
        itemCount: 0,
      },

      _recalculateSummary: () => {
        const { items } = get();
        const summary = calculateSummary(items);
        set({ summary });
      },

      addItem: async (newItem) => {
        const state = get();

        // Session token is now managed by AuthProvider
        // Get the token from the current stored session
        try {
          const token = await ensureValidSession();
          set({ sessionToken: token });
        } catch (error) {
          console.warn(
            "[CartStore] Failed to get session token, continuing in offline mode:",
            error,
          );
          // Continue without token - fallback to local-only mode
        }

        // Check for duplicate with same configuration
        const duplicate = findDuplicateItem(
          state as Cart,
          newItem.productId,
          newItem.customizations as Record<string, unknown>,
        );

        if (duplicate) {
          // Increase quantity of existing item
          const newQuantity = duplicate.quantity + (newItem.quantity || 1);

          // Validate the new total quantity for this item
          const quantityError = validateQuantity(newQuantity);
          if (quantityError) {
            throw new Error(quantityError.message);
          }

          // Check if we can add to cart (only total quantity constraint applies)
          const canAddError = canAddToCart(
            state as Cart,
            newItem.quantity || 1,
          );
          if (canAddError) {
            console.error(
              "[CartStore] Cart validation failed:",
              canAddError.message,
            );
            throw new Error(canAddError.message);
          }

          set({
            items: state.items.map((item) =>
              item.id === duplicate.id
                ? { ...item, quantity: newQuantity }
                : item,
            ),
            updatedAt: Date.now(),
          });
        } else {
          // Add new item - validate both total quantity and unique items constraints
          const canAddError = canAddToCart(
            state as Cart,
            newItem.quantity || 1,
            newItem.productId,
            newItem.customizations as Record<string, unknown>,
          );
          if (canAddError) {
            console.error(
              "[CartStore] Cart validation failed:",
              canAddError.message,
            );
            throw new Error(canAddError.message);
          }

          const cartItem: CartItem = {
            ...newItem,
            id: crypto.randomUUID(),
            addedAt: Date.now(),
            quantity: newItem.quantity || 1,
          };

          set({
            items: [...state.items, cartItem],
            updatedAt: Date.now(),
          });
        }

        // Recalculate summary
        get()._recalculateSummary();

        // Save to localStorage
        const updatedState = get();
        saveCart(updatedState as Cart);
      },

      removeItem: (itemId) => {
        const state = get();

        set({
          items: state.items.filter((item) => item.id !== itemId),
          updatedAt: Date.now(),
        });

        // Recalculate summary
        get()._recalculateSummary();

        // Save to localStorage
        const updatedState = get();
        saveCart(updatedState as Cart);
      },

      updateQuantity: (itemId, quantity) => {
        const quantityError = validateQuantity(quantity);
        if (quantityError) {
          throw new Error(quantityError.message);
        }

        const state = get();

        set({
          items: state.items.map((item) =>
            item.id === itemId ? { ...item, quantity } : item,
          ),
          updatedAt: Date.now(),
        });

        // Recalculate summary
        get()._recalculateSummary();

        // Save to localStorage
        const updatedState = get();
        saveCart(updatedState as Cart);
      },

      clearCart: () => {
        const emptyCart = createEmptyCart();
        set({
          ...emptyCart,
          summary: {
            totalItems: 0,
            totalPrice: 0,
            itemCount: 0,
          },
        });

        clearPersistedCart();
      },

      loadPersistedCart: () => {
        const persistedCart = loadCart();
        const summary = calculateSummary(persistedCart.items);
        set({
          ...persistedCart,
          summary,
        });
      },
    }),
    {
      name: "makelocal-cart",
      partialize: (state) => ({
        items: state.items,
        sessionToken: state.sessionToken,
        createdAt: state.createdAt,
        updatedAt: state.updatedAt,
        expiresAt: state.expiresAt,
      }),
    },
  ),
);

// Initialize cart from localStorage on first load
if (typeof window !== "undefined") {
  useCartStore.getState().loadPersistedCart();
}
