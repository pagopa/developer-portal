import {
  Products,
  Product as ApiProduct,
  BaseProduct,
} from './strapi/codecs/ProductCodec';
import { Product } from './types/product';

export function makeProductFromAttributes(
  attributes: Partial<ApiProduct['attributes']> & BaseProduct['attributes'],
  staticProducts: ReadonlyArray<Product>
): Product {
  const staticProduct =
    staticProducts.find((product) => product.slug === attributes.slug) ||
    staticProducts[0];
  return {
    ...staticProduct,
    ...attributes,
    logo: attributes.logo?.data.attributes || staticProduct.logo,
  };
}

export function makeProductsProps(
  products: Products,
  staticProducts: ReadonlyArray<Product>
): ReadonlyArray<Product> {
  return [
    ...staticProducts,
    ...products.data.map(({ attributes }) => {
      return makeProductFromAttributes(attributes, staticProducts);
    }),
  ];
}
