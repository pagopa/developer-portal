import { StrapiBaseGuide } from '@/lib/strapi/types/guide';
import { StrapiLink, StrapiRelatedLinks } from '@/lib/strapi/types/link';
import { StrapiMedia } from '@/lib/strapi/types/media';
import { StrapiBannerLink } from '@/lib/strapi/types/bannerLink';
import { StrapiNewsShowcase } from '@/lib/strapi/types/newsShowcase';
import { BlocksContent } from '@strapi/blocks-react-renderer';
import { StrapiSeo } from '@/lib/strapi/types/seo';
import { Paginated } from '@/lib/strapi/types/paginated';
import { StrapiBaseTutorial } from '@/lib/strapi/types/tutorial';
import { StrapiProduct } from '@/lib/strapi/types/product';

export type StrapiStartInfo = {
  readonly icon: { readonly data: StrapiMedia };
  readonly title: string;
  readonly description: string;
  readonly path: string;
};

export type StrapiStartInfoSection = {
  readonly title: string;
  readonly bottomLabel?: string;
  readonly bottomLink?: StrapiLink;
  readonly items: readonly StrapiStartInfo[];
};

export type StrapiFeature = {
  readonly title: string;
  readonly subtitle?: string;
  readonly items: ReadonlyArray<StrapiBannerLink>;
};

export type StrapiTutorialSection = {
  readonly title: string;
  readonly description: string;
  readonly tutorials: { readonly data: readonly StrapiBaseTutorial[] };
  readonly showNewLayout: boolean;
};

export type StrapiCardProps = {
  readonly title: string;
  readonly content: BlocksContent;
  readonly linkText: string;
  readonly linkHref: string;
  readonly image: { readonly data: StrapiMedia };
  readonly mobileImage: { readonly data: StrapiMedia };
};

export type StrapiServiceModel = {
  readonly title: string;
  readonly description: string;
  readonly href: string;
};

export type StrapiPostIntegration = {
  readonly title: string;
  readonly description: string;
  readonly link?: StrapiLink;
  readonly guidesTitle?: string;
  readonly documents: readonly StrapiCardProps[];
  readonly guides: { readonly data: readonly StrapiBaseGuide[] };
  readonly serviceModels: readonly StrapiServiceModel[];
};

export type StrapiOverview = {
  readonly id: number;
  readonly attributes: {
    readonly title: string;
    readonly createdAt: string;
    readonly updatedAt: string;
    readonly publishedAt: string;
    readonly subtitle: string;
    readonly backgroundImage: { readonly data: StrapiMedia };
    readonly features?: StrapiFeature;
    readonly startInfoSection?: StrapiStartInfoSection;
    readonly tutorialSection?: StrapiTutorialSection;
    readonly postIntegration?: StrapiPostIntegration;
    readonly relatedLinks?: StrapiRelatedLinks;
    readonly product: { readonly data: StrapiProduct };
    readonly bannerLinks: readonly StrapiBannerLink[];
    readonly seo?: StrapiSeo;
    readonly whatsNew?: StrapiNewsShowcase;
  };
};

export type StrapiOverviews = Paginated<StrapiOverview>;
