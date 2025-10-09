import { StrapiBannerLink } from '@/lib/strapi/types/bannerLink';
import { StrapiSeo } from '@/lib/strapi/types/seo';
import { Paginated } from '@/lib/strapi/types/paginated';
import { StrapiBaseProductWithRelations } from '@/lib/strapi/types/product';
import { StrapiBaseUseCase } from './useCase';

export type StrapiUseCaseListPage = {
  readonly id: number;
  readonly attributes: {
    readonly bannerLinks: readonly StrapiBannerLink[];
    readonly description: string;
    readonly product: {
      readonly data?: StrapiBaseProductWithRelations;
    };
    readonly title: string;
    readonly useCases: { readonly data: readonly StrapiBaseUseCase[] };
    readonly seo?: StrapiSeo;
  };
};

export type StrapiUseCaseListPages = Paginated<StrapiUseCaseListPage>;
