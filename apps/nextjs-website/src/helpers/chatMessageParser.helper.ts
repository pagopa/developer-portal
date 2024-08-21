import ChatLink from '@/components/atoms/ChatLink/ChatLink';
import Markdoc, { Config, ConfigType, Node } from '@markdoc/markdoc';
import React, { ReactNode } from 'react';

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
        const attributes = node.transformAttributes(config);
        return new Markdoc.Tag(
          'Link',
          attributes,
          node.transformChildren(config)
        );
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
