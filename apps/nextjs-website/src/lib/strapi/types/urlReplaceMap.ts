type Guide = {
  readonly title: string;
  readonly slug: string;
  readonly product: {
    readonly slug: string;
  };
};

export type StrapiUrlToGuide = {
  readonly id: number;
  readonly url: string;
  readonly subPath?: string;
  readonly guide?: Guide;
};

export type StrapiUrlReplaceMap = {
  readonly urlToGuide: readonly StrapiUrlToGuide[];
};
