import { StrapiMedia } from '@/lib/strapi/types/media';
import { StrapiBaseProductWithoutBannerLinks } from '@/lib/strapi/types/product';
import { StrapiSeo } from '@/lib/strapi/types/seo';
import { Paginated } from '@/lib/strapi/types/paginated';
import { StrapiPart } from '@/lib/strapi/types/part';

export type StrapiBaseCaseHistory = {
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

export type StrapiCaseHistory = StrapiBaseCaseHistory & {
  readonly attributes: StrapiBaseCaseHistory['attributes'] & {
    readonly products: {
      readonly data: readonly StrapiBaseProductWithoutBannerLinks[];
    };
    readonly parts: readonly StrapiPart[];
    readonly seo?: StrapiSeo;
  };
};

export type StrapiCaseHistories = Paginated<StrapiCaseHistory>;
