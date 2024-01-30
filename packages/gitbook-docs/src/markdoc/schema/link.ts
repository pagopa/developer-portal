import { Schema, Tag } from '@markdoc/markdoc';
import { LinkAttr } from '../attributes';

const capitalizeFirstLetter = (text: string): string =>
  text.charAt(0).toUpperCase() + text.slice(1);

export type LinkProps<A> = {
  readonly href: string;
  readonly children: A;
  readonly title?: string;
};

export const link: Schema = {
  attributes: {
    href: { type: LinkAttr, required: true },
    title: { type: String },
  },
  transform: (node, config) => {
    const attrs = node.transformAttributes(config);
    const childrenTreeNode = node.transformChildren(config);

    const titleFromAnchor =
      childrenTreeNode &&
      typeof childrenTreeNode[0] === 'string' &&
      childrenTreeNode[0].startsWith('#')
        ? capitalizeFirstLetter(
            childrenTreeNode[0].replace('#', '').replaceAll('-', ' ')
          )
        : undefined;

    const children = titleFromAnchor ? [titleFromAnchor] : childrenTreeNode;
    return new Tag('Link', attrs, children);
  },
};
