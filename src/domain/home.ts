import * as TE from 'fp-ts/lib/TaskEither';

export type IntegrationBlock = {
  title: string;
  subtitle: string;
  description: string;
  findMore: PageRef;
  image: Image;
};

type ProductPreview = {
  title: string;
  description: string;
};

export type ComingSoonBlock = {
  title: string;
  cards: ReadonlyArray<ProductPreview>;
};

export type HeroHomeBlock = {
  title: {
    plainWord: string;
    boldWord: string;
  };
  subtitle: string;
  cover: string; // URL or path to a local image?
};

type PageRef = {
  href: string;
  text: string;
};

type Image = {
  src: string;
  alt: string;
};

type PagePreview = {
  type: 'quickstart' | 'tutorial';
  preTitle: string;
  title: string;
  description: string;
  findMore: PageRef;
};

export type HighlightedBlock = {
  title: string;
  previews: ReadonlyArray<PagePreview>;
};

export type HomePage = {
  hero: HeroHomeBlock;
  highlighted: HighlightedBlock;
  integrations: IntegrationBlock;
  comingSoon: ComingSoonBlock;
};
