import { StrapiMedia } from '@/lib/strapi/types/media';
import {
  StrapiBaseProduct,
  StrapiBaseProductWithoutBannerLinks,
} from '@/lib/strapi/types/product';
import { StrapiBannerLink } from '@/lib/strapi/types/bannerLink';
import { StrapiSeo } from '@/lib/strapi/types/seo';
import { Paginated } from '@/lib/strapi/types/paginated';
import { StrapiWebinar } from '@/lib/strapi/types/webinars';
import { BlocksContent } from '@strapi/blocks-react-renderer';
import { StrapiCaseHistoriesComponent } from '@/lib/strapi/types/caseHistoriesComponent';

export type StrapiStep = {
  readonly title: string;
  readonly content: BlocksContent;
  readonly products: readonly StrapiBaseProduct[];
};

export type StrapiStat = {
  readonly title: string;
  readonly description?: string;
};

export type StrapiBaseSolution = {
  readonly slug: string;
  readonly icon: StrapiMedia;
  readonly kickerTitle: string;
  readonly title: string;
  readonly description?: string;
  readonly dirName: string;
  readonly landingUseCaseFile: string;
};

export type StrapiBaseSolutionWithProducts = {
  readonly slug: string;
  readonly icon: StrapiMedia;
  readonly kickerTitle: string;
  readonly title: string;
  readonly description?: string;
  readonly dirName: string;
  readonly landingUseCaseFile: string;
  readonly products: readonly StrapiBaseProductWithoutBannerLinks[];
};

export type StrapiSolution = {
  readonly id: number;
  readonly slug: string;
  readonly icon: StrapiMedia;
  readonly kickerTitle: string;
  readonly title: string;
  readonly description?: string;
  readonly dirName: string;
  readonly landingUseCaseFile: string;
  readonly publishedAt: string;
  readonly updatedAt: string;
  readonly introductionToSteps?: string;
  readonly steps: readonly StrapiStep[];
  readonly stats: readonly StrapiStat[];
  readonly statsSource?: string;
  readonly bannerLinks: readonly StrapiBannerLink[];
  readonly webinars: readonly StrapiWebinar[];
  readonly products: readonly StrapiBaseProductWithoutBannerLinks[];
  readonly caseHistories?: StrapiCaseHistoriesComponent;
  readonly seo?: StrapiSeo;
};

export type StrapiSolutions = Paginated<StrapiSolution>;
