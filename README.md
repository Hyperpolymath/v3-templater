# v3-templater

A modern, secure, and high-performance templating engine for Node.js with TypeScript support.

[![npm version](https://img.shields.io/npm/v/v3-templater.svg)](https://www.npmjs.com/package/v3-templater)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

- 🚀 **High Performance** - Fast compilation and rendering with built-in caching
- 🔒 **Security First** - XSS protection with automatic HTML escaping
- 💪 **TypeScript** - Full TypeScript support with type definitions
- 🎨 **Rich Syntax** - Variables, conditionals, loops, filters, inheritance, and more
- 🔧 **Extensible** - Custom filters, helpers, and plugin system
- 📦 **Zero Dependencies** - Lightweight with minimal footprint
- 🛠️ **CLI Tool** - Command-line interface for quick rendering
- ✅ **Well Tested** - Comprehensive test coverage (80%+)

## Installation

```bash
npm install v3-templater
```

## Quick Start

```javascript
const { Template } = require('v3-templater');

const template = new Template();
const result = template.render('Hello {{ name }}!', { name: 'World' });
console.log(result); // "Hello World!"
```

## Template Syntax

### Variables

```html
{{ variable }}
{{ object.property }}
{{ array.0 }}
```

### Filters

```html
{{ name | upper }}
{{ price | fixed(2) }}
{{ items | length }}
{{ text | truncate(100) }}
```

### Conditionals

```html
{% if user.isAdmin %}
  <p>Admin access granted</p>
{% elif user.isEditor %}
  <p>Editor access granted</p>
{% else %}
  <p>Read-only access</p>
{% endif %}
```

### Loops

```html
{% for item in items %}
  <li>{{ loop.index }}: {{ item }}</li>
{% endfor %}
```

Loop variables:
- `loop.index` - Current iteration (0-indexed)
- `loop.index1` - Current iteration (1-indexed)
- `loop.first` - True if first iteration
- `loop.last` - True if last iteration
- `loop.length` - Total number of items

### Blocks and Inheritance

**base.html:**
```html
<html>
  <head>
    <title>{% block title %}Default Title{% endblock %}</title>
  </head>
  <body>
    {% block content %}{% endblock %}
  </body>
</html>
```

**page.html:**
```html
{% extends "base.html" %}

{% block title %}My Page{% endblock %}

{% block content %}
  <h1>Hello World!</h1>
{% endblock %}
```

### Includes

```html
{% include "header.html" %}
<main>Content here</main>
{% include "footer.html" %}
```

## Built-in Filters

### String Filters
- `upper` - Convert to uppercase
- `lower` - Convert to lowercase
- `capitalize` - Capitalize first letter
- `title` - Capitalize each word
- `trim` - Remove whitespace
- `reverse` - Reverse string
- `truncate(length, suffix)` - Truncate to length
- `replace(search, replacement)` - Replace substring

### Array Filters
- `length` - Get length
- `join(separator)` - Join elements
- `first` - Get first element
- `last` - Get last element
- `reverse` - Reverse array
- `sort(key)` - Sort array
- `unique` - Get unique values
- `slice(start, end)` - Slice array

### Number Filters
- `abs` - Absolute value
- `round` - Round number
- `floor` - Floor number
- `ceil` - Ceil number
- `fixed(decimals)` - Fixed decimal places
- `percent(decimals)` - Format as percentage

### Utility Filters
- `default(value)` - Default value if undefined
- `json(indent)` - Format as JSON
- `safe` - Mark as safe (no escaping)
- `escape` - Explicitly escape HTML
- `urlencode` - URL encode
- `urldecode` - URL decode
- `date(format)` - Format date

## API

### Creating a Template Engine

```javascript
const { Template } = require('v3-templater');

const template = new Template({
  autoEscape: true,      // Auto-escape HTML (default: true)
  cache: true,           // Enable caching (default: true)
  strictMode: false,     // Throw on undefined vars (default: false)
  delimiters: {          // Custom delimiters
    start: '{{',
    end: '}}'
  }
});
```

### Rendering Templates

```javascript
// Render from string
const result = template.render('Hello {{ name }}', { name: 'World' });

// Render from file
template.setTemplateDirs(['./templates']);
const result = template.renderFile('page.html', { title: 'My Page' });

// Compile for reuse
const compiled = template.compile('Hello {{ name }}');
const result1 = compiled.render({ name: 'Alice' });
const result2 = compiled.render({ name: 'Bob' });
```

### Custom Filters

```javascript
template.addFilter('reverse', (value) => {
  return value.split('').reverse().join('');
});

template.render('{{ text | reverse }}', { text: 'hello' });
// Output: "olleh"
```

### Custom Helpers

```javascript
template.addHelper('formatCurrency', (value, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency
  }).format(value);
});
```

### Plugins

```javascript
const myPlugin = {
  name: 'my-plugin',
  install(engine) {
    // Add filters, helpers, etc.
    engine.addFilter('myFilter', (value) => value);
  }
};

const template = new Template({
  plugins: [myPlugin]
});
```

## CLI Usage

```bash
# Basic usage
v3t -t template.html -d data.json

# Output to file
v3t -t template.html -d data.json -o output.html

# Disable auto-escaping
v3t -t template.html -d data.json --no-escape

# Enable strict mode
v3t -t template.html -d data.json --strict

# Show help
v3t --help

# Show version
v3t --version
```

## Examples

### Email Template

```javascript
const emailTemplate = `
  <html>
    <body>
      <h1>Hello {{ user.name | capitalize }}!</h1>

      {% if order %}
        <p>Your order #{{ order.id }} has been confirmed.</p>

        <h2>Order Details:</h2>
        <ul>
          {% for item in order.items %}
            <li>{{ item.name }} - ${{ item.price | fixed(2) }}</li>
          {% endfor %}
        </ul>

        <p><strong>Total: ${{ order.total | fixed(2) }}</strong></p>
      {% endif %}

      <p>Thank you for your business!</p>
    </body>
  </html>
`;

const result = template.render(emailTemplate, {
  user: { name: 'john doe' },
  order: {
    id: 12345,
    items: [
      { name: 'Widget', price: 19.99 },
      { name: 'Gadget', price: 29.99 }
    ],
    total: 49.98
  }
});
```

### Blog Post

```javascript
const blogTemplate = `
  <article>
    <h1>{{ post.title }}</h1>
    <p class="meta">
      By {{ post.author }} on {{ post.date | date('locale') }}
    </p>

    <div class="content">
      {{ post.content }}
    </div>

    {% if post.tags %}
      <div class="tags">
        {% for tag in post.tags %}
          <span class="tag">{{ tag }}</span>
        {% endfor %}
      </div>
    {% endif %}

    <h2>Comments ({{ post.comments | length }})</h2>
    {% for comment in post.comments %}
      <div class="comment">
        <strong>{{ comment.author }}</strong>
        <p>{{ comment.text }}</p>
      </div>
    {% endfor %}
  </article>
`;
```

## Security

v3-templater takes security seriously:

- **Auto-escaping**: HTML entities are automatically escaped by default to prevent XSS attacks
- **SafeString**: Use the `safe` filter to mark trusted content
- **Strict Mode**: Enable strict mode to catch undefined variables
- **No Eval**: Templates are compiled without using `eval()` or `Function()` constructor

```javascript
// Unsafe input is automatically escaped
template.render('{{ userInput }}', {
  userInput: '<script>alert("xss")</script>'
});
// Output: &lt;script&gt;alert("xss")&lt;/script&gt;

// Mark as safe if you trust the content
template.render('{{ html | safe }}', {
  html: '<b>Bold text</b>'
});
// Output: <b>Bold text</b>
```

## Performance

v3-templater is designed for high performance:

- **Compiled Templates**: Templates are compiled to optimized JavaScript
- **Smart Caching**: LRU cache for compiled templates
- **Minimal Overhead**: Lightweight parser and runtime
- **Benchmarks**: Run `npm run benchmark` to see performance metrics

Typical performance (on modern hardware):
- Simple variables: ~100,000 ops/sec
- With caching: ~500,000+ ops/sec
- Complex templates: ~50,000 ops/sec

## Comparison with Other Engines

| Feature | v3-templater | Handlebars | EJS | Pug |
|---------|-------------|------------|-----|-----|
| Auto-escaping | ✅ | ✅ | ❌ | ✅ |
| Inheritance | ✅ | Partial | ❌ | ✅ |
| TypeScript | ✅ | ⚠️ | ⚠️ | ⚠️ |
| Performance | Fast | Fast | Very Fast | Medium |
| Learning Curve | Easy | Easy | Very Easy | Medium |
| Extensibility | ✅ | ✅ | Limited | ✅ |

## Contributing

Contributions are welcome! Please read our contributing guidelines and submit pull requests.

## License

MIT License - see LICENSE file for details

## Roadmap

- [ ] Async template loading
- [ ] Streaming support
- [ ] Browser build
- [ ] More built-in filters
- [ ] Template debugging tools
- [ ] Performance optimizations
- [ ] Macro support
- [ ] i18n integration

## Support

- 📖 [Documentation](https://github.com/Hyperpolymath/v3-templater#readme)
- 🐛 [Issue Tracker](https://github.com/Hyperpolymath/v3-templater/issues)
- 💬 [Discussions](https://github.com/Hyperpolymath/v3-templater/discussions)

## Acknowledgments

Inspired by Jinja2, Liquid, Handlebars, and other great templating engines.
