import * as t from 'io-ts/lib';
import { StrapiBannerLink } from '@/lib/strapi/codecs/BannerLinkCodec';
import { Pagination } from '@/lib/strapi/types/pagination';
import { BaseGuide } from '@/lib/strapi/types/guide';
import { SEOCodec } from '@/lib/strapi/codecs/SeoCodec';
import { StrapiBaseProductWithRelations } from '@/lib/strapi/codecs/ProductCodec';

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
    readonly seo: t.TypeOf<typeof SEOCodec> | null;
    readonly updatedAt: string;
  };
};

export type StrapiGuideListPages = {
  readonly data: ReadonlyArray<GuideListPage>;
  readonly meta: {
    readonly pagination: Pagination;
  };
};
