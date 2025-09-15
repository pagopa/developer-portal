import { StrapiComponent } from "./strapiComponent";

type Guide = {
  readonly attributes: {
    readonly title: string;
    readonly slug: string;
    readonly product: StrapiComponent<{
      readonly attributes: {
        readonly slug: string;
      };
    }>;
  };
};

export type StrapiUrlToGuide = {
  readonly id: number;
  readonly url: string;
  readonly subPath?: string;
  readonly guide: StrapiComponent<Guide | undefined>;
};

export type StrapiUrlReplaceMap = {
  readonly data: {
    readonly attributes: {
      readonly urlToGuide: readonly StrapiUrlToGuide[];
    };
  };
};
