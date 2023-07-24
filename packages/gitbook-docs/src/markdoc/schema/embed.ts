import Markdoc, { Schema } from '@markdoc/markdoc';
import { SrcAttr } from '../attributes';
import { hasMissingClosingError } from '../errors';

export type EmbedProps<A> = {
  readonly url: string;
  readonly children: A;
};

export const embed: Schema = {
  attributes: {
    url: { type: SrcAttr, required: true },
  },
  transform: (node, config) => {
    const attrs = node.transformAttributes(config);
    if (!hasMissingClosingError(node.errors, 'missing-closing')) {
      // return normal tag: embed tag has a closing tag
      return new Markdoc.Tag('Embed', attrs, node.transformChildren(config));
    } else {
      // consider unclosing embed tag as self-closing tag without children
      // render the children as sibling
      const result = new Markdoc.Tag('Embed', attrs);
      return [result, ...node.transformChildren(config)];
    }
  },
};
