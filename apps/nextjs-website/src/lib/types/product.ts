import { Path } from '@/lib/types/path';
import { Media } from '@/lib/strapi/codecs/MediaCodec';
import { BannerLinkProps } from '@/components/atoms/BannerLink/BannerLink';
import { Product as ApiProduct } from '@/lib/strapi/codecs/ProductCodec';

export type Product = {
  readonly slug: string;
  readonly shortName: string;
  readonly description: string | undefined;
  readonly logo: Media;
  readonly subpaths: Subpaths;
  readonly bannerLinks: readonly BannerLinkProps[];
  readonly api_data_list_page?:
    | ApiProduct['attributes']['api_data_list_page']
    | undefined;
  readonly tutorial_list_page?:
    | ApiProduct['attributes']['tutorial_list_page']
    | undefined;
  readonly guide_list_page?:
    | ApiProduct['attributes']['guide_list_page']
    | undefined;
  readonly overview?: ApiProduct['attributes']['overview'] | undefined;
  readonly quickstart_guide?:
    | ApiProduct['attributes']['quickstart_guide']
    | undefined;
} & Path;

type Subpaths = {
  readonly api?: Path;
  readonly guides?: Path;
  readonly overview: Path;
  readonly quickStart?: Path;
  readonly tutorials?: Path;
};

export type ProductSubpathsKeys = keyof Subpaths;
