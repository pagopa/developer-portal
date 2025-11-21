import { StrapiComponent } from './strapiComponent';

type Guide = {
  readonly title: string;
  readonly slug: string;
  readonly product: StrapiComponent<{
    readonly slug: string;
  }>;
};

export type StrapiUrlToGuide = {
  readonly id: number;
  readonly url: string;
  readonly subPath?: string;
  readonly guide: StrapiComponent<Guide | undefined>;
};

export type StrapiUrlReplaceMap = {
  readonly data: {
    readonly urlToGuide: readonly StrapiUrlToGuide[];
  };
};
