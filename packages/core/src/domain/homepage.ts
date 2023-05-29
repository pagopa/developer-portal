import * as TE from 'fp-ts/TaskEither';
import { RelatedResourcesBlock } from './pageBlock';
import { Image } from './Image';

export type Hero = {
  readonly title: string;
  readonly cover: string;
};

type ShowcaseItem = {
  readonly title: string;
  readonly description: string;
};

export type Showcase = {
  readonly title: string;
  readonly items: ReadonlyArray<ShowcaseItem>;
};

export type ProductOverviewPreview = {
  readonly title: string;
  readonly preview: {
    readonly title: string;
    readonly description: string;
    readonly link: string;
    readonly image: Image;
  };
};

export type Homepage = {
  readonly hero: Hero;
  readonly highlighted: RelatedResourcesBlock;
  readonly productPreview: ProductOverviewPreview;
  readonly comingSoon: Showcase;
};

/** The entry point to retrieve homepage */
export type HomepageCollector = {
  readonly getPage: () => TE.TaskEither<Error, Homepage>;
};
