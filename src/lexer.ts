/**
 * Lexical analyzer for v3-templater
 * Converts template strings into tokens
 */

import { Token, TokenType } from './types';

export class Lexer {
  private input: string;
  private position = 0;
  private line = 1;
  private column = 1;
  private delimiters: { start: string; end: string };

  constructor(input: string, delimiters = { start: '{{', end: '}}' }) {
    this.input = input;
    this.delimiters = delimiters;
  }

  /**
   * Tokenize the entire input
   */
  tokenize(): Token[] {
    const tokens: Token[] = [];
    let token: Token | null;

    while ((token = this.nextToken()) !== null) {
      tokens.push(token);
      if (token.type === TokenType.EOF) {
        break;
      }
    }

    return tokens;
  }

  /**
   * Get the next token from input
   */
  private nextToken(): Token | null {
    if (this.position >= this.input.length) {
      return this.createToken(TokenType.EOF, '');
    }

    // Check for tag start: {% %}
    if (this.peek('{%')) {
      return this.readTag();
    }

    // Check for variable start: {{ }}
    if (this.peek(this.delimiters.start)) {
      return this.readVariable();
    }

    // Read text until next delimiter
    return this.readText();
  }

  /**
   * Read a tag block {% ... %}
   */
  private readTag(): Token {
    const start = this.position;
    this.advance(2); // skip '{%'
    this.skipWhitespace();

    const content = this.readUntil('%}');
    this.advance(2); // skip '%}'

    return this.createToken(TokenType.TAG_START, content.trim());
  }

  /**
   * Read a variable block {{ ... }}
   */
  private readVariable(): Token {
    const startLen = this.delimiters.start.length;
    const endLen = this.delimiters.end.length;

    this.advance(startLen);
    this.skipWhitespace();

    const content = this.readUntil(this.delimiters.end);
    this.advance(endLen);

    return this.createToken(TokenType.VARIABLE_START, content.trim());
  }

  /**
   * Read text until next delimiter
   */
  private readText(): Token {
    const start = this.position;
    let text = '';

    while (this.position < this.input.length) {
      if (this.peek('{%') || this.peek(this.delimiters.start)) {
        break;
      }
      text += this.current();
      this.advance(1);
    }

    return this.createToken(TokenType.TEXT, text);
  }

  /**
   * Read until a specific string is found
   */
  private readUntil(str: string): string {
    let result = '';
    while (this.position < this.input.length && !this.peek(str)) {
      result += this.current();
      this.advance(1);
    }
    return result;
  }

  /**
   * Check if current position matches a string
   */
  private peek(str: string): boolean {
    return this.input.substring(this.position, this.position + str.length) === str;
  }

  /**
   * Get current character
   */
  private current(): string {
    return this.input[this.position];
  }

  /**
   * Advance position by n characters
   */
  private advance(n: number): void {
    for (let i = 0; i < n; i++) {
      if (this.input[this.position] === '\n') {
        this.line++;
        this.column = 1;
      } else {
        this.column++;
      }
      this.position++;
    }
  }

  /**
   * Skip whitespace characters
   */
  private skipWhitespace(): void {
    while (this.position < this.input.length && /\s/.test(this.current())) {
      this.advance(1);
    }
  }

  /**
   * Create a token
   */
  private createToken(type: TokenType, value: string): Token {
    return {
      type,
      value,
      line: this.line,
      column: this.column,
    };
  }
}

/**
 * Tokenize a tag content into expression tokens
 */
export class ExpressionLexer {
  private input: string;
  private position = 0;

  constructor(input: string) {
    this.input = input.trim();
  }

  tokenize(): Token[] {
    const tokens: Token[] = [];

    while (this.position < this.input.length) {
      this.skipWhitespace();

      if (this.position >= this.input.length) break;

      const token = this.nextToken();
      if (token) {
        tokens.push(token);
      }
    }

    tokens.push({ type: TokenType.EOF, value: '', line: 1, column: this.position });
    return tokens;
  }

  private nextToken(): Token | null {
    const char = this.current();

    // Operators
    if ('=!<>'.includes(char)) {
      return this.readOperator();
    }

    // Numbers
    if (/\d/.test(char)) {
      return this.readNumber();
    }

    // Strings
    if (char === '"' || char === "'") {
      return this.readString();
    }

    // Identifiers and keywords
    if (/[a-zA-Z_]/.test(char)) {
      return this.readIdentifier();
    }

    // Special characters
    switch (char) {
      case '.':
        this.position++;
        return { type: TokenType.DOT, value: '.', line: 1, column: this.position };
      case ',':
        this.position++;
        return { type: TokenType.COMMA, value: ',', line: 1, column: this.position };
      case '|':
        this.position++;
        return { type: TokenType.PIPE, value: '|', line: 1, column: this.position };
      case '(':
        this.position++;
        return { type: TokenType.LPAREN, value: '(', line: 1, column: this.position };
      case ')':
        this.position++;
        return { type: TokenType.RPAREN, value: ')', line: 1, column: this.position };
      case '[':
        this.position++;
        return { type: TokenType.LBRACKET, value: '[', line: 1, column: this.position };
      case ']':
        this.position++;
        return { type: TokenType.RBRACKET, value: ']', line: 1, column: this.position };
      case '+':
      case '-':
      case '*':
      case '/':
      case '%':
        this.position++;
        return { type: TokenType.OPERATOR, value: char, line: 1, column: this.position };
    }

    this.position++;
    return null;
  }

  private readOperator(): Token {
    let op = this.current();
    this.position++;

    if (this.current() === '=') {
      op += '=';
      this.position++;
    }

    return { type: TokenType.OPERATOR, value: op, line: 1, column: this.position };
  }

  private readNumber(): Token {
    let num = '';
    while (this.position < this.input.length && /[\d.]/.test(this.current())) {
      num += this.current();
      this.position++;
    }
    return { type: TokenType.NUMBER, value: num, line: 1, column: this.position };
  }

  private readString(): Token {
    const quote = this.current();
    this.position++; // skip opening quote
    let str = '';

    while (this.position < this.input.length && this.current() !== quote) {
      if (this.current() === '\\') {
        this.position++;
        if (this.position < this.input.length) {
          str += this.current();
          this.position++;
        }
      } else {
        str += this.current();
        this.position++;
      }
    }

    this.position++; // skip closing quote
    return { type: TokenType.STRING, value: str, line: 1, column: this.position };
  }

  private readIdentifier(): Token {
    let ident = '';
    while (this.position < this.input.length && /[a-zA-Z0-9_]/.test(this.current())) {
      ident += this.current();
      this.position++;
    }

    const keywords = ['if', 'else', 'elif', 'endif', 'for', 'endfor', 'in', 'block', 'endblock', 'extends', 'include', 'true', 'false', 'null', 'and', 'or', 'not'];
    const type = keywords.includes(ident) ? TokenType.KEYWORD : TokenType.IDENTIFIER;

    return { type, value: ident, line: 1, column: this.position };
  }

  private current(): string {
    return this.input[this.position];
  }

  private skipWhitespace(): void {
    while (this.position < this.input.length && /\s/.test(this.current())) {
      this.position++;
    }
  }
}
