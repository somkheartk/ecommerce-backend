# Database Schema Documentation

## Overview

This document describes the database schema used in the E-Commerce Backend API. The application uses MongoDB as the database with TypeORM as the ORM.

## Database: MongoDB

MongoDB is a NoSQL document database that stores data in flexible, JSON-like documents.

### Connection Configuration

The database connection is configured in `src/app.module.ts` using environment variables:

```typescript
TypeOrmModule.forRootAsync({
  type: 'mongodb',
  url: process.env.MONGO_URI,
  database: process.env.MONGO_DB,
  entities: [__dirname + '/../entities/*.entity.{js,ts}'],
  synchronize: true,
})
```

**Important:** Set `synchronize: false` in production to prevent automatic schema changes.

---

## Entities

### User Entity

**Collection Name:** `user`

**File:** `src/entities/user.entity.ts`

| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| `_id` | ObjectId | Unique identifier | Primary key, auto-generated |
| `email` | string | User's email address | Required, unique |
| `passwordHash` | string | Hashed password | Required |
| `name` | string | User's full name | Required |
| `role` | string | User role | Default: 'user', Values: 'user', 'admin' |
| `createdAt` | Date | Creation timestamp | Required |

**Example Document:**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "email": "john.doe@example.com",
  "passwordHash": "$2a$10$...",
  "name": "John Doe",
  "role": "user",
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

**Notes:**
- Passwords are hashed using bcryptjs before storage
- Email field has a unique index
- Role determines access permissions (user/admin)

---

### Product Entity

**Collection Name:** `product`

**File:** `src/entities/product.entity.ts`

| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| `_id` | ObjectId | Unique identifier | Primary key, auto-generated |
| `name` | string | Product name | Required |
| `description` | string (text) | Product description | Required |
| `price` | number (decimal) | Product price | Required |
| `stock` | number (int) | Available quantity | Required |
| `imageUrl` | string | Product image URL | Optional (nullable) |
| `createdAt` | Date | Creation timestamp | Required |

