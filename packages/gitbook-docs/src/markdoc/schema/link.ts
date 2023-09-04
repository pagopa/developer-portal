import { Schema, Tag } from '@markdoc/markdoc';
import { LinkAttr, PrefixLinkAttr } from '../attributes';
import { PageTitlePath } from '../../parseDoc';

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
    const children = page ? [page.title] : childrenTreeNode;
    return new Tag('Link', attrs, children);
  },
};
