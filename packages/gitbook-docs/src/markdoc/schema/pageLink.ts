import { Schema, Tag } from '@markdoc/markdoc';
import { LinkAttr } from '../attributes';

export type PageLinkProps<A> = {
  readonly url: string;
  readonly children: A;
};

export const pageLink: Schema = {
  children: ['Link'],
  attributes: {
    url: {
      type: LinkAttr,
      required: true,
    },
  },
  transform: (node, config) => {
    // To avoid to render a paragraph as child of PageLink, we Search the `link` types within the children and transform them
    const children = Array.from(node.walk())
      .find(({ type }) => type === 'link')
      ?.transformChildren(config);
    return new Tag('PageLink', node.transformAttributes(config), children);
  },
};
