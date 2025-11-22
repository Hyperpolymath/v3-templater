/**
 * Tests for Template class
 */

import { Template } from '../template';

describe('Template', () => {
  let template: Template;

  beforeEach(() => {
    template = new Template();
  });

  describe('Variable interpolation', () => {
    it('should render simple variables', () => {
      const result = template.render('Hello {{ name }}!', { name: 'World' });
      expect(result).toBe('Hello World!');
    });

    it('should render nested object properties', () => {
      const result = template.render('{{ user.name }}', {
        user: { name: 'John' },
      });
      expect(result).toBe('John');
    });

    it('should handle undefined variables gracefully', () => {
      const result = template.render('{{ missing }}', {});
      expect(result).toBe('');
    });

    it('should escape HTML by default', () => {
      const result = template.render('{{ html }}', { html: '<script>alert("xss")</script>' });
      expect(result).toContain('&lt;script&gt;');
    });

    it('should not escape when autoEscape is false', () => {
      const t = new Template({ autoEscape: false });
      const result = t.render('{{ html }}', { html: '<b>bold</b>' });
      expect(result).toBe('<b>bold</b>');
    });
  });

  describe('Filters', () => {
    it('should apply upper filter', () => {
      const result = template.render('{{ name | upper }}', { name: 'hello' });
      expect(result).toBe('HELLO');
    });

    it('should apply lower filter', () => {
      const result = template.render('{{ name | lower }}', { name: 'HELLO' });
      expect(result).toBe('hello');
    });

    it('should apply capitalize filter', () => {
      const result = template.render('{{ name | capitalize }}', { name: 'hello world' });
      expect(result).toBe('Hello world');
    });

    it('should apply title filter', () => {
      const result = template.render('{{ name | title }}', { name: 'hello world' });
      expect(result).toBe('Hello World');
    });

    it('should apply length filter', () => {
      const result = template.render('{{ items | length }}', { items: [1, 2, 3] });
      expect(result).toBe('3');
    });

    it('should apply default filter', () => {
      const result = template.render('{{ missing | default }}', { missing: undefined });
      expect(result).toBe('undefined');
    });

    it('should chain multiple filters', () => {
      const result = template.render('{{ name | lower | capitalize }}', { name: 'HELLO' });
      expect(result).toBe('Hello');
    });

    it('should apply custom filters', () => {
      template.addFilter('exclaim', (value) => value + '!!!');
      const result = template.render('{{ msg | exclaim }}', { msg: 'Hello' });
      expect(result).toBe('Hello!!!');
    });
  });

  describe('Conditionals', () => {
    it('should render if block when condition is true', () => {
      const tmpl = '{% if show %}visible{% endif %}';
      const result = template.render(tmpl, { show: true });
      expect(result).toBe('visible');
    });

    it('should not render if block when condition is false', () => {
      const tmpl = '{% if show %}visible{% endif %}';
      const result = template.render(tmpl, { show: false });
      expect(result).toBe('');
    });

    it('should render else block', () => {
      const tmpl = '{% if show %}yes{% else %}no{% endif %}';
      const result = template.render(tmpl, { show: false });
      expect(result).toBe('no');
    });

    it('should support elif', () => {
      const tmpl = '{% if x == 1 %}one{% elif x == 2 %}two{% else %}other{% endif %}';
      expect(template.render(tmpl, { x: 1 })).toBe('one');
      expect(template.render(tmpl, { x: 2 })).toBe('two');
      expect(template.render(tmpl, { x: 3 })).toBe('other');
    });

    it('should evaluate comparison operators', () => {
      expect(template.render('{% if x > 5 %}yes{% endif %}', { x: 10 })).toBe('yes');
      expect(template.render('{% if x < 5 %}yes{% endif %}', { x: 10 })).toBe('');
      expect(template.render('{% if x == 5 %}yes{% endif %}', { x: 5 })).toBe('yes');
    });

    it('should evaluate logical operators', () => {
      const tmpl = '{% if x > 5 and y < 10 %}yes{% endif %}';
      expect(template.render(tmpl, { x: 6, y: 9 })).toBe('yes');
      expect(template.render(tmpl, { x: 4, y: 9 })).toBe('');
    });
  });

  describe('Loops', () => {
    it('should iterate over arrays', () => {
      const tmpl = '{% for item in items %}{{ item }}{% endfor %}';
      const result = template.render(tmpl, { items: ['a', 'b', 'c'] });
      expect(result).toBe('abc');
    });

    it('should provide loop variables', () => {
      const tmpl = '{% for item in items %}{{ loop.index }}{% endfor %}';
      const result = template.render(tmpl, { items: ['a', 'b', 'c'] });
      expect(result).toBe('012');
    });

    it('should handle loop.first and loop.last', () => {
      const tmpl = '{% for item in items %}{% if loop.first %}F{% endif %}{% if loop.last %}L{% endif %}{% endfor %}';
      const result = template.render(tmpl, { items: ['a', 'b', 'c'] });
      expect(result).toBe('FL');
    });

    it('should handle empty arrays', () => {
      const tmpl = '{% for item in items %}{{ item }}{% endfor %}';
      const result = template.render(tmpl, { items: [] });
      expect(result).toBe('');
    });

    it('should handle nested loops', () => {
      const tmpl = '{% for row in matrix %}{% for col in row %}{{ col }}{% endfor %};{% endfor %}';
      const result = template.render(tmpl, {
        matrix: [
          [1, 2],
          [3, 4],
        ],
      });
      expect(result).toBe('12;34;');
    });
  });

  describe('Caching', () => {
    it('should cache compiled templates', () => {
      const t = new Template({ cache: true });
      const tmpl = 'Hello {{ name }}';

      // First render
      const result1 = t.render(tmpl, { name: 'World' });
      // Second render (should use cache)
      const result2 = t.render(tmpl, { name: 'Cache' });

      expect(result1).toBe('Hello World');
      expect(result2).toBe('Hello Cache');
    });

    it('should clear cache', () => {
      const t = new Template({ cache: true });
      const tmpl = 'Hello {{ name }}';

      t.render(tmpl, { name: 'World' });
      t.clearCache();

      // Should work after clearing cache
      const result = t.render(tmpl, { name: 'New' });
      expect(result).toBe('Hello New');
    });
  });

  describe('Custom delimiters', () => {
    it('should support custom delimiters', () => {
      const t = new Template({
        delimiters: { start: '<%', end: '%>' },
      });

      const result = t.render('Hello <% name %>!', { name: 'World' });
      expect(result).toBe('Hello World!');
    });
  });

  describe('Strict mode', () => {
    it('should throw on undefined variables in strict mode', () => {
      const t = new Template({ strictMode: true });
      expect(() => {
        t.render('{{ missing }}', {});
      }).toThrow();
    });

    it('should throw on unknown filters in strict mode', () => {
      const t = new Template({ strictMode: true });
      expect(() => {
        t.render('{{ value | unknown }}', { value: 'test' });
      }).toThrow();
    });
  });
});
