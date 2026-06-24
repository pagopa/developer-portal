import { StrapiBannerLink } from '@/lib/bannerLink/types';

export type StrapiFeatures = {
  readonly title: string;
  readonly subtitle?: string;
  readonly items: readonly StrapiBannerLink[];
};
