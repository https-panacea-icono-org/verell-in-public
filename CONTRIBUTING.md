# Contributing to Verell P2P DEX

Thank you for your interest in contributing to Verell! This document provides guidelines and instructions for contributing.

## Code of Conduct

- Be respectful and inclusive
- Focus on constructive feedback
- Help others learn and grow
- Follow project conventions

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/verell-in-public.git`
3. Create a branch: `git checkout -b feature/your-feature-name`
4. Make your changes
5. Test thoroughly
6. Submit a pull request

## Development Setup

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Run tests
npm test

# Run linter
npm run lint

# Start in development mode
npm run dev
```

## Project Structure

```
verell-in-public/
├── contracts/          # Smart contracts (FunC)
├── src/
│   ├── bot/           # Telegram bot
│   ├── api/           # REST API
│   ├── utils/         # Utilities
│   └── types/         # TypeScript types
├── tests/             # Test files
├── docs/              # Documentation
└── scripts/           # Deployment scripts
```

## Making Changes

### Code Style

- Use TypeScript for all new code
- Follow existing code style
- Use meaningful variable names
- Add comments for complex logic
- Keep functions small and focused

### Commit Messages

Follow conventional commits:
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `test:` - Test changes
- `refactor:` - Code refactoring
- `style:` - Formatting changes
- `chore:` - Maintenance tasks

Examples:
```
feat: add support for multiple payment methods
fix: resolve escrow timeout issue
docs: update API documentation
test: add tests for trade manager
```

### Testing

- Write tests for new features
- Ensure all tests pass: `npm test`
- Maintain or improve code coverage
- Test both success and error cases

### Documentation

Update documentation when:
- Adding new features
- Changing APIs
- Modifying configuration
- Adding dependencies

## Pull Request Process

1. **Before submitting:**
   - Run tests: `npm test`
   - Run linter: `npm run lint`
   - Build successfully: `npm run build`
   - Update documentation if needed

2. **PR Description:**
   - Describe what changed and why
   - Reference related issues
   - Include screenshots for UI changes
   - List breaking changes

3. **Review Process:**
   - Address reviewer feedback
   - Keep commits clean and logical
   - Squash commits if needed

## Areas for Contribution

### High Priority

- Database integration (PostgreSQL, MongoDB)
- Enhanced security features
- Dispute resolution system
- Multi-language support
- Additional payment methods

### Features

- User reputation system
- Trade history and statistics
- Price alerts
- Advanced order types
- Mobile app integration

### Improvements

- Performance optimization
- Better error handling
- Enhanced logging
- Code documentation
- Unit test coverage

### Documentation

- More examples
- Video tutorials
- API client libraries
- Deployment guides

## Bug Reports

When reporting bugs, include:

1. **Description**: Clear description of the issue
2. **Steps to reproduce**: Detailed steps
3. **Expected behavior**: What should happen
4. **Actual behavior**: What actually happens
5. **Environment**: 
   - OS and version
   - Node.js version
   - npm version
   - Network (testnet/mainnet)
6. **Logs**: Relevant error messages or logs
7. **Screenshots**: If applicable

## Feature Requests

When requesting features:

1. **Use case**: Explain the problem to solve
2. **Proposed solution**: Describe your idea
3. **Alternatives**: Other approaches considered
4. **Additional context**: Any relevant information

## Smart Contract Changes

Smart contract changes require extra care:

1. **Test extensively** on testnet
2. **Security audit** for critical changes
3. **Gas optimization** considerations
4. **Backward compatibility** if possible
5. **Migration plan** if breaking changes

## Coding Guidelines

### TypeScript

```typescript
// Good
async function getUserTrades(userId: number): Promise<Trade[]> {
  return this.trades.filter(trade => trade.buyerId === userId);
}

// Avoid
function getUserTrades(userId) {
  return this.trades.filter(trade => trade.buyerId == userId);
}
```

### Error Handling

```typescript
// Good
try {
  const result = await tonService.getBalance(address);
  return result;
} catch (error) {
  console.error('Failed to fetch balance:', error);
  throw new Error('Balance fetch failed');
}

// Avoid
const result = await tonService.getBalance(address);
return result;
```

### Comments

```typescript
// Good: Explain complex logic
// Calculate fee based on trade amount and user reputation
const fee = calculateFee(amount, user.reputation);

// Avoid: State the obvious
// Set the user ID
userId = 12345;
```

## Testing Guidelines

### Unit Tests

```typescript
describe('TradeManager', () => {
  let tradeManager: TradeManager;

  beforeEach(() => {
    tradeManager = new TradeManager();
  });

  test('should create order successfully', () => {
    const order = tradeManager.createOrder(/*...*/);
    expect(order).toBeDefined();
    expect(order.status).toBe(OrderStatus.ACTIVE);
  });
});
```

### Integration Tests

Test interactions between components:
- Bot commands → API → Trade Manager
- API → TON Service → Blockchain
- Trade flow from start to finish

## Security

- Never commit secrets or private keys
- Validate all user input
- Use parameterized queries for databases
- Implement rate limiting
- Follow security best practices

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

## Questions?

- Open an issue for general questions
- Join discussions in existing issues
- Check documentation in `docs/` folder

## Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- Project documentation

Thank you for contributing to Verell P2P DEX! 🚀
