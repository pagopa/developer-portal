import { Schema } from '@markdoc/markdoc';

export type TabProps<A> = {
  readonly title?: string;
  readonly children: A;
};

export const tab: Schema = {
  render: 'Tab',
  attributes: {
    title: { type: String },
  },
};
