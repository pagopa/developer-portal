import type { Product } from '@/lib/products/types';
import type { BannerLinkProps } from '@/components/atoms/BannerLink/BannerLink';
import type { SEO } from '@/lib/seo/types';

export type Guide = {
  readonly product: Product;
  readonly guide: {
    readonly name: string;
    readonly slug?: string;
    readonly path?: string;
  };
  readonly versions: ReadonlyArray<{
    readonly main?: boolean;
    readonly version: string;
    readonly dirName: string;
    readonly showGuidesTranslationDisclaimer?: boolean;
  }>;
  readonly bannerLinks: readonly BannerLinkProps[];
  readonly seo?: SEO;
  readonly source?: {
    readonly pathPrefix: string;
    readonly assetsPrefix: string;
    readonly dirPath: string;
    readonly spaceId: string;
  };
};
