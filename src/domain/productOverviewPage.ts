import { PageRef } from './PageRef';
import { Image } from './Image';

export type TutorialPreview = {
  date: string;
  title: string;
  description: string;
  image: Image;
  pageRef: PageRef;
};

export type TutorialBlock = {
  title: string;
  preview: TutorialPreview;
};

export type QuickStartStep = {
  title: string;
  description: string;
};

export type QuickStartBlock = {
  title: string;
  description: string;
  steps: ReadonlyArray<QuickStartStep>;
};

export type ProductHero = {
  title: string;
  description: string;
  cover: string;
};

export type ProductOverviewPage = {
  title: string;
  submenu: ReadonlyArray<PageRef>;
  hero: ProductHero;
  quickStart: QuickStartBlock;
  tutorial: TutorialBlock;
};
