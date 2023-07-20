import Markdoc, { ConfigType, RenderableTreeNode } from '@markdoc/markdoc';
import { ParseConfig } from './ParseConfig';
import { hint } from './markdoc/schema/hint';
import { figure } from './markdoc/schema/figure';
import { swagger } from './markdoc/schema/swagger';
import { paragraph } from './markdoc/schema/paragraph';
import { heading } from './markdoc/schema/heading';
import { link } from './markdoc/schema/link';
import { list } from './markdoc/schema/list';
import { item } from './markdoc/schema/item';
import { code, fence } from './markdoc/schema/code';

export const pairedHtmlTag = (tag: string) => ({
  regex: new RegExp(`<${tag}([^>]*?)>(.*?)</${tag}>`, 'gs'),
  replace: `{% ${tag}$1 %}$2{% /${tag} %}`,
});
export const unpairedHtmlTag = (tag: string) => ({
  regex: new RegExp(`<${tag}(.*?)>`, 'g'),
  replace: `{% ${tag}$1 / %}`,
});

const imgR = unpairedHtmlTag('img');
const figureR = pairedHtmlTag('figure');
const figcaptionR = pairedHtmlTag('figcaption');
const anchorR = pairedHtmlTag('a');
const pR = pairedHtmlTag('p');

const schema: ConfigType = {
  tags: {
    hint,
    figure,
    swagger,
    code,
  },
  nodes: {
    document: undefined,
    paragraph,
    heading,
    link,
    list,
    item,
    fence,
  },
};

export const parseContent = (
  markdown: string,
  config: Omit<ParseConfig, 'linkPrefix'>
): RenderableTreeNode => {
  // Workaround to convert from "GitBook Markdown" to "MarkDoc Markdown"
  // A better alternative could be to parse the html:
  // https://github.com/markdoc/markdoc/issues/10#issuecomment-1492560830
  // In this way many RegExp can be removed
  const markdoc = markdown
    .replaceAll('{% end', '{% /')
    .replaceAll(imgR.regex, imgR.replace)
    .replaceAll(figureR.regex, figureR.replace)
    .replaceAll(figcaptionR.regex, figcaptionR.replace)
    .replaceAll(anchorR.regex, anchorR.replace)
    .replaceAll(pR.regex, pR.replace);

  const ast = Markdoc.parse(markdoc);
  return Markdoc.transform(ast, { ...schema, variables: config });
};
