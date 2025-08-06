import { StrapiMedia } from '@/lib/strapi/types/media';
import { BaseProduct } from '@/lib/strapi/types/product';
import { StrapiProduct } from '@/lib/strapi/codecs/ProductCodec';
import { StrapiBannerLink } from '@/lib/strapi/types/bannerLink';
import { RelatedLinks } from '@/lib/strapi/types/link';
import { StrapiSeo } from '@/lib/strapi/types/seo';
import { Paginated } from '@/lib/strapi/types/paginated';
import { StrapiPart } from '@/lib/strapi/types/part';

export type BaseTutorial = {
  readonly attributes: {
    readonly title: string;
    readonly slug: string;
    readonly publishedAt?: string;
    readonly image: {
      readonly data?: StrapiMedia;
    };
    readonly product: {
      readonly data: BaseProduct;
    };
  };
};

export type Tutorial = {
  readonly attributes: BaseTutorial['attributes'] & {
    readonly createdAt: string;
    readonly locale: string;
    readonly parts: readonly StrapiPart[];
    readonly product: { readonly data: StrapiProduct };
    readonly updatedAt: string;
    readonly bannerLinks?: readonly StrapiBannerLink[];
    readonly relatedLinks?: RelatedLinks;
    readonly seo?: StrapiSeo;
  };
};

export type StrapiTutorials = Paginated<Tutorial>;
