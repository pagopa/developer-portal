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
import { Tutorial } from '@/lib/tutorials/types';

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
