import Markdoc, { Schema } from '@markdoc/markdoc';

export type HeadingProps<A> = {
  readonly level: number;
  readonly children: A;
};

export const heading: Schema = {
  children: ['inline'],
  attributes: {
    level: { type: Number, required: true },
  },
  transform(node, config) {
    return new Markdoc.Tag(
      `Heading`,
      node.transformAttributes(config),
      node.transformChildren(config)
    );
  },
};
