/**
 * Core type definitions for v3-templater
 */

export interface TemplateOptions {
  /** Custom delimiters for template syntax */
  delimiters?: {
    start: string;
    end: string;
  };
  /** Enable auto-escaping of HTML entities */
  autoEscape?: boolean;
  /** Enable strict mode (throw on undefined variables) */
  strictMode?: boolean;
  /** Enable template caching */
  cache?: boolean;
  /** Custom filters */
  filters?: Record<string, FilterFunction>;
  /** Custom helpers */
  helpers?: Record<string, HelperFunction>;
  /** Plugin instances */
  plugins?: Plugin[];
}

export type FilterFunction = (value: any, ...args: any[]) => any;
export type HelperFunction = (...args: any[]) => any;

export interface Plugin {
  name: string;
  install: (engine: any) => void;
}

export interface CompiledTemplate {
  render: (context: Record<string, any>) => string;
  source: string;
  ast: ASTNode;
}

export type ASTNode =
  | TextNode
  | VariableNode
  | IfNode
  | ForNode
  | IncludeNode
  | BlockNode
  | ExtendsNode
  | FilterNode;

export interface TextNode {
  type: 'text';
  value: string;
}

export interface VariableNode {
  type: 'variable';
  name: string;
  filters: Array<{ name: string; args: any[] }>;
}

export interface IfNode {
  type: 'if';
  condition: Expression;
  consequent: ASTNode[];
  alternate?: ASTNode[];
  elseIfs?: Array<{ condition: Expression; body: ASTNode[] }>;
}

export interface ForNode {
  type: 'for';
  variable: string;
  iterable: Expression;
  body: ASTNode[];
  indexVar?: string;
}

export interface IncludeNode {
  type: 'include';
  template: string;
  context?: Record<string, any>;
}

export interface BlockNode {
  type: 'block';
  name: string;
  body: ASTNode[];
}

export interface ExtendsNode {
  type: 'extends';
  parent: string;
}

export interface FilterNode {
  type: 'filter';
  name: string;
  args: Expression[];
}

export type Expression =
  | LiteralExpression
  | VariableExpression
  | BinaryExpression
  | UnaryExpression
  | CallExpression
  | MemberExpression;

export interface LiteralExpression {
  type: 'literal';
  value: string | number | boolean | null;
}

export interface VariableExpression {
  type: 'variable';
  name: string;
}

export interface BinaryExpression {
  type: 'binary';
  operator: string;
  left: Expression;
  right: Expression;
}

export interface UnaryExpression {
  type: 'unary';
  operator: string;
  argument: Expression;
}

export interface CallExpression {
  type: 'call';
  callee: Expression;
  arguments: Expression[];
}

export interface MemberExpression {
  type: 'member';
  object: Expression;
  property: string;
}

export interface Token {
  type: TokenType;
  value: string;
  line: number;
  column: number;
}

export enum TokenType {
  TEXT = 'TEXT',
  TAG_START = 'TAG_START',
  TAG_END = 'TAG_END',
  VARIABLE_START = 'VARIABLE_START',
  VARIABLE_END = 'VARIABLE_END',
  IDENTIFIER = 'IDENTIFIER',
  NUMBER = 'NUMBER',
  STRING = 'STRING',
  OPERATOR = 'OPERATOR',
  KEYWORD = 'KEYWORD',
  DOT = 'DOT',
  COMMA = 'COMMA',
  PIPE = 'PIPE',
  LPAREN = 'LPAREN',
  RPAREN = 'RPAREN',
  LBRACKET = 'LBRACKET',
  RBRACKET = 'RBRACKET',
  EOF = 'EOF',
}
