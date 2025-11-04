# Product Order Draft Edge Function

This function creates or updates draft product orders for authenticated users.

## Endpoint

```
POST /public/product-order-draft
```

## Authentication

Requires:

- `sb-{projectRef}-auth-token=<encoded_token>` cookie with a valid Supabase
  token (works for both regular and anonymous users)

The function uses the unified auth token cookie that contains both access_token
and refresh_token in base64-encoded JSON format.

## Functionality

- **Unified token validation**: Verifies the auth token through Supabase Auth
  (works for both regular and anonymous users)
- **Draft management**: Creates new draft orders or updates existing ones
- **Product accumulation**: Adds quantities and prices to existing drafts for
  the same product
- **User isolation**: Each user can only access their own drafts

## Request Format

### Headers

```
Content-Type: application/json
Cookie: sb-{projectRef}-auth-token=<encoded_token>
```

### Body

```json
{
  "productId": "uuid",
  "quantity": 2,
  "totalPrice": 150.0,
  "urgency": "standard",
  "currency": "PLN",
  "notes": "Optional notes",
  "productParameters": {
    "color": "red",
    "size": "large",
    "material": "wood"
  }
}
```

## Response Format

### Success Response

```json
{
  "draftOrderId": "uuid",
  "isNewDraft": true
}
```

### Error Responses

```json
{
  "error": "Error description"
}
```

## Behavior

1. **New Draft**: Creates a new `product_orders` record with `status: 'draft'`
   and stores product parameters
2. **Existing Draft**: Updates existing draft **only if product parameters match
   exactly**. If parameters differ, creates a new draft
3. **Parameter Matching**: Compares the complete set of changeable parameters to
   determine if it's the same product configuration
4. **Returns**: The draft order ID and whether it was newly created

## Database Schema

The function uses the `product_orders` table with these key fields:

- `id`: UUID (primary key)
- `product_id`: UUID (foreign key to products)
- `user_id`: UUID (foreign key to auth.users)
- `quantity`: INTEGER
- `total_price`: NUMERIC
- `status`: ENUM ('draft', 'pending', etc.)
- `urgency`: ENUM (order_urgency)
- `currency`: ENUM (order_currency)
- `notes`: TEXT
- `product_parameters`: JSONB (user customizations for changeable parameters)

## Usage Example

```javascript
// Client-side usage with unified auth token cookie
const response = await fetch(
  'https://your-project.supabase.co/functions/v1/public/product-order-draft',
  {
    method: 'POST',
    credentials: 'include', // Important for cookie handling
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      productId: 'product-uuid',
      quantity: 2,
      totalPrice: 150.0,
      urgency: 'standard',
      currency: 'PLN',
      productParameters: {
        color: 'red',
        size: 'large',
        material: 'wood',
      },
    }),
  }
);

const data = await response.json();
console.log('Draft Order ID:', data.draftOrderId);
console.log('Is New Draft:', data.isNewDraft);

// Example: Different parameters create separate drafts
// First request: { color: 'red', size: 'large' } -> Creates draft_1
// Second request: { color: 'blue', size: 'large' } -> Creates draft_2
// Third request: { color: 'red', size: 'large' } -> Updates draft_1
```

## Error Handling

- **401 Unauthorized**: Missing authentication (no auth token in cookie)
- **400 Bad Request**: Missing required fields (productId, quantity, totalPrice)
- **500 Internal Server Error**: Database or server errors

## Security Notes

- Uses Supabase service role for database operations
- Validates user identity through unified auth token cookie (works for both
  regular and anonymous users)
- Each user can only access their own drafts
- **Dynamic CORS origins**: Origins loaded from `allowed_origins` database table
- **User-specific filtering**: Different origins per user for enhanced security
- **Fallback protection**: Hardcoded origins if database unavailable