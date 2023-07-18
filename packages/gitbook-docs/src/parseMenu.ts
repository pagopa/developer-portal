import Markdoc, { ConfigType, RenderableTreeNode } from '@markdoc/markdoc';
import { link } from './markdoc/schema/link';
import { ParseConfig } from './ParseConfig';
import { title } from './markdoc/schema/title';
import { menuList } from './markdoc/schema/menuList';
import { menuItem } from './markdoc/schema/menuItem';
import { menuText } from './markdoc/schema/menuText';

const schema: ConfigType = {
  nodes: {
    document: {},
    paragraph: {},
    hr: {},
    heading: title,
    list: menuList,
    item: menuItem,
    link,
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
