import { StrapiBaseGuide } from '@/lib/strapi/types/guide';
import { StrapiSeo } from '@/lib/strapi/types/seo';
import { StrapiBannerLink } from '@/lib/strapi/types/bannerLink';
import { StrapiBaseProductWithRelations } from '@/lib/strapi/types/product';
import { Paginated } from './paginated';

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
