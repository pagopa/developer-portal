import type { StrapiBannerLink } from '@/lib/bannerLink/types';
import type { StrapiMedia } from '@/lib/media/strapiTypes';
import type { ApiDataListPageWithoutProduct } from '@/lib/apiDataListPages/types';
import type { Paginated } from '@/lib/strapi/types/paginated';
import type { StrapiTag } from '@/lib/tags/strapiTypes';

export type StrapiBaseProduct = {
  readonly name: string;
  readonly shortName: string;
  readonly slug: string;
  readonly isVisible: boolean;
};

export type StrapiBaseProductWithBannerLinks = StrapiBaseProduct & {
  readonly bannerLinks?: readonly StrapiBannerLink[];
};

export type StrapiBaseProductWithoutBannerLinks = StrapiBaseProduct & {
  readonly description?: string;
  readonly logo?: StrapiMedia;
};

export type StrapiProductRelations = {
  readonly overview?: number;
  readonly quickstart_guide?: number;
  readonly api_data_list_page?: ApiDataListPageWithoutProduct;
  readonly tutorial_list_page?: number;
  readonly guide_list_page?: number;
  readonly release_note?: number;
  readonly use_case_list_page?: number;
  readonly tags?: readonly StrapiTag[];
};

export type StrapiBaseProductWithRelations = StrapiBaseProduct &
  StrapiProductRelations & {
    readonly bannerLinks?: readonly StrapiBannerLink[];
  };

export type StrapiProduct = StrapiBaseProductWithRelations & {
  readonly bannerLinks?: readonly StrapiBannerLink[];
  readonly description?: string;
  readonly logo?: StrapiMedia;
};

export type StrapiProducts = Paginated<StrapiProduct>;
