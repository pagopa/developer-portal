import Markdoc, { Schema } from '@markdoc/markdoc';

export const blockquote: Schema = {
  attributes: {},
  transform: (node, config) => {
    const children = node.children
      .find(({ type }) => type === 'paragraph')
      ?.children.find(({ type }) => type === 'inline')
      ?.transformChildren({
        ...config,
      });
    return new Markdoc.Tag('Quote', node.transformAttributes(config), [
      new Markdoc.Tag('Paragraph', {}, children),
    ]);
  },
};
