export interface StrapiGuide {
  readonly id: number;
  readonly attributes: {
    readonly slug: string;
    readonly title: string;
    readonly product?: {
      readonly data?: {
        readonly attributes?: {
          readonly slug: string;
        };
      };
    };
    readonly versions: readonly {
      readonly id: number;
      readonly main: boolean;
      readonly version: string;
      readonly dirName: string;
    }[];
  };
}

export interface StrapiReleaseNote {
  readonly id: number;
  readonly attributes: {
    readonly slug: string;
    readonly title: string;
    readonly product?: {
      readonly data?: {
        readonly attributes?: {
          readonly slug: string;
        };
      };
    };
    readonly dirName: string;
    readonly landingFile: string;
  };
}

export interface StrapiSolution {
  readonly id: number;
  readonly attributes: {
    readonly slug: string;
    readonly title: string;
    readonly landingUseCaseFile: string;
    readonly dirName: string;
  };
}

export type GuideInfo = {
  readonly versionName: string;
  readonly isMainVersion: boolean;
  readonly dirName: string;
  readonly guideSlug: string;
  readonly productSlug: string;
};
