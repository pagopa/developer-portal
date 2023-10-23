import { pipe } from 'fp-ts/lib/function';
import * as RA from 'fp-ts/lib/ReadonlyArray';
import * as htmlparser2 from 'htmlparser2';
import Token from 'markdown-it/lib/token';

// return the tag name given the name
const makeTagName = (name: string): string => `html${name}`;

const makeHtmlParser = () => {
  // eslint-disable-next-line functional/prefer-readonly-type
  const result: Array<Token> = [];
  const parser = new htmlparser2.Parser({
    onopentag: (name, attrs) => {
      const token = new Token(`tag_open`, 'html-tag', 1);
      const attributes = Object.entries(attrs).map(([name, value]) => ({
        type: 'attribute',
        name,
        value,
      }));
      // eslint-disable-next-line functional/immutable-data, functional/no-expression-statements
      token.meta = {
        tag: makeTagName(name),
        attributes: [
          { type: 'attribute', name: 'html-tag-name', value: name },
          ...attributes,
        ],
      };
      // eslint-disable-next-line functional/immutable-data, functional/no-expression-statements
      result.push(token);
    },
    ontext: (content) => {
      if (typeof content !== 'string') return;
      if (content.trim().length > 0) {
        const token = new Token('text', 'text', 0);
        // eslint-disable-next-line functional/immutable-data, functional/no-expression-statements
        token.content = content;
        // eslint-disable-next-line functional/immutable-data, functional/no-expression-statements
        result.push(token);
      } else if (content.replaceAll('  ', ' ') === ' ') {
        const token = new Token('text', 'text', 0);
        // eslint-disable-next-line functional/immutable-data, functional/no-expression-statements
        token.content = ' ';
        // eslint-disable-next-line functional/immutable-data, functional/no-expression-statements
        result.push(token);
      }
    },
    onclosetag: (name) => {
      const token = new Token(`tag_close`, 'html-tag', -1);
      // eslint-disable-next-line functional/immutable-data, functional/no-expression-statements
      token.meta = {
        tag: makeTagName(name),
      };
      // eslint-disable-next-line functional/immutable-data, functional/no-expression-statements
      result.push(token);
    },
  });

  return {
    parseChunk: (content: string) => {
      // Reset the result array
      // eslint-disable-next-line functional/immutable-data, functional/no-expression-statements
      result.splice(0);
      // eslint-disable-next-line functional/immutable-data, functional/no-expression-statements
      parser.write(content);
      return result;
    },
  };
};

export const processHtmlTokens = (
  tokens: ReadonlyArray<Token>
): ReadonlyArray<Token> => {
  const htmlparser = makeHtmlParser();
  return pipe(
    tokens,
    RA.chain((token) => {
      switch (token.type) {
        case 'html_inline':
        case 'html_block':
          return htmlparser.parseChunk(token.content);
        case 'inline': {
          const children = processHtmlTokens(token.children || []);
          // eslint-disable-next-line functional/immutable-data, functional/no-expression-statements
          token.children = [...children];
          return [token];
        }
        default:
          return [token];
      }
    })
  );
};
