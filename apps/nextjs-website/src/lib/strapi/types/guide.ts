import { StrapiMedia } from '@/lib/strapi/types/media';
import { StrapiSeo } from '@/lib/strapi/types/seo';
import { StrapiBannerLink } from '@/lib/bannerLink/types';
import { Paginated } from '@/lib/strapi/types/paginated';
import { StrapiBaseProductWithRelations } from '@/lib/products/types';

type StrapiGuideVersion = {
  readonly main: boolean;
  readonly dirName: string;
  readonly version: string;
};

export type StrapiBaseGuide = {
  readonly title: string;
  readonly slug: string;
  readonly image: StrapiMedia;
  readonly mobileImage: StrapiMedia;
  readonly listItems: ReadonlyArray<{
    readonly text: string;
  }>;
};

export type StrapiGuide = StrapiBaseGuide & {
  readonly versions: ReadonlyArray<StrapiGuideVersion>;
  readonly product?: StrapiBaseProductWithRelations;
  readonly bannerLinks: ReadonlyArray<StrapiBannerLink>;
  readonly seo?: StrapiSeo;
};

export type StrapiGuides = Paginated<StrapiGuide>;
