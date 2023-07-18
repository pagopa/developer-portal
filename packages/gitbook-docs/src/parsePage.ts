import Markdoc, { ConfigType, RenderableTreeNode } from '@markdoc/markdoc';
import { ParseConfig } from './ParseConfig';
import { hint } from './markdoc/schema/hint';
import { figure } from './markdoc/schema/figure';

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

const schema: ConfigType = {
  tags: {
    hint,
    figure,
  },
  nodes: {
    document: undefined,
    paragraph: { render: 'Paragraph' },
  },
};

export const parsePage = (
  markdown: string,
  config: ParseConfig
): RenderableTreeNode => {
  // TODO: Workaround to convert from "GitBook Markdown" to "MarkDoc Markdown"
  // A better alternative could be to parse the html as following:
  // https://github.com/markdoc/markdoc/issues/10#issuecomment-1492560830
  // In this way many RegExp can be removed
  const markdoc = markdown
    .replaceAll('{% end', '{% /')
    .replaceAll(imgR.regex, imgR.replace)
    .replaceAll(figureR.regex, figureR.replace)
    .replaceAll(figcaptionR.regex, figcaptionR.replace);

  const ast = Markdoc.parse(markdoc);
  return Markdoc.transform(ast, { ...schema, variables: config });
};
