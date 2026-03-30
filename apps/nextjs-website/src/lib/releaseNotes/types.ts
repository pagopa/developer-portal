import { StrapiBaseProductWithRelations } from '@/lib/products/strapiTypes';
import { StrapiBannerLink } from '@/lib/bannerLink/types';
import { StrapiSeo } from '@/lib/seo/strapiTypes';
import { Paginated } from '@/lib/strapi/types/paginated';

export type StrapiReleaseNote = {
  readonly id: number;
  readonly bannerLinks: readonly StrapiBannerLink[];
  readonly createdAt: string;
  readonly dirName: string;
  readonly landingFile: string;
  readonly product?: StrapiBaseProductWithRelations;
  readonly publishedAt: string;
  readonly seo?: StrapiSeo;
  readonly title: string;
  readonly updatedAt: string;
};

export type StrapiReleaseNotes = Paginated<StrapiReleaseNote>;
