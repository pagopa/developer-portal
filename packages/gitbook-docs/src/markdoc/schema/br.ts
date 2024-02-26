import { Schema } from '@markdoc/markdoc';

export type BrProps = Record<string, never>;

export const br: Schema = {
  render: 'Br',
};
