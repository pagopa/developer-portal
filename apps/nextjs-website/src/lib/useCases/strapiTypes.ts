import { BannerLinkProps } from '@/components/atoms/BannerLink/BannerLink';
import { RelatedLinksProps } from '@/components/atoms/RelatedLinks/RelatedLinks';
import { StrapiBannerLink } from '@/lib/bannerLink/types';
import { StrapiPart } from '@/lib/parts/types';
import { StrapiBaseProductWithBannerLinks } from '@/lib/products/types';
import { Paginated } from '@/lib/strapi/types/paginated';
import { StrapiRelatedLinks } from '@/lib/strapi/types/link';
import { StrapiMedia } from '@/lib/media/strapiTypes';
import { StrapiSeo } from '@/lib/seo/strapiTypes';
import { StrapiTag } from '@/lib/tags/strapiTypes';
import { UseCase } from '@/lib/useCases/types';

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
