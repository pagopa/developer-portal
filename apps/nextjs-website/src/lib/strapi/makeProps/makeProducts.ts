import { StrapiProducts } from '../codecs/ProductCodec';
import { Product } from '../../types/product';
import { makeBannerLinkProps } from '@/lib/strapi/makeProps/makeBannerLink';

export function makeProductsProps(
  products: StrapiProducts
): ReadonlyArray<Product> {
  return products.data.map(makeProductProps);
}

export function makeProductProps(product: StrapiProducts['data'][0]): Product {
  return {
    ...product.attributes,
    description: product.attributes.description ?? '',
    logo: product.attributes.logo?.data.attributes,
    api_data_list_page: product.attributes.api_data_list_page,
    tutorial_list_page: product.attributes.tutorial_list_page,
    guide_list_page: product.attributes.guide_list_page,
    overview: product.attributes.overview,
    quickstart_guide: product.attributes.quickstart_guide,
    bannerLinks: product.attributes.bannerLinks?.map(makeBannerLinkProps) || [],
  };
}
