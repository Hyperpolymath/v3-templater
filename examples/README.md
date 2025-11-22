# v3-templater Examples

This directory contains example templates and usage patterns for v3-templater.

## Running Examples

### Basic Examples

```bash
# Run basic examples
npm run build
node examples/basic.js
```

### Email Template Example

```bash
# Using the CLI
npm run build
./dist/cli.js -t examples/email-template.html -d examples/email-data.json -o output.html
```

Or programmatically:

```javascript
const { Template } = require('v3-templater');
const fs = require('fs');

const template = new Template();
template.setTemplateDirs(['./examples']);

const data = JSON.parse(fs.readFileSync('./examples/email-data.json', 'utf-8'));
const html = fs.readFileSync('./examples/email-template.html', 'utf-8');

const result = template.render(html, data);
console.log(result);
```

## Available Examples

### basic.js
Demonstrates core features:
- Variable interpolation
- Filters
- Conditionals
- Loops
- Custom filters
- Auto-escaping
- Performance comparison

### email-template.html
Professional email template showing:
- Order confirmation layout
- Conditional content based on order status
- Dynamic item listing
- Responsive design
- Email best practices

### blog-template.html
Blog post template featuring:
- Article layout
- Author bio
- Tags and categories
- Comments section
- Related posts
- Social sharing
- SEO meta tags

### dashboard-template.html
Analytics dashboard showing:
- Statistics cards
- Data tables
- Progress bars
- Status badges
- System monitoring
- Responsive grid layout

## Template Patterns

### 1. Layout with Inheritance

**base.html:**
```html
<!DOCTYPE html>
<html>
<head>
  <title>{% block title %}Default{% endblock %}</title>
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
  <h1>Hello World</h1>
{% endblock %}
```

### 2. Reusable Components

**header.html:**
```html
<header>
  <h1>{{ site.title }}</h1>
  <nav>
    {% for item in navigation %}
      <a href="{{ item.url }}">{{ item.label }}</a>
    {% endfor %}
  </nav>
</header>
```

**main.html:**
```html
{% include "header.html" %}
<main>
  {{ content }}
</main>
```

### 3. Data-Driven Lists

```html
<ul>
  {% for user in users %}
    <li>
      {{ user.name }} ({{ user.email }})
      {% if user.premium %}⭐{% endif %}
    </li>
  {% else %}
    <li>No users found</li>
  {% endfor %}
</ul>
```

### 4. Conditional Rendering

```html
{% if user.role == "admin" %}
  <button>Admin Panel</button>
{% elif user.role == "moderator" %}
  <button>Moderate</button>
{% else %}
  <button>View Only</button>
{% endif %}
```

### 5. Complex Data Transformation

```html
<!-- Sort and filter data -->
<h2>Top Products</h2>
{% for product in products | sort("sales") | slice(0, 10) %}
  <div>
    {{ loop.index1 }}. {{ product.name }}
    - ${{ product.price | fixed(2) }}
    - {{ product.sales }} sold
  </div>
{% endfor %}
```

### 6. Safe HTML Rendering

```html
<!-- Escaped by default -->
<div>{{ userInput }}</div>

<!-- Explicitly marked as safe -->
<div>{{ trustedHtml | safe }}</div>

<!-- Explicitly escaped -->
<div>{{ possiblyUnsafe | escape }}</div>
```

## Best Practices

### 1. Use Template Directories

```javascript
template.setTemplateDirs([
  './templates',
  './components',
  './layouts'
]);
```

### 2. Cache Compiled Templates

```javascript
const template = new Template({ cache: true });
const compiled = template.compile(templateString);

// Reuse compiled template
const result1 = compiled.render(data1);
const result2 = compiled.render(data2);
```

### 3. Preload Templates for Production

```javascript
const { AsyncTemplate } = require('v3-templater');
const template = new AsyncTemplate();

// Preload all templates at startup
await template.preload([
  'layout.html',
  'header.html',
  'footer.html',
  'home.html'
]);
```

### 4. Use Strict Mode in Development

```javascript
const template = new Template({
  strictMode: process.env.NODE_ENV === 'development'
});
```

### 5. Custom Filters for Domain Logic

```javascript
template.addFilter('currency', (value, code = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: code
  }).format(value);
});

// Usage: {{ price | currency('EUR') }}
```

## Performance Tips

1. **Enable caching in production**
2. **Compile templates once, render many times**
3. **Use async templates for I/O-bound operations**
4. **Preload frequently used templates**
5. **Apply filters outside loops when possible**

## Security Reminders

1. **Auto-escaping is enabled by default** - don't disable unless necessary
2. **Only use `safe` filter on trusted content**
3. **Validate and sanitize all user input**
4. **Use strict mode to catch undefined variables**
5. **Keep dependencies updated**

## Getting Help

- See [API Documentation](../docs/API.md)
- Read [Migration Guide](../docs/MIGRATION.md)
- Check [Contributing Guide](../CONTRIBUTING.md)
- Open an [issue](https://github.com/Hyperpolymath/v3-templater/issues)
