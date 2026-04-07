export interface StrapiGuide {
  readonly id: number;
  readonly slug: string;
  readonly title: string;
  readonly product?: {
    readonly slug: string;
  };
  readonly versions: readonly {
    readonly id: number;
    readonly main: boolean;
    readonly version: string;
    readonly dirName: string;
  }[];
}

export interface StrapiReleaseNote {
  readonly id: number;
  readonly slug: string;
  readonly title: string;
  readonly product?: {
    readonly slug: string;
  };
  readonly dirName: string;
  readonly landingFile: string;
}

export interface StrapiSolution {
  readonly id: number;
  readonly slug: string;
  readonly title: string;
  readonly landingUseCaseFile: string;
  readonly dirName: string;
}

export interface StrapiProduct {
  readonly name: string;
  readonly shortName: string;
  readonly slug: string;
}

export interface StrapiApiData {
  readonly id: number;
  readonly title: string;
  readonly description?: string;
  readonly icon: {
    readonly data?: {
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
}

export interface StrapiProductsResponse {
  readonly data: readonly StrapiProduct[];
  readonly meta?: {
    readonly pagination?: {
      readonly page?: number;
      readonly pageSize?: number;
      readonly pageCount?: number;
      readonly total?: number;
    };
  };
}

export interface StrapiApiDataResponse {
  readonly data: readonly StrapiApiData[];
  readonly meta?: {
    readonly pagination?: {
      readonly page?: number;
      readonly pageSize?: number;
      readonly pageCount?: number;
      readonly total?: number;
    };
  };
}

// Raw Strapi response types for the full API responses
export interface StrapiGuidesResponse {
  readonly data: readonly StrapiGuide[];
  readonly meta?: {
    readonly pagination?: {
      readonly page?: number;
      readonly pageSize?: number;
      readonly pageCount?: number;
      readonly total?: number;
    };
  };
}

export interface StrapiSolutionsResponse {
  readonly data: readonly StrapiSolution[];
  readonly meta?: {
    readonly pagination?: {
      readonly page?: number;
      readonly pageSize?: number;
      readonly pageCount?: number;
      readonly total?: number;
    };
  };
}

export interface StrapiReleaseNotesResponse {
  readonly data: readonly StrapiReleaseNote[];
  readonly meta?: {
    readonly pagination?: {
      readonly page?: number;
      readonly pageSize?: number;
      readonly pageCount?: number;
      readonly total?: number;
    };
  };
}
