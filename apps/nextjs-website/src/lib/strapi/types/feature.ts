import { StrapiBannerLink } from '@/lib/strapi/types/bannerLink';

export type StrapiFeature = {
  readonly title: string;
  readonly subtitle?: string | null;
  readonly items: ReadonlyArray<StrapiBannerLink>;
};
