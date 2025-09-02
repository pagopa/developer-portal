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

export enum MetadataType {
  Guide = 0,
  ReleaseNote = 1,
  Solution = 2,
}

export type MetadataInfo = {
  readonly versionName: string;
  readonly isMainVersion: boolean;
  readonly dirName: string;
  readonly slug: string;
  readonly productSlug: string;
  readonly metadataType?: MetadataType;
};
