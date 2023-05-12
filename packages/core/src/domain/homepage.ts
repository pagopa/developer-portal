import * as TE from 'fp-ts/TaskEither';
import { RelatedResourcesBlock } from './pageBlock';
import { Image } from './Image';

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

/** The entry point to retrieve homepage */
export type HomepageCollector = {
  getPage: () => TE.TaskEither<Error, Homepage>;
};
