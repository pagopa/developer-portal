import { StrapiBaseProductWithRelations } from '@/lib/product/types';
import { StrapiBannerLink } from '@/lib/strapi/types/bannerLink';
import { StrapiSeo } from '@/lib/strapi/types/seo';
import { BaseApiData, BaseApiDataList } from '@/lib/apiDataList/types';
import { StrapiComponent } from '@/lib/strapi/types/strapiComponent';
import { ApiDataListPageTemplateProps } from '@/components/templates/ApiDataListTemplate/ApiDataListTemplate';

export type ApiDataListPage = {
  readonly id: number;
  readonly attributes: {
    readonly title: string;
    readonly description?: string;
    readonly product: {
      readonly data?: StrapiBaseProductWithRelations;
    };
    readonly updatedAt: string;
    readonly apiData: BaseApiDataList;
    readonly bannerLinks: readonly StrapiBannerLink[];
    readonly seo?: StrapiSeo;
    readonly enableFilters?: boolean;
  };
};

export type ApiDataListPageWithoutProduct = {
  readonly id: number;
  readonly attributes: {
    readonly updatedAt: string;
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

export type ApiDataListPages = StrapiComponent<readonly ApiDataListPage[]>;

export type { ApiDataListPageTemplateProps };
