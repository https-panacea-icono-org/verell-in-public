# Contributing to Verell P2P DEX

Thank you for your interest in contributing to Verell! This document provides guidelines and instructions for contributing.

## Code of Conduct

### Our Pledge

We pledge to make participation in our project a harassment-free experience for everyone, regardless of age, body size, disability, ethnicity, gender identity and expression, level of experience, nationality, personal appearance, race, religion, or sexual identity and orientation.

### Our Standards

- Be respectful and inclusive
- Welcome newcomers and help them learn
- Focus on what is best for the community
- Show empathy towards other community members

## How to Contribute

### Reporting Bugs

Before creating bug reports, please check existing issues to avoid duplicates.

**Bug Report Template:**
```markdown
**Describe the bug**
A clear description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '...'
3. See error

**Expected behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment:**
 - OS: [e.g. Ubuntu 22.04]
 - Node.js version: [e.g. 18.16.0]
 - Bot version: [e.g. 1.0.0]

**Additional context**
Any other context about the problem.
```

### Suggesting Enhancements

Enhancement suggestions are welcome! Please provide:

- **Use case**: Describe the problem you're trying to solve
- **Proposed solution**: How you envision the feature working
- **Alternatives**: Other solutions you've considered
- **Additional context**: Mockups, examples, or related features

### Pull Requests

1. **Fork the repository**
   ```bash
   git clone https://github.com/your-username/verell-in-public.git
   cd verell-in-public
   ```

2. **Create a branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```

3. **Make your changes**
   - Write clean, readable code
   - Follow the existing code style
   - Add comments for complex logic
   - Update documentation as needed

4. **Test your changes**
   ```bash
   npm run build
   npm test
   npm run lint
   ```

5. **Commit your changes**
   ```bash
   git commit -m "Add amazing feature"
   ```
   
   Follow conventional commit format:
   - `feat:` New feature
   - `fix:` Bug fix
   - `docs:` Documentation changes
   - `style:` Code style changes
   - `refactor:` Code refactoring
   - `test:` Test updates
   - `chore:` Build/tooling changes

6. **Push to your fork**
   ```bash
   git push origin feature/amazing-feature
   ```

7. **Open a Pull Request**
   - Provide a clear title and description
   - Reference any related issues
   - Include screenshots for UI changes
   - Ensure all tests pass

## Development Guidelines

### Code Style

- Use TypeScript for type safety
- Follow ESLint configuration
- Use meaningful variable names
- Keep functions small and focused
- Add JSDoc comments for public APIs

**Example:**
```typescript
/**
 * Creates a new trade between buyer and seller
 * @param orderId - The order ID to create trade from
 * @param buyerId - Telegram ID of the buyer
 * @param sellerId - Telegram ID of the seller
 * @returns The created trade object
 */
function createTrade(orderId: string, buyerId: number, sellerId: number): Trade {
  // Implementation
}
```

### Smart Contract Development

- Write secure, gas-efficient code
- Add comprehensive tests
- Document all functions and state variables
- Follow TON best practices
- Audit critical functions

### Testing

- Write unit tests for new features
- Maintain high code coverage
- Test edge cases and error conditions
- Include integration tests for APIs

```typescript
describe('OrderBook', () => {
  it('should add order to book', () => {
    const orderBook = new OrderBook();
    const order = createMockOrder();
    orderBook.addOrder(order);
    expect(orderBook.getOrder(order.id)).toBe(order);
  });
});
```

### Documentation

- Update README.md for user-facing changes
- Update API.md for API changes
- Update ARCHITECTURE.md for design changes
- Add inline comments for complex logic
- Include examples in documentation

## Project Structure

```
verell-in-public/
├── contracts/          # Smart contracts
├── src/
│   ├── bot/           # Telegram bot
│   ├── services/      # Business logic
│   ├── types/         # Type definitions
│   └── utils/         # Utilities
├── docs/              # Documentation
└── tests/             # Test files
```

## Git Workflow

### Branch Naming

- `feature/description` - New features
- `fix/description` - Bug fixes
- `docs/description` - Documentation updates
- `refactor/description` - Code refactoring
- `test/description` - Test additions/updates

### Commit Messages

Follow conventional commits:

```
feat(bot): add support for EUR currency

- Add EUR to supported currencies list
- Update payment method validation
- Add EUR-specific formatting

Closes #123
```

## Review Process

1. **Automated Checks**
   - Build must pass
   - Tests must pass
   - Linting must pass
   - Code coverage maintained

2. **Code Review**
   - At least one maintainer approval required
   - Address all review comments
   - Keep discussions professional and constructive

3. **Merge**
   - Squash commits when appropriate
   - Update changelog
   - Tag releases following semver

## Smart Contract Contributions

### Security Requirements

- No known vulnerabilities
- Gas optimization considered
- Proper access controls
- Event emissions for state changes
- Comprehensive testing

### Audit Checklist

- [ ] Integer overflow/underflow protection
- [ ] Reentrancy protection
- [ ] Access control validation
- [ ] Input validation
- [ ] Gas limit considerations
- [ ] Emergency stop mechanism
- [ ] Upgrade strategy documented

## Community

### Communication Channels

- **GitHub Issues**: Bug reports and feature requests
- **GitHub Discussions**: General questions and ideas
- **Telegram**: Real-time chat and support
- **Twitter**: Announcements and updates

### Getting Help

- Read the documentation first
- Search existing issues
- Ask in GitHub Discussions
- Join Telegram community
- Tag maintainers for urgent issues

## Recognition

Contributors are recognized in:
- README.md contributors section
- Release notes
- Project website (when available)

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

## Questions?

Feel free to reach out:
- Open a GitHub Discussion
- Contact maintainers
- Join our Telegram group

Thank you for contributing to Verell! 🚀
