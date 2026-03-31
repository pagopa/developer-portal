import type { StrapiMedia } from '@/lib/media/strapiTypes';
import type { StrapiBaseProductWithoutBannerLinks } from '@/lib/products/strapiTypes';
import type { StrapiSeo } from '@/lib/seo/strapiTypes';
import type { Paginated } from '@/lib/strapi/types/paginated';
import type { StrapiPart } from '@/lib/parts/strapiTypes';

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
