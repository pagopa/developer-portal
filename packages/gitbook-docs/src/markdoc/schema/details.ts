import Markdoc, { Schema } from '@markdoc/markdoc';

export type ExpandableProps<A> = {
  readonly children: A;
};
export type ExpandableSummaryProps<A> = {
  readonly children: A;
};
export type ExpandableDetailsProps<A> = {
  readonly children: A;
};

const summary: Schema = {
  render: 'ExpandableSummary',
};

export const details: Schema = {
  transform: (node, config) => {
    const attrs = node.transformAttributes(config);
    const children = node.transformChildren({
      ...config,
      tags: { ...config.tags, summary },
    });
    const [head, ...tail] = children;
    const summaryTag = Markdoc.Tag.isTag(head) ? head.children : [head];
    const detailsTag = new Markdoc.Tag('ExpandableDetails', attrs, tail);
    return new Markdoc.Tag('Expandable', attrs, [...summaryTag, detailsTag]);
  },
};
