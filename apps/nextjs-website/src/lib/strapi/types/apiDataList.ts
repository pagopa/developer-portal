// StrapiUrl remains unchanged
import { StrapiMedia } from '@/lib/strapi/types/media';
import { StrapiTag } from '@/lib/strapi/types/tag';
import { StrapiBaseProductWithRelations } from '@/lib/strapi/types/product';
import { StrapiBannerLink } from '@/lib/strapi/types/bannerLink';
import { StrapiSeo } from '@/lib/strapi/types/seo';

export type StrapiUrl = {
  readonly id: number;
  readonly name?: string;
  readonly url: string;
  readonly hideTryIt: boolean;
};

export type StrapiBaseApiData = {
  readonly id: number;
  readonly title: string;
  readonly description?: string;
  readonly icon?: StrapiMedia;
  readonly apiRestDetail?: {
    readonly slug: string;
    readonly specUrls: readonly StrapiUrl[];
  };
  readonly apiSoapDetail?: {
    readonly slug: string;
    readonly repositoryUrl: string;
    readonly dirName: string;
  };
  readonly tags?: readonly StrapiTag[];
};

export type StrapiApiData = StrapiBaseApiData & {
  readonly product?: StrapiBaseProductWithRelations;
  readonly bannerLinks: readonly StrapiBannerLink[];
  readonly seo?: StrapiSeo;
};
export type StrapiApiDataList = readonly StrapiApiData[];
