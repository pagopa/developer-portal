import { StrapiBaseUseCase } from '@/lib/useCases/types';
import { StrapiBannerLink } from '@/lib/bannerLink/types';
import { StrapiSeo } from '@/lib/strapi/types/seo';
import { Paginated } from '@/lib/strapi/types/paginated';
import { StrapiBaseProductWithRelations } from '@/lib/products/types';

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
