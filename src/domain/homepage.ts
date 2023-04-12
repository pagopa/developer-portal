import { Image } from '@/domain/Image';
import { RelatedResourcesBlock } from './pageBlock';

export type Hero = {
  title: string;
  cover: string;
};

type ShowcaseItem = {
  title: string;
  description: string;
};

export type Showcase = {
  title: string;
  items: ReadonlyArray<ShowcaseItem>;
};

export type ProductOverviewPreview = {
  title: string;
  preview: {
    title: string;
    description: string;
    link: string;
    image: Image;
  };
};

export type Homepage = {
  hero: Hero;
  highlighted: RelatedResourcesBlock;
  productPreview: ProductOverviewPreview;
  comingSoon: Showcase;
};
