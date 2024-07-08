import { Products } from './strapi/codecs/ProductCodec';
import { Product } from './types/product';

export function makeProductProps(product: Products): ReadonlyArray<Product> {
  return product.data.map(({ attributes }) => ({
    ...attributes,
    logo: attributes.logo.data.attributes,
    path: '',
    subpaths: {
      overview: {
        name: '',
        path: '',
      },
    },
  }));
}
