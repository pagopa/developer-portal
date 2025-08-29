import { StrapiBaseProductWithRelations } from '@/lib/strapi/types/product';
import { StrapiBannerLink } from '@/lib/strapi/types/bannerLink';
import { StrapiSeo } from '@/lib/strapi/types/seo';
import {
  BaseApiData,
  StrapiBaseApiDataList,
} from '@/lib/strapi/types/apiDataList';
import { StrapiComponent } from './strapiComponent';

export type ApiDataListPage = {
  readonly id: number;
  readonly attributes: {
    readonly title: string;
    readonly description?: string;
    readonly product: {
      readonly data: StrapiBaseProductWithRelations;
    };
    readonly updatedAt: string;
    readonly apiData: StrapiBaseApiDataList;
    readonly bannerLinks: readonly StrapiBannerLink[];
    readonly seo?: StrapiSeo;
  };
};

export type ApiDataListPageWithoutProduct = {
  readonly id: number;
  readonly attributes: {
    readonly apiData: StrapiComponent<
      readonly {
        readonly attributes: Pick<
          BaseApiData['attributes'],
          'apiRestDetail' | 'apiSoapDetail'
        >;
      }[]
    >;
  };
};

export type StrapiApiDataListPages = StrapiComponent<
  readonly ApiDataListPage[]
>;
