import { Products } from './strapi/codecs/ProductCodec';
import { Product } from './types/product';

export function makeProductProps(
  product: Products,
  staticProducts: ReadonlyArray<Product>
): ReadonlyArray<Product> {
  return [
    ...staticProducts,
    ...product.data.map(({ attributes }) => {
      const staticProduct =
        staticProducts.find((product) => product.slug === attributes.slug) ||
        staticProducts[0];
      return {
        ...staticProduct,
        ...attributes,
        logo: attributes.logo.data.attributes,
      };
    }),
  ];
}
