/**
 * Basic examples of v3-templater usage
 */

const { Template } = require('../dist/index');

// Example 1: Simple variable interpolation
console.log('=== Example 1: Simple Variables ===');
const template1 = new Template();
const result1 = template1.render('Hello {{ name }}!', { name: 'World' });
console.log(result1);
console.log();

// Example 2: Object properties
console.log('=== Example 2: Object Properties ===');
const template2 = new Template();
const result2 = template2.render(
  'User: {{ user.name }}, Age: {{ user.age }}',
  { user: { name: 'Alice', age: 30 } }
);
console.log(result2);
console.log();

// Example 3: Filters
console.log('=== Example 3: Filters ===');
const template3 = new Template();
const result3 = template3.render(
  '{{ message | upper }} - {{ count | fixed(2) }}',
  { message: 'hello world', count: 3.14159 }
);
console.log(result3);
console.log();

// Example 4: Conditionals
console.log('=== Example 4: Conditionals ===');
const template4 = new Template();
const tmpl4 = `
{% if user.role == "admin" %}
  Welcome, Administrator!
{% elif user.role == "editor" %}
  Welcome, Editor!
{% else %}
  Welcome, User!
{% endif %}
`.trim();

console.log('Admin:', template4.render(tmpl4, { user: { role: 'admin' } }));
console.log('Editor:', template4.render(tmpl4, { user: { role: 'editor' } }));
console.log('User:', template4.render(tmpl4, { user: { role: 'user' } }));
console.log();

// Example 5: Loops
console.log('=== Example 5: Loops ===');
const template5 = new Template();
const tmpl5 = `
Items:
{% for item in items %}
  {{ loop.index1 }}. {{ item }}
{% endfor %}
`.trim();

const result5 = template5.render(tmpl5, {
  items: ['Apple', 'Banana', 'Cherry']
});
console.log(result5);
console.log();

// Example 6: Custom filters
console.log('=== Example 6: Custom Filters ===');
const template6 = new Template();
template6.addFilter('exclaim', (value) => value + '!!!');
template6.addFilter('reverse', (value) => value.split('').reverse().join(''));

const result6 = template6.render(
  '{{ msg | exclaim }} - {{ msg | reverse }}',
  { msg: 'Hello' }
);
console.log(result6);
console.log();

// Example 7: Auto-escaping
console.log('=== Example 7: Auto-escaping ===');
const template7 = new Template();
const xssAttempt = '<script>alert("xss")</script>';

console.log('Escaped:', template7.render('{{ code }}', { code: xssAttempt }));
console.log('Safe:', template7.render('{{ code | safe }}', { code: '<b>Bold</b>' }));
console.log();

// Example 8: Complex template
console.log('=== Example 8: Complex Template ===');
const template8 = new Template();
const tmpl8 = `
<div class="user-card">
  <h2>{{ user.name | title }}</h2>
  <p>Email: {{ user.email }}</p>

  {% if user.premium %}
    <span class="badge">Premium Member</span>
  {% endif %}

  <h3>Recent Orders ({{ user.orders | length }})</h3>
  {% if user.orders %}
    <ul>
      {% for order in user.orders %}
        <li>
          Order #{{ order.id }} - ${{ order.total | fixed(2) }}
          {% if loop.first %}<strong>(Most Recent)</strong>{% endif %}
        </li>
      {% endfor %}
    </ul>
  {% else %}
    <p>No orders yet</p>
  {% endif %}
</div>
`.trim();

const result8 = template8.render(tmpl8, {
  user: {
    name: 'john doe',
    email: 'john@example.com',
    premium: true,
    orders: [
      { id: 103, total: 49.99 },
      { id: 102, total: 29.99 },
      { id: 101, total: 19.99 },
    ],
  },
});
console.log(result8);
console.log();

// Example 9: Compiled templates (performance)
console.log('=== Example 9: Compiled Templates ===');
const template9 = new Template();
const compiled = template9.compile('Hello {{ name }}!');

console.time('Compiled rendering');
for (let i = 0; i < 1000; i++) {
  compiled.render({ name: `User${i}` });
}
console.timeEnd('Compiled rendering');

console.time('Regular rendering');
for (let i = 0; i < 1000; i++) {
  template9.render('Hello {{ name }}!', { name: `User${i}` });
}
console.timeEnd('Regular rendering');
console.log();

console.log('✅ All examples completed!');
