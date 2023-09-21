import Markdoc, { ConfigType, RenderableTreeNode } from '@markdoc/markdoc';
import { ParseConfig } from './ParseConfig';
import { title } from './markdoc/schema/title';
import * as menu from './markdoc/schema/menu';
import { sanitizedText } from './markdoc/schema/sanitizedText';

const schema: ConfigType = {
  nodes: {
    document: {},
    paragraph: {},
    hr: {},
    heading: title,
    list: menu.list,
    item: menu.item,
    link: menu.link,
    text: sanitizedText,
  },
};

export const parseMenu = (
  markdown: string,
  config: ParseConfig
): RenderableTreeNode => {
  const ast = Markdoc.parse(markdown);
  return Markdoc.transform(ast, { ...schema, variables: config });
};
