import { BaseTutorial } from '@/lib/strapi/types/tutorial';
import { StrapiBannerLink } from '@/lib/strapi/types/bannerLink';
import { StrapiSeo } from '@/lib/strapi/types/seo';
import { Paginated } from '@/lib/strapi/types/paginated';
import { StrapiBaseProductWithRelations } from '@/lib/strapi/types/product';

export type TutorialsListPage = {
  readonly id: number;
  readonly attributes: {
    readonly bannerLinks: readonly StrapiBannerLink[];
    readonly description: string;
    readonly product: {
      readonly data: StrapiBaseProductWithRelations;
    };
    readonly title: string;
    readonly tutorials: { readonly data: readonly BaseTutorial[] };
    readonly seo?: StrapiSeo;
  };
};

export type StrapiTutorialListPages = Paginated<TutorialsListPage>;
