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
  readonly products: {
    readonly data: readonly StrapiBaseProduct[];
  };
};

export type StrapiStat = {
  readonly title: string;
  readonly description?: string;
};

export type StrapiBaseSolution = {
  readonly attributes: {
    readonly slug: string;
    readonly icon: {
      readonly data: StrapiMedia;
    };
    readonly kickerTitle: string;
    readonly title: string;
    readonly description?: string;
    readonly dirName: string;
    readonly landingUseCaseFile: string;
    readonly locale: string;
    readonly updatedAt: string;
  };
};

export type StrapiBaseSolutionWithProducts = {
  readonly attributes: {
    readonly slug: string;
    readonly icon: {
      readonly data: StrapiMedia;
    };
    readonly kickerTitle: string;
    readonly title: string;
    readonly description?: string;
    readonly dirName: string;
    readonly landingUseCaseFile: string;
    readonly locale: string;
    readonly updatedAt: string;
    readonly products: {
      readonly data: readonly StrapiBaseProductWithoutBannerLinks[];
    };
  };
};

export type StrapiSolution = {
  readonly id: number;
  readonly attributes: {
    readonly slug: string;
    readonly icon: {
      readonly data: StrapiMedia;
    };
    readonly kickerTitle: string;
    readonly title: string;
    readonly description?: string;
    readonly dirName: string;
    readonly landingUseCaseFile: string;
    readonly publishedAt: string;
    readonly updatedAt: string;
    readonly locale: string;
    readonly introductionToSteps?: string;
    readonly steps: readonly StrapiStep[];
    readonly stats: readonly StrapiStat[];
    readonly statsSource?: string;
    readonly bannerLinks: readonly StrapiBannerLink[];
    readonly webinars: {
      readonly data: readonly StrapiWebinar[];
    };
    readonly products: {
      readonly data: readonly StrapiBaseProductWithoutBannerLinks[];
    };
    readonly caseHistories?: StrapiCaseHistoriesComponent;
    readonly seo?: StrapiSeo;
    readonly localizations?: {
      readonly data: ReadonlyArray<{
        readonly attributes: {
          readonly locale: string;
          readonly slug: string;
        };
      }>;
    };
  };
};

export type StrapiSolutions = Paginated<StrapiSolution>;
