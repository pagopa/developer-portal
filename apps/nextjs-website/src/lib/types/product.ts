import { Media } from '@/lib/strapi/codecs/MediaCodec';
import { BannerLinkProps } from '@/components/atoms/BannerLink/BannerLink';
import { StrapiProduct as ApiProduct } from '@/lib/strapi/codecs/ProductCodec';

export type Product = {
  readonly slug: string;
  readonly shortName: string;
  readonly description: string | undefined;
  readonly logo?: Media;
  readonly name: string;
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
};
