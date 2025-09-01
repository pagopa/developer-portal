import { BlocksContent } from '@strapi/blocks-react-renderer';
import { StrapiRelatedLinks } from '@/lib/strapi/types/link';
import { StrapiMedia } from '@/lib/strapi/types/media';
import { StrapiLink } from '@/lib/strapi/types/link';
import { StrapiWebinar } from '@/lib/strapi/types/webinars';
import { StrapiProduct } from '@/lib/strapi/types/product';
import { StrapiSeo } from '@/lib/strapi/types/seo';
import { StrapiBaseSolution } from '@/lib/strapi/types/solutions';
import { StrapiNewsShowcase } from '@/lib/strapi/types/newsShowcase';

type StrapiCallToAction = {
  readonly link: StrapiLink;
  readonly variant?: 'text' | 'contained' | 'outlined';
};

type StrapiHeroSlide = {
  readonly title: string;
  readonly subhead?: BlocksContent;
  readonly subheadColor?: 'contrastText' | 'main' | 'light' | 'dark';
  readonly callToAction?: StrapiCallToAction;
  readonly titleColor?: 'contrastText' | 'main' | 'light' | 'dark';
  readonly backgroundImage: {
    readonly data?: StrapiMedia;
  };
};

type StrapiEcosystem = {
  readonly title?: string;
  readonly productsTabName: string;
  readonly products: {
    readonly data: readonly StrapiProduct[];
  };
  readonly solutionsTabName: string;
  readonly solutions: {
    readonly data: readonly StrapiBaseSolution[];
  };
  readonly solutionsCta?: StrapiCallToAction;
};

export type Homepage = {
  readonly data: {
    readonly attributes: {
      readonly comingsoonDocumentation: StrapiRelatedLinks;
      readonly heroSlider: readonly StrapiHeroSlide[];
      readonly newsShowcase?: StrapiNewsShowcase;
      readonly ecosystem?: StrapiEcosystem;
      readonly webinars: {
        readonly data: readonly StrapiWebinar[];
      };
      readonly seo?: StrapiSeo;
    };
  };
};

export type StrapiHomepage = Homepage;
