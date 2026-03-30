import { BlocksContent } from '@strapi/blocks-react-renderer';
import { StrapiRelatedLinks } from '@/lib/strapi/types/link';
import { StrapiMedia } from '@/lib/media/strapiTypes';
import { StrapiLink } from '@/lib/strapi/types/link';
import { StrapiWebinar } from '@/lib/webinars/strapiTypes';
import { StrapiProduct } from '@/lib/products/strapiTypes';
import { StrapiSeo } from '@/lib/seo/strapiTypes';
import { StrapiBaseSolution } from '@/lib/solutions/types';
import { StrapiNewsShowcase } from '@/lib/newsShowcase/types';
import { RootEntity } from '@/lib/strapi/types/rootEntity';

type CallToAction = {
  readonly link: StrapiLink;
  readonly variant?: 'text' | 'contained' | 'outlined';
};

type HeroSlide = {
  readonly title: string;
  readonly subhead?: BlocksContent;
  readonly subheadColor?: 'contrastText' | 'main' | 'light' | 'dark';
  readonly callToAction?: CallToAction;
  readonly titleColor?: 'contrastText' | 'main' | 'light' | 'dark';
  readonly backgroundImage?: StrapiMedia;
};

type Ecosystem = {
  readonly title?: string;
  readonly productsTabName: string;
  readonly products: readonly StrapiProduct[];
  readonly solutionsTabName: string;
  readonly solutions: readonly StrapiBaseSolution[];
  readonly solutionsCta?: CallToAction;
};

export type Homepage = {
  readonly comingsoonDocumentation: StrapiRelatedLinks;
  readonly heroSlider: readonly HeroSlide[];
  readonly newsShowcase?: StrapiNewsShowcase;
  readonly ecosystem?: Ecosystem;
  readonly webinars: readonly StrapiWebinar[];
  readonly seo?: StrapiSeo;
  readonly updatedAt: string;
};

export type StrapiHomepage = RootEntity<Homepage>;
