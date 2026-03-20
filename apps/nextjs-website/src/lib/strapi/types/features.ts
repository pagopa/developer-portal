import { StrapiBannerLink } from '@/lib/shared/bannerLink/types';

export type StrapiFeatures = {
  readonly title: string;
  readonly subtitle?: string;
  readonly items: readonly StrapiBannerLink[];
};
