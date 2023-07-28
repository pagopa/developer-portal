import Markdoc, { ConfigType, RenderableTreeNode } from '@markdoc/markdoc';
import { document } from './markdoc/schema/document';
import { hint } from './markdoc/schema/hint';
import { figure, img } from './markdoc/schema/image';
import { swagger } from './markdoc/schema/swagger';
import { paragraph } from './markdoc/schema/paragraph';
import { heading } from './markdoc/schema/heading';
import { link } from './markdoc/schema/link';
import { list } from './markdoc/schema/list';
import { item } from './markdoc/schema/item';
import { code, fence } from './markdoc/schema/code';
import { file } from './markdoc/schema/file';
import * as styled from './markdoc/schema/styledText';
import { blockquote } from './markdoc/schema/blockquote';
import { tabs } from './markdoc/schema/tabs';
import { details } from './markdoc/schema/details';
import { embed } from './markdoc/schema/embed';
import * as t from './markdoc/schema/table';

export type ParseContentConfig = {
  readonly assetsPrefix: string;
  readonly pagePath: string;
  readonly isPageIndex: boolean;
};

const pairedHtmlTag = (tag: string) => ({
  regex: new RegExp(`<${tag}([^>]*?)>(.*?)</${tag}>`, 'gs'),
  replace: `{% ${tag}$1 %}$2{% /${tag} %}`,
});
const unpairedHtmlTag = (tag: string) => ({
  regex: new RegExp(`<${tag}(.*?)>`, 'g'),
  replace: `{% ${tag}$1 / %}`,
});

const imgR = unpairedHtmlTag('img');
const figureR = pairedHtmlTag('figure');
const figcaptionR = pairedHtmlTag('figcaption');
const markR = pairedHtmlTag('mark');
const anchorR = pairedHtmlTag('a');
const pR = pairedHtmlTag('p');
const detailsR = pairedHtmlTag('details');
const summaryR = pairedHtmlTag('summary');
const strongR = pairedHtmlTag('strong');

const schema: ConfigType = {
  tags: {
    hint,
    img,
    figure,
    swagger,
    code,
    embed,
    file,
    tabs,
    details,
    strong: styled.strong,
  },
  nodes: {
    document,
    paragraph,
    heading,
    image: img,
    link,
    list,
    item,
    fence,
    strong: styled.strong,
    em: styled.em,
    code: styled.code,
    s: styled.strikethrough,
    blockquote,
    table: t.table,
    thead: t.thead,
    tbody: t.tbody,
    tr: t.tr,
    th: t.th,
    td: t.td,
  },
};

export const parseContent = (
  markdown: string,
  config: ParseContentConfig
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
    .replaceAll(markR.regex, markR.replace)
    .replaceAll(anchorR.regex, anchorR.replace)
    .replaceAll(pR.regex, pR.replace)
    .replaceAll(detailsR.regex, detailsR.replace)
    .replaceAll(summaryR.regex, summaryR.replace)
    .replaceAll(strongR.regex, strongR.replace);

  // Enable the parsing of html elements (e.g. <tables>). During the parse phase
  // the html content is handled as a Node of type html_block. For now this type
  // of node is ignored on rendering phase.
  const tokenizer = new Markdoc.Tokenizer({ html: true });
  const tokens = tokenizer.tokenize(markdoc);
  const ast = Markdoc.parse(tokens);
  return Markdoc.transform(ast, { ...schema, variables: config });
};
