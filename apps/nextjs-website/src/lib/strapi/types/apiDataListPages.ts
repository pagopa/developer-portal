import { StrapiBaseProductWithRelations } from '@/lib/strapi/types/product';
import { StrapiBannerLink } from '@/lib/strapi/types/bannerLink';
import { StrapiSeo } from '@/lib/strapi/types/seo';
import {
  StrapiBaseApiData,
  StrapiBaseApiDataList,
} from '@/lib/strapi/types/apiDataList';
import { StrapiComponent } from './strapiComponent';

export type StrapiApiDataListPage = {
  readonly id: number;
  readonly attributes: {
    readonly title: string;
    readonly description?: string;
    readonly product: {
      readonly data?: StrapiBaseProductWithRelations;
    };
    readonly updatedAt: string;
    readonly apiData: StrapiBaseApiDataList;
    readonly bannerLinks: readonly StrapiBannerLink[];
    readonly seo?: StrapiSeo;
    readonly enableFilters?: boolean;
    readonly localizations?: {
      readonly data: ReadonlyArray<{
        readonly attributes: {
          readonly locale: string;
          readonly slug: string;
          readonly updatedAt: string;
        };
      }>;
    };
    readonly locale: string;
  };
};

export type StrapiApiDataListPageWithoutProduct = {
  readonly id: number;
  readonly attributes: {
    readonly apiData: StrapiComponent<
      readonly {
        readonly attributes: Pick<
          StrapiBaseApiData['attributes'],
          'apiRestDetail' | 'apiSoapDetail'
        >;
      }[]
    >;
  };
};

export type StrapiApiDataListPages = StrapiComponent<
  readonly StrapiApiDataListPage[]
>;
