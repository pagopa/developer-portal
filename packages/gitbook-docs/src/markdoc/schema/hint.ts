import { Schema } from '@markdoc/markdoc';

export type HintProps<A> = {
  readonly style: string;
  readonly children: ReadonlyArray<A>;
};

// https://docs.gitbook.com/content-creation/blocks/hint
export const hint: Schema = {
  render: 'Hint',
  attributes: {
    style: {
      type: String,
      matches: ['info', 'success', 'warning', 'danger'],
    },
  },
};
