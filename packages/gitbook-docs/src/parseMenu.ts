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

const item: Schema = {
  render: 'Item',
  transform: (node, config) => {
    // track if the node has nested list or not
    const isLeaf = node.children.length === 1;
    const attrs = node.transformAttributes(config);
    return new Markdoc.Tag(
      'Item',
      { ...attrs, isLeaf },
      node.transformChildren(config)
    );
  },
};

const list: Schema = {
  render: 'List',
};

const heading: Schema = {
  transform: (node, config) => {
    // skip headers of level 1
    if (node.attributes['level'] !== 1)
      return new Markdoc.Tag(
        'Title',
        node.transformAttributes(config),
        node.transformChildren(config)
      );
    else return [];
  },
};

const text: Schema = {
  attributes: {
    content: { type: String, required: true },
  },
  transform: (node) => {
    // remove invalid characters
    return node.attributes.content
      .replace(/[^\p{L}\p{N}\p{P}\p{Z}^$\n]/gu, '')
      .replace(/^\s*/, '');
  },
};

const schema: ConfigType = {
  nodes: {
    document: {},
    paragraph: {},
    hr: {},
    heading,
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
  return Markdoc.transform(ast, { ...schema, variables: config });
};
