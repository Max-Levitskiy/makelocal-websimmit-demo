# Product Order Draft API

## Overview

The `product-order-draft` endpoint is a Supabase Edge Function that handles batch creation and updating of product order drafts. It processes multiple product orders in a single request, calculating prices server-side from the database to ensure data integrity.

## Endpoint

```
POST /public/product-order-draft
```

## Authentication

- **Method**: Cookie-based authentication
- **Required**: Valid Supabase auth token in cookies
- **Supported Users**: Regular authenticated users and anonymous users

## Request Format

### Request Body

```typescript
interface CreateDraftBatchRequest {
  items: CreateDraftRequest[];
}

interface ProductParameterWithValue {
  name: string;                // Parameter name
  type: 'text' | 'color' | 'material' | 'number' | 'boolean' | 'select';
  value: string;               // Parameter value
  default_value?: string;      // Optional: Default value
  is_required?: boolean;       // Optional: Whether parameter is required
  options?: string[];          // Optional: Available options for select type
  placeholder?: string;        // Optional: Placeholder text
  description?: string;        // Optional: Parameter description
}

interface CreateDraftRequest {
  productId: string;           // Required: Product ID to order
  quantity: number;            // Required: Quantity to order (must be > 0)
  urgency?: string;            // Optional: Urgency level (default: 'standard')
  currency?: string;           // Optional: Currency (default: 'PLN')
  notes?: string;              // Optional: Order notes
  productParameters?: ProductParameterWithValue[]; // Optional: Custom parameters
}
```

### Request Validation

- **items**: Must be a non-empty array
- **items.length**: Maximum 50 items per request
- **productId**: Must exist in products table
- **quantity**: Must be a positive integer

## Response Format

### Success Response (200)

```typescript
interface BatchDraftOrderResponse {
  results: DraftOrderResponse[];
  errors?: Array<{
    productId: string;
    error: string;
  }>;
}

interface DraftOrderResponse {
  draftOrderId: string;   // UUID of created/updated draft
  isNewDraft: boolean;    // true if new draft created, false if existing updated
  productId: string;      // Original product ID from request
}
```

### Error Response (400/500)

```typescript
interface ErrorResponse {
  error: string;
}
```

## Business Logic

### 1. Price Calculation

**Formula**: `totalPrice = product.price × quantity`

- Price fetched from `products.price` column
- Handles null prices as 0 (free products)
- Calculated server-side for security

### 2. Draft Management

#### Parameter Conversion

- **Request Format**: Array of `ProductParameterWithValue` objects
- **Storage Format**: Converted to `Record<string, string>` (key-value pairs)
- **Conversion Logic**: `{ [param.name]: param.value }` for each parameter
- **Type Safety**: Maintains parameter metadata in request, stores values in database

#### Existing Draft Detection

- Finds drafts with matching `product_id`, `user_id`, and `product_parameters`
- Compares parameter key-value pairs for exact equality
- Only considers drafts with `status = 'draft'`

#### Draft Updates

- **Quantity**: `newQuantity = existingDraft.quantity + request.quantity`
- **Total Price**: `newTotalPrice = existingDraft.total_price + calculatedPrice`
- **Parameters**: Merges existing parameters with new ones (new overrides existing)

#### Draft Creation

- Creates new draft with calculated total price
- Sets default values for optional fields
- Status set to `'draft'`

### 3. Batch Processing

- **Fault Tolerance**: Individual item failures don't stop batch processing
- **Parallel Processing**: Items processed sequentially (not parallel for consistency)
- **Transaction Safety**: Each item operation is independent
- **Error Collection**: Failed items added to errors array

## Database Operations

### Tables Modified

#### `product_orders`
- **INSERT**: New draft orders
- **UPDATE**: Existing draft orders (quantity, total_price, product_parameters, updated_at)

#### `products` (Read-only)
- **SELECT**: Fetch product price and currency for calculation

### Constraints Enforced

- `products_price_check`: `price IS NULL OR price >= 0` (allows free products)
- `product_orders_total_price_check`: `total_price IS NULL OR total_price >= 0`

## Error Handling

### Request-Level Errors (400)

- `Missing or invalid items array`
- `Maximum 50 items per request`
- `Missing authentication. Provide auth token in cookie`
- `Invalid or expired token`

### Item-Level Errors (Included in Response)

