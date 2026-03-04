import { StrapiMedia } from '@/lib/strapi/types/media';
import { StrapiBaseProductWithRelations } from '@/lib/strapi/types/product';
import { StrapiBannerLink } from '@/lib/strapi/types/bannerLink';
import { StrapiSeo } from '@/lib/strapi/types/seo';
import { StrapiComponent } from '@/lib/strapi/types/strapiComponent';
import { StrapiTag } from '@/lib/strapi/types/tag';
import { ApiDataPageProps } from '@/app/[locale]/[productSlug]/api/[apiDataSlug]/page';

type Url = {
  readonly id: number;
  readonly name?: string;
  readonly url: string;
  readonly hideTryIt: boolean;
};

export type BaseApiData = {
  readonly id: number;
  readonly attributes: {
    readonly title: string;
    readonly description?: string;
    readonly icon: {
      readonly data?: StrapiMedia;
    };
    readonly apiRestDetail?: {
      readonly slug: string;
      readonly specUrls: readonly Url[];
    };
    readonly apiSoapDetail?: {
      readonly slug: string;
      readonly repositoryUrl: string;
      readonly dirName: string;
    };
    readonly tags: StrapiComponent<readonly StrapiTag[] | undefined>;
  };
};

export type ApiData = BaseApiData & {
  readonly attributes: BaseApiData['attributes'] & {
    readonly product: {
      readonly data?: StrapiBaseProductWithRelations;
    };
    readonly bannerLinks: readonly StrapiBannerLink[];
    readonly seo?: StrapiSeo;
  };
};

export type BaseApiDataList = StrapiComponent<readonly BaseApiData[]>;
export type ApiDataList = StrapiComponent<readonly ApiData[]>;

export type { ApiDataPageProps };
