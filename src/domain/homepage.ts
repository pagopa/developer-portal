import { ProductPageReferences } from './product';
import { Image } from './Image';

export type Hero = {
  title: string;
  cover: string;
};

export type Integration = {
  title: string;
  subtitle: string;
  description: string;
  link: string;
  image: Image;
};

type ShowcaseItem = {
  title: string;
  description: string;
};

export type Showcase = {
  title: string;
  cards: ReadonlyArray<ShowcaseItem>;
};

export type Homepage = {
  hero: Hero;
  highlighted: ProductPageReferences;
  integration: Integration;
  comingSoon: Showcase;
};
