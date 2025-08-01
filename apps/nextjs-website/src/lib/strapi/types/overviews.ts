import { BaseGuide } from '@/lib/strapi/types/guide';
import { Link, RelatedLinks } from '@/lib/strapi/types/link';
import { Media } from '@/lib/strapi/types/media';
import { Pagination } from '@/lib/strapi/types/pagination';
import { StrapiProduct } from '@/lib/strapi/codecs/ProductCodec';
import { StrapiBaseTutorial } from '@/lib/strapi/codecs/TutorialCodec';
import { StrapiBannerLink } from '@/lib/strapi/types/bannerLink';
import { StrapiNewsShowcase } from '@/lib/strapi/types/newsShowcase';
import { BlocksContent } from '@strapi/blocks-react-renderer';
import { StrapiSeo } from '@/lib/strapi/types/seo';

export type StartInfo = {
  readonly icon: { readonly data: Media };
  readonly title: string;
  readonly description: string;
  readonly path: string;
};

export type StartInfoSection = {
  readonly title: string;
  readonly bottomLabel?: string;
  readonly bottomLink?: Link;
  readonly items: readonly StartInfo[];
};

export type StrapiFeature = {
  readonly title: string;
  readonly subtitle?: string;
  readonly items: ReadonlyArray<StrapiBannerLink>;
};

export type TutorialSection = {
  readonly title: string;
  readonly description: string;
  readonly tutorials: { readonly data: readonly StrapiBaseTutorial[] };
};

export type CardProps = {
  readonly title: string;
  readonly content: BlocksContent;
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
  readonly link?: Link;
  readonly guidesTitle?: string;
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
    readonly features?: StrapiFeature;
    readonly startInfoSection?: StartInfoSection;
    readonly tutorialSection?: TutorialSection;
    readonly postIntegration?: PostIntegration;
    readonly relatedLinks?: RelatedLinks;
    readonly product: { readonly data: StrapiProduct };
    readonly bannerLinks: readonly StrapiBannerLink[];
    readonly seo?: StrapiSeo;
    readonly whatsNew?: StrapiNewsShowcase;
  };
};

export type StrapiOverviews = {
  readonly data: readonly Overview[];
  readonly meta: {
    readonly pagination: Pagination;
  };
};
