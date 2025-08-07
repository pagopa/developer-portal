import * as t from 'io-ts';
import { StrapiBaseProductWithRelations } from '@/lib/strapi/codecs/ProductCodec';
import { StrapiBannerLink } from '@/lib/strapi/codecs/BannerLinkCodec';
import { SEOCodec } from '@/lib/strapi/codecs/SeoCodec';
import { MediaAttributes } from '@/lib/strapi/types/media';
import { Pagination } from '@/lib/strapi/types/pagination';

type GuideVersion = {
  readonly main: boolean;
  readonly dirName: string;
  readonly version: string;
};

type BaseGuideAttributes = {
  readonly title: string;
  readonly slug: string;
  readonly image: {
    readonly data: MediaAttributes;
  };
  readonly mobileImage: {
    readonly data: MediaAttributes;
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
    readonly seo: t.TypeOf<typeof SEOCodec> | null;
  };
};

export type StrapiGuides = {
  readonly data: ReadonlyArray<Guide>;
  readonly meta: {
    readonly pagination: Pagination;
  };
};
