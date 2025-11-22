/**
 * Tests for built-in filters
 */

import { builtinFilters } from '../filters';

describe('Built-in Filters', () => {
  describe('String filters', () => {
    it('upper: converts to uppercase', () => {
      expect(builtinFilters.upper('hello')).toBe('HELLO');
    });

    it('lower: converts to lowercase', () => {
      expect(builtinFilters.lower('HELLO')).toBe('hello');
    });

    it('capitalize: capitalizes first letter', () => {
      expect(builtinFilters.capitalize('hello')).toBe('Hello');
    });

    it('title: capitalizes each word', () => {
      expect(builtinFilters.title('hello world')).toBe('Hello World');
    });

    it('trim: removes whitespace', () => {
      expect(builtinFilters.trim('  hello  ')).toBe('hello');
    });

    it('reverse: reverses string', () => {
      expect(builtinFilters.reverse('abc')).toBe('cba');
    });

    it('truncate: truncates long strings', () => {
      expect(builtinFilters.truncate('hello world', 5)).toBe('he...');
    });

    it('replace: replaces substring', () => {
      expect(builtinFilters.replace('hello world', 'world', 'universe')).toBe(
        'hello universe'
      );
    });
  });

  describe('Array filters', () => {
    it('length: returns array length', () => {
      expect(builtinFilters.length([1, 2, 3])).toBe(3);
    });

    it('join: joins array elements', () => {
      expect(builtinFilters.join(['a', 'b', 'c'], '-')).toBe('a-b-c');
    });

    it('first: returns first element', () => {
      expect(builtinFilters.first([1, 2, 3])).toBe(1);
    });

    it('last: returns last element', () => {
      expect(builtinFilters.last([1, 2, 3])).toBe(3);
    });

    it('reverse: reverses array', () => {
      expect(builtinFilters.reverse([1, 2, 3])).toEqual([3, 2, 1]);
    });

    it('sort: sorts array', () => {
      expect(builtinFilters.sort([3, 1, 2])).toEqual([1, 2, 3]);
    });

    it('unique: returns unique values', () => {
      expect(builtinFilters.unique([1, 2, 2, 3, 3, 3])).toEqual([1, 2, 3]);
    });

    it('slice: slices array', () => {
      expect(builtinFilters.slice([1, 2, 3, 4, 5], 1, 3)).toEqual([2, 3]);
    });
  });

  describe('Number filters', () => {
    it('abs: returns absolute value', () => {
      expect(builtinFilters.abs(-5)).toBe(5);
    });

    it('round: rounds number', () => {
      expect(builtinFilters.round(3.7)).toBe(4);
    });

    it('floor: floors number', () => {
      expect(builtinFilters.floor(3.7)).toBe(3);
    });

    it('ceil: ceils number', () => {
      expect(builtinFilters.ceil(3.2)).toBe(4);
    });

    it('fixed: formats with fixed decimals', () => {
      expect(builtinFilters.fixed(3.14159, 2)).toBe('3.14');
    });

    it('percent: formats as percentage', () => {
      expect(builtinFilters.percent(0.5, 0)).toBe('50%');
    });
  });

  describe('Utility filters', () => {
    it('default: returns default value for undefined', () => {
      expect(builtinFilters.default(undefined, 'fallback')).toBe('fallback');
      expect(builtinFilters.default('value', 'fallback')).toBe('value');
    });

    it('json: formats as JSON', () => {
      expect(builtinFilters.json({ a: 1, b: 2 })).toContain('"a"');
    });

    it('urlencode: URL encodes string', () => {
      expect(builtinFilters.urlencode('hello world')).toBe('hello%20world');
    });

    it('urldecode: URL decodes string', () => {
      expect(builtinFilters.urldecode('hello%20world')).toBe('hello world');
    });

    it('escape: escapes HTML entities', () => {
      expect(builtinFilters.escape('<div>')).toContain('&lt;');
    });
  });

  describe('Date filter', () => {
    it('formats date as ISO', () => {
      const date = new Date('2024-01-01T12:00:00Z');
      const result = builtinFilters.date(date, 'iso');
      expect(result).toContain('2024-01-01');
    });

    it('formats date as date string', () => {
      const date = new Date('2024-01-01');
      const result = builtinFilters.date(date, 'date');
      expect(result).toBeTruthy();
    });
  });
});
