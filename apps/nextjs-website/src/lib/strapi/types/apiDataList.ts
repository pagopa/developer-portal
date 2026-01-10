import { StrapiMedia } from '@/lib/strapi/types/media';
import { StrapiBaseProductWithRelations } from '@/lib/strapi/types/product';
import { StrapiBannerLink } from '@/lib/strapi/types/bannerLink';
import { StrapiSeo } from '@/lib/strapi/types/seo';
import { StrapiComponent } from './strapiComponent';
import { StrapiTag } from './tag';

type StrapiUrl = {
  readonly id: number;
  readonly name?: string;
  readonly url: string;
  readonly hideTryIt: boolean;
};

export type StrapiBaseApiData = {
  readonly id: number;
  readonly attributes: {
    readonly title: string;
    readonly description?: string;
    readonly icon: {
      readonly data?: StrapiMedia;
    };
    readonly apiRestDetail?: {
      readonly slug: string;
      readonly specUrls: readonly StrapiUrl[];
    };
    readonly apiSoapDetail?: {
      readonly slug: string;
      readonly repositoryUrl: string;
      readonly dirName: string;
    };
    readonly tags: StrapiComponent<readonly StrapiTag[] | undefined>;
    readonly locale: string;
    readonly updatedAt: string;
  };
};

export type StrapiApiData = StrapiBaseApiData & {
  readonly attributes: StrapiBaseApiData['attributes'] & {
    readonly product: {
      readonly data?: StrapiBaseProductWithRelations;
    };
    readonly bannerLinks: readonly StrapiBannerLink[];
    readonly seo?: StrapiSeo;
    readonly locale: string;
    readonly updatedAt: string;
  };
};

export type StrapiBaseApiDataList = StrapiComponent<
  readonly StrapiBaseApiData[]
>;
export type StrapiApiDataList = StrapiComponent<readonly StrapiApiData[]>;
