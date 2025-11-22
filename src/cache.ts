/**
 * Template caching mechanism
 */

import { CompiledTemplate } from './types';

export class TemplateCache {
  private cache: Map<string, CompiledTemplate> = new Map();
  private maxSize: number;
  private accessOrder: string[] = [];

  constructor(maxSize = 100) {
    this.maxSize = maxSize;
  }

  /**
   * Get a cached template
   */
  get(key: string): CompiledTemplate | undefined {
    const template = this.cache.get(key);
    if (template) {
      // Update LRU order
      this.updateAccessOrder(key);
    }
    return template;
  }

  /**
   * Set a template in cache
   */
  set(key: string, template: CompiledTemplate): void {
    if (this.cache.size >= this.maxSize && !this.cache.has(key)) {
      // Evict least recently used
      const lruKey = this.accessOrder.shift();
      if (lruKey) {
        this.cache.delete(lruKey);
      }
    }

    this.cache.set(key, template);
    this.updateAccessOrder(key);
  }

  /**
   * Check if cache has a key
   */
  has(key: string): boolean {
    return this.cache.has(key);
  }

  /**
   * Clear the cache
   */
  clear(): void {
    this.cache.clear();
    this.accessOrder = [];
  }

  /**
   * Get cache size
   */
  get size(): number {
    return this.cache.size;
  }

  /**
   * Update access order for LRU
   */
  private updateAccessOrder(key: string): void {
    const index = this.accessOrder.indexOf(key);
    if (index > -1) {
      this.accessOrder.splice(index, 1);
    }
    this.accessOrder.push(key);
  }
}
