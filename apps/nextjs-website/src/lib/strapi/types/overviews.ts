import { BaseGuide } from '@/lib/strapi/types/guide';
import { Link, RelatedLinks } from '@/lib/strapi/types/link';
import { Media } from '@/lib/strapi/types/media';
import { Pagination } from '@/lib/strapi/types/pagination';
import { StrapiSEO } from '@/lib/strapi/codecs/SeoCodec';
import { StrapiProduct } from '@/lib/strapi/codecs/ProductCodec';
import { StrapiBlocksContent } from '@/lib/strapi/codecs/BlocksContentCodec';
import { StrapiBaseTutorial } from '@/lib/strapi/codecs/TutorialCodec';
import { StrapiBannerLink } from '@/lib/strapi/types/bannerLink';
import { StrapiNewsShowcase } from '@/lib/strapi/types/newsShowcase';

export type StartInfo = {
  readonly icon: { readonly data: Media };
  readonly title: string;
  readonly description: string;
  readonly path: string;
};

export type StartInfoSection = {
  readonly title: string;
  readonly bottomLabel?: string | null;
  readonly bottomLink?: Link | null;
  readonly items: readonly StartInfo[];
};

export type StrapiFeature = {
  readonly title: string;
  readonly subtitle?: string | null;
  readonly items: ReadonlyArray<StrapiBannerLink>;
};

export type TutorialSection = {
  readonly title: string;
  readonly description: string;
  readonly tutorials: { readonly data: readonly StrapiBaseTutorial[] };
};

export type CardProps = {
  readonly title: string;
  readonly content: StrapiBlocksContent;
  readonly linkText: string;
  readonly linkHref: string;
  readonly image: { readonly data: Media };
  readonly mobileImage: { readonly data: Media };
};

export type ServiceModel = {
  readonly title: string;
  readonly description: string;
  readonly href: string;
};

export type PostIntegration = {
  readonly title: string;
  readonly description: string;
  readonly link?: Link | null;
  readonly guidesTitle?: string | null;
  readonly documents: readonly CardProps[];
  readonly guides: { readonly data: readonly BaseGuide[] };
  readonly serviceModels: readonly ServiceModel[];
};

export type Overview = {
  readonly id: number;
  readonly attributes: {
    readonly title: string;
    readonly createdAt: string;
    readonly updatedAt: string;
    readonly publishedAt: string;
    readonly subtitle: string;
    readonly backgroundImage: { readonly data: Media };
    readonly features?: StrapiFeature | null;
    readonly startInfoSection?: StartInfoSection | null;
    readonly tutorialSection?: TutorialSection | null;
    readonly postIntegration?: PostIntegration | null;
    readonly relatedLinks?: RelatedLinks | null;
    readonly product: { readonly data: StrapiProduct };
    readonly bannerLinks: readonly StrapiBannerLink[];
    readonly seo?: StrapiSEO | null;
    readonly whatsNew?: StrapiNewsShowcase | null;
  };
};

export type StrapiOverviews = {
  readonly data: readonly Overview[];
  readonly meta: {
    readonly pagination: Pagination;
  };
};
