import { StrapiBaseProductWithRelations } from '@/lib/strapi/types/product';
import { StrapiBannerLink } from '@/lib/strapi/types/bannerLink';
import { StrapiSeo } from '@/lib/strapi/types/seo';
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
