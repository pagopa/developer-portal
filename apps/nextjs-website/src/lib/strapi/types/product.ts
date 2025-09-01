import { StrapiBannerLink } from '@/lib/strapi/types/bannerLink';
import { StrapiMedia } from '@/lib/strapi/types/media';
import { StrapiComponent } from './strapiComponent';
import { StrapiApiDataListPageWithoutProduct } from './apiDataListPages';

type StrapiId = {
  readonly id: number;
};

export type StrapiBaseProduct = {
  readonly attributes: {
    readonly name: string;
    readonly shortName: string;
    readonly slug: string;
  };
};

export type StrapiBaseProductWithBannerLinks = StrapiBaseProduct & {
  readonly attributes: {
    readonly bannerLinks?: readonly StrapiBannerLink[];
  };
};

export type StrapiBaseProductWithoutBannerLinks = StrapiBaseProduct & {
  readonly attributes: {
    readonly description?: string;
    readonly logo: {
      readonly data?: StrapiMedia;
    };
  };
};

export type StrapiProductRelations = {
  readonly overview: StrapiComponent<StrapiId | undefined>;
  readonly quickstart_guide: StrapiComponent<StrapiId | undefined>;
  readonly api_data_list_page: StrapiComponent<
    StrapiApiDataListPageWithoutProduct | undefined
  >;
  readonly tutorial_list_page: StrapiComponent<StrapiId | undefined>;
  readonly guide_list_page: StrapiComponent<StrapiId | undefined>;
  readonly release_note: StrapiComponent<StrapiId | undefined>;
};

export type StrapiBaseProductWithRelations = StrapiBaseProduct & {
  readonly attributes: StrapiProductRelations & {
    readonly bannerLinks?: readonly StrapiBannerLink[];
  };
};

export type StrapiProduct = StrapiBaseProduct & {
  readonly attributes: StrapiProductRelations & {
    readonly bannerLinks?: readonly StrapiBannerLink[];
    readonly description?: string;
    readonly logo: {
      readonly data: StrapiMedia;
    };
  };
};

export type StrapiProducts = StrapiComponent<readonly StrapiProduct[]>;
