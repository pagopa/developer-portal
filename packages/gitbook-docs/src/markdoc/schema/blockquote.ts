import { Schema } from '@markdoc/markdoc';

export type QuoteProps<A> = {
  readonly children: A;
};

export const blockquote: Schema = {
  render: 'Quote',
};
