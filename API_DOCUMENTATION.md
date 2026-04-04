# Global Leather Hub API Documentation

## Authentication
Protected routes require a Bearer token in the `Authorization` header. Public routes include health checks, authentication (`/api/auth/*`), product listings, and contact, unless otherwise noted below.

## Cart Endpoints

### GET /api/cart
Get user's cart contents.

**Response:**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "product": "product_id",
        "productName": "Leather Jacket",
        "quantity": 2,
        "pricePerUnit": 50.00
      }
    ],
    "totalAmount": 100.00
  }
}
```

### POST /api/cart
Add item to cart.

**Request:**
```json
{
  "productId": "product_id",
  "quantity": 1
}
```

**Response:** Same as GET /api/cart

### PATCH /api/cart/item/:productId
Update cart item quantity.

**Request:**
```json
{
  "quantity": 3
}
```

### DELETE /api/cart/item/:productId
Remove item from cart.

### DELETE /api/cart
Clear entire cart.

### POST /api/cart/checkout
Checkout cart.

**Request:**
```json
{
  "shippingDetails": {
    "fullName": "John Doe",
    "address": "123 Main St",
    "city": "New York",
    "country": "United States",
    "phone": "+1234567890"
  },
  "shippingProfileId": "profile_id", // optional
  "notes": "Handle with care"
}
```

## User Profile Endpoints

### PATCH /api/users/me/preferred-currency
Update preferred currency.

**Request:**
```json
{
  "preferredCurrency": "EUR"
}
```

### POST /api/users/me/shipping-profiles
Add shipping profile.

**Request:**
```json
{
  "name": "Office",
  "fullName": "John Doe",
  "company": "ABC Corp",
  "address": "123 Business St",
  "city": "New York",
  "country": "United States",
  "postalCode": "10001",
  "phone": "+1234567890",
  "isDefault": true
}
```

### PATCH /api/users/me/shipping-profiles/:profileId
Update shipping profile.

### DELETE /api/users/me/shipping-profiles/:profileId
Delete shipping profile.

## Order Endpoints (authenticated)

### GET /api/users/me/orders
List the signed-in user’s orders with pagination and optional status filter.

**Query:** `page`, `limit`, `status` (optional: `pending` | `confirmed` | `processing` | `shipped` | `delivered` | `cancelled`)

**Response:** `{ success, data: { orders, pagination: { page, pages, total, limit } } }`

Each order item line includes `pricePerUnit` (not `price`). Shipping is stored under `shippingDetails`.

### GET /api/users/me/orders/:id
Single order for the current user (404 if not owned).

**Response:** `{ success, data: { order } }`

## Bulk Order Endpoints

### POST /api/bulk-orders
Submit bulk order quotation request.

**Request:**
```json
{
  "products": [
    {
      "productId": "product_id",
      "name": "Leather Jacket",
      "quantity": 50,
      "customizations": "Custom logo embroidery",
      "notes": "Rush order needed"
    }
  ],
  "totalEstimatedValue": 2500.00,
  "currency": "USD"
}
```

### GET /api/bulk-orders
Get user's bulk order requests.

### GET /api/bulk-orders/:id
Get specific bulk order details.

## Error Responses
All endpoints return errors in this format:
```json
{
  "success": false,
  "message": "Error description"
}
```

## Supported Currencies
- USD (US Dollar)
- EUR (Euro)
- GBP (British Pound)
- AUD (Australian Dollar)
- CAD (Canadian Dollar)
- CNY (Chinese Yuan)

## MOQ (Minimum Order Quantity)
All cart operations enforce product-specific MOQ requirements. Orders below MOQ will be rejected.