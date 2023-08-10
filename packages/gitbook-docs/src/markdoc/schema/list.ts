import Markdoc, { Schema } from '@markdoc/markdoc';

export type ListProps<A> = {
  readonly ordered: boolean;
  readonly children: A;
};

export const list: Schema = {
  children: ['item'],
  attributes: {
    ordered: { type: Boolean, required: true },
    start: { type: Number },
    marker: { type: String, render: false },
  },
  transform(node, config) {
    const ordered = node.tag === 'htmlol';
    const attr = node.transformAttributes(config);
    return new Markdoc.Tag(
      'List',
      { ordered, ...attr },
      node.transformChildren(config)
    );
  },
};
