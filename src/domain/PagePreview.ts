import { PageRef } from './PageRef';

export type PagePreview = {
  type: 'quickstart' | 'tutorial';
  preTitle: string;
  title: string;
  description: string;
  findMore: PageRef;
};
