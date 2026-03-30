import { QuickStartGuidePageProps } from '@/app/[locale]/[productSlug]/quick-start/page';
import { StrapiBannerLink } from '@/lib/bannerLink/types';
import { StrapiBaseProductWithRelations } from '@/lib/products/strapiTypes';
import { Paginated } from '@/lib/strapi/types/paginated';
import { StrapiPart } from '@/lib/parts/types';
import { StrapiSeo } from '@/lib/seo/strapiTypes';

export type StrapiQuickStartGuideItem = {
  readonly id: number;
  readonly title: string;
  readonly anchor: string;
  readonly publishedAt: string;
  readonly parts: readonly StrapiPart[];
};

export type StrapiQuickStartGuide = {
  readonly id: number;
  readonly bannerLinks: readonly StrapiBannerLink[];
  readonly description: string;
  readonly product?: StrapiBaseProductWithRelations;
  readonly quickstartGuideItems: readonly StrapiQuickStartGuideItem[];
  readonly seo?: StrapiSeo;
  readonly title: string;
  readonly updatedAt: string;
};

export type StrapiQuickStartGuides = Paginated<StrapiQuickStartGuide>;

export type QuickStartGuides = readonly QuickStartGuidePageProps[];
