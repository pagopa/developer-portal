import Markdoc, { Schema } from '@markdoc/markdoc';
import { PrefixLinkAttr } from '../attributes';

export type MenuItemProps<A> = {
  readonly isLeaf: boolean;
  readonly href: string;
  readonly title: string;
  readonly children: A;
};

export const list: Schema = {
  render: undefined,
};

export const link: Schema = {
  attributes: {
    href: { type: PrefixLinkAttr, required: true },
    title: { type: String },
  },
  transform: (node, config) => {
    const attrs = node.transformAttributes(config);
    // Assume the children are only a single text
    const title = node
      .transformChildren(config)
      .find((node) => typeof node === 'string');
    return new Markdoc.Tag('Item', { ...attrs, title });
  },
};

export const item: Schema = {
  render: 'Item',
  transform: (node, config) => {
    // track if the node has nested list or not
    const isLeaf = node.children.length === 1;
    const [head, ...tail] = node.transformChildren(config);
    if (Markdoc.Tag.isTag(head))
      return new Markdoc.Tag(head.name, { ...head.attributes, isLeaf }, tail);
    else return [head, ...tail];
  },
};
