import { products } from '@/_contents/products';
import {
  Products,
  Product as ApiProduct,
  BaseProduct,
} from '../codecs/ProductCodec';
import { Product } from '../../types/product';
import { makeBannerLinkProps } from '@/lib/strapi/makeProps/makeBannerLink';

export function mergeProductWithStaticContent(
  attributes: Partial<ApiProduct['attributes']> & BaseProduct['attributes']
): Product {
  const staticProduct =
    products.find((product) => product.slug === attributes.slug) || products[0];
  return {
    ...staticProduct,
    ...attributes,
    logo: attributes.logo?.data.attributes || staticProduct.logo,
    bannerLinks: attributes.bannerLinks?.map(makeBannerLinkProps) || [],
  };
}

export function makeProductsProps(
  products: Products,
  staticProducts: ReadonlyArray<Product>
): ReadonlyArray<Product> {
  return [
    ...staticProducts,
    ...products.data.map(({ attributes }) => {
      return mergeProductWithStaticContent(attributes);
    }),
  ];
}
