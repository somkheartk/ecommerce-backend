# API Documentation

## Overview

This document provides detailed information about all API endpoints available in the E-Commerce Backend API.

## Base URL

```
http://localhost:3000
```

## Authentication

Most endpoints require authentication using JWT tokens. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## Response Format

All API responses follow a consistent format:

### Success Response
```json
{
  "code": 0,
  "message": "Success",
  "data": { ... }
}
```

### Error Response
```json
{
  "code": 1001,
  "message": "Invalid credentials",
  "error": "Error details..."
}
```

## Response Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| 0 | 200 | Success |
| 1 | 400 | Fail (Bad Request/Validation Error) |
| 1001 | 401 | Invalid Credentials |
| 1002 | 404 | User Not Found |
| 1003 | 404 | Product Not Found |
| 1004 | 404 | Order Not Found |
| 1005 | 401 | Unauthorized |
| 1006 | 403 | Forbidden |
| 2001 | 201 | Created Successfully |
| 2002 | 200 | Updated Successfully |
| 2003 | 200 | Deleted Successfully |

---

## Authentication Endpoints

### POST /auth/login

Authenticate a user and receive a JWT token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Success Response (200):**
```json
{
  "code": 0,
  "message": "Success",
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "user"
    }
  }
}
```

**Error Response (401):**
```json
{
  "code": "1001",
  "message": "Invalid credentials",
  "error": "Invalid email or password"
}
```

---

## User Endpoints

### POST /users

Create a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe",
  "role": "user"
}
```

**Response (201):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "email": "user@example.com",
  "name": "John Doe",
  "role": "user",
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

**Notes:**
- Password will be automatically hashed before storage
- Valid roles: `user`, `admin`
- Email must be unique

### GET /users

Get all users.

**Response (200):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "user",
    "createdAt": "2024-01-15T10:30:00.000Z"
  },
  ...
]
```

### GET /users/:id

Get a specific user by ID.

**URL Parameters:**
- `id` - MongoDB ObjectId of the user

**Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "email": "user@example.com",
  "name": "John Doe",
  "role": "user",
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

### PUT /users/:id

Update a user's information.

**URL Parameters:**
- `id` - MongoDB ObjectId of the user

**Request Body (partial update):**
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com"
}
```

**Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "email": "jane@example.com",
  "name": "Jane Doe",
  "role": "user",
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

### DELETE /users/:id

Delete a user.

**URL Parameters:**
- `id` - MongoDB ObjectId of the user

**Response (200):**
```json
null
```

---

## Product Endpoints

**Authentication Required:** All product endpoints require JWT authentication.

**Authorization:** 
- Create, Update, Delete: Admin role required
- Read operations: Admin or User role

### POST /products

Create a new product (Admin only).

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "Laptop",
  "description": "High-performance laptop",
  "price": 999.99,
  "stock": 50,
  "imageUrl": "https://example.com/laptop.jpg"
}
```

**Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439012",
  "name": "Laptop",
  "description": "High-performance laptop",
  "price": 999.99,
  "stock": 50,
  "imageUrl": "https://example.com/laptop.jpg",
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

### GET /products

