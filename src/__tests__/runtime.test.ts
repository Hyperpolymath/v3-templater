/**
 * Tests for Runtime evaluation
 */

import { Runtime } from '../runtime';
import { Expression } from '../types';

describe('Runtime', () => {
  describe('evaluateExpression', () => {
    it('should evaluate literal expressions', () => {
      const expr: Expression = { type: 'literal', value: 42 };
      expect(Runtime.evaluateExpression(expr, {})).toBe(42);
    });

    it('should evaluate variable expressions', () => {
      const expr: Expression = { type: 'variable', name: 'x' };
      expect(Runtime.evaluateExpression(expr, { x: 10 })).toBe(10);
    });

    it('should evaluate nested variables', () => {
      const expr: Expression = { type: 'variable', name: 'user.name' };
      expect(Runtime.evaluateExpression(expr, { user: { name: 'John' } })).toBe('John');
    });

    it('should evaluate binary expressions', () => {
      const expr: Expression = {
        type: 'binary',
        operator: '+',
        left: { type: 'literal', value: 5 },
        right: { type: 'literal', value: 3 },
      };
      expect(Runtime.evaluateExpression(expr, {})).toBe(8);
    });

    it('should evaluate comparison operators', () => {
      const expr: Expression = {
        type: 'binary',
        operator: '>',
        left: { type: 'literal', value: 10 },
        right: { type: 'literal', value: 5 },
      };
      expect(Runtime.evaluateExpression(expr, {})).toBe(true);
    });

    it('should evaluate logical operators', () => {
      const expr: Expression = {
        type: 'binary',
        operator: 'and',
        left: { type: 'literal', value: true },
        right: { type: 'literal', value: false },
      };
      expect(Runtime.evaluateExpression(expr, {})).toBe(false);
    });

    it('should evaluate unary expressions', () => {
      const expr: Expression = {
        type: 'unary',
        operator: 'not',
        argument: { type: 'literal', value: true },
      };
      expect(Runtime.evaluateExpression(expr, {})).toBe(false);
    });

    it('should evaluate member expressions', () => {
      const expr: Expression = {
        type: 'member',
        object: { type: 'variable', name: 'user' },
        property: 'age',
      };
      expect(Runtime.evaluateExpression(expr, { user: { age: 30 } })).toBe(30);
    });
  });

  describe('isTruthy', () => {
    it('should return false for null and undefined', () => {
      expect(Runtime.isTruthy(null)).toBe(false);
      expect(Runtime.isTruthy(undefined)).toBe(false);
    });

    it('should return false for false', () => {
      expect(Runtime.isTruthy(false)).toBe(false);
    });

    it('should return false for empty arrays', () => {
      expect(Runtime.isTruthy([])).toBe(false);
    });

    it('should return false for empty objects', () => {
      expect(Runtime.isTruthy({})).toBe(false);
    });

    it('should return true for non-empty values', () => {
      expect(Runtime.isTruthy(true)).toBe(true);
      expect(Runtime.isTruthy(1)).toBe(true);
      expect(Runtime.isTruthy('hello')).toBe(true);
      expect(Runtime.isTruthy([1])).toBe(true);
      expect(Runtime.isTruthy({ a: 1 })).toBe(true);
    });
  });

  describe('getIterable', () => {
    it('should return array as-is', () => {
      expect(Runtime.getIterable([1, 2, 3])).toEqual([1, 2, 3]);
    });

    it('should convert object to entries', () => {
      expect(Runtime.getIterable({ a: 1, b: 2 })).toEqual([
        ['a', 1],
        ['b', 2],
      ]);
    });

    it('should convert number to range', () => {
      expect(Runtime.getIterable(3)).toEqual([0, 1, 2]);
    });

    it('should return empty array for invalid values', () => {
      expect(Runtime.getIterable(null)).toEqual([]);
      expect(Runtime.getIterable(undefined)).toEqual([]);
    });
  });
});
