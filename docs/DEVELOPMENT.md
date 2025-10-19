# Development Guide

## Overview

This guide helps developers set up their development environment and understand the codebase structure for contributing to the E-Commerce Backend API.

## Table of Contents

- [Development Setup](#development-setup)
- [Project Architecture](#project-architecture)
- [Code Style](#code-style)
- [Adding New Features](#adding-new-features)
- [Testing](#testing)
- [Git Workflow](#git-workflow)
- [Common Tasks](#common-tasks)

---

## Development Setup

### Prerequisites

- Node.js v18 or higher
- npm v9 or higher
- MongoDB (local or cloud instance)
- Git
- Code editor (VS Code recommended)

### Initial Setup

1. **Clone the repository**

```bash
git clone https://github.com/somkheartk/ecommerce-backend.git
cd ecommerce-backend
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

```bash
cp .env.example .env
```

Edit `.env` with your local configuration:

```env
PORT=3000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017
MONGO_DB=ecommerce_dev
JWT_SECRET=dev-secret-key
JWT_EXPIRES_IN=1h
```

4. **Start MongoDB** (if using local instance)

```bash
# macOS with Homebrew
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Windows
net start MongoDB
```

5. **Run the development server**

```bash
npm run start:dev
```

The API will be available at `http://localhost:3000`

### VS Code Setup

#### Recommended Extensions

- ESLint
- Prettier - Code formatter
- REST Client (for testing APIs)
- MongoDB for VS Code
- GitLens

#### VS Code Settings

Create `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "eslint.validate": [
    "javascript",
    "typescript"
  ]
}
```

---

## Project Architecture

### NestJS Modules

The application follows NestJS modular architecture:

```
src/
├── auth/           # Authentication & Authorization
├── users/          # User management
├── products/       # Product catalog
├── orders/         # Order processing
├── entities/       # Database entities (TypeORM)
├── interfaces/     # TypeScript interfaces
├── constants/      # Application constants
├── common/         # Shared utilities
└── main.ts         # Application entry point
```

### Module Structure

Each module typically contains:

```
module-name/
├── dto/                      # Data Transfer Objects
│   ├── create-*.dto.ts
│   └── update-*.dto.ts
├── module-name.controller.ts # HTTP endpoints
├── module-name.service.ts    # Business logic
├── module-name.module.ts     # Module definition
└── *.spec.ts                 # Unit tests
```

### Dependency Injection Flow

```
main.ts
  └── AppModule
      ├── AuthModule
      │   ├── AuthController
      │   └── AuthService
      ├── UsersModule
      │   ├── UsersController
      │   └── UsersService
      ├── ProductsModule
      │   ├── ProductsController
      │   └── ProductsService
      └── OrdersModule
          ├── OrdersController
          └── OrdersService
```

### Request Flow

```
Client Request
    ↓
Controller (validate request)
    ↓
Guard (authentication/authorization)
    ↓
Service (business logic)
    ↓
Repository/Entity (database operations)
    ↓
Response to Client
```

---

## Code Style

### ESLint Configuration

The project uses ESLint for code quality. Configuration is in `eslint.config.mjs`.

Run linting:

```bash
npm run lint
```

Auto-fix issues:

```bash
npm run lint -- --fix
```

### Prettier Configuration

Prettier handles code formatting. Configuration is in `.prettierrc`.

Format code:

```bash
npm run format
```

### TypeScript Guidelines

1. **Use strict types**
```typescript
// Good
function createUser(email: string, name: string): Promise<User> { }

// Avoid
function createUser(email: any, name: any): any { }
```

2. **Define interfaces for complex objects**
```typescript
export interface IUser {
  email: string;
  name: string;
  role: string;
}
```

3. **Use enums for constants**
```typescript
export enum OrderStatus {
  PENDING = 'pending',
  PAID = 'paid',
  SHIPPED = 'shipped',
  CANCELLED = 'cancelled',
}
```

### Naming Conventions

- **Files**: `kebab-case.ts` (e.g., `users.controller.ts`)
- **Classes**: `PascalCase` (e.g., `UsersController`)
- **Interfaces**: `PascalCase` with `I` prefix (e.g., `IUser`)
- **Functions/Methods**: `camelCase` (e.g., `findUserById`)
- **Constants**: `UPPER_SNAKE_CASE` (e.g., `JWT_SECRET`)
- **Variables**: `camelCase` (e.g., `userId`)

---

## Adding New Features

### Creating a New Module

Use NestJS CLI to scaffold a module:

```bash
# Generate module
nest generate module payments

# Generate controller
nest generate controller payments

# Generate service
nest generate service payments
```

Or generate all at once:

```bash
nest generate resource payments
```

### Creating DTOs

Example `create-payment.dto.ts`:

```typescript
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreatePaymentDto {
  @IsNotEmpty()
  @IsString()
  orderId: string;

  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsNotEmpty()
  @IsString()
  paymentMethod: string;
}
```

### Creating Entities

Example `payment.entity.ts`:

```typescript
import { Entity, ObjectIdColumn, Column } from 'typeorm';
import { ObjectId } from 'mongodb';

@Entity()
export class Payment {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  orderId: ObjectId;

  @Column('decimal')
  amount: number;

  @Column()
  paymentMethod: string;

  @Column()
  status: string;

  @Column()
  createdAt: Date;
}
```

### Implementing Service

Example `payments.service.ts`:

```typescript
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from '../entities/payment.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
  ) {}

  async create(dto: CreatePaymentDto): Promise<Payment> {
    const payment = this.paymentRepository.create({
      ...dto,
      createdAt: new Date(),
      status: 'pending',
    });
    return await this.paymentRepository.save(payment);
  }

  async findAll(): Promise<Payment[]> {
    return await this.paymentRepository.find();
  }

  async findOne(id: string): Promise<Payment> {
    const payment = await this.paymentRepository.findOne({
      where: { _id: id as any },
    });
    
    if (!payment) {
      throw new NotFoundException('Payment not found');
    }
    
    return payment;
  }
}
```

### Implementing Controller

Example `payments.controller.ts`:

```typescript
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('payments')
@UseGuards(JwtAuthGuard)
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  create(@Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentsService.create(createPaymentDto);
  }

  @Get()
  findAll() {
    return this.paymentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.paymentsService.findOne(id);
  }
}
```

### Adding Module to App

Update `app.module.ts`:

```typescript
import { PaymentsModule } from './payments/payments.module';

@Module({
  imports: [
    // ... other imports
    PaymentsModule,
  ],
  // ...
})
export class AppModule {}
```

---

## Testing

### Unit Tests

Create test file alongside the service:

`payments.service.spec.ts`:

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { PaymentsService } from './payments.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Payment } from '../entities/payment.entity';

describe('PaymentsService', () => {
  let service: PaymentsService;
  let mockRepository: any;

  beforeEach(async () => {
    mockRepository = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentsService,
        {
          provide: getRepositoryToken(Payment),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<PaymentsService>(PaymentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a payment', async () => {
      const dto = {
        orderId: '123',
        amount: 100,
        paymentMethod: 'card',
      };

      mockRepository.create.mockReturnValue(dto);
      mockRepository.save.mockResolvedValue(dto);

      const result = await service.create(dto);
      expect(result).toEqual(dto);
      expect(mockRepository.create).toHaveBeenCalledWith(
        expect.objectContaining(dto),
      );
    });
  });
});
```

Run tests:

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:cov
```

### E2E Tests

E2E tests are in the `test/` directory:

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('PaymentsController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/payments (POST)', () => {
    return request(app.getHttpServer())
      .post('/payments')
      .send({
        orderId: '123',
        amount: 100,
        paymentMethod: 'card',
      })
      .expect(201);
  });
});
```

Run E2E tests:

```bash
npm run test:e2e
```

---

## Git Workflow

### Branch Naming

- `feature/feature-name` - New features
- `bugfix/bug-description` - Bug fixes
- `hotfix/critical-fix` - Critical production fixes
- `refactor/description` - Code refactoring

### Commit Messages

Follow conventional commits:

```
feat: add payment processing module
fix: resolve order calculation bug
docs: update API documentation
test: add unit tests for payments service
refactor: simplify authentication logic
```

### Workflow

1. **Create a branch**
```bash
git checkout -b feature/payment-processing
```

2. **Make changes and commit**
```bash
git add .
git commit -m "feat: add payment processing"
```

3. **Push to remote**
```bash
git push origin feature/payment-processing
```

4. **Create Pull Request**
- Go to GitHub
- Create PR from your branch to `main`
- Request code review

5. **After approval, merge**
```bash
git checkout main
git pull origin main
```

---

## Common Tasks

### Add New Environment Variable

1. Add to `.env.example`
2. Add to `.env`
3. Access in code via `ConfigService`

```typescript
constructor(private configService: ConfigService) {
  const apiKey = this.configService.get<string>('API_KEY');
}
```

### Add Database Index

```typescript
// In entity file
@Entity()
@Index(['userId', 'status'])
export class Order {
  // ...
}
```

### Add Validation

Use class-validator decorators in DTOs:

```typescript
import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsEnum,
} from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @MinLength(8)
  @MaxLength(50)
  password: string;

  @IsEnum(['user', 'admin'])
  role: string;
}
```

### Add Custom Decorator

```typescript
// decorators/user.decorator.ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);

// Usage in controller
@Get('profile')
getProfile(@CurrentUser() user: User) {
  return user;
}
```

### Add Exception Filter

```typescript
// filters/http-exception.filter.ts
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status = exception.getStatus();

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      message: exception.message,
    });
  }
}
```

### Debug with VS Code

Create `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug NestJS",
      "runtimeArgs": [
        "-r",
        "ts-node/register",
        "-r",
        "tsconfig-paths/register"
      ],
      "args": ["${workspaceFolder}/src/main.ts"],
      "cwd": "${workspaceFolder}",
      "protocol": "inspector",
      "console": "integratedTerminal"
    }
  ]
}
```

---

## Troubleshooting

### Module not found

```bash
npm install
```

### Database connection issues

Check:
- MongoDB is running
- Connection string is correct in `.env`
- Network access is configured (for cloud MongoDB)

### Port already in use

```bash
# Find process using port 3000
lsof -i :3000

# Kill process
kill -9 <PID>

# Or use different port in .env
PORT=3001
```

### TypeORM synchronization errors

Set `synchronize: false` and use migrations for schema changes.

---

## Resources

- [NestJS Documentation](https://docs.nestjs.com/)
- [TypeORM Documentation](https://typeorm.io/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Jest Documentation](https://jestjs.io/docs/getting-started)

---

## Getting Help

- Check existing documentation in `docs/` folder
- Review code comments and examples
- Create an issue on GitHub
- Contact the development team
