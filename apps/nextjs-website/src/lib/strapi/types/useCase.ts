import { StrapiMedia } from '@/lib/strapi/types/media';
import { StrapiBaseProductWithBannerLinks } from '@/lib/product/types';
import { StrapiBannerLink } from '@/lib/bannerLink/types';
import { StrapiRelatedLinks } from '@/lib/strapi/types/link';
import { StrapiSeo } from '@/lib/strapi/types/seo';
import { Paginated } from '@/lib/strapi/types/paginated';
import { StrapiPart } from '@/lib/parts/types';
import { StrapiTag } from '@/lib/strapi/types/tag';

export type StrapiBaseUseCase = {
  readonly coverImage?: StrapiMedia;
  readonly headerImage?: StrapiMedia;
  readonly product: StrapiBaseProductWithBannerLinks;
  readonly publishedAt?: string;
  readonly slug: string;
  readonly subtitle?: string;
  readonly tags?: readonly StrapiTag[];
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
