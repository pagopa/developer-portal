import { Schema } from '@markdoc/markdoc';

export type TabsProps<A> = {
  readonly children: A;
};

export const tabs: Schema = {
  children: ['tab'],
  render: 'Tabs',
};
