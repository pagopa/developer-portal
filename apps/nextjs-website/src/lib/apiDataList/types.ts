import type { StrapiMedia } from '@/lib/media/strapiTypes';
import type { StrapiBaseProductWithRelations } from '@/lib/products/strapiTypes';
import { StrapiBannerLink } from '@/lib/bannerLink/types';
import type { StrapiSeo } from '@/lib/seo/strapiTypes';
import type { StrapiTag } from '@/lib/tags/strapiTypes';
import { ApiDataPageProps } from '@/app/[locale]/[productSlug]/api/[apiDataSlug]/page';
import { RootEntity } from '@/lib/strapi/types/rootEntity';

type Url = {
  readonly id: number;
  readonly name?: string;
  readonly url: string;
  readonly hideTryIt: boolean;
};

export type BaseApiData = {
  readonly id: number;
  readonly title: string;
  readonly description?: string;
  readonly icon?: StrapiMedia;
  readonly apiRestDetail?: {
    readonly slug: string;
    readonly specUrls: readonly Url[];
  };
  readonly apiSoapDetail?: {
    readonly slug: string;
    readonly repositoryUrl: string;
    readonly dirName: string;
  };
  readonly tags?: readonly StrapiTag[];
};

export type ApiData = BaseApiData & {
  readonly product?: StrapiBaseProductWithRelations;
  readonly bannerLinks: readonly StrapiBannerLink[];
  readonly seo?: StrapiSeo;
};

export type BaseApiDataList = RootEntity<readonly BaseApiData[]>;
export type ApiDataList = RootEntity<readonly ApiData[]>;

export type { ApiDataPageProps };
