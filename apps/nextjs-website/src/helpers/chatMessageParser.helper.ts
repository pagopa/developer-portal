import ChatLink from '@/components/atoms/ChatLink/ChatLink';
import Markdoc, { Config, ConfigType, Node } from '@markdoc/markdoc';
import React, { ReactNode } from 'react';
import { transformAndReplaceUrlInMessage } from '@/helpers/chatMessageUrlReplacer.helper';
import { UrlReplaceMap } from '@/lib/strapi/makeProps/makeUrlReplaceMap';

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

export function parseChatMessage(
  markdown: string,
  urlReplaceMap: UrlReplaceMap
): ReactNode {
  // eslint-disable-next-line functional/no-expression-statements
  const parsedMarkdown = transformAndReplaceUrlInMessage(
    markdown,
    urlReplaceMap,
    chatMarkdocConfig
  );
  return Markdoc.renderers.react(parsedMarkdown, React, {
    components: {
      Link: ChatLink,
    },
  });
}
