/**
 * Tests for template caching
 */

import { TemplateCache } from '../cache';
import { CompiledTemplate } from '../types';

describe('TemplateCache', () => {
  let cache: TemplateCache;

  beforeEach(() => {
    cache = new TemplateCache(3);
  });

  const createMockTemplate = (id: string): CompiledTemplate => ({
    render: () => id,
    source: '',
    ast: { type: 'text', value: '' },
  });

  it('should store and retrieve templates', () => {
    const template = createMockTemplate('test');
    cache.set('key', template);

    expect(cache.has('key')).toBe(true);
    expect(cache.get('key')).toBe(template);
  });

  it('should return undefined for missing keys', () => {
    expect(cache.get('missing')).toBeUndefined();
  });

  it('should evict least recently used when full', () => {
    cache.set('key1', createMockTemplate('1'));
    cache.set('key2', createMockTemplate('2'));
    cache.set('key3', createMockTemplate('3'));

    // Cache is now full (maxSize = 3)
    // Add one more, should evict key1
    cache.set('key4', createMockTemplate('4'));

    expect(cache.has('key1')).toBe(false);
    expect(cache.has('key2')).toBe(true);
    expect(cache.has('key3')).toBe(true);
    expect(cache.has('key4')).toBe(true);
  });

  it('should update access order on get', () => {
    cache.set('key1', createMockTemplate('1'));
    cache.set('key2', createMockTemplate('2'));
    cache.set('key3', createMockTemplate('3'));

    // Access key1 to make it most recently used
    cache.get('key1');

    // Add key4, should evict key2 (least recently used)
    cache.set('key4', createMockTemplate('4'));

    expect(cache.has('key1')).toBe(true);
    expect(cache.has('key2')).toBe(false);
    expect(cache.has('key3')).toBe(true);
    expect(cache.has('key4')).toBe(true);
  });

  it('should clear all entries', () => {
    cache.set('key1', createMockTemplate('1'));
    cache.set('key2', createMockTemplate('2'));

    cache.clear();

    expect(cache.size).toBe(0);
    expect(cache.has('key1')).toBe(false);
    expect(cache.has('key2')).toBe(false);
  });

  it('should track size correctly', () => {
    expect(cache.size).toBe(0);

    cache.set('key1', createMockTemplate('1'));
    expect(cache.size).toBe(1);

    cache.set('key2', createMockTemplate('2'));
    expect(cache.size).toBe(2);

    cache.clear();
    expect(cache.size).toBe(0);
  });
});
