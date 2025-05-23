import { transformAndReplaceUrlInMessage } from '@/helpers/chatMessageUrlReplacer.helper';
import Markdoc, { Config, ConfigType, Node } from '@markdoc/markdoc';
import { validatePassword } from '@/helpers/auth.helpers';

describe('transformAndReplaceUrlInMessage', () => {
  it('transform a node to a ReactNode', () => {
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
    const markdown = '[link to stuff](https://www.google.com)';
    const ast = Markdoc.parse(markdown);
    const result = transformAndReplaceUrlInMessage(ast, chatMarkdocConfig);
    console.log(result);
    expect(result).toBe(false);
  });
});
