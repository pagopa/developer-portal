import { StrapiLink } from '@/lib/strapi/types/link';
import { StrapiMedia } from '@/lib/strapi/types/media';

type StrapiNewsItem = {
  readonly comingSoon: boolean;
  readonly title: string;
  readonly link: StrapiLink;
  readonly publishedAt: string;
  readonly image?: StrapiMedia;
  readonly label?: string;
};

export type StrapiNewsShowcase = {
  readonly title: string;
  readonly subTitle?: string;
  readonly link?: StrapiLink;
  readonly items: ReadonlyArray<StrapiNewsItem>;
};
