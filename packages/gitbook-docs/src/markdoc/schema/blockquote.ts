import Markdoc, { Schema } from '@markdoc/markdoc';

export type QuoteProps<A> = {
  readonly children: A;
};

export const blockquote: Schema = {
  attributes: {},
  transform: (node, config) => {
    return new Markdoc.Tag(
      'Quote',
      node.transformAttributes(config),
      node.transformChildren(config)
    );
  },
};
