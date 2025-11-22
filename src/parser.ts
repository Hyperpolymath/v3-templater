/**
 * Parser for v3-templater
 * Converts tokens into an Abstract Syntax Tree (AST)
 */

import { Lexer, ExpressionLexer } from './lexer';
import {
  ASTNode,
  TextNode,
  VariableNode,
  IfNode,
  ForNode,
  IncludeNode,
  BlockNode,
  ExtendsNode,
  Expression,
  Token,
  TokenType,
} from './types';

export class Parser {
  private tokens: Token[];
  private position = 0;

  constructor(template: string, delimiters?: { start: string; end: string }) {
    const lexer = new Lexer(template, delimiters);
    this.tokens = lexer.tokenize();
  }

  /**
   * Parse the template into an AST
   */
  parse(): ASTNode[] {
    const nodes: ASTNode[] = [];

    while (!this.isAtEnd()) {
      const node = this.parseNode();
      if (node) {
        nodes.push(node);
      }
    }

    return nodes;
  }

  /**
   * Parse a single node
   */
  private parseNode(): ASTNode | null {
    const token = this.current();

    if (token.type === TokenType.TEXT) {
      return this.parseText();
    }

    if (token.type === TokenType.VARIABLE_START) {
      return this.parseVariable();
    }

    if (token.type === TokenType.TAG_START) {
      return this.parseTag();
    }

    this.advance();
    return null;
  }

  /**
   * Parse a text node
   */
  private parseText(): TextNode {
    const token = this.advance();
    return {
      type: 'text',
      value: token.value,
    };
  }

  /**
   * Parse a variable node {{ variable }}
   */
  private parseVariable(): VariableNode {
    const token = this.advance();
    const exprLexer = new ExpressionLexer(token.value);
    const exprTokens = exprLexer.tokenize();
    const exprParser = new ExpressionParser(exprTokens);

    const parts = token.value.split('|').map((p) => p.trim());
    const varName = parts[0];
    const filters = parts.slice(1).map((f) => {
      const match = f.match(/^(\w+)(?:\((.*)\))?$/);
      if (match) {
        const name = match[1];
        const args = match[2] ? match[2].split(',').map((a) => a.trim()) : [];
        return { name, args };
      }
      return { name: f, args: [] };
    });

    return {
      type: 'variable',
      name: varName,
      filters,
    };
  }

  /**
   * Parse a tag node {% tag %}
   */
  private parseTag(): ASTNode | null {
    const token = this.advance();
    const parts = token.value.split(/\s+/);
    const tagName = parts[0];

    switch (tagName) {
      case 'if':
        return this.parseIf(token.value);
      case 'for':
        return this.parseFor(token.value);
      case 'include':
        return this.parseInclude(token.value);
      case 'block':
        return this.parseBlock(token.value);
      case 'extends':
        return this.parseExtends(token.value);
      default:
        return null;
    }
  }

  /**
   * Parse an if statement
   */
  private parseIf(content: string): IfNode {
    const condition = content.substring(2).trim(); // remove 'if'
    const exprParser = new ExpressionParser(new ExpressionLexer(condition).tokenize());
    const conditionExpr = exprParser.parseExpression();

    const consequent: ASTNode[] = [];
    const elseIfs: Array<{ condition: Expression; body: ASTNode[] }> = [];
    let alternate: ASTNode[] | undefined;

    while (!this.isAtEnd()) {
      const token = this.current();

      if (token.type === TokenType.TAG_START) {
        const tagContent = token.value.trim();

        if (tagContent === 'endif') {
          this.advance();
          break;
        }

        if (tagContent.startsWith('elif')) {
          const elifCondition = tagContent.substring(4).trim();
          const elifExprParser = new ExpressionParser(
            new ExpressionLexer(elifCondition).tokenize()
          );
          this.advance();

          const elifBody: ASTNode[] = [];
          while (!this.isAtEnd()) {
            const nextToken = this.current();
            if (
              nextToken.type === TokenType.TAG_START &&
              (nextToken.value === 'endif' ||
                nextToken.value === 'else' ||
                nextToken.value.startsWith('elif'))
            ) {
              break;
            }
            const node = this.parseNode();
            if (node) elifBody.push(node);
          }

          elseIfs.push({
            condition: elifExprParser.parseExpression(),
            body: elifBody,
          });
          continue;
        }

        if (tagContent === 'else') {
          this.advance();
          alternate = [];
          while (!this.isAtEnd()) {
            const nextToken = this.current();
            if (nextToken.type === TokenType.TAG_START && nextToken.value === 'endif') {
              break;
            }
            const node = this.parseNode();
            if (node) alternate.push(node);
          }
          continue;
        }
      }

      const node = this.parseNode();
      if (node) {
        if (alternate !== undefined) {
          alternate.push(node);
        } else if (elseIfs.length > 0) {
          elseIfs[elseIfs.length - 1].body.push(node);
        } else {
          consequent.push(node);
        }
      }
    }

    return {
      type: 'if',
      condition: conditionExpr,
      consequent,
      elseIfs: elseIfs.length > 0 ? elseIfs : undefined,
      alternate,
    };
  }

