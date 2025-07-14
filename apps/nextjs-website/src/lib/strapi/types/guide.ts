import * as t from 'io-ts';
import { BaseProductWithRelationsCodec } from '@/lib/strapi/codecs/ProductCodec';
import { BannerLinkCodec } from '@/lib/strapi/codecs/BannerLinkCodec';
import { SEOCodec } from '@/lib/strapi/codecs/SeoCodec';
import { PaginationCodec } from '@/lib/strapi/codecs/PaginationCodec';
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
      readonly data: t.TypeOf<typeof BaseProductWithRelationsCodec>;
    };
    readonly bannerLinks: readonly t.TypeOf<typeof BannerLinkCodec>[];
    readonly seo: t.TypeOf<typeof SEOCodec> | null;
  };
};

export type StrapiGuides = {
  readonly data: ReadonlyArray<Guide>;
  readonly meta: {
    readonly pagination: Pagination;
  };
};

export type StrapiGuidePageData = {
  readonly id: number;
  readonly attributes: {
    readonly title: string;
    readonly description: string;
    readonly product: {
      readonly data: t.TypeOf<typeof BaseProductWithRelationsCodec>;
    };
    readonly guidesByCategory: ReadonlyArray<{
      readonly category: string;
      readonly guides: {
        readonly data: readonly BaseGuide[];
      };
    }>;
    readonly bannerLinks: ReadonlyArray<t.TypeOf<typeof BannerLinkCodec>>;
    readonly seo?: t.TypeOf<typeof SEOCodec> | null;
  };
};

export type StrapiGuidesPaginated = {
  readonly data: ReadonlyArray<StrapiGuidePageData>;
  readonly meta: t.TypeOf<typeof PaginationCodec>;
};
