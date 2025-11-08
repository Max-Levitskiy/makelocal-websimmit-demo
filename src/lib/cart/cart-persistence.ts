import { getItem, removeItem, setItem } from "@/lib/utils/storage";
import type { Cart } from "@/types/cart";

const CART_STORAGE_KEY = "makelocal-cart";
const CART_TTL_DAYS = 7;

/**
 * Get cart TTL in milliseconds
 */
export function getCartTTL(): number {
  return CART_TTL_DAYS * 24 * 60 * 60 * 1000; // 7 days in milliseconds
}

/**
 * Check if cart has expired
 */
export function isCartExpired(cart: Cart): boolean {
  const now = Date.now();
  return now > cart.expiresAt;
}

/**
 * Create a new empty cart
 */
export function createEmptyCart(): Cart {
  const now = Date.now();
  return {
    items: [],
    createdAt: now,
    updatedAt: now,
    expiresAt: now + getCartTTL(),
  };
}

/**
 * Load cart from localStorage
 */
export function loadCart(): Cart {
  try {
    const stored = getItem<Cart>(CART_STORAGE_KEY);

    if (!stored) {
      return createEmptyCart();
    }

    // Check if expired
    if (isCartExpired(stored)) {
      removeItem(CART_STORAGE_KEY);
      return createEmptyCart();
    }

    return stored;
  } catch (error) {
    console.error("Failed to load cart:", error);
    return createEmptyCart();
  }
}

/**
 * Save cart to localStorage
 */
export function saveCart(cart: Cart): void {
  try {
    const updatedCart: Cart = {
      ...cart,
      updatedAt: Date.now(),
    };
    setItem(CART_STORAGE_KEY, updatedCart);
  } catch (error) {
    console.error("Failed to save cart:", error);
    throw error;
  }
}

/**
 * Clear cart from localStorage
 */
export function clearCart(): void {
  try {
    removeItem(CART_STORAGE_KEY);
  } catch (error) {
    console.error("Failed to clear cart:", error);
  }
}

/**
 * Extend cart expiration (refresh TTL)
 */
export function extendCartExpiration(cart: Cart): Cart {
  return {
    ...cart,
    expiresAt: Date.now() + getCartTTL(),
    updatedAt: Date.now(),
  };
}

/**
 * Get days until cart expires
 */
export function getDaysUntilExpiration(cart: Cart): number {
  const now = Date.now();
  const timeRemaining = cart.expiresAt - now;
  return Math.max(0, Math.ceil(timeRemaining / (24 * 60 * 60 * 1000)));
}

/**
 * Check if cart is expiring soon (within 1 day)
 */
export function isCartExpiringSoon(cart: Cart): boolean {
  return getDaysUntilExpiration(cart) <= 1;
}
