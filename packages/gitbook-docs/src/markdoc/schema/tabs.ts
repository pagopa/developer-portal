import Markdoc, { Schema } from '@markdoc/markdoc';

export type TabsProps<A> = {
  readonly titles: ReadonlyArray<string>;
  readonly children: ReadonlyArray<A>;
};

const tab: Schema = {
  transform: (node, config) => {
    const children = node.transformChildren(config);
    // empty tab is not allowed. Fallback to an empty string
    if (children.length === 0) return [''];
    else if (children.length === 1) return children;
    // given more than 1 children, group them into a Paragraph
    // otherwise the system renders only the first one
    else return new Markdoc.Tag('Paragraph', {}, children);
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

    return new Markdoc.Tag('Tabs', { titles }, children);
  },
};
