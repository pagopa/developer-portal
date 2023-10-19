type HeroSlideApi = {
  readonly title: string;
  readonly ctaLabel?: string;
  readonly ctaLink?: string;
};

type LinkApi = {
  readonly label: string;
  readonly url: string;
};

export type HomepageApi = {
  readonly hero: readonly HeroSlideApi[];
  readonly comingsoonDocumentationTitle: string;
  readonly comingsoonDocumentation: readonly LinkApi[];
};
