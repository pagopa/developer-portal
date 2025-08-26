import { StrapiMedia } from '@/lib/strapi/types/media';
import { BaseProductWithoutBannerLinks } from '@/lib/strapi/types/product';
import { StrapiSeo } from '@/lib/strapi/types/seo';
import { Paginated } from '@/lib/strapi/types/paginated';
import { StrapiPart } from '@/lib/strapi/types/part';

export type BaseCaseHistory = {
  readonly id: number;
  readonly attributes: {
    readonly slug: string;
    readonly title: string;
    readonly description?: string;
    readonly publishedAt: string;
    readonly updatedAt: string;
    readonly image?: {
      readonly data?: StrapiMedia;
    };
  };
};

export type CaseHistory = BaseCaseHistory & {
  readonly attributes: BaseCaseHistory['attributes'] & {
    readonly products: {
      readonly data: readonly BaseProductWithoutBannerLinks[];
    };
    readonly parts: readonly StrapiPart[];
    readonly seo?: StrapiSeo;
  };
};

export type StrapiCaseHistories = Paginated<CaseHistory>;
