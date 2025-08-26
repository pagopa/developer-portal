import { BlocksContent } from '@strapi/blocks-react-renderer';
import { RelatedLinks } from '@/lib/strapi/types/link';
import { StrapiMedia } from '@/lib/strapi/types/media';
import { Link } from '@/lib/strapi/types/link';
import { StrapiWebinar } from '@/lib/strapi/types/webinars';
import { StrapiProduct } from '@/lib/strapi/types/product';
import { StrapiSeo } from '@/lib/strapi/types/seo';
import { BaseSolution } from '@/lib/strapi/types/solutions';
import { StrapiNewsShowcase } from '@/lib/strapi/types/newsShowcase';

type CallToAction = {
  readonly link: Link;
  readonly variant?: 'text' | 'contained' | 'outlined';
};

type HeroSlide = {
  readonly title: string;
  readonly subhead?: BlocksContent;
  readonly subheadColor?: 'contrastText' | 'main' | 'light' | 'dark';
  readonly callToAction?: CallToAction;
  readonly titleColor?: 'contrastText' | 'main' | 'light' | 'dark';
  readonly backgroundImage: {
    readonly data?: StrapiMedia;
  };
};

type Ecosystem = {
  readonly title?: string;
  readonly productsTabName: string;
  readonly products: {
    readonly data: readonly StrapiProduct[];
  };
  readonly solutionsTabName: string;
  readonly solutions: {
    readonly data: readonly BaseSolution[];
  };
  readonly solutionsCta?: CallToAction;
};

export type Homepage = {
  readonly data: {
    readonly attributes: {
      readonly comingsoonDocumentation: RelatedLinks;
      readonly heroSlider: readonly HeroSlide[];
      readonly newsShowcase?: StrapiNewsShowcase;
      readonly ecosystem?: Ecosystem;
      readonly webinars: {
        readonly data: readonly StrapiWebinar[];
      };
      readonly seo?: StrapiSeo;
    };
  };
};

export type StrapiHomepage = Homepage;
