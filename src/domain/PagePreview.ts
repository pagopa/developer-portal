import { PageRef } from './PageRef';

export type PagePreview = {
  type: 'quickstart' | 'tutorial' | 'api' | 'guide';
  preTitle: string;
  title: string;
  description: string;
  findMore: PageRef;
};