**Example Document:**
```json
{
  "_id": "507f1f77bcf86cd799439012",
  "name": "Laptop",
  "description": "High-performance laptop with 16GB RAM",
  "price": 999.99,
  "stock": 50,
  "imageUrl": "https://example.com/images/laptop.jpg",
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

**Notes:**
- Price is stored as decimal for precision
- Stock is an integer representing available quantity
- ImageUrl can be null if no image is provided

---

### Order Entity

**Collection Name:** `order`

**File:** `src/entities/order.entity.ts`

| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| `_id` | ObjectId | Unique identifier | Primary key, auto-generated |
| `userId` | ObjectId | Reference to User | Required |
| `items` | ObjectId[] | Array of item references | Required |
| `total` | number (decimal) | Order total amount | Required |
| `status` | string | Order status | Default: 'pending' |
| `createdAt` | Date | Creation timestamp | Required |

**Valid Status Values:**
- `pending` - Order created, awaiting payment
- `paid` - Payment received
- `shipped` - Order dispatched
- `cancelled` - Order cancelled

**Example Document:**
```json
{
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
```

**Notes:**
- userId references the User who placed the order
- items is an array of ObjectIds (can reference products or order items)
- total is the sum of all item prices
- status tracks the order lifecycle

---

### Cart Entity

**Collection Name:** `cart`

**File:** `src/entities/cart.entity.ts`

| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| `_id` | ObjectId | Unique identifier | Primary key, auto-generated |
| `userId` | ObjectId | Reference to User | Required |
| `items` | ObjectId[] | Array of cart item references | Required |
| `createdAt` | Date | Creation timestamp | Required |
| `updatedAt` | Date | Last update timestamp | Required |

**Example Document:**
```json
{
  "_id": "507f1f77bcf86cd799439015",
  "userId": "507f1f77bcf86cd799439011",
  "items": [
    "507f1f77bcf86cd799439016",
    "507f1f77bcf86cd799439017"
  ],
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T11:00:00.000Z"
}
```

---

### CartItem Entity

**Collection Name:** `cartitem`

**File:** `src/entities/cart-item.entity.ts`

| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| `_id` | ObjectId | Unique identifier | Primary key, auto-generated |
| `cartId` | ObjectId | Reference to Cart | Required |
| `productId` | ObjectId | Reference to Product | Required |
| `quantity` | number (int) | Quantity of product | Required |
| `price` | number (decimal) | Price at time of adding | Required |

**Example Document:**
```json
{
  "_id": "507f1f77bcf86cd799439016",
  "cartId": "507f1f77bcf86cd799439015",
  "productId": "507f1f77bcf86cd799439012",
  "quantity": 2,
  "price": 999.99
}
```

**Notes:**
- Price is stored at the time of adding to cart (preserves price even if product price changes)
- Quantity represents how many units of the product

---

### OrderItem Entity

**Collection Name:** `orderitem`

**File:** `src/entities/order-item.entity.ts`

| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| `_id` | ObjectId | Unique identifier | Primary key, auto-generated |
| `orderId` | ObjectId | Reference to Order | Required |
| `productId` | ObjectId | Reference to Product | Required |
| `quantity` | number (int) | Quantity ordered | Required |
| `price` | number (decimal) | Price at time of order | Required |

**Example Document:**
```json
{
  "_id": "507f1f77bcf86cd799439018",
  "orderId": "507f1f77bcf86cd799439014",
  "productId": "507f1f77bcf86cd799439012",
  "quantity": 1,
  "price": 999.99
}
```

**Notes:**
- Price snapshot preserves historical pricing
- Links products to orders with quantity information

---

## Relationships

### One-to-Many Relationships

1. **User → Orders**
   - One user can have many orders
   - Referenced via `Order.userId`

2. **User → Cart**
   - One user can have one active cart
   - Referenced via `Cart.userId`

3. **Cart → CartItems**
   - One cart contains many cart items
   - Referenced via `CartItem.cartId`

4. **Order → OrderItems**
   - One order contains many order items
   - Referenced via `OrderItem.orderId`

### Many-to-Many Relationships

1. **Products ↔ Orders** (through OrderItem)
   - Products can appear in many orders
   - Orders can contain many products
   - Junction table: `OrderItem`

2. **Products ↔ Carts** (through CartItem)
   - Products can be in many carts
   - Carts can contain many products
   - Junction table: `CartItem`

---

## Indexes

### Recommended Indexes

For optimal performance, consider creating the following indexes:

**User Collection:**
```javascript
db.user.createIndex({ email: 1 }, { unique: true })
```

**Product Collection:**
```javascript
db.product.createIndex({ name: 1 })
db.product.createIndex({ price: 1 })
db.product.createIndex({ createdAt: -1 })
```

**Order Collection:**
```javascript
db.order.createIndex({ userId: 1 })
db.order.createIndex({ status: 1 })
db.order.createIndex({ createdAt: -1 })
```

**Cart Collection:**
```javascript
db.cart.createIndex({ userId: 1 }, { unique: true })
```

**CartItem Collection:**
```javascript
db.cartitem.createIndex({ cartId: 1 })
db.cartitem.createIndex({ productId: 1 })
```

**OrderItem Collection:**
```javascript
db.orderitem.createIndex({ orderId: 1 })
db.orderitem.createIndex({ productId: 1 })
```

---

## Data Types

### MongoDB ObjectId

ObjectId is a 12-byte identifier typically used as primary keys in MongoDB:
- 4-byte timestamp
- 5-byte random value
- 3-byte incrementing counter

Example: `507f1f77bcf86cd799439011`

### Decimal Numbers

For monetary values (price, total), use decimal type to maintain precision:
- Stored as decimal128 in MongoDB
- Prevents floating-point arithmetic errors

---

## Migration Strategy

Since TypeORM's `synchronize: true` is used in development, schema changes are automatically applied. For production:

1. Set `synchronize: false`
2. Use TypeORM migrations for schema changes
3. Create migration files:
   ```bash
   npm run typeorm migration:create -- -n MigrationName
   ```
4. Run migrations:
   ```bash
   npm run typeorm migration:run
   ```

---

## Backup and Restore

### Backup MongoDB Database

```bash
mongodump --uri="mongodb://localhost:27017/ecommerce" --out=/backup/path
```

### Restore MongoDB Database

```bash
mongorestore --uri="mongodb://localhost:27017/ecommerce" /backup/path/ecommerce
```

---

## Data Validation

TypeORM entities define the schema, but additional validation is done using:

1. **class-validator** decorators in DTOs
2. **MongoDB schema validation** (optional)
3. **Application-level validation** in services

Example DTO validation:
```typescript
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @MinLength(8)
  password: string;
}
```

---

## Best Practices

1. **Use ObjectId for references** instead of embedding documents for better normalization
2. **Store price snapshots** in orders and cart items to preserve historical data
3. **Index frequently queried fields** (userId, status, email)
4. **Use compound indexes** for multi-field queries
5. **Set appropriate TTL indexes** for temporary data like sessions
6. **Regular backups** of production database
7. **Monitor query performance** and optimize slow queries
8. **Implement soft deletes** for important data instead of hard deletes
9. **Use transactions** for operations that modify multiple collections
10. **Validate data** at multiple layers (DTO, entity, database)

---

## Security Considerations

1. **Never store plain-text passwords** - Always hash with bcrypt
2. **Sanitize user inputs** to prevent injection attacks
3. **Use parameterized queries** (TypeORM handles this)
4. **Implement proper access control** at the application level
5. **Encrypt sensitive data** at rest and in transit
6. **Regular security audits** of the database
7. **Least privilege principle** for database users
8. **Monitor for suspicious queries** and access patterns
