import { Schema, Tag } from '@markdoc/markdoc';
import { LinkAttr, PrefixLinkAttr } from '../attributes';

export type LinkProps<A> = {
  readonly href: string;
  readonly title?: string;
  readonly children: A;
};

export const link: Schema = {
  attributes: {
    href: { type: LinkAttr, required: true },
    title: { type: String },
  },
  transform: (node, config) => {
    const gitBookPagesWithTitle = [
      // eslint-disable-next-line no-unsafe-optional-chaining
      ...config.variables?.gitBookPagesWithTitle,
    ];
    // Find a page with same path, if any get its title. If not, use an empty string.
    const page = gitBookPagesWithTitle.find(
      ({ path }) => path === config.variables?.pagePath
    );
    const attrs = node.transformAttributes(config);
    const attributes = page ? { ...attrs, title: page.title } : attrs;
    return new Tag('Link', attributes, node.transformChildren(config));
  },
};

export const menuLink: Schema = {
  render: 'Link',
  attributes: {
    href: { type: PrefixLinkAttr, required: true },
    title: { type: String },
  },
};
