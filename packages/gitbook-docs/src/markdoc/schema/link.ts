import { Schema, Tag } from '@markdoc/markdoc';
import { LinkAttr } from '../attributes';
import { PageTitlePath } from '../../parseDoc';

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
    const gitBookPagesWithTitle: ReadonlyArray<PageTitlePath> = config.variables
      ? [...config.variables.gitBookPagesWithTitle]
      : [];
    const page = gitBookPagesWithTitle.find(({ path }) => path === attrs.href);

    const childrenTreeNode = node.transformChildren(config);

    const titleFromPage =
      childrenTreeNode &&
      typeof childrenTreeNode[0] === 'string' &&
      childrenTreeNode[0].endsWith('.md') &&
      page
        ? page.title
        : undefined;

    const titleFromAnchor =
      childrenTreeNode &&
      typeof childrenTreeNode[0] === 'string' &&
      childrenTreeNode[0].startsWith('#')
        ? capitalizeFirstLetter(
            childrenTreeNode[0].replace('#', '').replaceAll('-', ' ')
          )
        : undefined;

    const children = titleFromPage
      ? [titleFromPage]
      : titleFromAnchor
      ? [titleFromAnchor]
      : childrenTreeNode;

    if (attrs.href.match(/\/#/)) {
      const splitted = attrs.href.split('/');
      const anchor = splitted[splitted.length - 1].replace('/', '');
      const href = splitted.slice(0, -1).join('/');
      const linkAttrs = { ...attrs, href: `${href}${anchor}` };
      return new Tag('Link', linkAttrs, children);
    }

    return new Tag('Link', attrs, children);
  },
};
