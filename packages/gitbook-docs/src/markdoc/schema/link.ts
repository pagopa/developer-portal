import { Schema, Tag } from '@markdoc/markdoc';
import { LinkAttr } from '../attributes';
import { PageTitlePath } from '../../parseDoc';
import { pipe } from 'fp-ts/lib/function';

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
    /* eslint-disable functional/no-expression-statements */
    /* eslint-disable functional/immutable-data */
    if (attrs.href && attrs.href.includes('mailto:')) {
      // delete everything before the 'mailto:'
      attrs.href = attrs.href.replace(/.*mailto:/, 'mailto:');
    }
    /* eslint-enable functional/no-expression-statements */
    /* eslint-enable functional/immutable-data */

    const gitBookPagesWithTitle: ReadonlyArray<PageTitlePath> = config.variables
      ? [...config.variables.gitBookPagesWithTitle]
      : [];
    const page = gitBookPagesWithTitle.find(({ path }) => path === attrs.href);
    const childrenTreeNode = node.transformChildren(config);

    const titleFromAnchor =
      childrenTreeNode &&
      typeof childrenTreeNode[0] === 'string' &&
      childrenTreeNode[0].startsWith('#')
        ? capitalizeFirstLetter(
            childrenTreeNode[0].replace('#', '').replaceAll('-', ' ')
          )
        : undefined;

    const children = page
      ? [page.title]
      : titleFromAnchor
      ? [titleFromAnchor]
      : childrenTreeNode;
    return new Tag('Link', attrs, children);
  },
};
