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

    const linkFromHash =
      childrenTreeNode &&
      typeof childrenTreeNode[0] === 'string' &&
      childrenTreeNode[0].startsWith('#')
        ? capitalizeFirstLetter(
            childrenTreeNode[0].replace('#', '').replaceAll('-', ' ')
          )
        : undefined;

    const children = page
      ? [page.title]
      : linkFromHash
      ? [linkFromHash]
      : childrenTreeNode;
    return new Tag('Link', attrs, children);
  },
};
