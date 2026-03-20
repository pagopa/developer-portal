import { StrapiMedia } from '@/lib/strapi/types/media';
import { StrapiBaseProductWithoutBannerLinks } from '@/lib/product/types';
import { StrapiSeo } from '@/lib/strapi/types/seo';
import { Paginated } from '@/lib/strapi/types/paginated';
import { StrapiPart } from '@/lib/strapi/types/part';

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
