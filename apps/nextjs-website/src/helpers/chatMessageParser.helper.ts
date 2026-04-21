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

const markdownLinkWithClassModifiersRegex =
  /\[([^\]]+)\]\((\S+?)(?:\s+"([^"]*)")?\)\s*((?:\{%\s*\.[a-zA-Z0-9_-]+\s*%\})+)/g;
const linkClassModifierRegex = /\{%\s*\.([a-zA-Z0-9_-]+)\s*%\}/g;

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

type TransformableLinkNode = {
  readonly transformAttributes: (config: Config) => Record<string, unknown>;
  readonly transformChildren: (config: Config) => readonly RenderableTreeNode[];
};

function serializeMarkdocStringAttribute(name: string, value: string): string {
  return ` ${name}=${JSON.stringify(value)}`;
}

function extractLinkClassModifiers(classModifiers: string): string {
  return Array.from(
    classModifiers.matchAll(linkClassModifierRegex),
    (match) => match[1]
  ).join(' ');
}

function normalizeChatLinkClassModifiers(markdown: string): string {
  return markdown.replaceAll(
    markdownLinkWithClassModifiersRegex,
    (
      _,
      label: string,
      href: string,
      title: string | undefined,
      modifiers: string
    ) => {
      const className = extractLinkClassModifiers(modifiers);

      return `{% chat-link${serializeMarkdocStringAttribute('href', href)}${
        title ? serializeMarkdocStringAttribute('title', title) : ''
      }${serializeMarkdocStringAttribute(
        'className',
        className
      )} %}${label}{% /chat-link %}`;
    }
  );
}

function transformLinkNode(node: TransformableLinkNode, config: Config): Tag {
  const attrs = node.transformAttributes(config);
  const gitBookPagesWithTitle: ReadonlyArray<PageTitlePath> =
    config.variables?.gitBookPagesWithTitle || [];
  const page = gitBookPagesWithTitle.find(({ path }) => path === attrs.href);

  const childrenTreeNode = node.transformChildren(config);

  const titleFromPage = getTitleFromPage(childrenTreeNode, page);

  const titleFromAnchor = getTitleFromAnchor(childrenTreeNode);

  const children = titleFromPage
    ? [titleFromPage]
    : titleFromAnchor
    ? [titleFromAnchor]
    : childrenTreeNode;

  return new Tag('Link', attrs, [...children]);
}

const chatMarkdocConfig: ConfigType = {
  tags: {
    'chat-link': {
      render: 'Link',
      attributes: {
        href: { type: String, required: true },
        title: { type: String },
        className: { type: String },
      },
      transform(node: Node, config: Config) {
        return transformLinkNode(node, config);
      },
    },
  },
  nodes: {
    link: {
      render: 'Link',
      attributes: {
        href: { type: String, required: true },
        target: { type: String, default: '_blank' },
        title: { type: String },
      },
      transform(node: Node, config: Config) {
        return transformLinkNode(node, config);
      },
    },
  },
};

export function parseChatMessage(markdown: string): ReactNode {
  const ast = Markdoc.parse(normalizeChatLinkClassModifiers(markdown));
  const content = Markdoc.transform(ast, chatMarkdocConfig);
  return Markdoc.renderers.react(content, React, {
    components: {
      Link: ChatLink,
    },
  });
}
