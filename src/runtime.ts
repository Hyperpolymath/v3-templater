/**
 * Runtime evaluation engine for compiled templates
 */

import { Expression, VariableExpression, BinaryExpression, UnaryExpression, LiteralExpression, MemberExpression, CallExpression } from './types';

export class Runtime {
  /**
   * Evaluate an expression in a given context
   */
  static evaluateExpression(expr: Expression, context: Record<string, any>): any {
    switch (expr.type) {
      case 'literal':
        return (expr as LiteralExpression).value;

      case 'variable':
        return this.evaluateVariable(expr as VariableExpression, context);

      case 'binary':
        return this.evaluateBinary(expr as BinaryExpression, context);

      case 'unary':
        return this.evaluateUnary(expr as UnaryExpression, context);

      case 'member':
        return this.evaluateMember(expr as MemberExpression, context);

      case 'call':
        return this.evaluateCall(expr as CallExpression, context);

      default:
        throw new Error(`Unknown expression type: ${(expr as any).type}`);
    }
  }

  private static evaluateVariable(expr: VariableExpression, context: Record<string, any>): any {
    const parts = expr.name.split('.');
    let value = context;

    for (const part of parts) {
      if (value == null) return undefined;
      value = value[part];
    }

    return value;
  }

  private static evaluateBinary(expr: BinaryExpression, context: Record<string, any>): any {
    const left = this.evaluateExpression(expr.left, context);
    const right = this.evaluateExpression(expr.right, context);

    switch (expr.operator) {
      case '+':
        return left + right;
      case '-':
        return left - right;
      case '*':
        return left * right;
      case '/':
        return left / right;
      case '%':
        return left % right;
      case '==':
        return left == right;
      case '!=':
        return left != right;
      case '<':
        return left < right;
      case '<=':
        return left <= right;
      case '>':
        return left > right;
      case '>=':
        return left >= right;
      case 'and':
        return left && right;
      case 'or':
        return left || right;
      default:
        throw new Error(`Unknown operator: ${expr.operator}`);
    }
  }

  private static evaluateUnary(expr: UnaryExpression, context: Record<string, any>): any {
    const arg = this.evaluateExpression(expr.argument, context);

    switch (expr.operator) {
      case '-':
        return -arg;
      case '!':
      case 'not':
        return !arg;
      default:
        throw new Error(`Unknown unary operator: ${expr.operator}`);
    }
  }

  private static evaluateMember(expr: MemberExpression, context: Record<string, any>): any {
    const obj = this.evaluateExpression(expr.object, context);
    if (obj == null) return undefined;
    return obj[expr.property];
  }

  private static evaluateCall(expr: CallExpression, context: Record<string, any>): any {
    const fn = this.evaluateExpression(expr.callee, context);
    if (typeof fn !== 'function') {
      throw new Error('Attempting to call non-function');
    }

    const args = expr.arguments.map((arg) => this.evaluateExpression(arg, context));
    return fn(...args);
  }

  /**
   * Check if a value is truthy in template context
   */
  static isTruthy(value: any): boolean {
    if (value === null || value === undefined || value === false) {
      return false;
    }
    if (Array.isArray(value) && value.length === 0) {
      return false;
    }
    if (typeof value === 'object' && Object.keys(value).length === 0) {
      return false;
    }
    return Boolean(value);
  }

  /**
   * Get an iterable from a value
   */
  static getIterable(value: any): any[] {
    if (Array.isArray(value)) {
      return value;
    }
    if (typeof value === 'object' && value !== null) {
      return Object.entries(value);
    }
    if (typeof value === 'number') {
      return Array.from({ length: value }, (_, i) => i);
    }
    return [];
  }
}
