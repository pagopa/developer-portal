import { StrapiBaseGuide } from '@/lib/strapi/types/guide';
import { StrapiSeo } from '@/lib/strapi/types/seo';
import { StrapiBannerLink } from '@/lib/strapi/types/bannerLink';
import { StrapiBaseProductWithRelations } from '@/lib/strapi/types/product';
import { Paginated } from './paginated';

export type StrapiGuideListPage = {
  readonly id: number;
  readonly attributes: {
    readonly title: string;
    readonly description: string;
    readonly product: {
      readonly data?: StrapiBaseProductWithRelations;
    };
    readonly guidesByCategory: ReadonlyArray<{
      readonly category: string;
      readonly guides: {
        readonly data: ReadonlyArray<StrapiBaseGuide>;
      };
    }>;
    readonly bannerLinks: ReadonlyArray<StrapiBannerLink>;
    readonly seo?: StrapiSeo;
    readonly updatedAt: string;
    readonly localizations?: {
      readonly data: ReadonlyArray<{
        readonly attributes: {
          readonly locale: string;
        };
      }>;
    };
    readonly locale: string;
  };
};

export type StrapiGuideListPages = Paginated<StrapiGuideListPage>;
