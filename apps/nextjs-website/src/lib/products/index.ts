import { fetchProducts } from './fetcher';
import { mapProductsProps } from './mapper';
import { Product } from './types';
import { buildEnv } from '@/lib/buildEnv';

export const ProductRepository = {
  /**
   * Returns all products (ordered by name) pre-transformed and ready for UI
   */
  getAll: async (locale: string): Promise<ReadonlyArray<Product>> => {
    const strapiProducts = await fetchProducts(locale, buildEnv);
    const products = mapProductsProps(locale, strapiProducts);
    return [...products].sort((productA, productB) =>
      productA.name.localeCompare(productB.name)
    );
  },
};
