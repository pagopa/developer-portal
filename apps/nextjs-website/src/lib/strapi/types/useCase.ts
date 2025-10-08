import { StrapiMedia } from '@/lib/strapi/types/media';
import { StrapiBaseProductWithBannerLinks } from '@/lib/strapi/types/product';
import { StrapiBannerLink } from '@/lib/strapi/types/bannerLink';
import { StrapiRelatedLinks } from '@/lib/strapi/types/link';
import { StrapiSeo } from '@/lib/strapi/types/seo';
import { Paginated } from '@/lib/strapi/types/paginated';
import { StrapiPart } from '@/lib/strapi/types/part';

export type StrapiBaseUseCase = {
  readonly attributes: {
    readonly coverImage: {
      readonly data?: StrapiMedia;
    };
    readonly headerImage?: {
      readonly data?: StrapiMedia;
    };
    readonly product: {
      readonly data: StrapiBaseProductWithBannerLinks;
    };
    readonly publishedAt?: string;
    readonly slug: string;
    readonly title: string;
  };
};

export type StrapiUseCase = StrapiBaseUseCase & {
  readonly attributes: {
    readonly createdAt: string;
    readonly locale: string;
    readonly parts: readonly StrapiPart[];
    readonly updatedAt: string;
    readonly bannerLinks?: readonly StrapiBannerLink[];
    readonly relatedLinks?: StrapiRelatedLinks;
    readonly seo?: StrapiSeo;
  };
};

export type StrapiUseCases = Paginated<StrapiUseCase>;