Get all products (Authenticated users).

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439012",
    "name": "Laptop",
    "description": "High-performance laptop",
    "price": 999.99,
    "stock": 50,
    "imageUrl": "https://example.com/laptop.jpg",
    "createdAt": "2024-01-15T10:30:00.000Z"
  },
  ...
]
```

### GET /products/:id

Get a specific product (Authenticated users).

**Headers:**
```
Authorization: Bearer <token>
```

**URL Parameters:**
- `id` - MongoDB ObjectId of the product

**Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439012",
  "name": "Laptop",
  "description": "High-performance laptop",
  "price": 999.99,
  "stock": 50,
  "imageUrl": "https://example.com/laptop.jpg",
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

### PUT /products/:id

Update a product (Admin only).

**Headers:**
```
Authorization: Bearer <token>
```

**URL Parameters:**
- `id` - MongoDB ObjectId of the product

**Request Body (partial update):**
```json
{
  "price": 899.99,
  "stock": 75
}
```

**Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439012",
  "name": "Laptop",
  "description": "High-performance laptop",
  "price": 899.99,
  "stock": 75,
  "imageUrl": "https://example.com/laptop.jpg",
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

### DELETE /products/:id

Delete a product (Admin only).

**Headers:**
```
Authorization: Bearer <token>
```

**URL Parameters:**
- `id` - MongoDB ObjectId of the product

**Response (200):**
```json
null
```

---

## Order Endpoints

### POST /orders

Create a new order.

**Request Body:**
```json
{
  "userId": "507f1f77bcf86cd799439011",
  "items": [
    "507f1f77bcf86cd799439012",
    "507f1f77bcf86cd799439013"
  ],
  "total": 1499.98,
  "status": "pending"
}
```

**Success Response (201):**
```json
{
  "code": 2001,
  "message": "Created",
  "data": {
    "_id": "507f1f77bcf86cd799439014",
    "userId": "507f1f77bcf86cd799439011",
    "items": [
      "507f1f77bcf86cd799439012",
      "507f1f77bcf86cd799439013"
    ],
    "total": 1499.98,
    "status": "pending",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Error Response (400):**
```json
{
  "code": 1,
  "message": "Fail",
  "error": "Invalid order data"
}
```

### GET /orders

Get all orders with pagination.

**Query Parameters:**
- `page` (optional) - Page number (default: 1)
- `limit` (optional) - Items per page (default: 10)

**Example Request:**
```
GET /orders?page=2&limit=5
```

**Success Response (200):**
```json
{
  "code": 0,
  "message": "Success",
  "data": [
    {
      "_id": "507f1f77bcf86cd799439014",
      "userId": "507f1f77bcf86cd799439011",
      "items": ["507f1f77bcf86cd799439012"],
      "total": 999.99,
      "status": "pending",
      "createdAt": "2024-01-15T10:30:00.000Z"
    },
    ...
  ],
  "meta": {
    "page": 2,
    "limit": 5,
    "total": 50,
    "totalPages": 10
  }
}
```

### GET /orders/:id

Get a specific order.

**URL Parameters:**
- `id` - MongoDB ObjectId of the order

**Success Response (200):**
```json
{
  "code": 0,
  "message": "Success",
  "data": {
    "_id": "507f1f77bcf86cd799439014",
    "userId": "507f1f77bcf86cd799439011",
    "items": ["507f1f77bcf86cd799439012"],
    "total": 999.99,
    "status": "pending",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Error Response (404):**
```json
{
  "code": 1004,
  "message": "Order not found",
  "error": "Order with given ID does not exist"
}
```

### PUT /orders/:id

Update an order.

**URL Parameters:**
- `id` - MongoDB ObjectId of the order

**Request Body (partial update):**
```json
{
  "status": "shipped"
}
```

**Valid status values:**
- `pending`
- `paid`
- `shipped`
- `cancelled`

**Success Response (200):**
```json
{
  "code": 2002,
  "message": "Updated",
  "data": {
    "_id": "507f1f77bcf86cd799439014",
    "userId": "507f1f77bcf86cd799439011",
    "items": ["507f1f77bcf86cd799439012"],
    "total": 999.99,
    "status": "shipped",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Error Response (404):**
```json
{
  "code": 1004,
  "message": "Order not found",
  "error": "Order with given ID does not exist"
}
```

### DELETE /orders/:id

Delete an order.

**URL Parameters:**
- `id` - MongoDB ObjectId of the order

**Success Response (200):**
```json
{
  "code": 2003,
  "message": "Deleted"
}
```

**Error Response (404):**
```json
{
  "code": 1004,
  "message": "Order not found",
  "error": "Order with given ID does not exist"
}
```

---

## Error Handling

The API uses consistent error responses across all endpoints:

### Validation Errors (400)
```json
{
  "code": 1,
  "message": "Validation failed",
  "error": "email must be a valid email address"
}
```

### Authentication Errors (401)
```json
{
  "code": 1001,
  "message": "Invalid credentials",
  "error": "Invalid email or password"
}
```

### Authorization Errors (403)
```json
{
  "code": 1006,
  "message": "Forbidden",
  "error": "Insufficient permissions"
}
```

### Not Found Errors (404)
```json
{
  "code": 1004,
  "message": "Not found",
  "error": "Resource does not exist"
}
```

---

## Rate Limiting

Currently, there are no rate limits implemented. Consider implementing rate limiting for production use.

## CORS

Configure CORS settings in `main.ts` before deploying to production to allow requests from your frontend domain.

## Pagination

Endpoints that support pagination return data in the following format:

```json
{
  "code": 0,
  "message": "Success",
  "data": [...],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

Query parameters:
- `page`: Page number (starts at 1)
- `limit`: Number of items per page

---

## Best Practices

1. **Always use HTTPS in production** to protect JWT tokens and sensitive data
2. **Store JWT tokens securely** on the client side (httpOnly cookies recommended)
3. **Implement token refresh** mechanism for better security
4. **Validate all inputs** on both client and server side
5. **Handle errors gracefully** and don't expose sensitive information
6. **Use pagination** for large datasets to improve performance
7. **Implement rate limiting** to prevent abuse
8. **Monitor API usage** and performance metrics
