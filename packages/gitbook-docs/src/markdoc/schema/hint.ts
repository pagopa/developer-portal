import { Schema } from '@markdoc/markdoc';

export type HintProps<A> = {
  readonly style: 'info' | 'success' | 'warning' | 'danger';
  readonly children: A;
};

export const hint: Schema = {
  render: 'Hint',
  attributes: {
    style: {
      type: String,
      matches: ['info', 'success', 'warning', 'danger'],
    },
  },
};
