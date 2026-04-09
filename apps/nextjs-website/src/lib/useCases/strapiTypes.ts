import type { BannerLinkProps } from '@/components/atoms/BannerLink/BannerLink';
import type { RelatedLinksProps } from '@/components/atoms/RelatedLinks/RelatedLinks';
import type { StrapiBannerLink } from '@/lib/bannerLink/types';
import type { StrapiPart } from '@/lib/parts/strapiTypes';
import type { StrapiBaseProductWithBannerLinks } from '@/lib/products/strapiTypes';
import type { Paginated } from '@/lib/strapi/types/paginated';
import type { StrapiRelatedLinks } from '@/lib/strapi/types/link';
import type { StrapiMedia } from '@/lib/media/strapiTypes';
import type { StrapiSeo } from '@/lib/seo/strapiTypes';
import type { StrapiTag } from '@/lib/tags/strapiTypes';
import type { UseCase } from '@/lib/useCases/types';

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

export type UseCaseProps = UseCase & {
  readonly productSlug: string;
  readonly relatedLinks?: RelatedLinksProps;
  readonly bannerLinks?: readonly BannerLinkProps[];
};
