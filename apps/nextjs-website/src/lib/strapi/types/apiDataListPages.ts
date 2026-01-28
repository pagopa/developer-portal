import { StrapiBaseProductWithRelations } from '@/lib/strapi/types/product';
import { StrapiBannerLink } from '@/lib/strapi/types/bannerLink';
import { StrapiSeo } from '@/lib/strapi/types/seo';
import {
  StrapiApiData,
  StrapiApiDataList,
} from '@/lib/strapi/types/apiDataList';

export type StrapiApiDataListPage = {
  readonly id: number;
  readonly title: string;
  readonly description?: string;
  readonly product?: StrapiBaseProductWithRelations;
  readonly updatedAt: string;
  readonly api_data: StrapiApiDataList;
  readonly bannerLinks: readonly StrapiBannerLink[];
  readonly seo?: StrapiSeo;
  readonly enableFilters?: boolean;
};

export type StrapiApiDataListPageWithoutProduct = {
  readonly id: number;
  readonly api_data: readonly Pick<
    StrapiApiData,
    'apiRestDetail' | 'apiSoapDetail'
  >[];
};

export type StrapiApiDataListPages = readonly StrapiApiDataListPage[];
