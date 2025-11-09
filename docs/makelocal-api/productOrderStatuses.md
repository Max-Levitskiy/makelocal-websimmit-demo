# Product Order Statuses - Public Edge Function

## Overview

This edge function returns the current status of all product orders for an authenticated user. It's designed to be used by client applications that need to display a user's order history and track order progress. The function requires user authentication and returns comprehensive order details including progress tracking and product information.

## Authorization

The function requires user authentication and uses origin-based authorization:

- **User Authentication Required**: Uses Supabase auth tokens from cookies
- Checks the `origin` header against allowed origins stored in the
  `allowed_origins` table
- Falls back to default allowed origins: `https://makelocal.eu` and
  `https://makelocal.net`
- Returns `403 Forbidden` if the origin is not allowed
- Returns `401 Unauthorized` if no valid auth token is provided

## Endpoint

```
POST /functions/v1/public/product-order-statuses
```

## Request Format

### POST Request

**Request Body**: Empty (no body required)

The function returns all product orders for the authenticated user. Authentication is provided via Supabase auth cookies.

### Example Request

```bash
curl -X POST \
  'https://your-project.supabase.co/functions/v1/public/product-order-statuses' \
  -H 'Origin: https://makelocal.eu' \
  -H 'Cookie: sb-your-project-auth-token=your-auth-token-here'
```

## Response Format

### Success Response (200 OK)

```json
{
  "orders": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "product_id": "product-uuid-1",
      "status": "in_production",
      "total_models": 3,
      "completed_models": 1,
      "failed_models": 0,
      "quantity": 2,
      "total_price": 199.98,
      "urgency": "standard",
      "currency": "PLN",
      "notes": "Please handle with care",
      "product_parameters": {
        "color": "#FF0000",
        "material": "PLA"
      },
      "created_at": "2025-11-07T10:30:00Z",
      "updated_at": "2025-11-07T12:15:00Z",
      "completed_at": null,
      "payment_status": "paid",
      "product": {
        "id": "product-uuid-1",
        "title": "Custom Vase",
        "description": "Beautiful custom-designed vase",
        "featured_image": "https://cdn.example.com/vase.jpg"
      }
    }
  ],
  "notFound": ["987fcdeb-51a2-43d7-8f9e-123456789abc"]
}
```

### Response Fields

#### Order Object

- `id`: Order UUID
- `product_id`: Associated product UUID
- `status`: Current order status (see Order Status Values below)
- `total_models`: Total number of models in this order
- `completed_models`: Number of completed models
- `failed_models`: Number of failed models
- `quantity`: Order quantity
- `total_price`: Total order price
- `urgency`: Order urgency level
- `currency`: Order currency
- `notes`: Order notes (nullable)
- `product_parameters`: Product customization parameters (nullable)
- `created_at`: Order creation timestamp
- `updated_at`: Last update timestamp
- `completed_at`: Completion timestamp (nullable)
- `payment_status`: Payment status (nullable)

#### Product Object (nested)

- `id`: Product UUID
- `title`: Product title
- `description`: Product description (nullable)
- `featured_image`: Product featured image URL (nullable)


### Order Status Values

The `status` field can have the following values:

- `"draft"`: Order is in draft state
- `"design_request"`: Design request submitted
- `"pending"`: Order submitted, awaiting processing
- `"offered"`: Coordinator has provided pricing/offer
- `"matched"`: Coordinator assigned to order
- `"in_production"`: Order is being produced
- `"shipped"`: Order has been shipped
- `"delivered"`: Order has been delivered
- `"cancelled"`: Order was cancelled
- `"reviewing"`: Under review
- `"changes_suggested"`: Changes requested
- `"completed"`: Order completed successfully
- `"pending_payment"`: Awaiting payment

## Error Responses

### Missing authentication (401 Unauthorized)

```json
{
  "error": "Missing authentication. Provide auth token in cookie"
}
```

### Invalid or expired token (401 Unauthorized)

```json
{
  "error": "Invalid or expired token"
}
```

### Origin not allowed (403 Forbidden)

