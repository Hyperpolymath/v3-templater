# Contributing to v3-templater

Thank you for your interest in contributing to v3-templater! This document provides guidelines and instructions for contributing.

## Code of Conduct

This project adheres to a Code of Conduct. By participating, you are expected to uphold this code. Please be respectful and constructive in all interactions.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues to avoid duplicates. When creating a bug report, include:

- **Clear title and description**
- **Steps to reproduce** the issue
- **Expected behavior** vs **actual behavior**
- **Code samples** or test cases
- **Environment details** (Node.js version, OS, etc.)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, include:

- **Clear title and description** of the enhancement
- **Use case** and **motivation** for the feature
- **Examples** of how it would work
- **Alternatives** you've considered

### Pull Requests

1. **Fork the repository** and create your branch from `main`
2. **Make your changes** following our coding standards
3. **Add tests** for new functionality
4. **Update documentation** as needed
5. **Run tests** to ensure everything passes
6. **Submit a pull request**

## Development Setup

### Prerequisites

- Node.js 14.x or higher
- npm or yarn

### Getting Started

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/v3-templater.git
cd v3-templater

# Install dependencies
npm install

# Build the project
npm run build

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run linter
npm run lint

# Fix linting issues
npm run lint:fix

# Run benchmarks
npm run benchmark
```

## Coding Standards

### TypeScript Style Guide

- Use TypeScript for all new code
- Enable strict mode
- Provide type definitions for all public APIs
- Avoid `any` types when possible
- Use meaningful variable and function names

### Code Formatting

We use Prettier for code formatting. Run `npm run format` before committing.

```typescript
// Good
function renderTemplate(template: string, context: Record<string, any>): string {
  // Implementation
}

// Bad
function render(t,c){
  // Implementation
}
```

### Testing

- Write unit tests for all new features
- Maintain 80%+ code coverage
- Use descriptive test names
- Test edge cases and error conditions

```typescript
describe('Feature', () => {
  it('should handle normal case', () => {
    // Test
  });

  it('should handle edge case with empty input', () => {
    // Test
  });

  it('should throw error for invalid input', () => {
    // Test
  });
});
```

### Documentation

- Update README.md for user-facing changes
- Update API.md for API changes
- Add JSDoc comments for public APIs
- Include code examples

```typescript
/**
 * Render a template with the given context
 *
 * @param template - Template string to render
 * @param context - Data context for rendering
 * @returns Rendered string
 *
 * @example
 * ```typescript
 * const result = template.render('Hello {{ name }}', { name: 'World' });
 * ```
 */
render(template: string, context: Record<string, any>): string;
```

## Project Structure

```
v3-templater/
├── src/
│   ├── __tests__/      # Unit tests
│   ├── utils/          # Utility functions
│   ├── lexer.ts        # Lexical analysis
│   ├── parser.ts       # Syntax parsing
│   ├── compiler.ts     # Template compilation
│   ├── runtime.ts      # Runtime evaluation
│   ├── template.ts     # Main Template class
│   ├── filters.ts      # Built-in filters
│   ├── cache.ts        # Template caching
│   ├── types.ts        # Type definitions
│   ├── cli.ts          # CLI tool
│   └── index.ts        # Public API exports
├── docs/               # Documentation
├── examples/           # Example code
├── dist/               # Compiled output
└── package.json
```

## Commit Messages

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
type(scope): subject

body

footer
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Examples

```
feat(filters): add date formatting filter

Adds support for formatting dates with various formats
including ISO, locale, and custom formats.

Closes #123
```

```
fix(parser): handle escaped quotes in strings

Previously, escaped quotes inside string literals would
cause parsing errors. This fix properly handles escape
sequences.

Fixes #456
```

## Adding a New Filter

To add a new built-in filter:

1. Add the filter function to `src/filters.ts`
2. Add tests in `src/__tests__/filters.test.ts`
3. Document in README.md and docs/API.md
4. Add usage examples

Example:

```typescript
// src/filters.ts
export const builtinFilters: Record<string, FilterFunction> = {
  // ... existing filters

  /**
   * Convert string to kebab-case
   */
  kebab: (value: any): string => {
    return String(value)
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]/g, '');
  },
};
```

```typescript
// src/__tests__/filters.test.ts
it('kebab: converts to kebab-case', () => {
  expect(builtinFilters.kebab('Hello World')).toBe('hello-world');
  expect(builtinFilters.kebab('Foo Bar Baz')).toBe('foo-bar-baz');
});
```

## Performance Considerations

- Profile before optimizing
- Run benchmarks for performance-critical changes
- Consider caching opportunities
- Avoid unnecessary object creation in hot paths
- Use efficient algorithms and data structures

## Security Guidelines

- Always sanitize user input
- Test XSS protection thoroughly
- Avoid unsafe eval or Function constructor
- Review dependencies for vulnerabilities
- Document security considerations

## Release Process

Releases are handled by maintainers:

1. Update version in package.json
2. Update CHANGELOG.md
3. Create git tag
4. Push to npm
5. Create GitHub release

## Getting Help

- Check [documentation](./docs/)
- Search [existing issues](https://github.com/Hyperpolymath/v3-templater/issues)
- Ask in [discussions](https://github.com/Hyperpolymath/v3-templater/discussions)

## Recognition

Contributors will be recognized in:
- README.md
- Release notes
- GitHub contributors page

Thank you for contributing to v3-templater! 🎉
