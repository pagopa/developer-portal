import { Path } from '@/lib/types/path';
import { Media } from '@/lib/strapi/codecs/MediaCodec';
import { BannerLinkProps } from '@/components/atoms/BannerLink/BannerLink';

export type Product = {
  readonly slug: string;
  readonly shortName: string;
  readonly description: string | undefined;
  readonly logo: Media;
  readonly subpaths: Subpaths;
  readonly bannerLinks: readonly BannerLinkProps[];
} & Path;

type Subpaths = {
  readonly api?: Path;
  readonly guides?: Path;
  readonly overview: Path;
  readonly quickStart?: Path;
  readonly tutorials?: Path;
};

export type ProductSubpathsKeys = keyof Subpaths;
