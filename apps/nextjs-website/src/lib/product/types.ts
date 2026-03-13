import { Media } from '@/lib/types/media';
import { BannerLinkProps } from '@/components/atoms/BannerLink/BannerLink';
import { Tag } from '@/lib/types/tag';
import { StrapiBannerLink } from '@/lib/strapi/types/bannerLink';
import { StrapiMedia } from '@/lib/strapi/types/media';
import { StrapiComponent } from '@/lib/strapi/types/strapiComponent';
import { ApiDataListPageWithoutProduct } from '@/lib/apiDataListPages/types';
import { Paginated } from '@/lib/strapi/types/paginated';
import { StrapiTag } from '@/lib/strapi/types/tag';

type Id = {
  readonly id: number;
};

export type StrapiBaseProduct = {
  readonly attributes: {
    readonly name: string;
    readonly shortName: string;
    readonly slug: string;
    readonly isVisible: boolean;
  };
};

export type StrapiBaseProductWithBannerLinks = StrapiBaseProduct & {
  readonly attributes: {
    readonly bannerLinks?: readonly StrapiBannerLink[];
  };
};

export type StrapiBaseProductWithoutBannerLinks = StrapiBaseProduct & {
  readonly attributes: {
    readonly description?: string;
    readonly logo: {
      readonly data?: StrapiMedia;
    };
  };
};

export type StrapiProductRelations = {
  readonly overview: StrapiComponent<Id | undefined>;
  readonly quickstart_guide: StrapiComponent<Id | undefined>;
  readonly api_data_list_page: StrapiComponent<
    ApiDataListPageWithoutProduct | undefined
  >;
  readonly tutorial_list_page: StrapiComponent<Id | undefined>;
  readonly guide_list_page: StrapiComponent<Id | undefined>;
  readonly release_note: StrapiComponent<Id | undefined>;
  readonly use_case_list_page: StrapiComponent<Id | undefined>;
  readonly tags: StrapiComponent<readonly StrapiTag[] | undefined>;
};

export type StrapiBaseProductWithRelations = StrapiBaseProduct & {
  readonly attributes: StrapiProductRelations & {
    readonly bannerLinks?: readonly StrapiBannerLink[];
  };
};

export type StrapiProduct = StrapiBaseProduct & {
  readonly attributes: StrapiProductRelations & {
    readonly bannerLinks?: readonly StrapiBannerLink[];
    readonly description?: string;
    readonly logo: {
      readonly data: StrapiMedia;
    };
  };
};

export type StrapiProducts = Paginated<StrapiProduct>;

export type Product = {
  readonly apiDataListPageUrl?: string;
  readonly bannerLinks: readonly BannerLinkProps[];
  readonly description?: string;
  readonly isVisible: boolean;
  readonly logo?: Media;
  readonly hasApiDataListPage?: boolean;
  readonly hasGuideListPage?: boolean;
  readonly hasOverviewPage?: boolean;
  readonly hasQuickstartGuidePage?: boolean;
  readonly hasReleaseNotePage?: boolean;
  readonly hasTutorialListPage?: boolean;
  readonly hasUseCaseListPage?: boolean;
  readonly name: string;
  readonly shortName: string;
  readonly slug: string;
  readonly tags?: readonly Tag[];
};
