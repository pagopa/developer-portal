import { Schema } from '@markdoc/markdoc';
import { LinkAttr } from '../attributes';

export const link: Schema = {
  render: 'Link',
  attributes: {
    href: { type: LinkAttr, required: true },
    title: { type: String },
  },
};
