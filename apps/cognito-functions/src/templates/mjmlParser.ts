import mjml2html from 'mjml';
import { minify, MinifierOptions } from 'html-minifier-next';
import { pipe } from 'fp-ts/function';

const defaultMinificationOptions: MinifierOptions = {
  collapseWhitespace: true,
  minifyCSS: true,
  caseSensitive: true,
  removeEmptyAttributes: true,
};

export const parseMjmlToHtml = (
  mjml: string,
  minificationOptions: MinifierOptions = defaultMinificationOptions
): Promise<string> =>
  pipe(mjml2html(mjml), ({ html }) => minify(html, minificationOptions));
