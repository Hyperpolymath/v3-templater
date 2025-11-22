/**
 * Template compiler for v3-templater
 * Compiles AST into executable render functions
 */

import {
  ASTNode,
  TextNode,
  VariableNode,
  IfNode,
  ForNode,
  IncludeNode,
  BlockNode,
  ExtendsNode,
  CompiledTemplate,
  TemplateOptions,
  FilterFunction,
} from './types';
import { Runtime } from './runtime';
import { ensureSafe } from './utils/escape';
import { builtinFilters } from './filters';

export class Compiler {
  private options: Required<TemplateOptions>;
  private blocks: Map<string, ASTNode[]> = new Map();
  private templateLoader?: (name: string) => string;

  constructor(
    options: TemplateOptions = {},
    templateLoader?: (name: string) => string
  ) {
    this.options = {
      delimiters: options.delimiters ?? { start: '{{', end: '}}' },
      autoEscape: options.autoEscape ?? true,
      strictMode: options.strictMode ?? false,
      cache: options.cache ?? true,
      filters: { ...builtinFilters, ...options.filters },
      helpers: options.helpers ?? {},
      plugins: options.plugins ?? [],
    };
    this.templateLoader = templateLoader;
  }

  /**
   * Compile AST into a render function
   */
  compile(ast: ASTNode[]): CompiledTemplate {
    const renderFn = this.createRenderFunction(ast);

    return {
      render: renderFn,
      source: '', // Could store original template if needed
      ast: ast[0], // Return first node for simplicity
    };
  }

  /**
   * Create a render function from AST
   */
  private createRenderFunction(ast: ASTNode[]): (context: Record<string, any>) => string {
    return (context: Record<string, any>) => {
      return this.renderNodes(ast, context);
    };
  }

  /**
   * Render multiple nodes
   */
  private renderNodes(nodes: ASTNode[], context: Record<string, any>): string {
    let result = '';

    for (const node of nodes) {
      result += this.renderNode(node, context);
    }

    return result;
  }

  /**
   * Render a single node
   */
  private renderNode(node: ASTNode, context: Record<string, any>): string {
    switch (node.type) {
      case 'text':
        return this.renderText(node as TextNode);
      case 'variable':
        return this.renderVariable(node as VariableNode, context);
      case 'if':
        return this.renderIf(node as IfNode, context);
      case 'for':
        return this.renderFor(node as ForNode, context);
      case 'include':
        return this.renderInclude(node as IncludeNode, context);
      case 'block':
        return this.renderBlock(node as BlockNode, context);
      case 'extends':
        return ''; // Handled at template level
      default:
        return '';
    }
  }

  /**
   * Render a text node
   */
  private renderText(node: TextNode): string {
    return node.value;
  }

  /**
   * Render a variable with filters
   */
  private renderVariable(node: VariableNode, context: Record<string, any>): string {
    let value = this.getVariable(node.name, context);

    // Apply filters
    for (const filter of node.filters) {
      const filterFn = this.options.filters[filter.name];
      if (filterFn) {
        value = filterFn(value, ...filter.args);
      } else if (this.options.strictMode) {
        throw new Error(`Unknown filter: ${filter.name}`);
      }
    }

    return ensureSafe(value, this.options.autoEscape);
  }

  /**
   * Render an if statement
   */
  private renderIf(node: IfNode, context: Record<string, any>): string {
    const condition = Runtime.evaluateExpression(node.condition, context);

    if (Runtime.isTruthy(condition)) {
      return this.renderNodes(node.consequent, context);
    }

    // Check elif conditions
    if (node.elseIfs) {
      for (const elseIf of node.elseIfs) {
        const elifCondition = Runtime.evaluateExpression(elseIf.condition, context);
        if (Runtime.isTruthy(elifCondition)) {
          return this.renderNodes(elseIf.body, context);
        }
      }
    }

    // Render else block
    if (node.alternate) {
      return this.renderNodes(node.alternate, context);
    }

    return '';
  }

  /**
   * Render a for loop
   */
  private renderFor(node: ForNode, context: Record<string, any>): string {
    const iterable = Runtime.evaluateExpression(node.iterable, context);
    const items = Runtime.getIterable(iterable);
    let result = '';

    for (let i = 0; i < items.length; i++) {
      const loopContext = {
        ...context,
        [node.variable]: items[i],
        loop: {
          index: i,
          index0: i,
          index1: i + 1,
          first: i === 0,
          last: i === items.length - 1,
          length: items.length,
        },
      };

      if (node.indexVar) {
        loopContext[node.indexVar] = i;
      }

      result += this.renderNodes(node.body, loopContext);
    }

    return result;
  }

  /**
   * Render an include
   */
  private renderInclude(node: IncludeNode, context: Record<string, any>): string {
    if (!this.templateLoader) {
      if (this.options.strictMode) {
        throw new Error('Template loader not configured for includes');
      }
      return '';
    }

    // Load and render the included template
    // This is a simplified implementation
    return `<!-- include: ${node.template} -->`;
  }

  /**
   * Render a block
   */
  private renderBlock(node: BlockNode, context: Record<string, any>): string {
    this.blocks.set(node.name, node.body);
    return this.renderNodes(node.body, context);
  }

  /**
   * Get a variable from context
   */
  private getVariable(name: string, context: Record<string, any>): any {
    const parts = name.split('.');
    let value: any = context;

    for (const part of parts) {
      if (value == null) {
        if (this.options.strictMode) {
          throw new Error(`Undefined variable: ${name}`);
        }
        return '';
      }
      value = value[part];
    }

    if (value === undefined && this.options.strictMode) {
      throw new Error(`Undefined variable: ${name}`);
    }

    return value ?? '';
  }
}
