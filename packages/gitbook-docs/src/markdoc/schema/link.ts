import { Schema } from '@markdoc/markdoc';
import { LinkAttr } from '../attributes';

export type LinkProps<A> = {
  readonly href: string;
  readonly title?: string;
  readonly children: A;
};

export const link: Schema = {
  render: 'Link',
  attributes: {
    href: { type: LinkAttr, required: true },
    title: { type: String },
  },
};