  /**
   * Parse a for loop
   */
  private parseFor(content: string): ForNode {
    // {% for item in items %}
    const match = content.match(/for\s+(\w+)(?:\s*,\s*(\w+))?\s+in\s+(.+)/);
    if (!match) {
      throw new Error(`Invalid for loop syntax: ${content}`);
    }

    const variable = match[1];
    const indexVar = match[2];
    const iterableStr = match[3].trim();
    const exprParser = new ExpressionParser(new ExpressionLexer(iterableStr).tokenize());
    const iterable = exprParser.parseExpression();

    const body: ASTNode[] = [];

    while (!this.isAtEnd()) {
      const token = this.current();

      if (token.type === TokenType.TAG_START && token.value === 'endfor') {
        this.advance();
        break;
      }

      const node = this.parseNode();
      if (node) body.push(node);
    }

    return {
      type: 'for',
      variable,
      indexVar,
      iterable,
      body,
    };
  }

  /**
   * Parse an include statement
   */
  private parseInclude(content: string): IncludeNode {
    const match = content.match(/include\s+['"](.+)['"]/);
    if (!match) {
      throw new Error(`Invalid include syntax: ${content}`);
    }

    return {
      type: 'include',
      template: match[1],
    };
  }

  /**
   * Parse a block definition
   */
  private parseBlock(content: string): BlockNode {
    const match = content.match(/block\s+(\w+)/);
    if (!match) {
      throw new Error(`Invalid block syntax: ${content}`);
    }

    const name = match[1];
    const body: ASTNode[] = [];

    while (!this.isAtEnd()) {
      const token = this.current();

      if (token.type === TokenType.TAG_START && token.value === 'endblock') {
        this.advance();
        break;
      }

      const node = this.parseNode();
      if (node) body.push(node);
    }

    return {
      type: 'block',
      name,
      body,
    };
  }

  /**
   * Parse an extends statement
   */
  private parseExtends(content: string): ExtendsNode {
    const match = content.match(/extends\s+['"](.+)['"]/);
    if (!match) {
      throw new Error(`Invalid extends syntax: ${content}`);
    }

    return {
      type: 'extends',
      parent: match[1],
    };
  }

  private current(): Token {
    return this.tokens[this.position];
  }

  private advance(): Token {
    return this.tokens[this.position++];
  }

  private isAtEnd(): boolean {
    return this.position >= this.tokens.length || this.current().type === TokenType.EOF;
  }
}

/**
 * Parser for expressions within tags and variables
 */
export class ExpressionParser {
  private tokens: Token[];
  private position = 0;

  constructor(tokens: Token[]) {
    this.tokens = tokens;
  }

  parseExpression(): Expression {
    return this.parseOr();
  }

  private parseOr(): Expression {
    let left = this.parseAnd();

    while (this.match(TokenType.KEYWORD, 'or')) {
      const operator = this.previous().value;
      const right = this.parseAnd();
      left = {
        type: 'binary',
        operator,
        left,
        right,
      };
    }

    return left;
  }

  private parseAnd(): Expression {
    let left = this.parseEquality();

    while (this.match(TokenType.KEYWORD, 'and')) {
      const operator = this.previous().value;
      const right = this.parseEquality();
      left = {
        type: 'binary',
        operator,
        left,
        right,
      };
    }

    return left;
  }

  private parseEquality(): Expression {
    let left = this.parseComparison();

    while (this.matchOperator('==', '!=')) {
      const operator = this.previous().value;
      const right = this.parseComparison();
      left = {
        type: 'binary',
        operator,
        left,
        right,
      };
    }

    return left;
  }

  private parseComparison(): Expression {
    let left = this.parseTerm();

    while (this.matchOperator('<', '<=', '>', '>=')) {
      const operator = this.previous().value;
      const right = this.parseTerm();
      left = {
        type: 'binary',
        operator,
        left,
        right,
      };
    }

    return left;
  }

  private parseTerm(): Expression {
    let left = this.parseFactor();

    while (this.matchOperator('+', '-')) {
      const operator = this.previous().value;
      const right = this.parseFactor();
      left = {
        type: 'binary',
        operator,
        left,
        right,
      };
    }

    return left;
  }

  private parseFactor(): Expression {
    let left = this.parseUnary();

    while (this.matchOperator('*', '/', '%')) {
      const operator = this.previous().value;
      const right = this.parseUnary();
      left = {
        type: 'binary',
        operator,
        left,
        right,
      };
    }

    return left;
  }

  private parseUnary(): Expression {
    if (this.match(TokenType.KEYWORD, 'not') || this.matchOperator('-', '!')) {
      const operator = this.previous().value;
      const argument = this.parseUnary();
      return {
        type: 'unary',
        operator,
        argument,
      };
    }

    return this.parsePostfix();
  }

  private parsePostfix(): Expression {
    let expr = this.parsePrimary();

    while (true) {
      if (this.match(TokenType.DOT)) {
        const property = this.consume(TokenType.IDENTIFIER, 'Expected property name');
        expr = {
          type: 'member',
          object: expr,
          property: property.value,
        };
      } else if (this.match(TokenType.LBRACKET)) {
        const property = this.consume(TokenType.IDENTIFIER, 'Expected property name');
        this.consume(TokenType.RBRACKET, 'Expected ]');
        expr = {
          type: 'member',
          object: expr,
          property: property.value,
        };
      } else if (this.match(TokenType.LPAREN)) {
        const args: Expression[] = [];
        if (!this.check(TokenType.RPAREN)) {
          do {
            args.push(this.parseExpression());
          } while (this.match(TokenType.COMMA));
        }
        this.consume(TokenType.RPAREN, 'Expected )');
        expr = {
          type: 'call',
          callee: expr,
          arguments: args,
        };
      } else {
        break;
      }
    }

    return expr;
  }

  private parsePrimary(): Expression {
    if (this.match(TokenType.NUMBER)) {
      return {
        type: 'literal',
        value: parseFloat(this.previous().value),
      };
    }

    if (this.match(TokenType.STRING)) {
      return {
        type: 'literal',
        value: this.previous().value,
      };
    }

    if (this.match(TokenType.KEYWORD, 'true')) {
      return { type: 'literal', value: true };
    }

    if (this.match(TokenType.KEYWORD, 'false')) {
      return { type: 'literal', value: false };
    }

    if (this.match(TokenType.KEYWORD, 'null')) {
      return { type: 'literal', value: null };
    }

    if (this.match(TokenType.IDENTIFIER)) {
      return {
        type: 'variable',
        name: this.previous().value,
      };
    }

    if (this.match(TokenType.LPAREN)) {
      const expr = this.parseExpression();
      this.consume(TokenType.RPAREN, 'Expected )');
      return expr;
    }

    throw new Error(`Unexpected token: ${this.current().value}`);
  }

  private match(type: TokenType, value?: string): boolean {
    if (this.check(type)) {
      if (value === undefined || this.current().value === value) {
        this.advance();
        return true;
      }
    }
    return false;
  }

  private matchOperator(...operators: string[]): boolean {
    if (this.check(TokenType.OPERATOR)) {
      if (operators.includes(this.current().value)) {
        this.advance();
        return true;
      }
    }
    return false;
  }

  private check(type: TokenType): boolean {
    if (this.isAtEnd()) return false;
    return this.current().type === type;
  }

  private advance(): Token {
    if (!this.isAtEnd()) this.position++;
    return this.previous();
  }

  private isAtEnd(): boolean {
    return this.current().type === TokenType.EOF;
  }

  private current(): Token {
    return this.tokens[this.position];
  }

  private previous(): Token {
    return this.tokens[this.position - 1];
  }

  private consume(type: TokenType, message: string): Token {
    if (this.check(type)) return this.advance();
    throw new Error(message);
  }
}
