# Contributing to E-Commerce Backend

Thank you for considering contributing to the E-Commerce Backend API! This document provides guidelines and instructions for contributing.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Commit Message Guidelines](#commit-message-guidelines)
- [Testing Guidelines](#testing-guidelines)

---

## Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inspiring community for all. Please be respectful and constructive in your interactions.

### Our Standards

- Use welcoming and inclusive language
- Be respectful of differing viewpoints
- Accept constructive criticism gracefully
- Focus on what is best for the community
- Show empathy towards others

---

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues to avoid duplicates.

**When submitting a bug report, include:**

- Clear and descriptive title
- Steps to reproduce the issue
- Expected behavior vs actual behavior
- Screenshots if applicable
- Environment details (OS, Node version, etc.)
- Any error messages or logs

**Bug Report Template:**

```markdown
**Description:**
A clear description of the bug

**Steps to Reproduce:**
1. Step 1
2. Step 2
3. Step 3

**Expected Behavior:**
What should happen

**Actual Behavior:**
What actually happens

**Environment:**
- OS: [e.g., macOS 13.0]
- Node.js: [e.g., v18.17.0]
- npm: [e.g., 9.8.1]

**Additional Context:**
Any other relevant information
```

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues.

**When suggesting an enhancement, include:**

- Clear and descriptive title
- Detailed description of the proposed feature
- Use cases and benefits
- Possible implementation approach
- Examples from other projects (if applicable)

### Your First Code Contribution

Unsure where to begin? Look for issues labeled:

- `good first issue` - Simple issues suitable for beginners
- `help wanted` - Issues that need assistance
- `documentation` - Documentation improvements

### Pull Requests

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write or update tests
5. Ensure all tests pass
6. Update documentation
7. Submit a pull request

---

## Development Setup

### Prerequisites

- Node.js v18 or higher
- npm v9 or higher
- MongoDB (local or cloud)
- Git

### Setup Steps

1. **Fork and clone the repository**

```bash
git clone https://github.com/YOUR_USERNAME/ecommerce-backend.git
cd ecommerce-backend
```

2. **Add upstream remote**

```bash
git remote add upstream https://github.com/somkheartk/ecommerce-backend.git
```

3. **Install dependencies**

```bash
npm install
```

4. **Set up environment variables**

```bash
cp .env.example .env
# Edit .env with your configuration
```

5. **Run the development server**

```bash
npm run start:dev
```

6. **Run tests**

```bash
npm run test
```

---

## Pull Request Process

### Before Submitting

- [ ] Code follows the project's style guidelines
- [ ] Self-review of your code completed
- [ ] Code is commented where necessary
- [ ] Documentation updated
- [ ] Tests added/updated
- [ ] All tests pass
- [ ] No lint errors
- [ ] Branch is up to date with main

### Submitting a Pull Request

1. **Create a branch**

```bash
git checkout -b feature/your-feature-name
```

Branch naming conventions:
- `feature/description` - New features
- `bugfix/description` - Bug fixes
- `docs/description` - Documentation changes
- `refactor/description` - Code refactoring
- `test/description` - Test additions/updates

2. **Make your changes**

Write clean, maintainable code following the project's style guide.

3. **Commit your changes**

```bash
git add .
git commit -m "feat: add new feature"
```

Follow [Commit Message Guidelines](#commit-message-guidelines)

4. **Keep your branch updated**

```bash
git fetch upstream
git rebase upstream/main
```

5. **Push to your fork**

```bash
git push origin feature/your-feature-name
```

6. **Open a Pull Request**

Go to the repository on GitHub and click "New Pull Request"

### Pull Request Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests pass
- [ ] E2E tests pass
- [ ] Manual testing completed

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added where needed
- [ ] Documentation updated
- [ ] No new warnings
- [ ] Tests added/updated
- [ ] All tests pass

## Related Issues
Fixes #(issue number)

## Screenshots (if applicable)
Add screenshots here
```

### Review Process

1. At least one maintainer must review the PR
2. All CI checks must pass
3. Address review comments
4. Once approved, a maintainer will merge

---

## Coding Standards

### TypeScript Style

- Use TypeScript strict mode
- Define explicit types (avoid `any`)
- Use interfaces for object shapes
- Use enums for constants

### File Naming

- Use kebab-case: `users.service.ts`
- Test files: `users.service.spec.ts`
- DTO files: `create-user.dto.ts`

### Code Organization

```typescript
// 1. Imports (organized by external, then internal)
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from './users.service';

// 2. Class decorators
@Injectable()
export class MyService {
  // 3. Properties
  private readonly logger: Logger;
  
  // 4. Constructor
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}
  
  // 5. Public methods
  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }
  
  // 6. Private methods
  private validateUser(user: User): boolean {
    return user.email !== null;
  }
}
```

### Naming Conventions

- **Classes**: PascalCase - `UsersController`
- **Methods**: camelCase - `findUserById`
- **Variables**: camelCase - `userId`
- **Constants**: UPPER_SNAKE_CASE - `MAX_RETRY_COUNT`
- **Interfaces**: PascalCase with I prefix - `IUser`
- **Types**: PascalCase - `UserRole`

### Comments

```typescript
// Good: Explain WHY, not WHAT
// Cache user data to avoid repeated database queries
const cachedUser = this.cache.get(userId);

// Bad: Obvious comment
// Get user by id
const user = this.findById(id);
```

### Error Handling

```typescript
// Use NestJS exceptions
throw new NotFoundException('User not found');
throw new BadRequestException('Invalid input');
throw new UnauthorizedException('Invalid credentials');

// Custom error messages
throw new NotFoundException(`User with ID ${id} not found`);
```

### Async/Await

```typescript
// Good: Use async/await
async findUser(id: string): Promise<User> {
  const user = await this.userRepository.findOne({ where: { _id: id } });
  if (!user) {
    throw new NotFoundException('User not found');
  }
  return user;
}

// Avoid: Promise chains when possible
findUser(id: string): Promise<User> {
  return this.userRepository.findOne({ where: { _id: id } })
    .then(user => {
      if (!user) throw new NotFoundException('User not found');
      return user;
    });
}
```

### Validation

Use class-validator decorators:

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

## Commit Message Guidelines

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, no logic change)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks
- `perf`: Performance improvements

### Examples

```
feat(auth): add JWT token refresh endpoint

Add a new endpoint to refresh JWT tokens before expiration.
This improves user experience by avoiding forced logouts.

Closes #123
```

```
fix(orders): correct total calculation for discounted items

Fixed an issue where discount was not properly applied
to the order total calculation.

Fixes #456
```

```
docs(api): update authentication section

Added examples for JWT authentication headers and
improved error response documentation.
```

### Rules

- Use present tense ("add" not "added")
- Use imperative mood ("move" not "moves")
- Don't capitalize first letter
- No period at the end
- Limit first line to 72 characters
- Reference issues in footer

---

## Testing Guidelines

### Unit Tests

- Test each service method
- Mock external dependencies
- Test edge cases and error conditions
- Aim for >80% code coverage

**Example:**

```typescript
describe('UsersService', () => {
  let service: UsersService;
  let repository: MockType<Repository<User>>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getRepositoryToken(User), useFactory: repositoryMockFactory },
      ],
    }).compile();

    service = module.get(UsersService);
    repository = module.get(getRepositoryToken(User));
  });

  describe('findOne', () => {
    it('should return a user when found', async () => {
      const user = { _id: '1', email: 'test@example.com' };
      repository.findOne.mockReturnValue(user);
      
      expect(await service.findOne('1')).toEqual(user);
    });

    it('should throw NotFoundException when user not found', async () => {
      repository.findOne.mockReturnValue(null);
      
      await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
    });
  });
});
```

### E2E Tests

- Test complete request/response cycles
- Test authentication and authorization
- Test error scenarios
- Use test database

**Example:**

```typescript
describe('Users (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/users (GET)', () => {
    return request(app.getHttpServer())
      .get('/users')
      .expect(200)
      .expect((res) => {
        expect(Array.isArray(res.body)).toBe(true);
      });
  });
});
```

### Running Tests

```bash
# Unit tests
npm run test

# Watch mode
npm run test:watch

# Coverage
npm run test:cov

# E2E tests
npm run test:e2e
```

---

## Documentation

### Code Documentation

- Add JSDoc comments for public APIs
- Explain complex logic
- Document function parameters and return types

```typescript
/**
 * Finds a user by their email address
 * @param email - The email address to search for
 * @returns The user object if found
 * @throws NotFoundException if user doesn't exist
 */
async findByEmail(email: string): Promise<User> {
  // implementation
}
```

### API Documentation

When adding new endpoints:

1. Update `docs/API.md`
2. Include request/response examples
3. Document error responses
4. Note authentication requirements

### README Updates

Keep README.md updated with:

- New features
- Changed dependencies
- Updated setup instructions
- New environment variables

---

## Questions?

- Check existing documentation in `docs/` folder
- Search for existing issues
- Open a new issue with your question
- Contact maintainers

---

## License

By contributing, you agree that your contributions will be licensed under the same license as the project (UNLICENSED).

---

## Recognition

Contributors will be recognized in the project README and release notes.

Thank you for contributing! 🎉