- `Missing required fields: productId, quantity`
- `Product not found`
- `Failed to fetch existing drafts: [error]`
- `Failed to update existing draft: [error]`
- `Failed to create new draft: [error]`

### System Errors (500)

- Database connection errors
- Unexpected server errors

## Usage Examples

### Single Item Request

```json
{
  "items": [
    {
      "productId": "550e8400-e29b-41d4-a716-446655440000",
  "quantity": 2,
      "urgency": "high",
      "productParameters": [
        {
          "name": "color",
          "type": "color",
          "value": "red"
        },
        {
          "name": "size",
          "type": "select",
          "value": "large",
          "options": ["small", "medium", "large"]
        }
      ],
      "notes": "Rush order"
    }
  ]
}
```

### Batch Request

```json
{
  "items": [
    {
      "productId": "550e8400-e29b-41d4-a716-446655440001",
      "quantity": 1,
      "urgency": "standard"
    },
    {
      "productId": "550e8400-e29b-41d4-a716-446655440002",
      "quantity": 3,
      "notes": "Bulk order"
    }
  ]
}
```

### Success Response

```json
{
  "results": [
    {
      "draftOrderId": "660e8400-e29b-41d4-a716-446655440010",
      "isNewDraft": true,
      "productId": "550e8400-e29b-41d4-a716-446655440001"
    },
    {
      "draftOrderId": "660e8400-e29b-41d4-a716-446655440011",
      "isNewDraft": false,
      "productId": "550e8400-e29b-41d4-a716-446655440002"
    }
  ]
}
```

### Partial Success Response

```json
{
  "results": [
    {
      "draftOrderId": "660e8400-e29b-41d4-a716-446655440010",
      "isNewDraft": true,
      "productId": "550e8400-e29b-41d4-a716-446655440001"
    }
  ],
  "errors": [
    {
      "productId": "550e8400-e29b-41d4-a716-446655440002",
      "error": "Product not found"
    }
  ]
}
```

## Security Considerations

### Authentication
- Requires valid Supabase session token
- Supports both regular and anonymous users
- Validates user ownership of drafts

### Authorization
- Users can only create/update drafts for themselves
- Drafts are isolated by `user_id`

### Input Validation
- Server-side validation of all inputs
- SQL injection prevention via parameterized queries
- XSS prevention via proper data sanitization

### Price Security
- Prices calculated server-side from trusted database
- Prevents client-side price manipulation
- Ensures pricing consistency

## Performance Characteristics

### Rate Limiting
- Maximum 50 items per request
- Individual database operations per item
- No explicit rate limiting (relies on Supabase limits)

### Database Impact
- **Reads**: 1 query per item (product lookup)
- **Writes**: 1 insert/update per item
- **Indexes Used**: `product_orders_user_id_product_id_status_idx` (implied)

### Scalability
- Sequential processing (not parallel)
- Independent item operations
- Suitable for moderate batch sizes (1-50 items)

## Monitoring & Logging

### Success Logging
- Draft creation/updates logged via application monitoring
- Includes user context and operation details

### Error Logging
- Item-level errors collected in response
- System errors logged to console
- Database errors include detailed error messages

## Testing

### Unit Tests
- Individual item processing logic
- Price calculation validation
- Parameter merging logic

### Integration Tests
- Full batch processing workflows
- Database state verification
- Authentication flow testing

### Edge Cases
- Empty request arrays
- Invalid product IDs
- Concurrent draft updates
- Free products (price = 0)

## Dependencies

### External
- `@supabase/supabase-js@2.38.4`: Database client
- Supabase Edge Runtime: Server environment

### Internal
- `../../_shared/auth.ts`: Authentication utilities
- `../../_shared/types.ts`: CORS configuration

## Deployment

### Environment Variables
- `SUPABASE_URL`: Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY`: Service role key for database access
- `SUPABASE_ANON_KEY`: Anonymous key for user authentication

### CORS Configuration
- Dynamically loads allowed origins from `allowed_origins` table
- Falls back to hardcoded domains for development

## Future Enhancements

### Potential Improvements
- Parallel processing for better performance
- Optimistic locking for concurrent updates
- Bulk database operations
- Enhanced validation rules
- Rate limiting implementation
- Comprehensive audit logging

### Breaking Changes
- Request format is not backward compatible with single-item API
- Error response format may change with new error types