```json
{
  "error": "Origin not allowed"
}
```

### Method not allowed (405 Method Not Allowed)

```json
{
  "error": "Method not allowed"
}
```

### Server error (500 Internal Server Error)

```json
{
  "error": "Failed to fetch order statuses"
}
```

## Usage Examples

### JavaScript/TypeScript Example

```typescript
interface OrderStatus {
  id: string;
  product_id: string;
  status: string;
  total_models: number | null;
  completed_models: number | null;
  failed_models: number | null;
  quantity: number;
  total_price: number | null;
  urgency: string;
  currency: string;
  notes: string | null;
  product_parameters: any | null;
  created_at: string | null;
  updated_at: string | null;
  completed_at: string | null;
  payment_status: string | null;
  product: {
    id: string;
    title: string;
    description: string | null;
    featured_image: string | null;
  } | null;
}

interface OrderStatusResponse {
  orders: OrderStatus[];
}

async function getUserOrderStatuses(): Promise<OrderStatusResponse> {
  const response = await fetch(
    'https://your-project.supabase.co/functions/v1/public/product-order-statuses',
    {
      method: 'POST',
      credentials: 'include', // Include cookies for authentication
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to get order statuses');
  }

  return response.json();
}

// Usage
try {
  const result = await getUserOrderStatuses();

  console.log(`Found ${result.orders.length} orders for user`);

  result.orders.forEach(order => {
    console.log(`Order ${order.id}: ${order.status}`);
    if (order.product) {
      console.log(`  Product: ${order.product.title}`);
    }
    console.log(`  Progress: ${order.completed_models || 0} / ${order.total_models || 0} models`);
  });
} catch (error) {
  console.error('Error getting order statuses:', error);
}
```

### React Hook Example

```typescript
import { useState, useEffect } from 'react';

function useOrderStatuses() {
  const [orders, setOrders] = useState<OrderStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadStatuses() {
      try {
        setLoading(true);
        setError(null);

        const result = await getUserOrderStatuses();

        setOrders(result.orders);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load order statuses');
      } finally {
        setLoading(false);
      }
    }

    loadStatuses();
  }, []);

  return { orders, loading, error };
}

// Usage in component
function OrderStatusTracker() {
  const { orders, loading, error } = useOrderStatuses();

  if (loading) return <div>Loading order statuses...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Order Status Updates</h2>

      {orders.map(order => (
        <div key={order.id} className="order-status-card">
          <h3>{order.product?.title || 'Unknown Product'}</h3>
          <p>Order ID: {order.id}</p>
          <p>Status: <span className={`status-${order.status}`}>{order.status}</span></p>
          <p>Progress: {order.completed_models || 0} / {order.total_models || 0} models</p>
          {order.completed_at && (
            <p>Completed: {new Date(order.completed_at).toLocaleDateString()}</p>
          )}
        </div>
      ))}

    </div>
  );
}
```

## Security Considerations

1. **No Authentication Required**: This is a public endpoint for status checking
2. **Origin-Based Access Control**: Only requests from allowed origins are
   accepted
3. **UUID Validation**: All order IDs are validated for proper UUID format
4. **Rate Limiting**: Consider implementing rate limiting to prevent abuse
5. **Data Exposure**: Only returns order status information, not sensitive user
   data

## Performance Considerations

1. **Batch Processing**: Supports up to 100 order IDs in a single request
2. **Efficient Queries**: Uses `IN` clause for bulk fetching
3. **Field Selection**: Only necessary fields are selected to minimize response
   size
4. **Indexing**: Database indexes on order IDs ensure fast lookups

## Future Enhancements

Potential improvements for future versions:

- Add filtering by status, date ranges, or product types
- Add pagination for large result sets
- Add webhook support for real-time status updates
- Add caching for frequently accessed orders
- Add rate limiting and request throttling
- Add bulk status updates for coordinators

## Related Functions

- `product-order-draft`: Create draft orders
- `products-by-coordinator`: Get products by coordinator
- `authorize-stripe-payment`: Handle payment authorization
