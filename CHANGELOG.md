# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-01-15

### Added

#### Core Features
- Initial release of v3-templater
- Variable interpolation with dot notation support (`{{ user.name }}`)
- Conditional statements with if/elif/else support
- For loops with loop variables (index, first, last, length)
- Template inheritance with blocks and extends
- Partial templates with includes
- Comprehensive filter system with 30+ built-in filters
- Custom delimiter support
- Plugin system for extensibility
- Template caching with LRU eviction

#### Security
- Automatic HTML escaping to prevent XSS attacks
- SafeString class for marking trusted content
- Strict mode for catching undefined variables
- No use of eval() or Function() constructor

#### Performance
- Fast template compilation
- Smart LRU caching
- Optimized expression evaluation
- Benchmarking suite included

#### Developer Experience
- Full TypeScript support with type definitions
- CLI tool for command-line rendering
- Comprehensive test coverage (80%+)
- Detailed API documentation
- Migration guides from other engines
- Rich examples and use cases

#### Built-in Filters

**String Filters:**
- `upper`, `lower`, `capitalize`, `title`
- `trim`, `reverse`, `truncate`, `replace`, `split`
- `escape`, `safe`, `urlencode`, `urldecode`

**Array Filters:**
- `length`, `join`, `first`, `last`, `reverse`
- `sort`, `unique`, `slice`

**Number Filters:**
- `abs`, `round`, `floor`, `ceil`
- `fixed`, `percent`

**Utility Filters:**
- `default`, `json`, `date`

#### Documentation
- Comprehensive README with examples
- Full API documentation
- Migration guides (Handlebars, EJS, Mustache, Pug, Liquid)
- Contributing guidelines
- Example templates (email, blog, dashboard)

#### Tooling
- Jest testing framework
- ESLint for code quality
- Prettier for code formatting
- TypeScript with strict mode
- GitHub Actions CI/CD
- Benchmark suite

### Development

#### Architecture
- Modular design with separate lexer, parser, compiler, and runtime
- Clean separation of concerns
- Extensible filter and helper system
- Plugin architecture

#### Testing
- Unit tests for all components
- Integration tests for complex scenarios
- Security tests for XSS protection
- Performance benchmarks

### Compared to Other Engines

#### vs Handlebars
- Similar syntax but more powerful conditionals
- Better TypeScript support
- Built-in XSS protection by default
- More built-in filters

#### vs EJS
- Declarative syntax vs embedded JavaScript
- Better security with no arbitrary code execution
- Template inheritance support
- Cleaner syntax for conditionals and loops

#### vs Mustache
- Logic-full vs logic-less
- More powerful conditionals (elif support)
- Rich filter system
- Plugin support

#### vs Pug
- HTML-like syntax vs significant whitespace
- Easier to learn for HTML developers
- Better for mixing with HTML content
- More familiar to users of Liquid/Handlebars

### Known Limitations

- No async filter support (coming in v1.1.0)
- No macro support (planned for v1.2.0)
- No streaming support (planned for v1.3.0)
- Browser build not yet available (coming in v1.1.0)

### Breaking Changes

None (initial release)

### Security

- All user input is automatically escaped by default
- Filters are sandboxed and cannot execute arbitrary code
- Template compilation does not use eval()
- Dependencies are regularly audited

### Performance

Typical performance on modern hardware:
- Simple variables: ~100,000 ops/sec
- With caching: ~500,000+ ops/sec
- Complex templates: ~50,000 ops/sec
- Memory efficient with LRU caching

### Credits

Inspired by and learning from:
- Jinja2 (Python)
- Liquid (Ruby)
- Handlebars (JavaScript)
- Mustache (Multi-language)
- EJS (JavaScript)

### Contributors

- Initial development and architecture
- Comprehensive documentation and examples
- Testing and quality assurance

---

## [Unreleased]

### Planned for v1.1.0
- [ ] Async filter support
- [ ] Browser build (UMD/ESM)
- [ ] Streaming rendering
- [ ] More date formatting options
- [ ] i18n integration helpers

### Planned for v1.2.0
- [ ] Macro support
- [ ] Template debugging tools
- [ ] Source map improvements
- [ ] Performance optimizations
- [ ] Additional built-in filters

### Planned for v1.3.0
- [ ] Template linting
- [ ] Auto-completion support for IDEs
- [ ] Visual template editor
- [ ] Template dependency analysis
- [ ] Hot reloading support

---

[1.0.0]: https://github.com/Hyperpolymath/v3-templater/releases/tag/v1.0.0
