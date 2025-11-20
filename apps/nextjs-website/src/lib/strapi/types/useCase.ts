import { StrapiMedia } from '@/lib/strapi/types/media';
import { StrapiBaseProductWithBannerLinks } from '@/lib/strapi/types/product';
import { StrapiBannerLink } from '@/lib/strapi/types/bannerLink';
import { StrapiRelatedLinks } from '@/lib/strapi/types/link';
import { StrapiSeo } from '@/lib/strapi/types/seo';
import { Paginated } from '@/lib/strapi/types/paginated';
import { StrapiPart } from '@/lib/strapi/types/part';
import { StrapiComponent } from '@/lib/strapi/types/strapiComponent';
import { StrapiTag } from '@/lib/strapi/types/tag';

export type StrapiBaseUseCase = {
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
  readonly subtitle?: string;
  readonly tags: StrapiComponent<readonly StrapiTag[] | undefined>;
  readonly title: string;
};

export type StrapiUseCase = StrapiBaseUseCase & {
  readonly createdAt: string;
  readonly locale: string;
  readonly parts: readonly StrapiPart[];
  readonly updatedAt: string;
  readonly bannerLinks?: readonly StrapiBannerLink[];
  readonly relatedLinks?: StrapiRelatedLinks;
  readonly seo?: StrapiSeo;
};

export type StrapiUseCases = Paginated<StrapiUseCase>;
