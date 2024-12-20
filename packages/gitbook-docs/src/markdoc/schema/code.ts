import Markdoc, { Schema } from '@markdoc/markdoc';
import { BooleanOrNullAttr } from '../attributes';

export type CodeBlockProps<A> = {
  readonly language?: string;
  readonly title?: string;
  readonly overflow?: string;
  readonly lineNumbers?: boolean;
  readonly children: A;
};

export const fence: Schema = {
  attributes: {
    content: { type: String, render: false, required: true },
    language: { type: String },
    process: { type: Boolean, render: false, default: true },
  },
  transform: (node, config) => {
    return new Markdoc.Tag(
      'CodeBlock',
      { ...node.transformAttributes(config), lineNumbers: true },
      node.transformChildren(config)
    );
  },
};

export const code: Schema = {
  attributes: {
    title: { type: String },
    overflow: { type: String },
    lineNumbers: { type: BooleanOrNullAttr },
  },
  transform: (node, config) => {
    const fenceAttr = node.children
      .find(({ type }) => type === 'fence')
      ?.transformAttributes({ ...config, nodes: { fence } });
    const attrs = node.transformAttributes(config);
    const children = node.children
      .find(({ type }) => type === 'fence')
      ?.transformChildren(config);

    return new Markdoc.Tag(
      'CodeBlock',
      {
        ...Object.fromEntries(
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          Object.entries(attrs).filter(([_, value]) => value !== null)
        ),
        ...fenceAttr,
      },
      children
    );
  },
};
