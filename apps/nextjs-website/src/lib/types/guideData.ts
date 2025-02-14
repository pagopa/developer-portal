import { BannerLinkProps } from '@/components/atoms/BannerLink/BannerLink';
import { Path } from '@/lib/types/path';
import { DocPage } from 'gitbook-docs/parseDoc';
import { Product } from './product';
import { SEO } from './seo';
import { ParseContentConfig } from 'gitbook-docs/parseContent';

export type Guide = {
  readonly title: string;
  readonly description: string;
} & Path;

export type GuideVersion = {
  readonly main: boolean;
  readonly name: string;
  readonly path: string;
};

export type GuideSource = {
  readonly pathPrefix: string;
  readonly assetsPrefix: string;
  readonly dirPath: string;
  readonly spaceId: string;
};

export type GuidePage = NonNullable<
  DocPage<{
    readonly product: Product;
    readonly guide: {
      readonly name: string;
      readonly path: string;
    };
    readonly version: GuideVersion;
    readonly versions: readonly GuideVersion[];
    readonly source: GuideSource;
    readonly bannerLinks: readonly BannerLinkProps[];
    readonly products: readonly Product[];
    readonly pathPrefix: string;
    readonly assetsPrefix: string;
    readonly redirect?: boolean;
    readonly seo?: SEO;
    readonly bodyConfig: Omit<ParseContentConfig, 'urlReplaces'>;
  }>
>;
