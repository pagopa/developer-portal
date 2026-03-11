import Token from 'markdown-it/lib/token';
import { convertEmojiToUnicode } from '../convertEmojiToUnicode';

const CODE_TOKENS = ['code_inline', 'fence', 'code_block'];

export const processEmojiTokens = (
  tokens: ReadonlyArray<Token>
): ReadonlyArray<Token> => {
  // eslint-disable-next-line functional/no-expression-statements
  tokens.forEach((token) => {
    if (token.type === 'text') {
      // eslint-disable-next-line functional/immutable-data, functional/no-expression-statements
      token.content = token.content.replaceAll(
        /:([a-z0-9_]+):/g,
        convertEmojiToUnicode
      );
    }

    // eslint-disable-next-line functional/no-expression-statements
    if (
      token.meta &&
      token.meta.attributes &&
      Array.isArray(token.meta.attributes)
    ) {
      // eslint-disable-next-line functional/no-expression-statements
      token.meta.attributes.forEach((attr: any) => {
        if (typeof attr.value === 'string') {
          // eslint-disable-next-line functional/immutable-data, functional/no-expression-statements
          attr.value = attr.value.replaceAll(
            /:([a-z0-9_]+):/g,
            convertEmojiToUnicode
          );
        }
      });
    }

    if (
      !CODE_TOKENS.includes(token.type) &&
      token.children &&
      token.children.length > 0
    ) {
      // eslint-disable-next-line functional/no-expression-statements
      processEmojiTokens(token.children);
    }
  });
  return tokens;
};
