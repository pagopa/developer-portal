import { Schema, Tag } from '@markdoc/markdoc';
import { LinkAttr } from '../attributes';
import { PageTitlePath } from '../../parseDoc';

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
    // TODO: This block of code is very similar to the transform function of the Link. Refactor to reuse other functions.
    // To avoid to render a paragraph as child of PageLink, we Search the `link` types within the children and transform them
    const gitBookPagesWithTitle: ReadonlyArray<PageTitlePath> = config.variables
      ? [...config.variables.gitBookPagesWithTitle]
      : [];
    const attrs = node.transformAttributes(config);
    const page = gitBookPagesWithTitle.find(({ path }) => path === attrs.url);
    const childrenTreeNode = Array.from(node.walk())
      .find(({ type }) => type === 'link')
      ?.transformChildren(config);
    const children = page ? [page.title] : childrenTreeNode;
    return new Tag('PageLink', attrs, children);
  },
};
