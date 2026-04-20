import type { StrapiBannerLink } from '@/lib/bannerLink/types';
import type { CaseHistoriesComponent } from '@/lib/caseHistories/types';
import type {
  StrapiBaseProduct,
  StrapiBaseProductWithoutBannerLinks,
} from '@/lib/products/strapiTypes';
import type { Paginated } from '@/lib/strapi/types/paginated';
import type { StrapiMedia } from '@/lib/media/strapiTypes';
import type { StrapiSeo } from '@/lib/seo/strapiTypes';
import type { StrapiWebinar } from '@/lib/webinars/strapiTypes';
import type { BlocksContent } from '@strapi/blocks-react-renderer';

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
  readonly caseHistories?: CaseHistoriesComponent;
  readonly seo?: StrapiSeo;
};

export type StrapiSolutions = Paginated<StrapiSolution>;
