# Migration Guide

This guide helps you migrate from other templating engines to v3-templater.

## Table of Contents

- [From Handlebars](#from-handlebars)
- [From EJS](#from-ejs)
- [From Mustache](#from-mustache)
- [From Pug/Jade](#from-pugjadecontinue)
- [From Liquid](#from-liquid)

## From Handlebars

Handlebars and v3-templater have similar syntax, making migration relatively straightforward.

### Variable Interpolation

**Handlebars:**
```handlebars
{{name}}
{{user.name}}
```

**v3-templater:**
```html
{{ name }}
{{ user.name }}
```

✅ Nearly identical! Just add spaces for consistency.

### Conditionals

**Handlebars:**
```handlebars
{{#if condition}}
  Yes
{{else}}
  No
{{/if}}
```

**v3-templater:**
```html
{% if condition %}
  Yes
{% else %}
  No
{% endif %}
```

⚠️ Use `{% %}` for control flow, `{{ }}` for variables.

### Loops

**Handlebars:**
```handlebars
{{#each items}}
  {{this}}
{{/each}}
```

**v3-templater:**
```html
{% for item in items %}
  {{ item }}
{% endfor %}
```

⚠️ Explicit variable naming instead of `this`.

### Helpers vs Filters

**Handlebars:**
```handlebars
{{uppercase name}}
```

**v3-templater:**
```html
{{ name | upper }}
```

⚠️ Filters use pipe syntax instead of helper syntax.

### Partials vs Includes

**Handlebars:**
```handlebars
{{> header}}
```

**v3-templater:**
```html
{% include "header.html" %}
```

⚠️ Explicit include syntax with filename.

### Custom Helpers

**Handlebars:**
```javascript
Handlebars.registerHelper('loud', function(str) {
  return str.toUpperCase() + '!!!';
});
```

**v3-templater:**
```javascript
template.addFilter('loud', (str) => {
  return str.toUpperCase() + '!!!';
});
```

## From EJS

EJS uses embedded JavaScript, while v3-templater uses a declarative syntax.

### Variable Interpolation

**EJS:**
```ejs
<%= name %>
<%- rawHtml %>
```

**v3-templater:**
```html
{{ name }}
{{ rawHtml | safe }}
```

### Conditionals

**EJS:**
```ejs
<% if (condition) { %>
  Yes
<% } else { %>
  No
<% } %>
```

**v3-templater:**
```html
{% if condition %}
  Yes
{% else %}
  No
{% endif %}
```

### Loops

**EJS:**
```ejs
<% items.forEach(function(item, index) { %>
  <li><%= item %></li>
<% }); %>
```

**v3-templater:**
```html
{% for item in items %}
  <li>{{ item }}</li>
{% endfor %}
```

### Includes

**EJS:**
```ejs
<%- include('header') %>
```

**v3-templater:**
```html
{% include "header.html" %}
```

## From Mustache

Mustache is logic-less, while v3-templater supports more control flow.

### Variables

**Mustache:**
```mustache
{{name}}
{{{rawHtml}}}
```

**v3-templater:**
```html
{{ name }}
{{ rawHtml | safe }}
```

### Conditionals

**Mustache:**
```mustache
{{#show}}
  Visible
{{/show}}
```

**v3-templater:**
```html
{% if show %}
  Visible
{% endif %}
```

### Loops

**Mustache:**
```mustache
{{#items}}
  {{name}}
{{/items}}
```

**v3-templater:**
```html
{% for item in items %}
  {{ item.name }}
{% endfor %}
```

### Inverted Sections

**Mustache:**
```mustache
{{^items}}
  No items
{{/items}}
```

**v3-templater:**
```html
{% if not items %}
  No items
{% endif %}
```

## From Pug/Jade

Pug uses significant whitespace, while v3-templater uses explicit tags.

### Basic Template

**Pug:**
```pug
doctype html
html
  head
    title= title
  body
    h1= heading
    p= content
```

**v3-templater:**
```html
<!DOCTYPE html>
<html>
  <head>
    <title>{{ title }}</title>
  </head>
  <body>
    <h1>{{ heading }}</h1>
    <p>{{ content }}</p>
  </body>
</html>
```

### Conditionals

**Pug:**
```pug
if user
  p Welcome, #{user.name}
else
  p Please log in
```

**v3-templater:**
```html
{% if user %}
  <p>Welcome, {{ user.name }}</p>
{% else %}
  <p>Please log in</p>
{% endif %}
```

### Loops

**Pug:**
```pug
ul
  each item in items
    li= item
```

**v3-templater:**
```html
<ul>
  {% for item in items %}
    <li>{{ item }}</li>
  {% endfor %}
</ul>
```

## From Liquid

Liquid and v3-templater have very similar syntax!

### Variables

**Liquid:**
```liquid
{{ product.title }}
```

**v3-templater:**
```html
{{ product.title }}
```

✅ Identical!

### Filters

**Liquid:**
```liquid
{{ "hello" | upcase }}
```

**v3-templater:**
```html
{{ "hello" | upper }}
```

⚠️ Some filter names differ. See filter mapping below.

### Conditionals

**Liquid:**
```liquid
{% if customer %}
  Welcome back!
{% endif %}
```

**v3-templater:**
```html
{% if customer %}
  Welcome back!
{% endif %}
```

✅ Identical!

### Loops

**Liquid:**
```liquid
{% for product in collection.products %}
  {{ product.title }}
{% endfor %}
```

**v3-templater:**
```html
{% for product in collection.products %}
  {{ product.title }}
{% endfor %}
```

✅ Identical!

### Filter Mapping

| Liquid | v3-templater |
|--------|--------------|
| `upcase` | `upper` |
| `downcase` | `lower` |
| `size` | `length` |
| `strip` | `trim` |
| `lstrip` | Use custom filter |
| `rstrip` | Use custom filter |
| `truncate` | `truncate` |
| `date` | `date` |
| `default` | `default` |

## Common Patterns

### Auto-escaping

v3-templater auto-escapes by default. To output raw HTML:

```html
{{ html | safe }}
```

### Custom Delimiters

If you need different delimiters to avoid conflicts:

```javascript
const template = new Template({
  delimiters: {
    start: '<%',
    end: '%>'
  }
});
```

### Error Handling

Enable strict mode to catch undefined variables:

```javascript
const template = new Template({
  strictMode: true
});
```

### Template Directories

Set up template directories for includes:

```javascript
template.setTemplateDirs([
  './templates',
  './views',
  './partials'
]);
```

## Performance Tips

1. **Enable caching** (enabled by default):
   ```javascript
   const template = new Template({ cache: true });
   ```

2. **Compile once, render many**:
   ```javascript
   const compiled = template.compile(templateString);
   const result1 = compiled.render(data1);
   const result2 = compiled.render(data2);
   ```

3. **Use filters efficiently**:
   ```html
   <!-- Good: Apply filter once -->
   {% for item in items | sort %}
     {{ item }}
   {% endfor %}

   <!-- Avoid: Filtering inside loop -->
   {% for item in items %}
     {{ item | someExpensiveFilter }}
   {% endfor %}
   ```

## Need Help?

- Check the [API Documentation](./API.md)
- See [Examples](../examples/)
- Open an [issue](https://github.com/Hyperpolymath/v3-templater/issues)
