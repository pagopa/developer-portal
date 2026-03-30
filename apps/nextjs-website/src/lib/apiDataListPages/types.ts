import { StrapiBaseProductWithRelations } from '@/lib/products/strapiTypes';
import { StrapiBannerLink } from '@/lib/bannerLink/types';
import { StrapiSeo } from '@/lib/seo/strapiTypes';
import { ApiData } from '@/lib/apiDataList/types';
import { ApiDataListPageTemplateProps } from '@/components/templates/ApiDataListTemplate/ApiDataListTemplate';
import { RootEntity } from '@/lib/strapi/types/rootEntity';

export type ApiDataListPage = {
  readonly id: number;
  readonly title: string;
  readonly description?: string;
  readonly product: StrapiBaseProductWithRelations;
  readonly updatedAt: string;
  readonly api_data: readonly ApiData[];
  readonly bannerLinks: readonly StrapiBannerLink[];
  readonly seo?: StrapiSeo;
  readonly enableFilters?: boolean;
};

export type ApiDataListPageWithoutProduct = {
  readonly id: number;
  readonly updatedAt: string;
  readonly api_data: readonly Pick<
    ApiData,
    'apiRestDetail' | 'apiSoapDetail'
  >[];
};

export type ApiDataListPages = RootEntity<readonly ApiDataListPage[]>;

export type { ApiDataListPageTemplateProps };
