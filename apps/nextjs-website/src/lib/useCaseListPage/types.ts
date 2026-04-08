import type { StrapiBaseUseCase } from '@/lib/useCases/strapiTypes';
import type { StrapiBannerLink } from '@/lib/bannerLink/types';
import type { StrapiSeo } from '@/lib/seo/strapiTypes';
import type { Paginated } from '@/lib/strapi/types/paginated';
import type { StrapiBaseProductWithRelations } from '@/lib/products/strapiTypes';

export type StrapiUseCaseListPage = {
  readonly id: number;
  readonly bannerLinks: readonly StrapiBannerLink[];
  readonly description: string;
  readonly enableFilters: boolean | undefined;
  readonly product?: StrapiBaseProductWithRelations;
  readonly seo?: StrapiSeo;
  readonly title: string;
  readonly useCases: readonly StrapiBaseUseCase[];
};

export type StrapiUseCaseListPages = Paginated<StrapiUseCaseListPage>;
