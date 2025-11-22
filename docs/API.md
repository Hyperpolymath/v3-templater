# API Documentation

## Table of Contents

- [Template Class](#template-class)
- [Types](#types)
- [Filters](#filters)
- [Runtime](#runtime)
- [Utilities](#utilities)

## Template Class

The main class for creating and rendering templates.

### Constructor

```typescript
constructor(options?: TemplateOptions)
```

**Parameters:**

- `options` (optional): Configuration options

```typescript
interface TemplateOptions {
  delimiters?: { start: string; end: string };
  autoEscape?: boolean;
  strictMode?: boolean;
  cache?: boolean;
  filters?: Record<string, FilterFunction>;
  helpers?: Record<string, HelperFunction>;
  plugins?: Plugin[];
}
```

**Example:**

```javascript
const template = new Template({
  autoEscape: true,
  cache: true,
  strictMode: false,
  delimiters: { start: '{{', end: '}}' }
});
```

### Methods

#### render(template, context)

Renders a template string with the given context.

```typescript
render(template: string, context?: Record<string, any>): string
```

**Parameters:**
- `template`: Template string to render
- `context`: Data context for rendering (default: `{}`)

**Returns:** Rendered string

**Example:**

```javascript
const result = template.render('Hello {{ name }}', { name: 'World' });
// Returns: "Hello World"
```

#### renderFile(filename, context)

Renders a template from a file.

```typescript
renderFile(filename: string, context?: Record<string, any>): string
```

**Parameters:**
- `filename`: Path to template file
- `context`: Data context for rendering (default: `{}`)

**Returns:** Rendered string

**Example:**

```javascript
template.setTemplateDirs(['./templates']);
const result = template.renderFile('page.html', { title: 'My Page' });
```

#### compile(template)

Compiles a template into a reusable function.

```typescript
compile(template: string): CompiledTemplate
```

**Parameters:**
- `template`: Template string to compile

**Returns:** CompiledTemplate object with `render` method

**Example:**

```javascript
const compiled = template.compile('Hello {{ name }}');
const result1 = compiled.render({ name: 'Alice' });
const result2 = compiled.render({ name: 'Bob' });
```

#### addFilter(name, fn)

Adds a custom filter.

```typescript
addFilter(name: string, fn: FilterFunction): void
```

**Parameters:**
- `name`: Filter name
- `fn`: Filter function

**Example:**

```javascript
template.addFilter('shout', (value) => value.toUpperCase() + '!!!');
```

#### addHelper(name, fn)

Adds a custom helper function.

```typescript
addHelper(name: string, fn: HelperFunction): void
```

**Parameters:**
- `name`: Helper name
- `fn`: Helper function

**Example:**

```javascript
template.addHelper('formatDate', (date) => {
  return new Date(date).toLocaleDateString();
});
```

#### setTemplateDirs(dirs)

Sets directories for template file loading.

```typescript
setTemplateDirs(dirs: string[]): void
```

**Parameters:**
- `dirs`: Array of directory paths

**Example:**

```javascript
template.setTemplateDirs(['./templates', './views']);
```

#### clearCache()

Clears the compiled template cache.

```typescript
clearCache(): void
```

**Example:**

```javascript
template.clearCache();
```

## Types

### TemplateOptions

Configuration options for the template engine.

```typescript
interface TemplateOptions {
  delimiters?: {
    start: string;  // Default: '{{'
    end: string;    // Default: '}}'
  };
  autoEscape?: boolean;      // Default: true
  strictMode?: boolean;      // Default: false
  cache?: boolean;           // Default: true
  filters?: Record<string, FilterFunction>;
  helpers?: Record<string, HelperFunction>;
  plugins?: Plugin[];
}
```

### FilterFunction

Type for filter functions.

```typescript
type FilterFunction = (value: any, ...args: any[]) => any;
```

**Example:**

```javascript
const myFilter: FilterFunction = (value, prefix = '') => {
  return prefix + value;
};
```

### HelperFunction

Type for helper functions.

```typescript
type HelperFunction = (...args: any[]) => any;
```

### Plugin

Interface for plugins.

```typescript
interface Plugin {
  name: string;
  install: (engine: Template) => void;
}
```

**Example:**

```javascript
const myPlugin = {
  name: 'my-plugin',
  install(engine) {
    engine.addFilter('myFilter', (value) => value);
    engine.addHelper('myHelper', () => 'helper result');
  }
};
```

### CompiledTemplate

Represents a compiled template.

```typescript
interface CompiledTemplate {
  render: (context: Record<string, any>) => string;
  source: string;
  ast: ASTNode;
}
```

## Filters

All built-in filters are available in the `builtinFilters` object.

### String Filters

#### upper

```typescript
upper(value: any): string
```

Converts to uppercase.

```javascript
{{ "hello" | upper }}  // "HELLO"
```

#### lower

```typescript
lower(value: any): string
```

Converts to lowercase.

```javascript
{{ "HELLO" | lower }}  // "hello"
```

#### capitalize

```typescript
capitalize(value: any): string
```

Capitalizes first letter.

```javascript
{{ "hello world" | capitalize }}  // "Hello world"
```

#### title

```typescript
title(value: any): string
```

Capitalizes each word.

```javascript
{{ "hello world" | title }}  // "Hello World"
```

#### trim

```typescript
trim(value: any): string
```

Removes whitespace.

```javascript
{{ "  hello  " | trim }}  // "hello"
```

#### reverse

```typescript
reverse(value: any): any
```

Reverses string or array.

```javascript
{{ "abc" | reverse }}  // "cba"
{{ [1,2,3] | reverse }}  // [3,2,1]
```

#### truncate

```typescript
truncate(value: any, length?: number, suffix?: string): string
```

Truncates to specified length.

```javascript
{{ "Hello World" | truncate(5) }}  // "He..."
{{ "Hello World" | truncate(5, "…") }}  // "Hell…"
```

#### replace

```typescript
replace(value: any, search: string, replacement: string): string
```

Replaces substring.

```javascript
{{ "hello world" | replace("world", "universe") }}  // "hello universe"
```

### Array Filters

#### length

```typescript
length(value: any): number
```

Returns length.

```javascript
{{ [1,2,3] | length }}  // 3
{{ "hello" | length }}  // 5
```

#### join

```typescript
join(value: any, separator?: string): string
```

Joins array elements.

```javascript
{{ ["a","b","c"] | join("-") }}  // "a-b-c"
```

#### first

```typescript
first(value: any): any
```

Returns first element.

```javascript
{{ [1,2,3] | first }}  // 1
```

#### last

```typescript
last(value: any): any
```

Returns last element.

```javascript
{{ [1,2,3] | last }}  // 3
```

#### sort

```typescript
sort(value: any, key?: string): any
```

Sorts array.

```javascript
{{ [3,1,2] | sort }}  // [1,2,3]
{{ users | sort("name") }}  // Sorted by name property
```

#### unique

```typescript
unique(value: any): any
```

Returns unique values.

```javascript
{{ [1,2,2,3] | unique }}  // [1,2,3]
```

#### slice

```typescript
slice(value: any, start?: number, end?: number): any
```

Slices array or string.

```javascript
{{ [1,2,3,4,5] | slice(1, 3) }}  // [2,3]
```

### Number Filters

#### abs

```typescript
abs(value: any): number
```

Returns absolute value.

```javascript
{{ -5 | abs }}  // 5
```

#### round

```typescript
round(value: any): number
```

Rounds number.

```javascript
{{ 3.7 | round }}  // 4
```

#### floor

```typescript
floor(value: any): number
```

Floors number.

```javascript
{{ 3.7 | floor }}  // 3
```

#### ceil

```typescript
ceil(value: any): number
```

Ceils number.

```javascript
{{ 3.2 | ceil }}  // 4
```

#### fixed

```typescript
fixed(value: any, decimals?: number): string
```

Formats with fixed decimals.

```javascript
{{ 3.14159 | fixed(2) }}  // "3.14"
```

#### percent

```typescript
percent(value: any, decimals?: number): string
```

Formats as percentage.

```javascript
{{ 0.5 | percent(0) }}  // "50%"
{{ 0.333 | percent(1) }}  // "33.3%"
```

### Utility Filters

#### default

```typescript
default(value: any, defaultValue: any): any
```

Returns default value if undefined.

```javascript
{{ missing | default("fallback") }}  // "fallback"
```

#### json

```typescript
json(value: any, indent?: number): string
```

Formats as JSON.

```javascript
{{ object | json }}
{{ object | json(4) }}  // 4-space indent
```

#### safe

```typescript
safe(value: any): SafeString
```

Marks string as safe (won't be escaped).

```javascript
{{ html | safe }}
```

#### escape

```typescript
escape(value: any): string
```

Explicitly escapes HTML.

```javascript
{{ userInput | escape }}
```

#### urlencode

```typescript
urlencode(value: any): string
```

URL encodes string.

```javascript
{{ "hello world" | urlencode }}  // "hello%20world"
```

#### urldecode

```typescript
urldecode(value: any): string
```

URL decodes string.

```javascript
{{ "hello%20world" | urldecode }}  // "hello world"
```

#### date

```typescript
date(value: any, format?: string): string
```

Formats date.

```javascript
{{ timestamp | date("iso") }}
{{ timestamp | date("locale") }}
```

## Runtime

The Runtime class handles expression evaluation.

### Static Methods

#### evaluateExpression(expr, context)

```typescript
static evaluateExpression(expr: Expression, context: Record<string, any>): any
```

Evaluates an expression in the given context.

#### isTruthy(value)

```typescript
static isTruthy(value: any): boolean
```

Checks if a value is truthy in template context.

#### getIterable(value)

```typescript
static getIterable(value: any): any[]
```

Converts a value to an iterable array.

## Utilities

### SafeString

Class representing a safe (unescaped) string.

```typescript
class SafeString {
  constructor(value: string);
  value: string;
  toString(): string;
}
```

**Example:**

```javascript
import { SafeString } from 'v3-templater';

const safe = new SafeString('<b>Bold</b>');
// Will not be escaped when rendered
```

### escapeHtml(str)

```typescript
function escapeHtml(str: string): string
```

Escapes HTML entities for XSS protection.

**Example:**

```javascript
import { escapeHtml } from 'v3-templater';

const safe = escapeHtml('<script>alert("xss")</script>');
// Returns: &lt;script&gt;alert("xss")&lt;/script&gt;
```

### Quick Functions

#### createTemplate(options)

```typescript
function createTemplate(options?: TemplateOptions): Template
```

Factory function for creating template instances.

```javascript
import { createTemplate } from 'v3-templater';

const template = createTemplate({ autoEscape: true });
```

#### render(template, context, options)

```typescript
function render(
  template: string,
  context?: Record<string, any>,
  options?: TemplateOptions
): string
```

Quick render utility.

```javascript
import { render } from 'v3-templater';

const result = render('Hello {{ name }}', { name: 'World' });
```
