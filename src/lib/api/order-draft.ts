import type {
  BatchDraftOrderResponse,
  CreateDraftBatchRequest,
  CreateDraftRequest,
  ProductParameterWithValue,
} from "@/types/api";
import type { Cart, CartItem } from "@/types/cart";
import type { Customizations } from "@/types/product";
import { ensureValidSession } from "./anonymous-auth";
import { makeLocalRequest } from "./makelocal-client";

/**
 * Transform customizations to product parameters
 */
export function customizationsToProductParameters(
  customizations: Customizations,
): ProductParameterWithValue[] {
  const parameters: ProductParameterWithValue[] = [];

  if (customizations.text) {
    parameters.push({
      name: "text",
      type: "text",
      value: customizations.text,
      is_required: false,
    });
  }

  if (customizations.colorId) {
    parameters.push({
      name: "color",
      type: "color",
      value: customizations.colorId,
      is_required: false,
    });
  }

  return parameters;
}

/**
 * Transform cart item to create draft request
 */
export function cartItemToCreateDraftRequest(
  item: CartItem,
): CreateDraftRequest {
  return {
    productId: item.productId,
    quantity: item.quantity,
    productParameters: customizationsToProductParameters(item.customizations),
    urgency: "standard",
    currency: "EUR",
  };
}

/**
 * Transform cart to create draft batch request
 */
export function cartToCreateDraftBatchRequest(
  cart: Cart,
): CreateDraftBatchRequest {
  return {
    items: cart.items.map(cartItemToCreateDraftRequest),
  };
}

/**
 * Create order draft with MakeLocal API
 * Note: Session token is sent as cookie via credentials: 'include'
 */
export async function createOrderDraft(
  cart: Cart,
): Promise<BatchDraftOrderResponse> {
  // Ensure we have a valid session token (sets cookie)
  const sessionToken = cart.sessionToken || (await ensureValidSession());

  if (!sessionToken) {
    throw new Error(
      "No session token available. Please try adding items to cart again.",
    );
  }

  // Transform cart to batch request
  const payload = cartToCreateDraftBatchRequest(cart);

  // Validate payload
  if (payload.items.length === 0) {
    throw new Error("Cart is empty. Please add items before checking out.");
  }

  if (payload.items.length > 50) {
    throw new Error("Maximum 50 items per request. Please reduce cart size.");
  }

  try {
    const response = await makeLocalRequest<BatchDraftOrderResponse>(
      "/product-order-draft",
      {
        method: "POST",
        body: JSON.stringify(payload),
      },
    );

    // Check if there were any errors in the batch
    if (response.errors && response.errors.length > 0) {
      console.warn(
        "Some items failed to create draft orders:",
        response.errors,
      );

      // If all items failed, throw an error
      if (response.results.length === 0) {
        throw new Error(
          `Failed to create draft orders: ${response.errors[0].error}`,
        );
      }
    }

    return response;
  } catch (error) {
    console.error("Failed to create order draft:", error);
    throw error;
  }
}

/**
 * Validate cart before creating order draft
 */
export function validateCartForCheckout(cart: Cart): {
  valid: boolean;
  message?: string;
} {
  if (cart.items.length === 0) {
    return {
      valid: false,
      message: "Your cart is empty. Please add items before checking out.",
    };
  }

  // Check for required customizations
  for (const item of cart.items) {
    if (!item.customizations) {
      return {
        valid: false,
        message: `Item "${item.productName}" is missing customizations.`,
      };
    }
  }

  return { valid: true };
}
