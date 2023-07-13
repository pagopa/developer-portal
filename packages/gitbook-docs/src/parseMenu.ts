import Markdoc, {
  ConfigType,
  RenderableTreeNode,
  Schema,
} from '@markdoc/markdoc';
import { LinkAttr } from './markdoc/attributes';

type ParseMenuConfig = {
  readonly linkPrefix: string;
  readonly assetsPrefix: string;
};

const link: Schema = {
  render: 'Link',
  attributes: {
    href: { type: LinkAttr, required: true },
    title: { type: String },
  },
};

const item = {
  render: 'Item',
};

const list: Schema = {
  render: 'List',
};

const text: Schema = {
  attributes: {
    content: { type: String, required: true },
  },
  // remove emoji
  transform: (node) => node.attributes.content,
};

const schema: ConfigType = {
  nodes: {
    document: {},
    paragraph: {},
    hr: {},
    list,
    item,
    link,
    text,
  },
};

export const parseMenu = (
  markdown: string,
  config: ParseMenuConfig
): RenderableTreeNode => {
  const ast = Markdoc.parse(markdown);
  const transformed = Markdoc.transform(ast, { ...schema, variables: config });
  return transformed;
};
