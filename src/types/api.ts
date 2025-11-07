/**
 * MakeLocal API type definitions
 */

// Anonymous Authentication

export interface AnonymousSession {
  token: string; // Session token
  expiresAt: number; // Unix timestamp
  createdAt: number; // Unix timestamp
}

export interface AnonymousAuthResponse {
  token: string;
  expiresIn: number; // Seconds until expiration
}

// Order Draft

export type ProductParameterType =
  | "text"
  | "color"
  | "material"
  | "number"
  | "boolean"
  | "select";

export interface ProductParameterWithValue {
  name: string; // Parameter name
  type: ProductParameterType;
  value: string; // Parameter value
  default_value?: string; // Optional: Default value
  is_required?: boolean; // Optional: Whether parameter is required
  options?: string[]; // Optional: Available options for select type
  placeholder?: string; // Optional: Placeholder text
  description?: string; // Optional: Parameter description
}

export interface CreateDraftRequest {
  productId: string; // Required: Product ID to order
  quantity: number; // Required: Quantity to order (must be > 0)
  urgency?: string; // Optional: Urgency level (default: 'standard')
  currency?: string; // Optional: Currency (default: 'PLN')
  notes?: string; // Optional: Order notes
  productParameters?: ProductParameterWithValue[]; // Optional: Custom parameters
}

export interface CreateDraftBatchRequest {
  items: CreateDraftRequest[];
}

export interface DraftOrderResponse {
  draftOrderId: string; // UUID of created/updated draft
  isNewDraft: boolean; // true if new draft created, false if existing updated
  productId: string; // Original product ID from request
}

export interface BatchDraftOrderResponse {
  results: DraftOrderResponse[];
  errors?: Array<{
    productId: string;
    error: string;
  }>;
  redirectUrl: string; // URL to redirect to for checkout
}

// Legacy type for backward compatibility
export type OrderDraftStatus = "draft" | "pending" | "confirmed" | "failed";

// API Errors

export interface APIError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
  statusCode?: number;
}

export class MakeLocalAPIError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode?: number,
    public details?: Record<string, unknown>,
  ) {
    super(message || "An unknown error occurred");
    this.name = "MakeLocalAPIError";
  }
}
