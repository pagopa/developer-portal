import { BlocksContent } from '@strapi/blocks-react-renderer';
import { StrapiBaseGuide } from '@/lib/strapi/types/guide';
import { StrapiBannerLink } from '@/lib/shared/bannerLink/types';
import { StrapiLink, StrapiRelatedLinks } from '@/lib/strapi/types/link';
import { StrapiMedia } from '@/lib/strapi/types/media';
import { StrapiNewsShowcase } from '@/lib/strapi/types/newsShowcase';
import { Paginated } from '@/lib/strapi/types/paginated';
import { StrapiSeo } from '@/lib/strapi/types/seo';
import { StrapiBaseTutorial } from '@/lib/strapi/types/tutorial';
import { StrapiBaseUseCase } from '@/lib/strapi/types/useCase';
import { StrapiProduct } from '@/lib/product/types';

export type StrapiStartInfo = {
  readonly icon: StrapiMedia;
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
  readonly tutorials: readonly StrapiBaseTutorial[];
  readonly showCardsLayout: boolean;
};

export type StrapiUseCaseSection = {
  readonly title: string;
  readonly description: string;
  readonly useCases: readonly StrapiBaseUseCase[];
};

export type StrapiCard = {
  readonly title: string;
  readonly content: BlocksContent;
  readonly linkText: string;
  readonly linkHref: string;
  readonly image: StrapiMedia;
  readonly mobileImage: StrapiMedia;
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
  readonly documents: readonly StrapiCard[];
  readonly guides: readonly StrapiBaseGuide[];
  readonly serviceModels: readonly StrapiServiceModel[];
};

export type StrapiOverview = {
  readonly id: number;
  readonly title: string;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly publishedAt: string;
  readonly subtitle: string;
  readonly backgroundImage: StrapiMedia;
  readonly features?: StrapiFeature;
  readonly startInfoSection?: StrapiStartInfoSection;
  readonly tutorialSection?: StrapiTutorialSection;
  readonly useCaseSection?: StrapiUseCaseSection;
  readonly postIntegration?: StrapiPostIntegration;
  readonly relatedLinks?: StrapiRelatedLinks;
  readonly product: StrapiProduct;
  readonly bannerLinks: readonly StrapiBannerLink[];
  readonly seo?: StrapiSeo;
  readonly whatsNew?: StrapiNewsShowcase;
};

export type StrapiOverviews = Paginated<StrapiOverview>;
