import Token from 'markdown-it/lib/token';
import { convertEmojiToUnicode } from '../convertEmojiToUnicode';

const CODE_TOKENS = ['code_inline', 'fence', 'code_block'];
const EMOJI_PATTERN = /:([a-z0-9_]+):/g;
type TokenAttribute = Readonly<
  Record<string, unknown> & { readonly value?: unknown }
>;

const replaceEmoji = (value: string): string =>
  value.replaceAll(EMOJI_PATTERN, convertEmojiToUnicode);

const cloneToken = (token: Token): Token =>
  Object.assign(new Token(token.type, token.tag, token.nesting), token);

const mapTokenAttributes = (
  attributes: ReadonlyArray<TokenAttribute>
): ReadonlyArray<TokenAttribute> =>
  attributes.map((attr) =>
    typeof attr.value === 'string'
      ? {
          ...attr,
          value: replaceEmoji(attr.value),
        }
      : attr
  );

export const processEmojiTokens = (
  tokens: ReadonlyArray<Token>
): ReadonlyArray<Token> => {
  return tokens.map((token) => {
    const attributes = Array.isArray(token.meta?.attributes)
      ? mapTokenAttributes(
          token.meta.attributes as ReadonlyArray<TokenAttribute>
        )
      : token.meta?.attributes;

    return Object.assign(cloneToken(token), {
      content:
        token.type === 'text' ? replaceEmoji(token.content) : token.content,
      meta:
        attributes === undefined
          ? token.meta
          : {
              ...token.meta,
              attributes,
            },
      children:
        !CODE_TOKENS.includes(token.type) &&
        token.children &&
        token.children.length > 0
          ? processEmojiTokens(token.children)
          : token.children,
    });
  });
};
