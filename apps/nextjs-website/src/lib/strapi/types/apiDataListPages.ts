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
      readonly Pick<
        BaseApiData['attributes'],
        'apiRestDetail' | 'apiSoapDetail'
      >[]
    >;
  };
};

export type StrapiApiDataListPages = StrapiComponent<
  readonly ApiDataListPage[]
>;

// ataListPage = {
//   readonly data?: {
//     readonly id: number;
//     readonly attributes: {
//       readonly apiData: {
//         readonly data: readonly [
//           {
//             readonly id: number;
//             readonly attributes: {
//               readonly apiRestDetail?: {
//                 readonly slug: string;
//                 readonly specUrl: StrapiUrl;
//               };
//               readonly apiSoapDetail?: {
//                 readonly slug: string;
//                 readonly repositoryUrl: string;
//                 readonly dirName: string;
//               };
//             };
//           }
//         ];
//       };
//     };
//   };
// };
