import type { StrapiBaseTutorial } from '@/lib/tutorials/strapiTypes';
import type { StrapiBannerLink } from '@/lib/bannerLink/types';
import type { StrapiSeo } from '@/lib/seo/strapiTypes';
import type { Paginated } from '@/lib/strapi/types/paginated';
import type { StrapiBaseProductWithRelations } from '@/lib/products/strapiTypes';

export type StrapiTutorialsListPage = {
  readonly id: number;
  readonly bannerLinks: readonly StrapiBannerLink[];
  readonly description: string;
  readonly product?: StrapiBaseProductWithRelations;
  readonly title: string;
  readonly tutorials: readonly StrapiBaseTutorial[];
  readonly seo?: StrapiSeo;
  readonly enableFilters?: boolean;
};

export type StrapiTutorialListPages = Paginated<StrapiTutorialsListPage>;
