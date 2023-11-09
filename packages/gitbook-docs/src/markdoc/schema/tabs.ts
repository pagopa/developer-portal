import Markdoc, { Schema } from '@markdoc/markdoc';

export type TabsProps<A> = {
  readonly titles: ReadonlyArray<string>;
  readonly children: ReadonlyArray<A>;
};

const tab: Schema = {
  transform: (node, config) => {
    const children = node.transformChildren(config);
    // Empty tab is not allowed. Fallback to an empty string
    return children.length === 0 ? [''] : children;
  },
};

export const tabs: Schema = {
  transform: (node, config) => {
    const tags = { ...config.tags, tab };
    const children = node.transformChildren({ ...config, tags });
    // Assumption: children are tab tag. Take all titles from children
    const titles = node.children
      .filter((child) => typeof child.attributes.title === 'string')
      .map((child) => child.attributes.title);

    console.log('titles', titles);
    console.log('children', children);

    return new Markdoc.Tag('Tabs', { titles }, children);
  },
};
