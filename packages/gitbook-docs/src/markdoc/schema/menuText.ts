import { Schema } from '@markdoc/markdoc';

export type MenuTextProps<A> = {
  readonly children: A;
};

export const menuText: Schema = {
  attributes: {
    content: { type: String, required: true },
  },
  transform: (node) => {
    // remove invalid characters
    return node.attributes.content
      .replace(/[^\p{L}\p{N}\p{P}\p{Z}^$\n]/gu, '')
      .replace(/^\s*/, '');
  },
};
