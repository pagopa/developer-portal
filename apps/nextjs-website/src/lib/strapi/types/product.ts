import { StrapiBannerLink } from '@/lib/strapi/types/bannerLink';
import { StrapiMedia } from '@/lib/strapi/types/media';
import { StrapiComponent } from './strapiComponent';
import { ApiDataListPageWithoutProduct } from './apiDataListPages';

type Id = {
  readonly id: number;
};

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

export type BaseProductWithoutBannerLinks = BaseProduct & {
  readonly attributes: {
    readonly description?: string;
    readonly logo: {
      readonly data?: StrapiMedia;
    };
  };
};

export type ProductRelations = {
  readonly overview: StrapiComponent<Id | undefined>;
  readonly quickstart_guide: StrapiComponent<Id | undefined>;
  readonly api_data_list_page: StrapiComponent<
    ApiDataListPageWithoutProduct | undefined
  >;
  readonly tutorial_list_page: StrapiComponent<Id | undefined>;
  readonly guide_list_page: StrapiComponent<Id | undefined>;
  readonly release_note: StrapiComponent<Id | undefined>;
};

export type StrapiBaseProductWithRelations = BaseProduct & {
  readonly attributes: ProductRelations & {
    readonly bannerLinks?: readonly StrapiBannerLink[];
  };
};

export type StrapiProduct = BaseProduct & {
  readonly attributes: ProductRelations & {
    readonly bannerLinks?: readonly StrapiBannerLink[];
    readonly description?: string;
    readonly logo: {
      readonly data: StrapiMedia;
    };
  };
};

export type StrapiProducts = StrapiComponent<readonly StrapiProduct[]>;
