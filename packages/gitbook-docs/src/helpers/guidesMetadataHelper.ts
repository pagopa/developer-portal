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

export interface StrapiProduct {
  readonly attributes: {
    readonly name: string;
    readonly shortName: string;
    readonly slug: string;
  };
}

export interface StrapiApiData {
  readonly id: number;
  readonly attributes: {
    readonly title: string;
    readonly description?: string;
    readonly icon: {
      readonly data?: {
        readonly attributes: {
          readonly name: string;
          readonly ext: string;
          readonly mime: string;
          readonly size: number;
          readonly url: string;
          readonly alternativeText?: string;
          readonly caption?: string;
          readonly height?: number;
          readonly width?: number;
        };
      };
    };
    readonly apiRestDetail?: {
      readonly slug: string;
      readonly specUrls: readonly {
        readonly id: number;
        readonly name?: string;
        readonly url: string;
        readonly hideTryIt: boolean;
      }[];
    };
    readonly apiSoapDetail?: {
      readonly slug: string;
      readonly repositoryUrl: string;
      readonly dirName: string;
    };
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
