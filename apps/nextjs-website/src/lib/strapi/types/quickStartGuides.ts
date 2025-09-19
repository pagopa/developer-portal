import { StrapiComponent } from '@/lib/strapi/types/strapiComponent';
import { StrapiBaseProductWithRelations } from '@/lib/strapi/types/product';
import { StrapiBannerLink } from '@/lib/strapi/types/bannerLink';
import { StrapiSeo } from '@/lib/strapi/types/seo';
import { Paginated } from '@/lib/strapi/types/paginated';
import { StrapiPart } from '@/lib/strapi/types/part';

export type StrapiQuickStartGuideItem = {
  readonly id: number;
  readonly attributes: {
    readonly title: string;
    readonly anchor: string;
    readonly publishedAt: string;
    readonly parts: readonly StrapiPart[];
  };
};

export type StrapiQuickStartGuide = {
  readonly id: number;
  readonly attributes: {
    readonly bannerLinks: readonly StrapiBannerLink[];
    readonly description: string;
    readonly product: {
      readonly data?: StrapiBaseProductWithRelations;
    };
    readonly quickstartGuideItems: StrapiComponent<
      readonly StrapiQuickStartGuideItem[]
    >;
    readonly seo?: StrapiSeo;
    readonly title: string;
    readonly updatedAt: string;
  };
};

export type StrapiQuickStartGuides = Paginated<StrapiQuickStartGuide>;
