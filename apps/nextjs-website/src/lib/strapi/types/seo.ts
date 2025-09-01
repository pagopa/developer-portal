import { StrapiMedia } from '@/lib/strapi/types/media';

export type StrapiSeoMediaSocial = Partial<{
  readonly id: number;
  readonly socialNetwork: string;
  readonly title: string;
  readonly description: string;
  readonly card: string;
  readonly site: string;
  readonly creator: string;
}>;

export type StrapiSeo = Partial<{
  readonly id: number;
  readonly metaTitle: string;
  readonly metaDescription: string;
  readonly keywords: string;
  readonly metaRobots: string;
  readonly metaViewport: string;
  readonly canonicalURL: string;
  readonly metaImage: {
    readonly data?: Partial<StrapiMedia>;
  };
  readonly metaSocial: ReadonlyArray<StrapiSeoMediaSocial>;
  readonly structuredData: unknown;
}>;
