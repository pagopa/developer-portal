import ChatLink from '@/components/atoms/ChatLink/ChatLink';
import Markdoc, {
  Config,
  ConfigType,
  Node,
  RenderableTreeNode,
  Tag,
} from '@markdoc/markdoc';
import React, { ReactNode } from 'react';
import { PageTitlePath } from '@/helpers/parseS3Doc.helpers';

function getTitleFromPage(
  childrenTreeNode: readonly RenderableTreeNode[],
  page?: PageTitlePath
): string | undefined {
  return childrenTreeNode &&
    typeof childrenTreeNode[0] === 'string' &&
    childrenTreeNode[0].endsWith('.md') &&
    page
    ? page.title
    : undefined;
}

function getTitleFromAnchor(
  childrenTreeNode: readonly RenderableTreeNode[]
): string | undefined {
  return childrenTreeNode &&
    typeof childrenTreeNode[0] === 'string' &&
    childrenTreeNode[0].startsWith('#')
    ? capitalizeFirstLetter(
        childrenTreeNode[0].replace('#', '').replaceAll('-', ' ')
      )
    : undefined;
}

const capitalizeFirstLetter = (text: string): string =>
  text.charAt(0).toUpperCase() + text.slice(1);
const chatMarkdocConfig: ConfigType = {
  nodes: {
    link: {
      render: 'Link',
      attributes: {
        href: { type: String, required: true },
        target: { type: String, default: '_blank' },
        title: { type: String },
      },
      transform(node: Node, config: Config) {
        const attrs = node.transformAttributes(config);
        const gitBookPagesWithTitle: ReadonlyArray<PageTitlePath> =
          config.variables?.gitBookPagesWithTitle || [];
        const page = gitBookPagesWithTitle.find(
          ({ path }) => path === attrs.href
        );

        const childrenTreeNode = node.transformChildren(config);

        const titleFromPage = getTitleFromPage(childrenTreeNode, page);

        const titleFromAnchor = getTitleFromAnchor(childrenTreeNode);

        const children = titleFromPage
          ? [titleFromPage]
          : titleFromAnchor
          ? [titleFromAnchor]
          : childrenTreeNode;

        return new Tag('Link', attrs, children);
      },
    },
  },
};

export function parseChatMessage(markdown: string): ReactNode {
  const ast = Markdoc.parse(markdown);
  const content = Markdoc.transform(ast, chatMarkdocConfig);
  return Markdoc.renderers.react(content, React, {
    components: {
      Link: ChatLink,
    },
  });
}
