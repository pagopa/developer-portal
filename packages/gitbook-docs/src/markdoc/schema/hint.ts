import { Schema } from '@markdoc/markdoc';

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
