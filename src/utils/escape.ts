/**
 * HTML escaping utilities for XSS protection
 */

const HTML_ENTITIES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#x27;',
  '/': '&#x2F;',
};

const HTML_ENTITY_REGEX = /[&<>"'\/]/g;

/**
 * Escape HTML entities to prevent XSS attacks
 */
export function escapeHtml(str: string): string {
  if (typeof str !== 'string') {
    return String(str);
  }
  return str.replace(HTML_ENTITY_REGEX, (match) => HTML_ENTITIES[match]);
}

/**
 * Mark a string as safe (already escaped)
 */
export class SafeString {
  constructor(public value: string) {}

  toString(): string {
    return this.value;
  }
}

/**
 * Check if value is a SafeString
 */
export function isSafeString(value: any): value is SafeString {
  return value instanceof SafeString;
}

/**
 * Ensure value is properly escaped unless it's marked as safe
 */
export function ensureSafe(value: any, autoEscape: boolean): string {
  if (isSafeString(value)) {
    return value.value;
  }

  const strValue = String(value ?? '');
  return autoEscape ? escapeHtml(strValue) : strValue;
}
