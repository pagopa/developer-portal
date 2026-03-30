import { StrapiBaseGuide } from '@/lib/guides/types';
import { StrapiSeo } from '@/lib/seo/strapiTypes';
import { StrapiBannerLink } from '@/lib/bannerLink/types';
import { StrapiBaseProductWithRelations } from '@/lib/products/strapiTypes';
import { Paginated } from '../strapi/types/paginated';

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
