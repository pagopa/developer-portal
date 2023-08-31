import { Schema, Tag } from '@markdoc/markdoc';
import { LinkAttr, PrefixLinkAttr } from '../attributes';
import { PageTitlePath } from '../../parseDoc';

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
    const gitBookPagesWithTitle: ReadonlyArray<PageTitlePath> = config.variables
      ? [...config.variables.gitBookPagesWithTitle]
      : [];
    const page = gitBookPagesWithTitle.find(
      ({ path }) => path === config.variables?.pagePath
    );
    const attrs = node.transformAttributes(config);
    const attributes = page ? { ...attrs, title: page.title } : attrs;
    return new Tag('Link', attributes, node.transformChildren(config));
  },
};
