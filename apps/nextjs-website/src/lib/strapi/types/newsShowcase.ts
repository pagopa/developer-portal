import { Link } from '@/lib/strapi/types/link';
import { StrapiMedia } from '@/lib/strapi/types/media';

type NewsItem = {
  readonly attributes: {
    readonly comingSoon: boolean;
    readonly title: string;
    readonly link: Link;
    readonly publishedAt: string;
    readonly image?: { readonly data: StrapiMedia };
    readonly label?: string;
  };
};

export type StrapiNewsShowcase = {
  readonly title: string;
  readonly subTitle?: string;
  readonly link?: Link;
  readonly items: {
    readonly data: ReadonlyArray<NewsItem>;
  };
};
