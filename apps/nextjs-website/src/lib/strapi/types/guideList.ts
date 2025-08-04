import { BaseGuide } from '@/lib/strapi/types/guide';
import { StrapiBaseProductWithRelations } from '@/lib/strapi/codecs/ProductCodec';
import { StrapiSeo } from '@/lib/strapi/types/seo';
import { StrapiBannerLink } from '@/lib/strapi/types/bannerLink';
import { Paginated } from '@/lib/strapi/types/paginated';

export type GuideListPage = {
  readonly id: number;
  readonly attributes: {
    readonly title: string;
    readonly description: string;
    readonly product: {
      readonly data: StrapiBaseProductWithRelations;
    };
    readonly guidesByCategory: ReadonlyArray<{
      readonly category: string;
      readonly guides: {
        readonly data: ReadonlyArray<BaseGuide>;
      };
    }>;
    readonly bannerLinks: ReadonlyArray<StrapiBannerLink>;
    readonly seo?: StrapiSeo;
    readonly updatedAt: string;
  };
};

export type StrapiGuideLists = Paginated<GuideListPage>;
