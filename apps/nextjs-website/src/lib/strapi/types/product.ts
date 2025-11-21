import { StrapiBannerLink } from '@/lib/strapi/types/bannerLink';
import { StrapiMedia } from '@/lib/strapi/types/media';
import { StrapiApiDataListPageWithoutProduct } from '@/lib/strapi/types/apiDataListPages';
import { Paginated } from '@/lib/strapi/types/paginated';
import { StrapiTag } from '@/lib/strapi/types/tag';

type Id = {
  readonly id: number;
};

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
  readonly api_data_list_page?: StrapiApiDataListPageWithoutProduct;
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
