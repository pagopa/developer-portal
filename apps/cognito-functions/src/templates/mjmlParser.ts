import mjml2html from 'mjml';
import { minify, Options } from 'html-minifier';
import { pipe } from 'fp-ts/function';

const defaultMinificationOptions = {
  collapseWhitespace: true,
  minifyCSS: true,
  caseSensitive: true,
  removeEmptyAttributes: true,
};

export const parseMjmlToHtml = (
  mjml: string,
  minificationOptions: Options = defaultMinificationOptions
): string =>
  pipe(mjml2html(mjml), ({ html }) => minify(html, minificationOptions));
