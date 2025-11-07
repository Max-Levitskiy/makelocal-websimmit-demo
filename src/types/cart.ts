import type { Customizations } from "./product";

/**
 * Cart and cart item type definitions
 */

export interface CartItem {
  id: string; // Unique cart item ID (UUID)
  productId: string; // References Product.id
  productSlug: string; // For linking back to product page
  productName: string; // Denormalized for display
  basePrice: number; // Denormalized from Product
  customizations: Customizations; // User's configuration
  quantity: number; // Must be 1-10 per item
  addedAt: number; // Unix timestamp
}

export interface Cart {
  items: CartItem[];
  sessionToken?: string; // Anonymous auth token (from US3)
  createdAt: number; // Unix timestamp
  updatedAt: number; // Unix timestamp
  expiresAt: number; // Unix timestamp (createdAt + 7 days)
}

export interface CartSummary {
  totalItems: number; // Sum of all item quantities
  totalPrice: number; // Sum of (basePrice * quantity) for all items
  itemCount: number; // Number of distinct items
}
