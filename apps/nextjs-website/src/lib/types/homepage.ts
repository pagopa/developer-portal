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

export type HomepageProps = {
  readonly cards: readonly {
    readonly title: string;
    readonly cta?: { readonly label: string; readonly href: string };
  }[];
  readonly comingsoonDocumentation: {
    readonly title: string;
    readonly links: readonly {
      readonly text: string;
      readonly href: string;
    }[];
  };
};
