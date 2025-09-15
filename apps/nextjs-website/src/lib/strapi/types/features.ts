import { StrapiBannerLink } from "@/lib/strapi/types/bannerLink";

export type StrapiFeatures = {
  readonly title: string;
  readonly subtitle?: string;
  readonly items: readonly StrapiBannerLink[];
};
