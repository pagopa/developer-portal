import { convertEmojiToUnicode } from '../convertEmojiToUnicode';
import { cloneToken, type TokenLike } from './localToken';

const CODE_TOKENS = ['code_inline', 'fence', 'code_block'];
const EMOJI_PATTERN = /:([a-z0-9_]+):/g;
type TokenAttribute = Readonly<
  Record<string, unknown> & { readonly value?: unknown }
>;
type TokenMeta = Readonly<
  Record<string, unknown> & { readonly attributes?: unknown }
>;

const replaceEmoji = (value: string): string =>
  value.replaceAll(EMOJI_PATTERN, convertEmojiToUnicode);

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
  tokens: ReadonlyArray<TokenLike>
): ReadonlyArray<TokenLike> => {
  return tokens.map((token) => {
    const tokenMeta =
      token.meta && typeof token.meta === 'object'
        ? (token.meta as TokenMeta)
        : undefined;

    const attributes = Array.isArray(tokenMeta?.attributes)
      ? mapTokenAttributes(
          tokenMeta?.attributes as ReadonlyArray<TokenAttribute>
        )
      : tokenMeta?.attributes;

    return Object.assign(cloneToken(token), {
      content:
        token.type === 'text' ? replaceEmoji(token.content) : token.content,
      meta:
        attributes === undefined
          ? token.meta
          : {
              ...tokenMeta,
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
