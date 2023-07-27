import Markdoc, { Schema } from '@markdoc/markdoc';

export type TabsProps<A> = {
  readonly titles: ReadonlyArray<string>;
  readonly children: ReadonlyArray<A>;
};

export const tabs: Schema = {
  children: ['tab'],
  transform: (node, config) => {
    const children = node.transformChildren(config);
    // Assumption: children are tab tag. Take all titles from children
    const titles = node.children
      .filter((child) => typeof child.attributes.title === 'string')
      .map((child) => child.attributes.title);
    return new Markdoc.Tag('Tabs', { titles }, children);
  },
};
