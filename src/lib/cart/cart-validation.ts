import type { Cart, CartItem } from "@/types/cart";

/**
 * Cart validation rules and utilities
 */

// Validation constraints
export const CART_CONSTRAINTS = {
  MIN_QUANTITY: 1,
  MAX_QUANTITY: 10,
  MAX_TOTAL_ITEMS: 10, // Max total quantity across all items
  MAX_UNIQUE_ITEMS: 10, // Max distinct products
} as const;

export interface CartValidationError {
  code: string;
  message: string;
  field?: string;
}

/**
 * Validate item quantity
 */
export function validateQuantity(quantity: number): CartValidationError | null {
  if (quantity < CART_CONSTRAINTS.MIN_QUANTITY) {
    return {
      code: "QUANTITY_TOO_LOW",
      message: `Quantity must be at least ${CART_CONSTRAINTS.MIN_QUANTITY}`,
      field: "quantity",
    };
  }

  if (quantity > CART_CONSTRAINTS.MAX_QUANTITY) {
    return {
      code: "QUANTITY_TOO_HIGH",
      message: `Quantity cannot exceed ${CART_CONSTRAINTS.MAX_QUANTITY} per item`,
      field: "quantity",
    };
  }

  return null;
}

/**
 * Calculate total quantity in cart
 */
export function getTotalQuantity(cart: Cart): number {
  if (!cart?.items || !Array.isArray(cart.items)) {
    return 0;
  }
  return cart.items.reduce((sum, item) => sum + item.quantity, 0);
}

/**
 * Check if adding quantity would exceed cart limits
 */
export function canAddToCart(
  cart: Cart,
  quantityToAdd: number = 1,
): CartValidationError | null {
  if (!cart?.items || !Array.isArray(cart.items)) {
    return null; // Empty cart, can add
  }

  const currentTotal = getTotalQuantity(cart);
  const newTotal = currentTotal + quantityToAdd;

  if (newTotal > CART_CONSTRAINTS.MAX_TOTAL_ITEMS) {
    return {
      code: "CART_FULL",
      message: `Cannot add item. Cart limit is ${CART_CONSTRAINTS.MAX_TOTAL_ITEMS} items total`,
    };
  }

  if (cart.items.length >= CART_CONSTRAINTS.MAX_UNIQUE_ITEMS) {
    return {
      code: "TOO_MANY_UNIQUE_ITEMS",
      message: `Cannot add more distinct products. Maximum ${CART_CONSTRAINTS.MAX_UNIQUE_ITEMS} unique items allowed`,
    };
  }

  return null;
}

/**
 * Check if item exists in cart
 */
export function findCartItem(cart: Cart, itemId: string): CartItem | undefined {
  if (!cart?.items || !Array.isArray(cart.items)) {
    return undefined;
  }
  return cart.items.find((item) => item.id === itemId);
}

/**
 * Check if product with same configuration exists in cart
 */
export function findDuplicateItem(
  cart: Cart,
  productId: string,
  customizations: Record<string, unknown>,
): CartItem | undefined {
  if (!cart?.items || !Array.isArray(cart.items)) {
    return undefined;
  }
  return cart.items.find((item) => {
    if (item.productId !== productId) {
      return false;
    }

    // Deep equality check for customizations
    return (
      JSON.stringify(item.customizations) === JSON.stringify(customizations)
    );
  });
}

/**
 * Validate cart item
 */
export function validateCartItem(item: CartItem): CartValidationError[] {
  const errors: CartValidationError[] = [];

  // Validate quantity
  const quantityError = validateQuantity(item.quantity);
  if (quantityError) {
    errors.push(quantityError);
  }

  // Validate required fields
  if (!item.productId) {
    errors.push({
      code: "MISSING_PRODUCT_ID",
      message: "Product ID is required",
      field: "productId",
    });
  }

  if (!item.productName) {
    errors.push({
      code: "MISSING_PRODUCT_NAME",
      message: "Product name is required",
      field: "productName",
    });
  }

  if (typeof item.basePrice !== "number" || item.basePrice < 0) {
    errors.push({
      code: "INVALID_PRICE",
      message: "Valid price is required",
      field: "basePrice",
    });
  }

  return errors;
}

/**
 * Validate entire cart
 */
export function validateCart(cart: Cart): CartValidationError[] {
  const errors: CartValidationError[] = [];

  if (!cart?.items || !Array.isArray(cart.items)) {
    return errors; // Empty cart is valid
  }

  // Validate total quantity
  const totalQuantity = getTotalQuantity(cart);
  if (totalQuantity > CART_CONSTRAINTS.MAX_TOTAL_ITEMS) {
    errors.push({
      code: "CART_TOTAL_EXCEEDED",
      message: `Cart total exceeds ${CART_CONSTRAINTS.MAX_TOTAL_ITEMS} items`,
    });
  }

  // Validate each item
  cart.items.forEach((item, index) => {
    const itemErrors = validateCartItem(item);
    itemErrors.forEach((error) => {
      errors.push({
        ...error,
        message: `Item ${index + 1}: ${error.message}`,
      });
    });
  });

  return errors;
}
