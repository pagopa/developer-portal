import { BlocksContent } from '@strapi/blocks-react-renderer';
import { StrapiBaseGuide } from '@/lib/strapi/types/guide';
import { StrapiBannerLink } from '@/lib/strapi/types/bannerLink';
import { StrapiLink, StrapiRelatedLinks } from '@/lib/strapi/types/link';
import { StrapiMedia } from '@/lib/strapi/types/media';
import { StrapiNewsShowcase } from '@/lib/strapi/types/newsShowcase';
import { Paginated } from '@/lib/strapi/types/paginated';
import { StrapiSeo } from '@/lib/strapi/types/seo';
import { StrapiBaseTutorial } from '@/lib/strapi/types/tutorial';
import { StrapiBaseUseCase } from '@/lib/strapi/types/useCase';
import { StrapiProduct } from '@/lib/product/types';

export type StartInfo = {
  readonly icon: StrapiMedia;
  readonly title: string;
  readonly description: string;
  readonly path: string;
};

export type StartInfoSection = {
  readonly title: string;
  readonly bottomLabel?: string;
  readonly bottomLink?: StrapiLink;
  readonly items: readonly StartInfo[];
};

export type Feature = {
  readonly title: string;
  readonly subtitle?: string;
  readonly items: ReadonlyArray<StrapiBannerLink>;
};

export type TutorialSection = {
  readonly title: string;
  readonly description: string;
  readonly tutorials: readonly StrapiBaseTutorial[];
  readonly showCardsLayout: boolean;
};

export type UseCaseSection = {
  readonly title: string;
  readonly description: string;
  readonly useCases: readonly StrapiBaseUseCase[];
};

export type Card = {
  readonly title: string;
  readonly content: BlocksContent;
  readonly linkText: string;
  readonly linkHref: string;
  readonly image: StrapiMedia;
  readonly mobileImage: StrapiMedia;
};

export type ServiceModel = {
  readonly title: string;
  readonly description: string;
  readonly href: string;
};

export type PostIntegration = {
  readonly title: string;
  readonly description: string;
  readonly link?: StrapiLink;
  readonly guidesTitle?: string;
  readonly documents: readonly Card[];
  readonly guides: readonly StrapiBaseGuide[];
  readonly serviceModels: readonly ServiceModel[];
};

export type Overview = {
  readonly id: number;
  readonly title: string;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly publishedAt: string;
  readonly subtitle: string;
  readonly backgroundImage: StrapiMedia;
  readonly features?: Feature;
  readonly startInfoSection?: StartInfoSection;
  readonly tutorialSection?: TutorialSection;
  readonly useCaseSection?: UseCaseSection;
  readonly postIntegration?: PostIntegration;
  readonly relatedLinks?: StrapiRelatedLinks;
  readonly product: StrapiProduct;
  readonly bannerLinks: readonly StrapiBannerLink[];
  readonly seo?: StrapiSeo;
  readonly whatsNew?: StrapiNewsShowcase;
};

export type Overviews = Paginated<Overview>;
