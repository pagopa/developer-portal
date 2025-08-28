import { StrapiProduct } from '@/lib/strapi/types/product';
import { StrapiBannerLink } from '@/lib/strapi/types/bannerLink';
import { StrapiSeo } from '@/lib/strapi/types/seo';
import { Paginated } from '@/lib/strapi/types/paginated';

export type ReleaseNote = {
  readonly id: number;
  readonly attributes: {
    readonly bannerLinks: readonly StrapiBannerLink[];
    readonly createdAt: string;
    readonly dirName: string;
    readonly landingFile: string;
    readonly product: {
      readonly data: StrapiProduct;
    };
    readonly publishedAt: string;
    readonly seo?: StrapiSeo;
    readonly title: string;
    readonly updatedAt: string;
  };
};

export type StrapiReleaseNotes = Paginated<ReleaseNote>;
