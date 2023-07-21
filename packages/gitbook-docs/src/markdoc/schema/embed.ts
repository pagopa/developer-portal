import Markdoc, { Schema } from '@markdoc/markdoc';
import { SrcAttr } from '../attributes';

export type EmbedProps<A> = {
  readonly url: string;
  readonly children: A;
};

export const embed: Schema = {
  attributes: {
    url: { type: SrcAttr, required: true },
  },
  transform: (node, config) => {
    console.log('node', JSON.stringify(node, null, 2));
    return new Markdoc.Tag(
      'Embed',
      node.transformAttributes(config),
      node.transformChildren(config)
    );
  },
};
