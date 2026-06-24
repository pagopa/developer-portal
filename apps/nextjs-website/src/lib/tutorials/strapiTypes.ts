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
import type { Tutorial } from '@/lib/tutorials/types';

export type StrapiBaseTutorial = {
  readonly updatedAt: string;
  readonly title: string;
  readonly slug: string;
  readonly publishedAt?: string;
  readonly image?: StrapiMedia;
  readonly tags?: readonly StrapiTag[];
  readonly product?: StrapiBaseProductWithBannerLinks;
  readonly icon?: StrapiMedia;
  readonly description?: string;
  readonly redirectPath?: string;
};

export type StrapiTutorial = StrapiBaseTutorial & {
  readonly createdAt: string;
  readonly locale: string;
  readonly parts: readonly StrapiPart[];
  readonly updatedAt: string;
  readonly bannerLinks?: readonly StrapiBannerLink[];
  readonly relatedLinks?: StrapiRelatedLinks;
  readonly seo?: StrapiSeo;
};

export type StrapiTutorials = Paginated<StrapiTutorial>;

export type TutorialProps = Tutorial & {
  readonly productSlug: string;
  readonly relatedLinks?: RelatedLinksProps;
  readonly bannerLinks?: readonly BannerLinkProps[];
};
