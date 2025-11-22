/**
 * v3-templater - A modern, secure, and high-performance templating engine
 * @module v3-templater
 */

export { Template } from './template';
export { AsyncTemplate } from './async-template';
export { SafeString } from './utils/escape';
export { builtinFilters } from './filters';
export {
  TemplateOptions,
  FilterFunction,
  HelperFunction,
  Plugin,
  CompiledTemplate,
  ASTNode,
} from './types';

import { Template } from './template';
import { AsyncTemplate } from './async-template';
import { TemplateOptions } from './types';

/**
 * Create a new template instance
 */
export function createTemplate(options?: TemplateOptions): Template {
  return new Template(options);
}

/**
 * Create a new async template instance
 */
export function createAsyncTemplate(options?: TemplateOptions): AsyncTemplate {
  return new AsyncTemplate(options);
}

/**
 * Quick render utility
 */
export function render(template: string, context: Record<string, any> = {}, options?: TemplateOptions): string {
  const t = new Template(options);
  return t.render(template, context);
}

/**
 * Quick async render utility
 */
export async function renderAsync(
  template: string,
  context: Record<string, any> = {},
  options?: TemplateOptions
): Promise<string> {
  const t = new AsyncTemplate(options);
  return t.render(template, context);
}

// Default export
export default {
  Template,
  AsyncTemplate,
  createTemplate,
  createAsyncTemplate,
  render,
  renderAsync,
};
