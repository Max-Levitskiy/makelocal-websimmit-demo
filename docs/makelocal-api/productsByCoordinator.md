# Products by Coordinator - Public Edge Function

## Overview

This edge function returns all published public products created by a specific
coordinator. It's designed to be used by external websites that want to display
a coordinator's product catalog.

## Authorization

The function uses origin-based authorization similar to `product-order-draft`:

- Checks the `origin` header against allowed origins stored in the
  `allowed_origins` table
- Falls back to default allowed origins: `https://makelocal.eu` and
  `https://makelocal.net`
- Returns `403 Forbidden` if the origin is not allowed

## Endpoint

```
GET /public/products-by-coordinator
```

## Request Methods

The function supports both `GET` and `POST` methods:

### GET Request

Query parameter:

- `coordinatorId` (required): UUID of the coordinator

Example:

```bash
curl -X GET \
  'https://your-project.supabase.co/functions/v1/public/products-by-coordinator?coordinatorId=123e4567-e89b-12d3-a456-426614174000' \
  -H 'Origin: https://makelocal.eu'
```

## Response Format

### Success Response (200 OK)

```json
{
  "products": [
    {
      "id": "product-uuid",
      "title": "Product Name",
      "description": "Product description",
      "slug": "product-slug",
      "featured_image": "https://your-bucket.s3.eu-central-1.amazonaws.com/products/123/main.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&...",
      "photos": [
        "https://your-bucket.s3.eu-central-1.amazonaws.com/products/123/photo1.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&...",
        "https://your-bucket.s3.eu-central-1.amazonaws.com/products/123/photo2.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&..."
      ],
      "tags": ["tag1", "tag2"],
      "price": 99.99,
      "currency": "PLN",
      "changeable_parameters": {
        "color": {
          "type": "color",
          "default": "#FF0000",
          "options": ["#FF0000", "#00FF00", "#0000FF"]
        }
      },
      "published_at": "2025-11-07T12:00:00Z",
      "view_count": 150,
      "model_count": 3
    }
  ],
  "total_count": 1
}
```

### Error Responses

#### Missing coordinatorId (400 Bad Request)

```json
{
  "error": "Missing required parameter: coordinatorId"
}
```

#### Invalid coordinatorId format (400 Bad Request)

```json
{
  "error": "Invalid coordinatorId format. Must be a valid UUID."
}
```

#### Origin not allowed (403 Forbidden)

```json
{
  "error": "Origin not allowed"
}
```

#### Method not allowed (405 Method Not Allowed)

```json
{
  "error": "Method not allowed"
}
```

#### Server error (500 Internal Server Error)

```json
{
  "error": "Failed to fetch products"
}
```

## Filter Criteria

The function only returns products that meet ALL of the following criteria:

- `created_by` = `coordinatorId`
- `status` = `published`
- `access_type` = `public`

Products are ordered by `published_at` in descending order (newest first).

## Image Handling

The function automatically generates **presigned URLs** for all product images:

### How It Works
- **S3 Keys**: If stored as S3 object keys, presigned URLs are generated (expire in 1 hour)
- **Existing URLs**: If already HTTP/HTTPS URLs, they are returned unchanged
- **Error Handling**: Failed URL generation for individual images doesn't break the response

### Benefits
- ✅ **Secure Access**: External websites get time-limited access to your S3 objects
- ✅ **No Public Buckets**: Your S3 bucket doesn't need to be publicly accessible
- ✅ **Flexible Storage**: Works with both S3 keys and existing CDN URLs
- ✅ **Performance**: Parallel processing of multiple images
- ✅ **Error Resilient**: Individual image failures don't break the entire response

### Environment Variables Required
```bash
AWS_REGION=eu-central-1
AWS_S3_BUCKET_NAME=your-bucket-name
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
```

## Data Included

For each product, the following fields are returned:

- Basic info: `id`, `title`, `description`, `slug`
- Media: `featured_image`, `photos` (presigned URLs)
- Metadata: `tags`, `published_at`, `view_count`, `model_count`
- Pricing: `price`, `currency`
- Configuration: `changeable_parameters`

## Usage in External Websites

### JavaScript/TypeScript Example

```typescript
interface Product {
  id: string;
  title: string;
  description: string | null;
  slug: string | null;
  featured_image: string | null;
  photos: string[] | null;
  tags: string[] | null;
  price: number | null;
  currency: string | null;
  changeable_parameters: any | null;
  published_at: string | null;
  view_count: number | null;
  model_count: number | null;
}

interface ProductsResponse {
  products: Product[];
  total_count: number;
}

async function fetchCoordinatorProducts(
  coordinatorId: string
): Promise<ProductsResponse> {
  const response = await fetch(
    'https://your-project.supabase.co/functions/v1/public/products-by-coordinator?coordinatorId=${coordinatorId}',
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch products');
  }

  return response.json();
}

// Usage
try {
  const data = await fetchCoordinatorProducts(
    '123e4567-e89b-12d3-a456-426614174000'
  );
  console.log(`Found ${data.total_count} products`);
  console.log(`Coordinator: ${data.coordinator?.display_name}`);
  data.products.forEach(product => {
    console.log(`- ${product.title}: ${product.price} ${product.currency}`);
  });
} catch (error) {
  console.error('Error fetching products:', error);
}
```

### React Hook Example

```typescript
import { useState, useEffect } from 'react';

function useCoordinatorProducts(coordinatorId: string) {
  const [products, setProducts] = useState<Product[]>([]);
  const [coordinator, setCoordinator] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        setError(null);

        const data = await fetchCoordinatorProducts(coordinatorId);

        setProducts(data.products);
        setCoordinator(data.coordinator);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load products');
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, [coordinatorId]);

  return { products, coordinator, loading, error };
}

// Usage in component
function CoordinatorCatalog({ coordinatorId }: { coordinatorId: string }) {
  const { products, coordinator, loading, error } = useCoordinatorProducts(coordinatorId);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>{coordinator?.display_name}'s Products</h1>
      <div className="products-grid">
        {products.map(product => (
          <div key={product.id} className="product-card">
            <img src={product.featured_image || '/placeholder.png'} alt={product.title} />
            <h3>{product.title}</h3>
            <p>{product.description}</p>
            <p className="price">
              {product.price} {product.currency}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
```

## Security Considerations

1. **No Authentication Required**: This is a public endpoint that doesn't
   require user authentication
2. **Origin-Based Access Control**: Only requests from allowed origins are
   accepted
3. **Public Data Only**: Only products with `status='published'` and
   `access_type='public'` are returned
4. **Rate Limiting**: Consider implementing rate limiting on the client side to
   avoid abuse
5. **UUID Validation**: The function validates that coordinatorId is a valid
   UUID format

## Performance Considerations

1. **Indexing**: The database has indexes on `created_by`, `status`, and
   `access_type` columns for efficient filtering
2. **Ordering**: Products are sorted by `published_at` in descending order
3. **Field Selection**: Only necessary fields are selected to minimize data
   transfer
4. **No Pagination**: Currently returns all matching products. Consider adding
   pagination if coordinators have many products

## Future Enhancements

Potential improvements for future versions:

- Add pagination support (limit, offset)
- Add filtering by tags, price range
- Add search functionality
- Add sorting options (price, title, date)
- Cache responses for better performance
- Add rate limiting
