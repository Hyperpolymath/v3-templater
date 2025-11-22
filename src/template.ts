/**
 * Main Template class for v3-templater
 */

import { Parser } from './parser';
import { Compiler } from './compiler';
import { TemplateCache } from './cache';
import { TemplateOptions, CompiledTemplate, FilterFunction, HelperFunction, Plugin } from './types';
import * as fs from 'fs';
import * as path from 'path';

export class Template {
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
    this.compiler = new Compiler(this.options, this.loadTemplate.bind(this));

    // Install plugins
    if (this.options.plugins) {
      for (const plugin of this.options.plugins) {
        plugin.install(this);
      }
    }
  }

  /**
   * Set template directories for file loading
   */
  setTemplateDirs(dirs: string[]): void {
    this.templateDirs = dirs;
  }

  /**
   * Render a template string
   */
  render(template: string, context: Record<string, any> = {}): string {
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
   * Render a template from file
   */
  renderFile(filename: string, context: Record<string, any> = {}): string {
    const template = this.loadTemplate(filename);
    return this.render(template, context);
  }

  /**
   * Compile a template (returns a reusable render function)
   */
  compile(template: string): CompiledTemplate {
    const parser = new Parser(template, this.options.delimiters);
    const ast = parser.parse();
    return this.compiler.compile(ast);
  }

  /**
   * Add a custom filter
   */
  addFilter(name: string, fn: FilterFunction): void {
    if (!this.options.filters) {
      this.options.filters = {};
    }
    this.options.filters[name] = fn;
    this.compiler = new Compiler(this.options, this.loadTemplate.bind(this));
  }

  /**
   * Add a custom helper
   */
  addHelper(name: string, fn: HelperFunction): void {
    if (!this.options.helpers) {
      this.options.helpers = {};
    }
    this.options.helpers[name] = fn;
  }

  /**
   * Clear the template cache
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Load a template from file
   */
  private loadTemplate(filename: string): string {
    // Try absolute path first
    if (path.isAbsolute(filename) && fs.existsSync(filename)) {
      return fs.readFileSync(filename, 'utf-8');
    }

    // Try each template directory
    for (const dir of this.templateDirs) {
      const fullPath = path.join(dir, filename);
      if (fs.existsSync(fullPath)) {
        return fs.readFileSync(fullPath, 'utf-8');
      }
    }

    // Try current directory
    if (fs.existsSync(filename)) {
      return fs.readFileSync(filename, 'utf-8');
    }

    throw new Error(`Template not found: ${filename}`);
  }
}
