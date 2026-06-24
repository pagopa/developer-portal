/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable functional/no-this-expressions */
/* eslint-disable functional/no-return-void */
/* eslint-disable functional/no-classes */
/* eslint-disable functional/prefer-property-signatures */
/* eslint-disable functional/prefer-readonly-type */
/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-expression-statements */
/**
 * DISCLAIMER: This file is a custom implementation of a token class for Markdoc processing, designed to be compatible with CommonJS modules and Jest testing framework:
 * This file defines a LocalToken class that implements the TokenLike interface, which is used to represent tokens in the Markdoc parsing process.
 * The LocalToken class provides methods for managing token attributes and cloning tokens.
 * The cloneToken function creates a new instance of LocalToken with the same properties as the original token.
 * This implementation allows for the creation and manipulation of tokens without relying on the internal Token class of Markdoc.
 * Previously, this package was using the Token class implementation from Markdoc in an unconventional way, but after upgrading to markdoc-it 14 the library moved to mjs modules which are not compatible with CommonJS modules and caused incompatibilities with Jest.
 * This implementation of LocalToken allows us to avoid these issues while still providing the necessary functionality for token manipulation during Markdoc processing.
 */

export type TokenNesting = 1 | 0 | -1;
export type TokenAttribute = [string, string];

export interface TokenLike {
  type: string;
  tag: string;
  attrs: Array<TokenAttribute> | null;
  map: [number, number] | null;
  nesting: TokenNesting;
  level: number;
  children: Array<TokenLike> | null;
  content: string;
  markup: string;
  info: string;
  meta: unknown;
  block: boolean;
  hidden: boolean;
  errors?: unknown[];
  position?: {
    start?: number;
    end?: number;
  };
  attrIndex(name: string): number;
  attrPush(attrData: TokenAttribute): void;
  attrSet(name: string, value: string): void;
  attrGet(name: string): string | null;
  attrJoin(name: string, value: string): void;
}

export type TokenConstructor = new (
  type: string,
  tag: string,
  nesting: TokenNesting
) => TokenLike;

export class LocalToken implements TokenLike {
  type: string;
  tag: string;
  attrs: Array<TokenAttribute> | null;
  map: [number, number] | null;
  nesting: TokenNesting;
  level: number;
  children: Array<TokenLike> | null;
  content: string;
  markup: string;
  info: string;
  meta: unknown;
  block: boolean;
  hidden: boolean;
  errors?: unknown[];
  position?: {
    start?: number;
    end?: number;
  };

  constructor(type: string, tag: string, nesting: TokenNesting) {
    this.type = type;
    this.tag = tag;
    this.attrs = null;
    this.map = null;
    this.nesting = nesting;
    this.level = 0;
    this.children = null;
    this.content = '';
    this.markup = '';
    this.info = '';
    this.meta = null;
    this.block = false;
    this.hidden = false;
  }

  attrIndex(name: string): number {
    if (!this.attrs) {
      return -1;
    }

    return this.attrs.findIndex(([attributeName]) => attributeName === name);
  }

  attrPush(attrData: TokenAttribute): void {
    if (!this.attrs) {
      this.attrs = [];
    }

    this.attrs.push(attrData);
  }

  attrSet(name: string, value: string): void {
    const index = this.attrIndex(name);

    if (index < 0) {
      this.attrPush([name, value]);
      return;
    }

    this.attrs![index] = [name, value];
  }

  attrGet(name: string): string | null {
    const index = this.attrIndex(name);

    return index < 0 ? null : this.attrs![index][1];
  }

  attrJoin(name: string, value: string): void {
    const currentValue = this.attrGet(name);

    if (currentValue === null) {
      this.attrPush([name, value]);
      return;
    }

    this.attrSet(name, `${currentValue} ${value}`);
  }
}

export const cloneToken = (token: TokenLike): TokenLike =>
  Object.assign(new LocalToken(token.type, token.tag, token.nesting), token);
