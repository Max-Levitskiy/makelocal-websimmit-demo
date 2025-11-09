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
  userId: string; // UUID of the anonymous user
  token: string; // Base64-encoded JWT with refresh token
  isAnonymous: boolean; // True for anonymous users
  expiresIn?: number; // Optional: Seconds until expiration (if not provided, defaults to 7 days)
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

// Products by Coordinator

export interface ProductParameter {
  name: string;
  type: "text" | "color" | "material" | "number" | "boolean" | "select";
  default_value?: string;
  is_required?: boolean;
  options?: string[];
  placeholder?: string;
  description?: string;
  applies_to_models?: boolean; // Whether this applies to all models or just product-level
}

export interface CoordinatorProduct {
  id: string;
  title: string;
  description: string | null;
  slug: string | null;
  featured_image: string | null;
  photos: string[] | null;
  tags: string[] | null;
  price: number | null;
  currency: string | null;
  changeable_parameters: ProductParameter[] | null;
  published_at: string | null;
  view_count: number | null;
  model_count: number | null;
}

export interface ProductsByCoordinatorResponse {
  products: CoordinatorProduct[];
  total_count: number;
}

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

// Product Order Statuses

export type OrderStatusType =
  | "draft"
  | "design_request"
  | "pending"
  | "offered"
  | "matched"
  | "in_production"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "reviewing"
  | "changes_suggested"
  | "completed"
  | "pending_payment";

export interface OrderStatus {
  id: string;
  product_id: string;
  status: OrderStatusType;
  total_models: number | null;
  completed_models: number | null;
  failed_models: number | null;
  quantity: number;
  total_price: number | null;
  urgency: string;
  currency: string;
  notes: string | null;
  product_parameters: Record<string, unknown> | null;
  created_at: string | null;
  updated_at: string | null;
  completed_at: string | null;
  payment_status: string | null;
  products: {
    id: string;
    title: string;
    description: string | null;
    featured_image: string | null;
  } | null;
}

export interface OrderStatusesResponse {
  orders: OrderStatus[];
}
