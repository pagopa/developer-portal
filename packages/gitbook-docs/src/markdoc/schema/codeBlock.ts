import Markdoc, { Schema } from '@markdoc/markdoc';

export type CodeBlockProps<A> = {
  readonly children: A;
};

const codeBlockContent: Schema = {
  attributes: {
    language: { type: String },
  },
};

export const codeBlock: Schema = {
  attributes: {
    title: { type: String },
    overflow: { type: String },
    lineNumbers: { type: String },
  },
  transform: (node, config) => {
    const langAttr = node.children
      .find(({ type }) => type === 'fence')
      ?.transformAttributes({ ...config, tags: { codeBlockContent } });
    const attrs = node.transformAttributes(config);
    const children = node.children
      .find(({ type }) => type === 'fence')
      ?.transformChildren(config);
    return new Markdoc.Tag('CodeBlock', { ...attrs, ...langAttr }, children);
  },
};
