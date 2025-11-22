/**
 * Async template engine for v3-templater
 * Supports async template loading and rendering
 */

import { Parser } from './parser';
import { Compiler } from './compiler';
import { TemplateCache } from './cache';
import { TemplateOptions, CompiledTemplate } from './types';
import * as fs from 'fs/promises';
import * as path from 'path';

export class AsyncTemplate {
  private options: TemplateOptions;
  private compiler: Compiler;
  private cache: TemplateCache;
  private templateDirs: string[] = [];

  constructor(options: TemplateOptions = {}) {
    this.options = {
      autoEscape: true,
      cache: true,
      strictMode: false,
      ...options,
    };

    this.cache = new TemplateCache();
    this.compiler = new Compiler(this.options, this.loadTemplateSync.bind(this));
  }

  /**
   * Set template directories for file loading
   */
  setTemplateDirs(dirs: string[]): void {
    this.templateDirs = dirs;
  }

  /**
   * Render a template string asynchronously
   */
  async render(template: string, context: Record<string, any> = {}): Promise<string> {
    const cacheKey = this.options.cache ? template : '';

    // Check cache
    if (this.options.cache && cacheKey && this.cache.has(cacheKey)) {
      const compiled = this.cache.get(cacheKey);
      if (compiled) {
        return compiled.render(context);
      }
    }

    // Parse and compile
    const parser = new Parser(template, this.options.delimiters);
    const ast = parser.parse();
    const compiled = this.compiler.compile(ast);

    // Cache if enabled
    if (this.options.cache && cacheKey) {
      this.cache.set(cacheKey, compiled);
    }

    return compiled.render(context);
  }

  /**
   * Render a template from file asynchronously
   */
  async renderFile(filename: string, context: Record<string, any> = {}): Promise<string> {
    const template = await this.loadTemplate(filename);
    return this.render(template, context);
  }

  /**
   * Compile a template asynchronously
   */
  async compile(template: string): Promise<CompiledTemplate> {
    const parser = new Parser(template, this.options.delimiters);
    const ast = parser.parse();
    return this.compiler.compile(ast);
  }

  /**
   * Preload and cache multiple templates
   */
  async preload(filenames: string[]): Promise<void> {
    const promises = filenames.map(async (filename) => {
      const template = await this.loadTemplate(filename);
      const parser = new Parser(template, this.options.delimiters);
      const ast = parser.parse();
      const compiled = this.compiler.compile(ast);
      this.cache.set(filename, compiled);
    });

    await Promise.all(promises);
  }

  /**
   * Clear the template cache
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Load a template from file asynchronously
   */
  private async loadTemplate(filename: string): Promise<string> {
    // Try absolute path first
    if (path.isAbsolute(filename)) {
      try {
        return await fs.readFile(filename, 'utf-8');
      } catch {
        // Continue to try other paths
      }
    }

    // Try each template directory
    for (const dir of this.templateDirs) {
      const fullPath = path.join(dir, filename);
      try {
        return await fs.readFile(fullPath, 'utf-8');
      } catch {
        // Continue trying other directories
      }
    }

    // Try current directory
    try {
      return await fs.readFile(filename, 'utf-8');
    } catch {
      throw new Error(`Template not found: ${filename}`);
    }
  }

  /**
   * Synchronous template loading for compiler
   */
  private loadTemplateSync(filename: string): string {
    throw new Error('Sync loading not supported in async mode. Use AsyncTemplate.render() instead.');
  }
}
