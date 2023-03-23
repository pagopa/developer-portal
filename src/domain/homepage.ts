import { ProductOverviewPreview, ProductPageReferences } from '@/domain/product';

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

export type Homepage = {
  hero: Hero;
  highlighted: ProductPageReferences;
  productPreview: ProductOverviewPreview;
  comingSoon: Showcase;
};
