import { Media } from '@/lib/types/media';
import { BannerLinkProps } from '@/components/atoms/BannerLink/BannerLink';
import { Tag } from '@/lib/types/tag';
import { StrapiBannerLink } from '@/lib/bannerLink/types';
import { StrapiMedia } from '@/lib/strapi/types/media';
import { ApiDataListPageWithoutProduct } from '@/lib/apiDataListPages/types';
import { Paginated } from '@/lib/strapi/types/paginated';
import { StrapiTag } from '@/lib/strapi/types/tag';

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

export type Product = {
  readonly apiDataListPageUrl?: string;
  readonly bannerLinks: readonly BannerLinkProps[];
  readonly description?: string;
  readonly isVisible: boolean;
  readonly logo?: Media;
  readonly hasApiDataListPage?: boolean;
  readonly hasGuideListPage?: boolean;
  readonly hasOverviewPage?: boolean;
  readonly hasQuickstartGuidePage?: boolean;
  readonly hasReleaseNotePage?: boolean;
  readonly hasTutorialListPage?: boolean;
  readonly hasUseCaseListPage?: boolean;
  readonly name: string;
  readonly shortName: string;
  readonly slug: string;
  readonly tags?: readonly Tag[];
};
