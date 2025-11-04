# Auth Anonymous Edge Function

This function provides anonymous authentication for cross-origin requests using
Supabase Auth.

## Endpoint

```
POST /public/auth-anonymous
```

## Functionality

- **Cookie-based token validation**: Checks for existing
  `sb-{projectRef}-auth-token` cookie (unified cookie for both regular and
  anonymous auth)
- **Regular auth bypass**: If `sb-{projectRef}-auth-token` exists, returns early
  without creating anonymous user
- **Token verification**: Validates existing auth tokens using Supabase Auth
  (works for both regular and anonymous users)
- **Anonymous user creation**: Creates new anonymous users when no valid token
  exists
- **Cross-origin support**: Returns appropriate CORS headers for web integration

## Request/Response Format

### Request

```
POST /auth-anonymous
Content-Type: application/json
Cookie: sb-{projectRef}-auth-token=<encoded_token> (optional)
```

### Response

```json
{
  "userId": "uuid",
  "token": "base64-encoded_jwt_with_refresh_token",
  "isAnonymous": true
}
```

### Error Response

```json
{
  "error": "Error message",
  "isAnonymous": false
}
```

## Usage Example

```javascript
// Client-side usage
const response = await fetch(
  'https://your-project.supabase.co/functions/v1/public/auth-anonymous',
  {
    method: 'POST',
    credentials: 'include', // Important for cookie handling
    headers: {
      'Content-Type': 'application/json',
    },
  }
);

const data = await response.json();
console.log('User ID:', data.userId);
console.log('Token:', data.token);

// Token is automatically stored in cookie for future requests
```

## Features

- **Unified cookie handling**: Uses same `sb-{projectRef}-auth-token` cookie for
  both regular and anonymous auth
- **JWT structure**: Stores tokens as base64-encoded JSON with access_token and
  refresh_token
- **Automatic token refresh**: Creates new anonymous user if token is invalid
- **Cookie storage**: Stores token in HttpOnly cookie for security
- **CORS enabled**: Supports cross-origin requests
- **Error handling**: Comprehensive error responses
- **Logging**: Detailed console logging for debugging

## Security Notes

- Uses HttpOnly cookies to prevent XSS attacks
- Tokens are valid for 7 days
- SameSite=None and Secure flags for cross-origin support
- Anonymous users are identified by `is_anonymous` claim in JWT
- **Dynamic CORS origins**: Origins loaded from `allowed_origins` database table
- **User-specific filtering**: Different origins per user for enhanced security