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
    const gitBookPages = [
      // eslint-disable-next-line no-unsafe-optional-chaining
      ...config.variables?.gitBookPages,
    ];
    // Find a page with same path, if any get its title. If not, use an empty string.
    const title = gitBookPages.find(
      ({ page }) => page.path === config.variables?.pagePath
    )?.page.title;
    const attrs = node.transformAttributes(config);
    const attributes = title ? { ...attrs, title } : attrs;
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
