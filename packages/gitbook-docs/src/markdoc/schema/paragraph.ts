import { Schema } from '@markdoc/markdoc';

export type ParagraphProps<A> = {
  readonly children: A;
};

export const paragraph: Schema = {
  render: 'Paragraph',
};
