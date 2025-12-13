import { StrapiBaseTutorial } from '@/lib/strapi/types/tutorial';
import { StrapiBannerLink } from '@/lib/strapi/types/bannerLink';
import { StrapiSeo } from '@/lib/strapi/types/seo';
import { Paginated } from '@/lib/strapi/types/paginated';
import { StrapiBaseProductWithRelations } from '@/lib/strapi/types/product';

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
