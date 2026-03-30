import { StrapiBaseTutorial } from '@/lib/tutorials/strapiTypes';
import { StrapiBannerLink } from '@/lib/bannerLink/types';
import { StrapiSeo } from '@/lib/seo/strapiTypes';
import { Paginated } from '@/lib/strapi/types/paginated';
import { StrapiBaseProductWithRelations } from '@/lib/products/types';

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
