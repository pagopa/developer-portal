import { PageRef } from '@/domain/PageRef';
import { PagePreview } from './PagePreview';

export type RelatedResoucesBlock = {
  title: string;
  previews: ReadonlyArray<PagePreview>;
};

export type IntroBlock = {
  title: string;
  description: string;
};

export type ProductQuickStartPage = {
  title: string;
  submenu: ReadonlyArray<PageRef>;
  intro: IntroBlock;
  related: RelatedResoucesBlock;
};
