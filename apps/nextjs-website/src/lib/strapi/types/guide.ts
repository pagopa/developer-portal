import { StrapiBaseProductWithRelations } from '@/lib/strapi/codecs/ProductCodec';
import { StrapiMedia } from '@/lib/strapi/types/media';
import { StrapiSeo } from '@/lib/strapi/types/seo';
import { StrapiBannerLink } from '@/lib/strapi/types/bannerLink';
import { Paginated } from '@/lib/strapi/types/paginated';

type GuideVersion = {
  readonly main: boolean;
  readonly dirName: string;
  readonly version: string;
};

type BaseGuideAttributes = {
  readonly title: string;
  readonly slug: string;
  readonly image: {
    readonly data: StrapiMedia;
  };
  readonly mobileImage: {
    readonly data: StrapiMedia;
  };
  readonly listItems: ReadonlyArray<{
    readonly text: string;
  }>;
};

export type BaseGuide = {
  readonly attributes: BaseGuideAttributes;
};

export type Guide = {
  readonly attributes: BaseGuideAttributes & {
    readonly versions: ReadonlyArray<GuideVersion>;
    readonly product: {
      readonly data: StrapiBaseProductWithRelations;
    };
    readonly bannerLinks: ReadonlyArray<StrapiBannerLink>;
    readonly seo?: StrapiSeo;
  };
};

export type StrapiGuides = Paginated<Guide>;
