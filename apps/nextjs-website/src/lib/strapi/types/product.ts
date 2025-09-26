import { StrapiBannerLink } from '@/lib/strapi/types/bannerLink';
import { StrapiMedia } from '@/lib/strapi/types/media';
import { StrapiComponent } from '@/lib/strapi/types/strapiComponent';
import { StrapiApiDataListPageWithoutProduct } from '@/lib/strapi/types/apiDataListPages';
import { Paginated } from '@/lib/strapi/types/paginated';

type Id = {
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
  readonly overview: StrapiComponent<Id | undefined>;
  readonly quickstart_guide: StrapiComponent<Id | undefined>;
  readonly api_data_list_page: StrapiComponent<
    StrapiApiDataListPageWithoutProduct | undefined
  >;
  readonly tutorial_list_page: StrapiComponent<Id | undefined>;
  readonly guide_list_page: StrapiComponent<Id | undefined>;
  readonly release_note: StrapiComponent<Id | undefined>;
  readonly use_case_list_page: StrapiComponent<Id | undefined>;
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

export type StrapiProducts = Paginated<StrapiProduct>;
