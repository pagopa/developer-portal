import Markdoc, { Schema } from '@markdoc/markdoc';

export type ItemProps<A> = {
  readonly checked?: boolean;
  readonly children: A;
};

const symbols = {
  unchecked: '[ ]',
  checked: '[x]',
};

export const item: Schema = {
  transform: (node, config) => {
    const attrs = node.transformAttributes(config);
    const children = node.transformChildren(config);
    const rendered = new Markdoc.Tag('Item', attrs, children);
    const [head, ...tail] = children;
    if (typeof head === 'string')
      if (head.startsWith(symbols.checked)) {
        const attributes = { ...rendered.attributes, checked: true };
        const newHead = head.replace(symbols.checked, '').trimStart();
        return new Markdoc.Tag(rendered.name, attributes, [newHead, ...tail]);
      } else if (head.startsWith(symbols.unchecked)) {
        const attributes = { ...rendered.attributes, checked: false };
        const newHead = head.replace(symbols.unchecked, '').trimStart();
        return new Markdoc.Tag(rendered.name, attributes, [newHead, ...tail]);
      } else return rendered;
    else return rendered;
  },
};
