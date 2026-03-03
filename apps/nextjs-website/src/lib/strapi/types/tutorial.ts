import { StrapiMedia } from '@/lib/strapi/types/media';
import { StrapiBaseProductWithBannerLinks } from '@/lib/strapi/types/product';
import { StrapiBannerLink } from '@/lib/strapi/types/bannerLink';
import { StrapiRelatedLinks } from '@/lib/strapi/types/link';
import { StrapiSeo } from '@/lib/strapi/types/seo';
import { Paginated } from '@/lib/strapi/types/paginated';
import { StrapiPart } from '@/lib/strapi/types/part';
import { StrapiComponent } from '@/lib/strapi/types/strapiComponent';
import { StrapiTag } from '@/lib/strapi/types/tag';

export type StrapiBaseTutorial = {
  readonly attributes: {
    readonly updatedAt: string;
    readonly title: string;
    readonly slug: string;
    readonly publishedAt?: string;
    readonly image: {
      readonly data?: StrapiMedia;
    };
    readonly tags: StrapiComponent<readonly StrapiTag[] | undefined>;
    readonly product: {
      readonly data: StrapiBaseProductWithBannerLinks;
    };
    readonly icon: {
      readonly data?: StrapiMedia;
    };
    readonly description?: string;
    readonly redirectPath?: string;
  };
};

export type StrapiTutorial = StrapiBaseTutorial & {
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

export type StrapiTutorials = Paginated<StrapiTutorial>;
