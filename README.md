# E-Commerce Backend API

A RESTful API backend for an e-commerce platform built with NestJS, TypeScript, and MongoDB.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Environment Configuration](#environment-configuration)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Authentication & Authorization](#authentication--authorization)
- [Data Models](#data-models)
- [Development](#development)
- [Testing](#testing)
- [Deployment](#deployment)

## Features

- 🔐 JWT-based authentication and authorization
- 👥 User management with role-based access control (Admin/User)
- 🛍️ Product catalog management
- 🛒 Shopping cart functionality
- 📦 Order processing and management
- 🔒 Secure password hashing with bcrypt
- 📊 Pagination support for listing endpoints
- ✅ Input validation with class-validator
- 🗄️ MongoDB database with TypeORM

## Tech Stack

- **Framework:** NestJS 11.x
- **Language:** TypeScript 5.x
- **Database:** MongoDB with TypeORM
- **Authentication:** JWT (JSON Web Tokens)
- **Password Hashing:** bcryptjs
- **Validation:** class-validator, class-transformer
- **Testing:** Jest

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- MongoDB instance (local or cloud)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/somkheartk/ecommerce-backend.git
cd ecommerce-backend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment configuration file:
```bash
cp .env.example .env
```

4. Configure your environment variables in `.env` (see [Environment Configuration](#environment-configuration))

5. Start the development server:
```bash
npm run start:dev
```

The API will be available at `http://localhost:3000`

## Environment Configuration

Create a `.env` file in the root directory with the following variables:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# MongoDB Configuration
MONGO_URI=mongodb://localhost:27017
MONGO_DB=ecommerce

# JWT Configuration
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=1h
```

### Environment Variables Description

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `PORT` | Port number for the server | 3000 | No |
| `NODE_ENV` | Environment mode (development/production) | development | No |
| `MONGO_URI` | MongoDB connection URI | - | Yes |
| `MONGO_DB` | MongoDB database name | - | Yes |
| `JWT_SECRET` | Secret key for JWT token signing | devsecret | Yes (Production) |
| `JWT_EXPIRES_IN` | JWT token expiration time | 1h | No |

## API Documentation

### Base URL

```
http://localhost:3000
```

### Authentication Endpoints

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "code": "0000",
  "message": "Success",
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "_id": "...",
      "email": "user@example.com",
      "name": "User Name",
      "role": "user"
    }
  }
}
```

### User Endpoints

#### Create User
```http
POST /users
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "User Name",
  "role": "user"
}
```

#### Get All Users
```http
GET /users
```

#### Get User by ID
```http
GET /users/:id
```

#### Update User
```http
PUT /users/:id
Content-Type: application/json

{
  "name": "Updated Name",
  "email": "newemail@example.com"
}
```

#### Delete User
```http
DELETE /users/:id
```

### Product Endpoints

All product endpoints require authentication. Admin role is required for create, update, and delete operations.

#### Create Product (Admin only)
```http
POST /products
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Product Name",
  "description": "Product description",
  "price": 99.99,
  "stock": 100,
  "imageUrl": "https://example.com/image.jpg"
}
```

#### Get All Products (Authenticated users)
```http
GET /products
Authorization: Bearer <token>
```

#### Get Product by ID (Authenticated users)
```http
GET /products/:id
Authorization: Bearer <token>
```

#### Update Product (Admin only)
```http
PUT /products/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated Product Name",
  "price": 89.99,
  "stock": 150
}
```

#### Delete Product (Admin only)
```http
DELETE /products/:id
Authorization: Bearer <token>
```

### Order Endpoints

#### Create Order
```http
POST /orders
Content-Type: application/json

{
  "userId": "...",
  "items": ["itemId1", "itemId2"],
  "total": 199.98
}
```

#### Get All Orders (with pagination)
```http
GET /orders?page=1&limit=10
```

**Response:**
```json
{
  "code": "0000",
  "message": "Success",
  "data": [...],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5
  }
}
```

#### Get Order by ID
```http
GET /orders/:id
```

#### Update Order
```http
PUT /orders/:id
Content-Type: application/json

{
  "status": "shipped"
}
```

#### Delete Order
```http
DELETE /orders/:id
```

### Response Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| 0000 | 200 | Success |
| 0001 | 201 | Created |
| 0002 | 200 | Updated |
| 0003 | 200 | Deleted |
| 1000 | 400 | Bad Request |
| 1001 | 401 | Invalid Credentials |
| 1002 | 404 | Order Not Found |

## Project Structure

```
src/
├── auth/                    # Authentication module
│   ├── dto/                # Data transfer objects
│   ├── jwt-auth.guard.ts   # JWT authentication guard
│   ├── roles.guard.ts      # Role-based authorization guard
│   ├── auth.controller.ts  # Auth endpoints
│   ├── auth.service.ts     # Auth business logic
│   └── auth.module.ts      # Auth module definition
├── users/                   # Users module
│   ├── dto/                # DTOs for user operations
│   ├── users.controller.ts # User endpoints
│   ├── users.service.ts    # User business logic
│   └── users.module.ts     # User module definition
├── products/                # Products module
│   ├── dto/                # DTOs for product operations
│   ├── products.controller.ts
│   ├── products.service.ts
│   └── products.module.ts
├── orders/                  # Orders module
│   ├── dto/                # DTOs for order operations
│   ├── orders.controller.ts
│   ├── orders.service.ts
│   └── orders.module.ts
├── entities/                # TypeORM entities
│   ├── user.entity.ts
│   ├── product.entity.ts
│   ├── order.entity.ts
│   ├── cart.entity.ts
│   ├── cart-item.entity.ts
│   └── order-item.entity.ts
├── interfaces/              # TypeScript interfaces
│   ├── user.interface.ts
│   ├── product.interface.ts
│   └── order.interface.ts
├── constants/               # Application constants
│   └── app.constants.ts
├── common/                  # Shared utilities
│   └── response.util.ts
├── app.module.ts           # Root application module
├── app.controller.ts       # Root controller
├── app.service.ts          # Root service
└── main.ts                 # Application entry point
```

## Authentication & Authorization

### Authentication Flow

1. User sends credentials to `/auth/login`
2. Server validates credentials
3. Server generates JWT token
4. Client includes token in `Authorization` header for protected routes

### Role-Based Access Control

The application supports two roles:

- **Admin:** Full access to all operations
- **User:** Limited access to reading data

Role requirements are enforced using guards:

```typescript
@UseGuards(JwtAuthGuard, RolesGuard)
@SetMetadata('roles', [ROLES.ADMIN])
```

## Data Models

### User
```typescript
{
  _id: ObjectId,
  email: string,        // Unique
  passwordHash: string,
  name: string,
  role: string,         // 'admin' or 'user'
  createdAt: Date
}
```

### Product
```typescript
{
  _id: ObjectId,
  name: string,
  description: string,
  price: number,
  stock: number,
  imageUrl: string,
  createdAt: Date
}
```

### Order
```typescript
{
  _id: ObjectId,
  userId: ObjectId,
  items: ObjectId[],
  total: number,
  status: string,       // 'pending' | 'paid' | 'shipped' | 'cancelled'
  createdAt: Date
}
```

## Development

### Available Scripts

```bash
# Development mode with hot reload
npm run start:dev

# Build the project
npm run build

# Start production server
npm run start:prod

# Run linter
npm run lint

# Format code with Prettier
npm run format
```

### Code Style

This project uses ESLint and Prettier for code quality and formatting:

- ESLint configuration: `eslint.config.mjs`
- Prettier configuration: `.prettierrc`

Run linting:
```bash
npm run lint
```

Format code:
```bash
npm run format
```

## Testing

### Run Tests

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov

# Watch mode
npm run test:watch
```

### Test Structure

Tests are located alongside their source files with `.spec.ts` extension:

```
src/
├── users/
│   ├── users.service.ts
│   └── users.service.spec.ts
```

## Deployment

### Production Build

```bash
npm run build
```

The compiled code will be in the `dist/` directory.

### Start Production Server

```bash
npm run start:prod
```

### Environment Considerations

1. Set `NODE_ENV=production`
2. Use a strong `JWT_SECRET`
3. Configure proper MongoDB connection with authentication
4. Enable CORS for your frontend domain
5. Use environment variables for all sensitive data
6. Consider using a process manager like PM2

### Docker Deployment (Optional)

Create a `Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start:prod"]
```

Build and run:
```bash
docker build -t ecommerce-backend .
docker run -p 3000:3000 --env-file .env ecommerce-backend
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the UNLICENSED License.

## Support

For issues and questions, please open an issue on GitHub. 
