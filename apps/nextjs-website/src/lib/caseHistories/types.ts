import { StrapiMedia } from '@/lib/media/strapiTypes';
import { StrapiBaseProductWithoutBannerLinks } from '@/lib/products/strapiTypes';
import { StrapiSeo } from '@/lib/seo/strapiTypes';
import { Paginated } from '@/lib/strapi/types/paginated';
import { StrapiPart } from '@/lib/parts/types';

export type BaseCaseHistory = {
  readonly id: number;
  readonly slug: string;
  readonly title: string;
  readonly description?: string;
  readonly publishedAt: string;
  readonly updatedAt: string;
  readonly image?: StrapiMedia;
};

export type CaseHistory = BaseCaseHistory & {
  readonly products: readonly StrapiBaseProductWithoutBannerLinks[];
  readonly parts: readonly StrapiPart[];
  readonly seo?: StrapiSeo;
};

export type CaseHistoriesComponent = {
  readonly title: string;
  readonly description?: string;
  readonly case_histories: readonly BaseCaseHistory[];
};

export type CaseHistories = Paginated<CaseHistory>;
