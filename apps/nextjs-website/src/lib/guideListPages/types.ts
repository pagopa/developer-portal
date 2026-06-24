import type { StrapiBaseGuide } from '@/lib/guides/strapiTypes';
import type { StrapiSeo } from '@/lib/seo/strapiTypes';
import type { StrapiBannerLink } from '@/lib/bannerLink/types';
import type { StrapiBaseProductWithRelations } from '@/lib/products/strapiTypes';
import type { Paginated } from '@/lib/strapi/types/paginated';

export type StrapiGuideListPage = {
  readonly id: number;
  readonly title: string;
  readonly description: string;
  readonly product?: StrapiBaseProductWithRelations;
  readonly guidesByCategory: ReadonlyArray<{
    readonly category: string;
    readonly guides: ReadonlyArray<StrapiBaseGuide>;
  }>;
  readonly bannerLinks: ReadonlyArray<StrapiBannerLink>;
  readonly seo?: StrapiSeo;
  readonly updatedAt: string;
};

export type StrapiGuideListPages = Paginated<StrapiGuideListPage>;
