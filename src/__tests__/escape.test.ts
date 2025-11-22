/**
 * Tests for HTML escaping utilities
 */

import { escapeHtml, SafeString, isSafeString, ensureSafe } from '../utils/escape';

describe('Escape utilities', () => {
  describe('escapeHtml', () => {
    it('should escape HTML entities', () => {
      expect(escapeHtml('<div>')).toBe('&lt;div&gt;');
      expect(escapeHtml('&')).toBe('&amp;');
      expect(escapeHtml('"quote"')).toBe('&quot;quote&quot;');
      expect(escapeHtml("'quote'")).toBe('&#x27;quote&#x27;');
    });

    it('should escape XSS attempts', () => {
      const xss = '<script>alert("xss")</script>';
      const escaped = escapeHtml(xss);
      expect(escaped).not.toContain('<script>');
      expect(escaped).toContain('&lt;script&gt;');
    });

    it('should handle non-string values', () => {
      expect(escapeHtml(123 as any)).toBe('123');
      expect(escapeHtml(null as any)).toBe('null');
    });
  });

  describe('SafeString', () => {
    it('should create a SafeString', () => {
      const safe = new SafeString('<b>bold</b>');
      expect(safe.value).toBe('<b>bold</b>');
      expect(safe.toString()).toBe('<b>bold</b>');
    });

    it('should be identified by isSafeString', () => {
      const safe = new SafeString('test');
      expect(isSafeString(safe)).toBe(true);
      expect(isSafeString('test')).toBe(false);
    });
  });

  describe('ensureSafe', () => {
    it('should escape when autoEscape is true', () => {
      const result = ensureSafe('<div>', true);
      expect(result).toBe('&lt;div&gt;');
    });

    it('should not escape when autoEscape is false', () => {
      const result = ensureSafe('<div>', false);
      expect(result).toBe('<div>');
    });

    it('should not escape SafeString regardless of autoEscape', () => {
      const safe = new SafeString('<div>');
      expect(ensureSafe(safe, true)).toBe('<div>');
      expect(ensureSafe(safe, false)).toBe('<div>');
    });

    it('should handle null and undefined', () => {
      expect(ensureSafe(null, true)).toBe('');
      expect(ensureSafe(undefined, true)).toBe('');
    });
  });
});
