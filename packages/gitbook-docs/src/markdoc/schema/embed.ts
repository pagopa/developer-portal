import { Schema } from '@markdoc/markdoc';
import { SrcAttr } from '../attributes';

export type EmbedProps<A> = {
  readonly url: string;
  readonly children: A;
};

export const embed: Schema = {
  attributes: {
    url: { type: SrcAttr, required: true },
  },
  render: 'Embed',
};
