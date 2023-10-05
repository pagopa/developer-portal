import { Schema } from '@markdoc/markdoc';

export type HintStyle = 'info' | 'success' | 'warning' | 'danger';

export type HintProps<A> = {
  readonly style: HintStyle;
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
