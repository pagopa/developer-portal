import { StrapiBannerLink } from '@/lib/strapi/types/bannerLink';
import { Media } from '@/lib/strapi/types/media';

export type BaseProduct = {
  readonly attributes: {
    readonly name: string;
    readonly shortName: string;
    readonly slug: string;
  };
};

export type BaseProductWithBannerLinks = BaseProduct & {
  readonly attributes: {
    readonly bannerLinks?: readonly StrapiBannerLink[];
  };
};

type StrapiUrl = {
  readonly id: number;
  readonly name?: string;
  readonly url: string;
  readonly hideTryIt: boolean;
};

export type ApiDataListPage = {
  readonly data?: {
    readonly id: number;
    readonly attributes: {
      readonly apiData: {
        readonly data: readonly [
          {
            readonly id: number;
            readonly attributes: {
              readonly apiRestDetail?: {
                readonly slug: string;
                readonly specUrl: StrapiUrl;
              };
              readonly apiSoapDetail?: {
                readonly slug: string;
                readonly repositoryUrl: string;
                readonly dirName: string;
              };
            };
          }
        ];
      };
    };
  };
};

export type ProductRelations = {
  readonly overview: {
    readonly data?: {
      readonly id: number;
    };
  };
  readonly quickstart_guide: {
    readonly data?: {
      readonly id: number;
    };
  };
  readonly api_data_list_page: ApiDataListPage;
  readonly tutorial_list_page?: {
    readonly data?: {
      readonly id: number;
    };
  };
  readonly guide_list_page: {
    readonly data?: {
      readonly id: number;
    };
  };
  readonly release_note: {
    readonly data?: {
      readonly id: number;
    };
  };
};

export type StrapiProduct = {
  readonly attributes: BaseProduct['attributes'] &
    ProductRelations & {
      readonly bannerLinks?: readonly StrapiBannerLink[];
      readonly description?: string;
      readonly logo: {
        readonly data?: Media;
      };
    };
};
