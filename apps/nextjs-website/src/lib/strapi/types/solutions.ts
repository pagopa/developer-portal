import { StrapiMedia } from '@/lib/strapi/types/media';
import {
  BaseProduct,
  BaseProductWithoutBannerLinks,
} from '@/lib/strapi/types/product';
import { StrapiBannerLink } from '@/lib/strapi/types/bannerLink';
import { StrapiSeo } from '@/lib/strapi/types/seo';
import { Paginated } from '@/lib/strapi/types/paginated';
import { StrapiWebinar } from '@/lib/strapi/types/webinars';
import { BlocksContent } from '@strapi/blocks-react-renderer';
import { CaseHistoriesComponent } from '@/lib/strapi/types/caseHistoriesComponent';

export type Step = {
  readonly title: string;
  readonly content: BlocksContent;
  readonly products: {
    readonly data: readonly BaseProduct[];
  };
};

export type Stat = {
  readonly title: string;
  readonly description?: string;
};

export type BaseSolution = {
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
  };
};

export type BaseSolutionWithProducts = {
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
    readonly products: {
      readonly data: readonly BaseProductWithoutBannerLinks[];
    };
  };
};

export type Solution = {
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
    readonly publishedAt: Date;
    readonly updatedAt: Date;
    readonly introductionToSteps?: string;
    readonly steps: readonly Step[];
    readonly stats: readonly Stat[];
    readonly statsSource?: string;
    readonly bannerLinks: readonly StrapiBannerLink[];
    readonly webinars: {
      readonly data: readonly StrapiWebinar[];
    };
    readonly products: {
      readonly data: readonly BaseProductWithoutBannerLinks[];
    };
    readonly caseHistories?: CaseHistoriesComponent;
    readonly seo?: StrapiSeo;
  };
};

export type StrapiSolutions = Paginated<Solution>;
