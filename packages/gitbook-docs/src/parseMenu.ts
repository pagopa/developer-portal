import Markdoc, { ConfigType, RenderableTreeNode } from '@markdoc/markdoc';
import { ParseConfig } from './ParseConfig';
import { title } from './markdoc/schema/title';
import { menuText } from './markdoc/schema/menuText';
import * as menu from './markdoc/schema/menu';

const schema: ConfigType = {
  nodes: {
    document: {},
    paragraph: {},
    hr: {},
    heading: title,
    list: menu.list,
    item: menu.item,
    link: menu.link,
    text: menuText,
  },
};

export const parseMenu = (
  markdown: string,
  config: ParseConfig
): RenderableTreeNode => {
  const ast = Markdoc.parse(markdown);
  return Markdoc.transform(ast, { ...schema, variables: config });
};
